import { auditLogService, contactEnquiryService } from '../services/index.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendServiceResponse } from '../utils/controller-response.js';
import { getQueryOptions } from '../utils/request-options.js';

export const createContactEnquiry = asyncHandler(async (req, res) => {
  const response = await contactEnquiryService.create(req.validated.body);
  return sendServiceResponse(res, response, 201);
});

export const listAdminContactEnquiries = asyncHandler(async (req, res) => {
  const response = await contactEnquiryService.findMany(getQueryOptions(req.validated.query));
  return sendServiceResponse(res, response);
});

export const updateAdminContactEnquiry = asyncHandler(async (req, res) => {
  const response = await contactEnquiryService.update(req.validated.params.id, req.validated.body);

  await auditLogService.record({
    actor: req.user._id,
    action: 'contact_enquiry.updated',
    entityType: 'ContactEnquiry',
    entityId: response.data._id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: { status: req.validated.body.status },
  });

  return sendServiceResponse(res, response);
});
