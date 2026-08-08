import { z } from 'zod';
import { USER_ROLES } from '../models/index.js';
import { idParamSchema, listQuerySchema } from './common.validator.js';

export const listUsersSchema = listQuerySchema;

export const getUserSchema = idParamSchema;

export const updateUserSchema = idParamSchema.extend({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      email: z.string().trim().email().max(254).optional(),
      role: z.enum(Object.values(USER_ROLES)).optional(),
      isActive: z.boolean().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

export const sendPasswordResetLinkSchema = idParamSchema;
export const deleteUserSchema = idParamSchema;
