import { randomBytes } from 'node:crypto';
import { Credential, CREDENTIAL_STATUSES, User, USER_ROLES } from '../models/index.js';
import { notificationConfig } from '../config/notification.config.js';
import { notificationService } from '../notifications/index.js';
import { ConflictError } from '../utils/errors.js';
import { Workspace, WORKSPACE_STATUSES } from '../workspace/models/index.js';
import { createSupabaseRecoveryLink, deleteSupabaseUser } from './auth.service.js';
import { BaseService } from './base.service.js';
import { hashPassword } from './password.service.js';
import { signPasswordResetToken } from './token.service.js';

class UserService extends BaseService {
  constructor() {
    super(User, {
      resourceName: 'User',
      searchFields: ['name', 'email'],
      allowedFilters: ['role', 'isActive'],
      allowedSortFields: ['createdAt', 'updatedAt', 'name', 'email', 'lastLoginAt'],
      allowedSelectFields: [
        'name',
        'email',
        'role',
        'isActive',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async ensureEmailAvailable(email, excludedUserId = null) {
    const existingUser = await User.findByEmail(email);

    if (existingUser && String(existingUser._id) !== String(excludedUserId)) {
      throw new ConflictError('An account with this email already exists.');
    }

    return true;
  }

  findMany(options = {}) {
    const filters = {
      ...options.filters,
      isActive: options.filters?.isActive ?? true,
    };

    return super.findMany({
      ...options,
      filters,
    });
  }

  findCustomers(options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        role: USER_ROLES.CUSTOMER,
      },
    });
  }

  findAdmins(options = {}) {
    return this.findMany({
      ...options,
      filters: {
        ...options.filters,
        role: USER_ROLES.ADMIN,
      },
    });
  }

  async sendPasswordResetLink(id) {
    const user = await User.findById(id).select('+passwordHash');

    if (!user) {
      return null;
    }

    const supabaseResetUrl = await createSupabaseRecoveryLink(user.email);
    const token = supabaseResetUrl ? null : signPasswordResetToken(user);
    const resetUrl =
      supabaseResetUrl ||
      `${notificationConfig.frontendUrl}/reset-password?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(user.email)}`;

    await notificationService.sendPasswordReset({
      user,
      resetUrl,
      expiresIn: '30m',
    });

    return user;
  }

  async delete(id) {
    this.ensureValidId(id);

    const user = await User.findById(id);

    if (!user) {
      return super.delete(id);
    }

    if (user.role === USER_ROLES.CUSTOMER) {
      const hasActiveWorkspace = await Workspace.exists({
        customer: user._id,
        status: { $in: [WORKSPACE_STATUSES.PROVISIONING, WORKSPACE_STATUSES.RUNNING] },
      });

      if (hasActiveWorkspace) {
        throw new ConflictError(
          'Stop the customer active workspace before deleting this account.'
        );
      }

      await deleteSupabaseUser({
        email: user.email,
        supabaseUserId: user.supabaseUserId,
      });

      const revokedAt = new Date();

      await Credential.updateMany(
        { customer: user._id, status: CREDENTIAL_STATUSES.ACTIVE },
        { $set: { status: CREDENTIAL_STATUSES.REVOKED, revokedAt } }
      );
    }

    user.name = 'Deleted customer';
    user.email = `deleted-${user._id}@accounts.invalid`;
    user.passwordHash = await hashPassword(randomBytes(48).toString('hex'));
    user.emailVerifiedAt = null;
    user.supabaseUserId = null;
    user.isActive = false;
    user.lastLoginAt = null;
    await user.save();

    return {
      data: user,
      message: 'User access revoked and account deleted successfully.',
    };
  }
}

export const userService = new UserService();
