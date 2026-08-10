import { Router } from 'express';
import {
  createContactEnquiry,
  listAdminContactEnquiries,
  updateAdminContactEnquiry,
} from '../controllers/contact-enquiry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { contactEnquiryRateLimiter } from '../middlewares/rate-limit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createContactEnquirySchema,
  listContactEnquiriesSchema,
  updateContactEnquirySchema,
} from '../validators/contact-enquiry.validator.js';

export const contactEnquiryRouter = Router();
export const adminContactEnquiryRouter = Router();

contactEnquiryRouter.post(
  '/',
  contactEnquiryRateLimiter,
  validate(createContactEnquirySchema),
  createContactEnquiry
);

adminContactEnquiryRouter.use(authenticate, requireAdmin);
adminContactEnquiryRouter.get('/', validate(listContactEnquiriesSchema), listAdminContactEnquiries);
adminContactEnquiryRouter.patch(
  '/:id',
  validate(updateContactEnquirySchema),
  updateAdminContactEnquiry
);
