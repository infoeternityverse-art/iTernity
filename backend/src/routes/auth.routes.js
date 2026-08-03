import { Router } from 'express';
import {
  adminLogin,
  changePassword,
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPasswordWithToken,
  updateMe,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  passwordResetEmailRateLimiter,
  passwordResetIpRateLimiter,
} from '../middlewares/rate-limit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateMeSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/admin/login', validate(loginSchema), adminLogin);
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  passwordResetIpRateLimiter,
  passwordResetEmailRateLimiter,
  forgotPassword
);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPasswordWithToken);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, me);
authRouter.patch('/me', authenticate, validate(updateMeSchema), updateMe);
authRouter.patch('/password', authenticate, validate(changePasswordSchema), changePassword);
