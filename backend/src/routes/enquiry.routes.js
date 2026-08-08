import { Router } from 'express';
import {
  createEnquiry,
  getEnquiry,
  listAdminEnquiries,
  listCustomerEnquiries,
  updateAdminEnquiry,
} from '../controllers/enquiry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin, requireCustomer } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createEnquirySchema,
  getEnquirySchema,
  listEnquiriesSchema,
  updateEnquirySchema,
} from '../validators/enquiry.validator.js';

export const enquiryRouter = Router();
export const customerEnquiryRouter = Router();
export const adminEnquiryRouter = Router();

enquiryRouter.use(authenticate);
enquiryRouter.post('/', requireCustomer, validate(createEnquirySchema), createEnquiry);
enquiryRouter.get('/:id', validate(getEnquirySchema), getEnquiry);

customerEnquiryRouter.use(authenticate, requireCustomer);
customerEnquiryRouter.get('/', validate(listEnquiriesSchema), listCustomerEnquiries);

adminEnquiryRouter.use(authenticate, requireAdmin);
adminEnquiryRouter.get('/', validate(listEnquiriesSchema), listAdminEnquiries);
adminEnquiryRouter.patch('/:id', validate(updateEnquirySchema), updateAdminEnquiry);
