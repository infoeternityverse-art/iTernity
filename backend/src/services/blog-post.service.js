import { BlogPost, BLOG_POST_STATUSES } from '../models/index.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { buildServiceResponse } from '../utils/response-builder.js';
import { BaseService } from './base.service.js';

class BlogPostService extends BaseService {
  constructor() {
    super(BlogPost, {
      resourceName: 'Blog post',
      searchFields: ['title', 'slug', 'excerpt', 'category', 'tags'],
      allowedFilters: ['slug', 'category', 'status', 'author'],
      allowedSortFields: ['createdAt', 'updatedAt', 'publishedAt', 'title', 'category', 'status'],
      allowedSelectFields: [
        'title',
        'slug',
        'excerpt',
        'category',
        'status',
        'author',
        'heroTone',
        'tags',
        'body',
        'metrics',
        'publishedAt',
        'scheduledAt',
        'seoTitle',
        'seoDescription',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
      ],
      allowedPopulate: ['createdBy', 'updatedBy'],
    });
  }

  async ensureSlugAvailable(slug, excludedPostId = null) {
    const existingPost = await BlogPost.findBySlug(slug);

    if (existingPost && String(existingPost._id) !== String(excludedPostId)) {
      throw new ConflictError('A blog post with this slug already exists.');
    }

    return true;
  }

  findPublished(options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        status: BLOG_POST_STATUSES.PUBLISHED,
      },
      sort: options.sort || 'publishedAt',
      order: options.order || 'desc',
    });
  }

  async findPublishedBySlug(slug, options = {}) {
    const select = options.fields;
    const response = await this.findOne(
      {
        slug: String(slug).toLowerCase().trim(),
        status: BLOG_POST_STATUSES.PUBLISHED,
      },
      {
        ...options,
        fields: select,
        required: true,
      }
    );

    return response;
  }

  async findAdminBySlug(slug, options = {}) {
    const response = await this.findOne(
      { slug: String(slug).toLowerCase().trim() },
      {
        ...options,
        required: true,
      }
    );

    return response;
  }

  async incrementViews(id) {
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { 'metrics.views': 1 } },
      { new: true, runValidators: true }
    );

    if (!post) {
      throw new NotFoundError(this.resourceName);
    }

    return buildServiceResponse({
      data: post,
      message: `${this.resourceName} analytics updated successfully.`,
    });
  }
}

export const blogPostService = new BlogPostService();
