import { Router } from 'express';
import {
  adminLogin,
  changePassword,
  completePasswordReset,
  createSession,
  forgotPassword,
  login,
  logout,
  me,
  resetPasswordWithToken,
  refreshSession,
  updateMe,
  requestEmailChange,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  adminLoginAccountRateLimiter,
  adminLoginIpRateLimiter,
  authSessionRateLimiter,
  loginAccountRateLimiter,
  loginIpRateLimiter,
  passwordResetEmailRateLimiter,
  passwordResetIpRateLimiter,
  emailChangeAccountRateLimiter,
  emailChangeIpRateLimiter,
  passwordChangeAccountRateLimiter,
  passwordChangeIpRateLimiter,
} from '../middlewares/rate-limit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  updateMeSchema,
  requestEmailChangeSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  validate(loginSchema),
  loginIpRateLimiter,
  loginAccountRateLimiter,
  login
);
authRouter.post(
  '/admin/login',
  validate(loginSchema),
  adminLoginIpRateLimiter,
  adminLoginAccountRateLimiter,
  adminLogin
);
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  passwordResetIpRateLimiter,
  passwordResetEmailRateLimiter,
  forgotPassword
);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPasswordWithToken);
authRouter.post('/session', authSessionRateLimiter, authenticate, createSession);
authRouter.post('/refresh', authSessionRateLimiter, refreshSession);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, me);
authRouter.patch('/me', authenticate, validate(updateMeSchema), updateMe);
authRouter.post(
  '/email-change',
  authenticate,
  emailChangeIpRateLimiter,
  emailChangeAccountRateLimiter,
  validate(requestEmailChangeSchema),
  requestEmailChange
);
authRouter.patch(
  '/password',
  authenticate,
  passwordChangeIpRateLimiter,
  passwordChangeAccountRateLimiter,
  validate(changePasswordSchema),
  changePassword
);
authRouter.post('/password-reset-complete', authSessionRateLimiter, authenticate, completePasswordReset);
