import { z } from 'zod';
import { BLOG_POST_CATEGORIES, BLOG_POST_STATUSES } from '../models/index.js';
import { listQuerySchema } from './common.validator.js';

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug with hyphens.');

const blogSectionSchema = z.object({
  heading: z.string().trim().min(2).max(180),
  copy: z.string().trim().min(10).max(5000),
});

const blogMetricsSchema = z
  .object({
    views: z.coerce.number().int().min(0).optional(),
    engagement: z.coerce.number().min(0).max(100).optional(),
    leads: z.coerce.number().int().min(0).optional(),
  })
  .strict();

const imageUrlSchema = z
  .string()
  .trim()
  .max(600)
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith('/')) {
      return !value.startsWith('//') && !value.includes('\\');
    }

    try {
      const url = new URL(value);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Use an HTTPS image URL or a same-origin path like /media/blog.webp.');

const blogPostBodySchema = z
  .object({
    title: z.string().trim().min(2).max(180),
    slug: slugSchema,
    excerpt: z.string().trim().min(10).max(500),
    category: z.enum(Object.values(BLOG_POST_CATEGORIES)),
    status: z.enum(Object.values(BLOG_POST_STATUSES)).optional(),
    author: z.string().trim().min(2).max(120).optional(),
    heroTone: z.string().trim().min(2).max(32).optional(),
    imageUrl: imageUrlSchema.optional(),
    imageAlt: z.string().trim().max(180).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
    body: z.array(blogSectionSchema).max(24).optional(),
    metrics: blogMetricsSchema.optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    scheduledAt: z.coerce.date().nullable().optional(),
    seoTitle: z.string().trim().max(180).optional(),
    seoDescription: z.string().trim().max(300).optional(),
  })
  .strict();

export const listBlogPostsSchema = listQuerySchema;

export const getBlogPostBySlugSchema = z.object({
  params: z.object({
    slug: slugSchema,
  }),
  query: listQuerySchema.shape.query.optional(),
});

export const createBlogPostSchema = z.object({
  body: blogPostBodySchema,
});

export const updateBlogPostSchema = z.object({
  params: z.object({
    slug: slugSchema,
  }),
  body: blogPostBodySchema
    .partial()
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

export const deleteBlogPostSchema = z.object({
  params: z.object({
    slug: slugSchema,
  }),
});

export const uploadBlogImageSchema = z.object({
  body: z
    .object({
      image: z
        .string()
        .min(100)
        .max(1_800_000)
        .regex(
          /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i,
          'Upload a PNG, JPG, or WebP image.'
        ),
      fileName: z.string().trim().min(1).max(140).optional(),
    })
    .strict(),
});
