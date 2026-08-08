import { randomBytes } from 'node:crypto';
import { config } from '../config/index.js';
import { notificationConfig } from '../config/notification.config.js';
import { notificationService } from '../notifications/index.js';
import { User, USER_ROLES } from '../models/index.js';
import { ApiError } from '../utils/api-error.js';
import { comparePassword, hashPassword } from './password.service.js';
import {
  issueAuthTokens,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from './token.service.js';

const sanitizeUser = (user) => user.toJSON();

const buildAuthResponse = (user) => ({
  user: sanitizeUser(user),
  tokens: issueAuthTokens(user),
});

const getSupabaseUser = async (token) => {
  if (!config.supabase.url || !config.supabase.anonKey) {
    return null;
  }

  const response = await fetch(`${config.supabase.url.replace(/\/+$/g, '')}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: config.supabase.anonKey,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

const callSupabaseAdmin = async (path, options = {}) => {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    return null;
  }

  const response = await fetch(`${config.supabase.url.replace(/\/+$/g, '')}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.supabase.serviceRoleKey}`,
      apikey: config.supabase.serviceRoleKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    return null;
  }

  if (response.status === 204) {
    return {};
  }

  return response.json();
};

export const createSupabaseRecoveryLink = async (email) => {
  const data = await callSupabaseAdmin('/auth/v1/admin/generate_link', {
    method: 'POST',
    body: JSON.stringify({
      type: 'recovery',
      email,
      redirect_to: `${notificationConfig.frontendUrl}/reset-password`,
    }),
  });

  return data?.action_link || null;
};

export const findSupabaseUserIdByEmail = async (email) => {
  const normalizedEmail = String(email || '').toLowerCase().trim();

  if (!normalizedEmail) {
    return null;
  }

  const data = await callSupabaseAdmin('/auth/v1/admin/users?page=1&per_page=1000');
  const user = data?.users?.find(
    (candidate) => String(candidate.email || '').toLowerCase().trim() === normalizedEmail
  );

  return user?.id || null;
};

export const deleteSupabaseUser = async ({ email, supabaseUserId }) => {
  const userId = supabaseUserId || (await findSupabaseUserIdByEmail(email));

  if (!userId) {
    return false;
  }

  const data = await callSupabaseAdmin(`/auth/v1/admin/user/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });

  return Boolean(data);
};

const getSupabaseDisplayName = (profile) => {
  const metadata = profile.user_metadata || {};
  return String(
    metadata.name || metadata.full_name || metadata.display_name || profile.email || 'Customer'
  ).trim();
};

export const syncSupabaseUser = async (token) => {
  const profile = await getSupabaseUser(token);

  if (!profile?.email) {
    return null;
  }

  const email = String(profile.email).toLowerCase().trim();
  const emailVerifiedAt = profile.email_confirmed_at
    ? new Date(profile.email_confirmed_at)
    : new Date();
  let user = await User.findByEmail(email);

  if (!user) {
    user = await User.create({
      name: getSupabaseDisplayName(profile),
      email,
      passwordHash: await hashPassword(randomBytes(48).toString('hex')),
      role: USER_ROLES.CUSTOMER,
      emailVerifiedAt,
      supabaseUserId: profile.id,
    });
    notificationService.sendWelcomeEmail(user);
  } else {
    if (!user.isActive) {
      throw new ApiError(403, 'This account is inactive.');
    }

    user.emailVerifiedAt = user.emailVerifiedAt || emailVerifiedAt;
    user.supabaseUserId = user.supabaseUserId || profile.id;
    if (!user.name) {
      user.name = getSupabaseDisplayName(profile);
    }
  }

  user.markLogin();
  await user.save();

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
    '+passwordHash'
  );

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account is inactive.');
  }

  if (!user.emailVerifiedAt) {
    throw new ApiError(403, 'Please verify your email before logging in.');
  }

  user.markLogin();
  await user.save();

  return buildAuthResponse(user);
};

export const loginAdmin = async ({ email, password }) => {
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
    '+passwordHash'
  );

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account is inactive.');
  }

  if (user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Admin access required.');
  }

  user.markLogin();
  await user.save();

  return buildAuthResponse(user);
};

export const getCurrentUser = (user) => sanitizeUser(user);

export const updateCurrentUser = async (user, payload) => {
  if (payload.email) {
    const existingUser = await User.findByEmail(payload.email);

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      throw new ApiError(409, 'An account with this email already exists.');
    }
  }

  Object.assign(user, payload);
  await user.save();

  notificationService.sendProfileUpdated(user);

  return sanitizeUser(user);
};

export const changeCurrentUserPassword = async (user, { currentPassword, newPassword }) => {
  const userWithPassword = await User.findById(user._id).select('+passwordHash');

  if (!(await comparePassword(currentPassword, userWithPassword.passwordHash))) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  userWithPassword.passwordHash = await hashPassword(newPassword);
  await userWithPassword.save();

  notificationService.sendPasswordChanged(userWithPassword);
};

export const requestPasswordReset = async ({ email }) => {
  const user = await User.findByEmail(email).select('+passwordHash');

  if (!user || !user.isActive || !user.emailVerifiedAt) {
    return;
  }

  const supabaseResetUrl = await createSupabaseRecoveryLink(user.email);
  const token = supabaseResetUrl ? null : signPasswordResetToken(user);
  const resetUrl =
    supabaseResetUrl ||
    `${notificationConfig.frontendUrl}/reset-password?token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(user.email)}`;

  notificationService.sendPasswordReset({
    user,
    resetUrl,
    expiresIn: config.jwt.passwordResetExpiresIn,
  });
};

export const resetPassword = async ({ email, token, password }) => {
  const user = await User.findByEmail(email).select('+passwordHash');

  if (!user || !user.isActive) {
    throw new ApiError(400, 'Invalid or expired password reset link.');
  }

  try {
    const payload = verifyPasswordResetToken(token, user);

    if (payload.purpose !== 'password_reset' || payload.sub !== user._id.toString()) {
      throw new Error('Invalid password reset token.');
    }
  } catch {
    throw new ApiError(400, 'Invalid or expired password reset link.');
  }

  user.passwordHash = await hashPassword(password);
  await user.save();

  notificationService.sendPasswordChanged(user);
};
