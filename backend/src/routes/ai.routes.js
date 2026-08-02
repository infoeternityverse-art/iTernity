import { Router } from 'express';
import { generateBlogMetadata } from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { generateBlogMetadataSchema } from '../validators/ai.validator.js';

export const adminAiRouter = Router();

adminAiRouter.use(authenticate, requireAdmin);
adminAiRouter.post('/blog-metadata', validate(generateBlogMetadataSchema), generateBlogMetadata);
