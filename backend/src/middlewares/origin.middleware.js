import { config } from '../config/index.js';
import { ApiError } from '../utils/api-error.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const requireTrustedCookieOrigin = (req, _res, next) => {
  const hasAuthCookie = Boolean(
    req.cookies?.[config.authCookies.accessName] || req.cookies?.[config.authCookies.refreshName]
  );

  if (SAFE_METHODS.has(req.method) || !hasAuthCookie) {
    return next();
  }

  const origin = req.get('origin');

  if (!origin || !config.corsOrigins.includes(origin)) {
    throw new ApiError(403, 'Request origin is not allowed.');
  }

  return next();
};
