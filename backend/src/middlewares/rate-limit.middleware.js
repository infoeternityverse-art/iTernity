import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/index.js';

const passwordResetRateLimitMessage = {
  success: false,
  message: 'Too many password reset requests. Please try again later.',
  errors: [],
};

const createMessage = (message) => ({ success: false, message, errors: [] });

const loginKey = (scope, req) => {
  const email = req.validated?.body?.email;
  return email
    ? `${scope}:${String(email).toLowerCase().trim()}`
    : `${scope}:${ipKeyGenerator(req.ip)}`;
};

const createLoginLimiter = ({ max, scope, byAccount = false }) =>
  rateLimit({
    windowMs: config.authRateLimit.windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: byAccount
      ? (req) => loginKey(scope, req)
      : (req) => `${scope}:${ipKeyGenerator(req.ip)}`,
    message: createMessage('Too many login attempts. Please wait before trying again.'),
  });

export const loginIpRateLimiter = createLoginLimiter({
  max: config.authRateLimit.ipMax,
  scope: 'login-ip',
});

export const loginAccountRateLimiter = createLoginLimiter({
  max: config.authRateLimit.accountMax,
  scope: 'login-account',
  byAccount: true,
});

export const adminLoginIpRateLimiter = createLoginLimiter({
  max: config.authRateLimit.adminIpMax,
  scope: 'admin-login-ip',
});

export const adminLoginAccountRateLimiter = createLoginLimiter({
  max: config.authRateLimit.adminAccountMax,
  scope: 'admin-login-account',
  byAccount: true,
});

export const authSessionRateLimiter = createLoginLimiter({
  max: config.authRateLimit.sessionMax,
  scope: 'auth-session-ip',
});

const createAiLimiter = (max, scope) =>
  rateLimit({
    windowMs: config.aiRateLimit.windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${scope}:${ipKeyGenerator(req.ip)}`,
    message: createMessage('AI request limit reached. Please try again later.'),
  });

export const gpuRecommendationRateLimiter = createAiLimiter(
  config.aiRateLimit.recommendationMax,
  'ai-gpu-recommendation'
);

export const siteAssistantRateLimiter = createAiLimiter(
  config.aiRateLimit.assistantMax,
  'ai-site-assistant'
);

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
