import { auditLogService, userService } from '../services/index.js';
import { sendServiceResponse } from '../utils/controller-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getQueryOptions } from '../utils/request-options.js';

export const listUsers = asyncHandler(async (req, res) => {
  const response = await userService.findMany(getQueryOptions(req.validated.query));
  return sendServiceResponse(res, response);
});

export const getUser = asyncHandler(async (req, res) => {
  const response = await userService.findById(req.validated.params.id);
  return sendServiceResponse(res, response);
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.validated.body.email) {
    await userService.ensureEmailCanBeEdited(req.validated.params.id);
    await userService.ensureEmailAvailable(req.validated.body.email, req.validated.params.id);
  }

  const response = await userService.update(req.validated.params.id, req.validated.body);
  return sendServiceResponse(res, response);
});

export const sendPasswordResetLink = asyncHandler(async (req, res) => {
  const targetUser = await userService.sendPasswordResetLink(req.validated.params.id);

  if (!targetUser) {
    throw new ApiError(404, 'User not found.');
  }

  return sendServiceResponse(res, {
    message: 'Password reset link sent.',
    data: { user: targetUser },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.validated.params.id) === String(req.user._id)) {
    throw new ApiError(400, 'You cannot delete your own account.');
  }

  const response = await userService.delete(req.validated.params.id);

  try {
    await auditLogService.record({
      actor: req.user._id,
      action: 'user.deleted',
      entityType: 'User',
      entityId: req.validated.params.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
    });
  } catch (error) {
    console.error('User deletion audit log failed.', error);
  }

  return sendServiceResponse(res, response);
});
