import { z } from 'zod';
import {
  idParamSchema,
  idParamWithListQuerySchema,
  listQuerySchema,
  objectIdSchema,
} from '../../validators/common.validator.js';
import { WORKSPACE_PROVIDERS, WORKSPACE_STATUSES } from '../models/index.js';

export const listWorkspacesSchema = listQuerySchema;

const workspaceUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .url('Workspace links must be valid URLs.')
  .refine((value) => ['https:', 'http:'].includes(new URL(value).protocol), {
    message: 'Workspace links must use HTTPS or HTTP.',
  });

const workspaceUrlsSchema = z
  .record(
    z.string().trim().min(1).max(80).regex(/^[a-z0-9 _.-]+$/i, 'Use a simple link label.'),
    workspaceUrlSchema
  )
  .refine((value) => Object.keys(value).length <= 20, 'Add no more than 20 workspace links.')
  .optional();

const workspaceBodySchema = z
  .object({
    customer: objectIdSchema,
    package: objectIdSchema,
    provider: z.enum(Object.values(WORKSPACE_PROVIDERS)),
    providerInstanceId: z.string().trim().max(180).optional(),
    gpuModel: z.string().trim().min(1).max(120),
    status: z.enum(Object.values(WORKSPACE_STATUSES)).optional(),
    instanceIP: z.string().trim().max(120).optional(),
    sshPort: z.coerce.number().int().min(1).max(65535).optional(),
    sshUsername: z.string().trim().max(120).optional(),
    sshPassword: z.string().min(1).max(4096).optional(),
    installedApps: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
    workspaceUrls: workspaceUrlsSchema,
    expiryDate: z.coerce.date().nullable().optional(),
    notes: z.string().trim().max(5000).optional(),
  })
  .strict();

export const createWorkspaceSchema = z.object({
  body: workspaceBodySchema,
});

export const updateWorkspaceSchema = idParamSchema.extend({
  body: workspaceBodySchema
    .partial()
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

export const getWorkspaceSchema = idParamWithListQuerySchema;

export const updateWorkspaceStatusSchema = idParamSchema.extend({
  body: z
    .object({
      status: z.enum(Object.values(WORKSPACE_STATUSES)),
      notes: z.string().trim().max(5000).optional(),
    })
    .strict(),
});
