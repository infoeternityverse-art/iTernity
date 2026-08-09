import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email address.').max(254),
    password: z.string().min(1, 'Password is required.'),
  }),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

export const requestEmailChangeSchema = z.object({
  body: z
    .object({
      newEmail: z.string().trim().email('Enter a valid email address.').max(254),
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: passwordSchema,
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email address.').max(254),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Enter a valid email address.').max(254),
    token: z.string().min(20, 'Reset token is required.'),
    password: passwordSchema,
  }),
});
