import { z } from 'zod';
import { BLOG_POST_CATEGORIES } from '../models/index.js';

const blogSectionSchema = z.object({
  heading: z.string().trim().min(2).max(180),
  copy: z.string().trim().min(10).max(5000),
});

export const generateBlogMetadataSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(2).max(180),
      category: z.enum(Object.values(BLOG_POST_CATEGORIES)),
      excerpt: z.string().trim().max(500).optional(),
      imageUrl: z.string().trim().max(600).optional(),
      body: z.array(blogSectionSchema).max(24).optional(),
    })
    .strict(),
});
