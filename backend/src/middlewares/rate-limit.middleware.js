import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/index.js';
import { MongoRateLimitStore } from '../utils/mongo-rate-limit-store.js';

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
    store: new MongoRateLimitStore({ prefix: `${scope}:` }),
    skipSuccessfulRequests: true,
    keyGenerator: byAccount
      ? (req) => loginKey('account', req)
      : (req) => ipKeyGenerator(req.ip),
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
    store: new MongoRateLimitStore({ prefix: `${scope}:` }),
    keyGenerator: (req) => ipKeyGenerator(req.ip),
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

export const contactEnquiryRateLimiter = rateLimit({
  windowMs: config.contactRateLimit.windowMs,
  max: config.contactRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'contact-enquiry-ip:' }),
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: createMessage('Too many contact requests. Please wait before trying again.'),
});

export const passwordResetIpRateLimiter = rateLimit({
  windowMs: config.passwordResetRateLimit.ipWindowMs,
  max: config.passwordResetRateLimit.ipMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'password-reset-ip:' }),
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: passwordResetRateLimitMessage,
});

export const passwordResetEmailRateLimiter = rateLimit({
  windowMs: config.passwordResetRateLimit.emailWindowMs,
  max: config.passwordResetRateLimit.emailMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'password-reset-email:' }),
  keyGenerator: (req) => {
    const email = req.validated?.body?.email;

    if (email) {
      return String(email).toLowerCase().trim();
    }

    return ipKeyGenerator(req.ip);
  },
  message: passwordResetRateLimitMessage,
});

const emailChangeRateLimitMessage = createMessage(
  'Too many email change requests. Please try again later.'
);

export const emailChangeIpRateLimiter = rateLimit({
  windowMs: config.emailChangeRateLimit.ipWindowMs,
  max: config.emailChangeRateLimit.ipMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'email-change-ip:' }),
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: emailChangeRateLimitMessage,
});

export const emailChangeAccountRateLimiter = rateLimit({
  windowMs: config.emailChangeRateLimit.accountWindowMs,
  max: config.emailChangeRateLimit.accountMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'email-change-account:' }),
  keyGenerator: (req) => String(req.user._id),
  message: emailChangeRateLimitMessage,
});

const passwordChangeRateLimitMessage = createMessage(
  'Too many password change attempts. Please wait before trying again.'
);

export const passwordChangeIpRateLimiter = rateLimit({
  windowMs: config.passwordChangeRateLimit.windowMs,
  max: config.passwordChangeRateLimit.ipMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'password-change-ip:' }),
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: passwordChangeRateLimitMessage,
});

export const passwordChangeAccountRateLimiter = rateLimit({
  windowMs: config.passwordChangeRateLimit.windowMs,
  max: config.passwordChangeRateLimit.accountMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore({ prefix: 'password-change-account:' }),
  keyGenerator: (req) => String(req.user._id),
  message: passwordChangeRateLimitMessage,
});
