import { Router } from 'express';
import {
  analyzeEnquiry,
  answerSiteAssistant,
  generateBlogMetadata,
  generateGpuPackageCopy,
  recommendGpuPackage,
} from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  analyzeEnquirySchema,
  generateBlogMetadataSchema,
  generateGpuPackageCopySchema,
  recommendGpuPackageSchema,
  siteAssistantSchema,
} from '../validators/ai.validator.js';

export const aiRouter = Router();
export const adminAiRouter = Router();

aiRouter.post('/gpu-recommendation', validate(recommendGpuPackageSchema), recommendGpuPackage);
aiRouter.post('/site-assistant', validate(siteAssistantSchema), answerSiteAssistant);

adminAiRouter.use(authenticate, requireAdmin);
adminAiRouter.post('/blog-metadata', validate(generateBlogMetadataSchema), generateBlogMetadata);
adminAiRouter.post('/enquiry-analysis', validate(analyzeEnquirySchema), analyzeEnquiry);
adminAiRouter.post('/gpu-package-copy', validate(generateGpuPackageCopySchema), generateGpuPackageCopy);
