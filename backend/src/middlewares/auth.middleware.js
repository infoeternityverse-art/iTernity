import { User } from '../models/index.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { verifyAccessToken } from '../services/token.service.js';
import { syncSupabaseUser } from '../services/auth.service.js';
import { config } from '../config/index.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
};

const getAccessToken = (req) =>
  getBearerToken(req) || req.cookies?.[config.authCookies.accessName] || null;

const isCurrentBackendSession = (payload, user) =>
  Boolean(
    user &&
      user.role === payload.role &&
      (user.sessionVersion || 0) === Number(payload.sv || 0)
  );

export const attachCurrentUser = asyncHandler(async (req, res, next) => {
  const token = getAccessToken(req);
  const bearerToken = getBearerToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findActiveById(payload.sub);
    req.user = isCurrentBackendSession(payload, user) ? user : null;
  } catch {
    req.user = bearerToken ? await syncSupabaseUser(bearerToken) : null;
  }

  return next();
});

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = getAccessToken(req);
  const bearerToken = getBearerToken(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required.');
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    const supabaseUser = bearerToken ? await syncSupabaseUser(bearerToken) : null;

    if (!supabaseUser) {
      throw new ApiError(401, 'Invalid or expired token.');
    }

    req.user = supabaseUser;
    return next();
  }

  const user = await User.findActiveById(payload.sub);

  if (!isCurrentBackendSession(payload, user)) {
    throw new ApiError(401, 'Authentication session is no longer valid.');
  }

  req.user = user;
  return next();
});
