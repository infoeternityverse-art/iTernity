import { Router } from 'express';
import {
  getAdminSiteSettings,
  getSiteSettings,
  uploadSiteMedia,
} from '../controllers/site-setting.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadSiteMediaSchema } from '../validators/site-setting.validator.js';

export const siteSettingRouter = Router();
export const adminSiteSettingRouter = Router();

siteSettingRouter.get('/', getSiteSettings);

adminSiteSettingRouter.use(authenticate, requireAdmin);
adminSiteSettingRouter.get('/', getAdminSiteSettings);
adminSiteSettingRouter.post('/media', validate(uploadSiteMediaSchema), uploadSiteMedia);
