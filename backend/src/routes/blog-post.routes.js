import { Router } from 'express';
import {
  createBlogPost,
  deleteBlogPost,
  getAdminBlogPost,
  getBlogPost,
  listAdminBlogPosts,
  listBlogPosts,
  uploadBlogImage,
  updateBlogPost,
} from '../controllers/blog-post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createBlogPostSchema,
  deleteBlogPostSchema,
  getBlogPostBySlugSchema,
  listBlogPostsSchema,
  uploadBlogImageSchema,
  updateBlogPostSchema,
} from '../validators/blog-post.validator.js';

export const blogPostRouter = Router();
export const adminBlogPostRouter = Router();

blogPostRouter.get('/', validate(listBlogPostsSchema), listBlogPosts);
blogPostRouter.get('/:slug', validate(getBlogPostBySlugSchema), getBlogPost);

adminBlogPostRouter.use(authenticate, requireAdmin);
adminBlogPostRouter.get('/', validate(listBlogPostsSchema), listAdminBlogPosts);
adminBlogPostRouter.post('/image-uploads', validate(uploadBlogImageSchema), uploadBlogImage);
adminBlogPostRouter.post('/', validate(createBlogPostSchema), createBlogPost);
adminBlogPostRouter.get('/:slug', validate(getBlogPostBySlugSchema), getAdminBlogPost);
adminBlogPostRouter.patch('/:slug', validate(updateBlogPostSchema), updateBlogPost);
adminBlogPostRouter.delete('/:slug', validate(deleteBlogPostSchema), deleteBlogPost);
