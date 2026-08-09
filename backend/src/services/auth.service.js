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
  verifyRefreshToken,
  verifyPasswordResetToken,
} from './token.service.js';

const sanitizeUser = (user) => user.toJSON();

export const buildAuthResponse = (user) => ({
  user: sanitizeUser(user),
  tokens: issueAuthTokens(user),
});

export const refreshAuthSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh session required.');
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh session.');
  }

  const user = await User.findActiveById(payload.sub);

  if (!user || user.role !== payload.role) {
    throw new ApiError(401, 'Refresh session is no longer valid.');
  }

  return buildAuthResponse(user);
};

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

const getSupabaseErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload?.msg || payload?.message || payload?.error_description || payload?.error || null;
  } catch {
    return null;
  }
};

const callSupabaseAdmin = async (
  path,
  options = {},
  { required = false, acceptedStatuses = [] } = {}
) => {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    if (required) {
      throw new ApiError(503, 'Supabase account administration is not configured.');
    }

    return null;
  }

  let response;

  try {
    response = await fetch(`${config.supabase.url.replace(/\/+$/g, '')}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${config.supabase.serviceRoleKey}`,
        apikey: config.supabase.serviceRoleKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    if (required) {
      throw new ApiError(502, 'Supabase account administration is temporarily unavailable.');
    }

    return null;
  }

  if (!response.ok && !acceptedStatuses.includes(response.status)) {
    const providerMessage = await getSupabaseErrorMessage(response);

    if (required) {
      const error = new ApiError(502, 'Supabase rejected the account administration request.');
      error.cause = providerMessage ? new Error(providerMessage) : undefined;
      throw error;
    }

    return null;
  }

  if (response.status === 204 || acceptedStatuses.includes(response.status)) {
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

const getSupabaseAdminUser = async (userId) => {
  const data = await callSupabaseAdmin(
    `/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    {},
    { required: true }
  );

  return data?.user || data;
};

const createSupabaseEmailChangeLink = async ({ type, email, newEmail }) => {
  const data = await callSupabaseAdmin(
    '/auth/v1/admin/generate_link',
    {
      method: 'POST',
      body: JSON.stringify({
        type,
        email,
        new_email: newEmail,
        redirect_to: `${notificationConfig.frontendUrl}/email-change-confirmed`,
      }),
    },
    { required: true }
  );

  if (!data?.action_link) {
    throw new ApiError(502, 'Supabase did not return an email-change verification link.');
  }

  return data.action_link;
};

export const findSupabaseUserIdByEmail = async (email, { required = false } = {}) => {
  const normalizedEmail = String(email || '').toLowerCase().trim();

  if (!normalizedEmail) {
    return null;
  }

  for (let page = 1; page <= 100; page += 1) {
    const data = await callSupabaseAdmin(
      `/auth/v1/admin/users?page=${page}&per_page=1000`,
      {},
      { required }
    );
    const users = data?.users || [];
    const user = users.find(
      (candidate) => String(candidate.email || '').toLowerCase().trim() === normalizedEmail
    );

    if (user) {
      return user.id;
    }

    if (users.length < 1000) {
      break;
    }
  }

  return null;
};

export const deleteSupabaseUser = async ({ email, supabaseUserId }) => {
  const userId =
    supabaseUserId || (await findSupabaseUserIdByEmail(email, { required: true }));

  if (!userId) {
    return true;
  }

  await callSupabaseAdmin(
    `/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
    { required: true, acceptedStatuses: [404] }
  );

  return true;
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
  const emailVerifiedAt = profile.email_confirmed_at ? new Date(profile.email_confirmed_at) : null;
  let user = await User.findOne({ supabaseUserId: profile.id });

  if (!user) {
    user = await User.findByEmail(email);
  }

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
    if (user.supabaseUserId && user.supabaseUserId !== profile.id) {
      throw new ApiError(409, 'This email is linked to a different account identity.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'This account is inactive.');
    }

    if (user.email !== email) {
      const emailOwner = await User.findByEmail(email);

      if (emailOwner && String(emailOwner._id) !== String(user._id)) {
        throw new ApiError(409, 'The verified email is already linked to another account.');
      }

      user.email = email;
      user.emailVerifiedAt = emailVerifiedAt;
    } else {
      user.emailVerifiedAt = user.emailVerifiedAt || emailVerifiedAt;
    }

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
  if (payload.name) {
    user.name = payload.name;
  }

  await user.save();

  notificationService.sendProfileUpdated(user);

  return sanitizeUser(user);
};

export const requestCurrentUserEmailChange = async (user, { newEmail }) => {
  const normalizedEmail = String(newEmail).toLowerCase().trim();

  if (!user.supabaseUserId) {
    throw new ApiError(409, 'Re-authenticate before changing your email address.');
  }

  const supabaseUser = await getSupabaseAdminUser(user.supabaseUserId);
  const currentEmail = String(supabaseUser?.email || '').toLowerCase().trim();

  if (!currentEmail) {
    throw new ApiError(409, 'The current verified email could not be confirmed.');
  }

  if (normalizedEmail === currentEmail) {
    throw new ApiError(400, 'Enter a different email address.');
  }

  const existingUser = await User.findByEmail(normalizedEmail);

  if (existingUser && String(existingUser._id) !== String(user._id)) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const [currentVerificationUrl, newVerificationUrl] = await Promise.all([
    createSupabaseEmailChangeLink({
      type: 'email_change_current',
      email: currentEmail,
      newEmail: normalizedEmail,
    }),
    createSupabaseEmailChangeLink({
      type: 'email_change_new',
      email: currentEmail,
      newEmail: normalizedEmail,
    }),
  ]);

  await Promise.all([
    notificationService.sendEmailChangeVerification({
      to: currentEmail,
      verificationUrl: currentVerificationUrl,
      newEmail: normalizedEmail,
      isCurrent: true,
    }),
    notificationService.sendEmailChangeVerification({
      to: normalizedEmail,
      verificationUrl: newVerificationUrl,
      newEmail: normalizedEmail,
      isCurrent: false,
    }),
  ]);

  return { currentEmail, newEmail: normalizedEmail };
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
