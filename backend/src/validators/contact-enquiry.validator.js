import { z } from 'zod';
import { CONTACT_ENQUIRY_STATUSES } from '../models/index.js';
import { idParamSchema, listQuerySchema } from './common.validator.js';

export const listContactEnquiriesSchema = listQuerySchema;

export const createContactEnquirySchema = z.object({
  body: z.object({
    contactName: z.string().trim().min(2).max(120),
    contactEmail: z.string().trim().email().max(254),
    contactPhone: z.string().trim().max(40).optional(),
    subject: z.string().trim().min(3).max(120),
    message: z.string().trim().min(10).max(5000),
  }),
});

export const updateContactEnquirySchema = idParamSchema.extend({
  body: z
    .object({
      status: z.enum(Object.values(CONTACT_ENQUIRY_STATUSES)).optional(),
      adminNotes: z.string().trim().max(5000).optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});
