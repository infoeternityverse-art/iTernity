import { User } from '../models/index.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { verifyAccessToken } from '../services/token.service.js';
import { syncSupabaseUser } from '../services/auth.service.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
};

export const attachCurrentUser = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = await User.findActiveById(payload.sub);
  } catch {
    req.user = await syncSupabaseUser(token);
  }

  return next();
});

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required.');
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    const supabaseUser = await syncSupabaseUser(token);

    if (!supabaseUser) {
      throw new ApiError(401, 'Invalid or expired token.');
    }

    req.user = supabaseUser;
    return next();
  }

  const user = await User.findActiveById(payload.sub);

  if (!user) {
    throw new ApiError(401, 'Authenticated user was not found.');
  }

  req.user = user;
  return next();
});
