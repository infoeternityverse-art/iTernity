import { z } from 'zod';
import { ENQUIRY_STATUSES } from '../models/index.js';
import {
  idParamSchema,
  idParamWithListQuerySchema,
  listQuerySchema,
  objectIdSchema,
} from './common.validator.js';

export const listEnquiriesSchema = listQuerySchema;
export const getEnquirySchema = idParamWithListQuerySchema;

export const createEnquirySchema = z.object({
  body: z.object({
    gpuPackage: objectIdSchema,
    contactName: z.string().trim().min(2).max(120),
    projectDescription: z.string().trim().min(10).max(5000),
    expectedUsage: z.string().trim().max(2000).optional(),
    duration: z.string().trim().max(120).optional(),
    contactEmail: z.string().trim().email().max(254),
    contactPhone: z.string().trim().max(40).optional(),
  }),
});

export const updateEnquirySchema = idParamSchema.extend({
  body: z
    .object({
      status: z.enum(Object.values(ENQUIRY_STATUSES)).optional(),
      adminNotes: z.string().trim().max(5000).optional(),
      customerVisibleNotes: z.string().trim().max(5000).optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});
