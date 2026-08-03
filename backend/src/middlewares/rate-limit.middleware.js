import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/index.js';

const passwordResetRateLimitMessage = {
  success: false,
  message: 'Too many password reset requests. Please try again later.',
  errors: [],
};

export const passwordResetIpRateLimiter = rateLimit({
  windowMs: config.passwordResetRateLimit.ipWindowMs,
  max: config.passwordResetRateLimit.ipMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `password-reset-ip:${ipKeyGenerator(req.ip)}`,
  message: passwordResetRateLimitMessage,
});

export const passwordResetEmailRateLimiter = rateLimit({
  windowMs: config.passwordResetRateLimit.emailWindowMs,
  max: config.passwordResetRateLimit.emailMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.validated?.body?.email;

    if (email) {
      return `password-reset-email:${String(email).toLowerCase().trim()}`;
    }

    return `password-reset-email:${ipKeyGenerator(req.ip)}`;
  },
  message: passwordResetRateLimitMessage,
});
