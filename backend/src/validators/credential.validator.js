import { z } from 'zod';
import { CREDENTIAL_STATUSES } from '../models/index.js';
import { idParamSchema, listQuerySchema, objectIdSchema } from './common.validator.js';

export const listCredentialsSchema = listQuerySchema;

const credentialBodySchema = z.object({
  customer: objectIdSchema,
  enquiry: objectIdSchema,
  gpuPackage: objectIdSchema,
  host: z.string().trim().min(1).max(255),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  username: z.string().trim().min(1).max(120),
  passwordEncrypted: z.string().min(1).max(4096),
  sshCommand: z.string().trim().max(500).optional(),
  accessInstructions: z.string().trim().max(5000).optional(),
  status: z.enum(Object.values(CREDENTIAL_STATUSES)).optional(),
  expiresAt: z.coerce.date().nullable().optional(),
});

export const createCredentialSchema = z.object({
  body: credentialBodySchema,
});

export const updateCredentialSchema = idParamSchema.extend({
  body: credentialBodySchema
    .partial()
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});
