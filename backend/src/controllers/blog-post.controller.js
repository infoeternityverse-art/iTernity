import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditLogService, blogPostService } from '../services/index.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendSuccess } from '../utils/api-response.js';
import { sendServiceResponse } from '../utils/controller-response.js';
import { getQueryOptions } from '../utils/request-options.js';
import { ApiError } from '../utils/api-error.js';

const BLOG_IMAGE_MAX_BYTES = 1_250_000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const blogImageUploadDirectory = path.resolve(
  currentDirectory,
  '../../../frontend/public/media/blog'
);
const mimeExtensionMap = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const safeFileStem = (value = 'blog-image') =>
  value
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'blog-image';

export const listBlogPosts = asyncHandler(async (req, res) => {
  const response = await blogPostService.findPublished(getQueryOptions(req.validated.query));
  return sendServiceResponse(res, response);
});

export const getBlogPost = asyncHandler(async (req, res) => {
  const response = await blogPostService.findPublishedBySlug(
    req.validated.params.slug,
    getQueryOptions(req.validated.query)
  );

  await blogPostService.incrementViews(response.data._id);

  return sendServiceResponse(res, response);
});

export const listAdminBlogPosts = asyncHandler(async (req, res) => {
  const response = await blogPostService.findMany(getQueryOptions(req.validated.query));
  return sendServiceResponse(res, response);
});

export const getAdminBlogPost = asyncHandler(async (req, res) => {
  const response = await blogPostService.findAdminBySlug(
    req.validated.params.slug,
    getQueryOptions(req.validated.query)
  );
  return sendServiceResponse(res, response);
});

export const createBlogPost = asyncHandler(async (req, res) => {
  await blogPostService.ensureSlugAvailable(req.validated.body.slug);

  const response = await blogPostService.create({
    ...req.validated.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  await auditLogService.record({
    actor: req.user._id,
    action: 'blog_post.created',
    entityType: 'BlogPost',
    entityId: response.data._id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: { status: response.data.status },
  });

  return sendServiceResponse(res, response, 201);
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const existingPost = await blogPostService.findAdminBySlug(req.validated.params.slug, {
    unwrap: false,
  });

  if (req.validated.body.slug) {
    await blogPostService.ensureSlugAvailable(req.validated.body.slug, existingPost.data._id);
  }

  const response = await blogPostService.update(existingPost.data._id, {
    ...req.validated.body,
    updatedBy: req.user._id,
  });

  await auditLogService.record({
    actor: req.user._id,
    action: 'blog_post.updated',
    entityType: 'BlogPost',
    entityId: response.data._id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: { fields: Object.keys(req.validated.body) },
  });

  return sendServiceResponse(res, response);
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const existingPost = await blogPostService.findAdminBySlug(req.validated.params.slug);
  const response = await blogPostService.delete(existingPost.data._id);

  await auditLogService.record({
    actor: req.user._id,
    action: 'blog_post.deleted',
    entityType: 'BlogPost',
    entityId: existingPost.data._id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  return sendServiceResponse(res, response);
});

export const uploadBlogImage = asyncHandler(async (req, res) => {
  const match = req.validated.body.image.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/i);

  if (!match) {
    throw new ApiError(400, 'Upload a PNG, JPG, or WebP image.');
  }

  const [, mimeType, base64Content] = match;
  const imageBuffer = Buffer.from(base64Content, 'base64');

  if (!imageBuffer.length || imageBuffer.length > BLOG_IMAGE_MAX_BYTES) {
    throw new ApiError(400, 'Cropped image must be under 1.25 MB.');
  }

  const extension = mimeExtensionMap[mimeType.toLowerCase()];
  const fileName = `${safeFileStem(req.validated.body.fileName)}-${crypto
    .randomBytes(8)
    .toString('hex')}.${extension}`;

  await fs.mkdir(blogImageUploadDirectory, { recursive: true });
  await fs.writeFile(path.join(blogImageUploadDirectory, fileName), imageBuffer, { flag: 'wx' });

  await auditLogService.record({
    actor: req.user._id,
    action: 'blog_post.image_uploaded',
    entityType: 'BlogPost',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: {
      fileName,
      bytes: imageBuffer.length,
      mimeType,
    },
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Blog image uploaded successfully.',
    data: {
      imageUrl: `/media/blog/${fileName}`,
    },
  });
});
