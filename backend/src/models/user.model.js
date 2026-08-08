import mongoose from 'mongoose';

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    supabaseUserId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

userSchema.virtual('displayName').get(function getDisplayName() {
  return this.name || this.email;
});

userSchema.virtual('isAdmin').get(function getIsAdmin() {
  return this.role === USER_ROLES.ADMIN;
});

userSchema.method('canAccessAdmin', function canAccessAdmin() {
  return this.isActive && this.role === USER_ROLES.ADMIN;
});

userSchema.method('markLogin', function markLogin() {
  this.lastLoginAt = new Date();
  return this;
});

userSchema.static('findByEmail', function findByEmail(email) {
  return this.findOne({ email: String(email).toLowerCase().trim() });
});

userSchema.static('findActiveById', function findActiveById(id) {
  return this.findOne({ _id: id, isActive: true });
});

userSchema.pre('save', function normalizeUser(next) {
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  if (this.isModified('name') && this.name) {
    this.name = this.name.trim();
  }

  next();
});

export const User = mongoose.model('User', userSchema);
