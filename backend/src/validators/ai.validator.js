import { z } from 'zod';
import { AVAILABILITY_STATUSES, BLOG_POST_CATEGORIES, STORAGE_TYPES } from '../models/index.js';

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

const gpuPackageSchema = z
  .object({
    name: z.string().trim().max(160).optional(),
    gpuModel: z.string().trim().max(120).optional(),
    gpuMemoryGb: z.coerce.number().positive().optional(),
    cpuCores: z.coerce.number().positive().optional(),
    ramGb: z.coerce.number().positive().optional(),
    storageGb: z.coerce.number().positive().optional(),
    storageType: z.enum(Object.values(STORAGE_TYPES)).optional(),
    bandwidth: z.string().trim().max(120).optional(),
    region: z.string().trim().max(120).optional(),
    hourlyPrice: z.coerce.number().min(0).optional(),
    monthlyPrice: z.coerce.number().min(0).optional(),
    currency: z.string().trim().length(3).optional(),
    availabilityStatus: z.enum(Object.values(AVAILABILITY_STATUSES)).optional(),
    description: z.string().trim().max(5000).optional(),
    features: z.array(z.string().trim().max(160)).max(12).optional(),
    useCases: z.array(z.string().trim().max(160)).max(12).optional(),
  })
  .strict();

export const analyzeEnquirySchema = z.object({
  body: z
    .object({
      projectDescription: z.string().trim().min(10).max(5000),
      expectedUsage: z.string().trim().max(2000).optional(),
      duration: z.string().trim().max(120).optional(),
      budget: z.coerce.number().min(0).nullable().optional(),
      gpuPackage: gpuPackageSchema.optional(),
    })
    .strict(),
});

export const generateGpuPackageCopySchema = z.object({
  body: gpuPackageSchema
    .extend({
      name: z.string().trim().min(2).max(160),
      gpuModel: z.string().trim().min(1).max(120),
      gpuMemoryGb: z.coerce.number().positive(),
      cpuCores: z.coerce.number().positive(),
      ramGb: z.coerce.number().positive(),
      storageGb: z.coerce.number().positive(),
      region: z.string().trim().min(1).max(120),
      hourlyPrice: z.coerce.number().min(0),
      monthlyPrice: z.coerce.number().min(0),
    })
    .strict(),
});
