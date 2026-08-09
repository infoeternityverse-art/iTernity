import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Button, Input } from '@/components/ui/index.js';

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
});

const formatCooldown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
};

export function ProfileForm({ user, onSubmit, loading, error, emailChangeCooldownSeconds = 0 }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name || '', email: user.email || '' });
  }, [reset, user]);

  const requestedEmail = String(watch('email') || '')
    .toLowerCase()
    .trim();
  const currentEmail = String(user?.email || '').toLowerCase();
  const isEmailChange = Boolean(requestedEmail && requestedEmail !== currentEmail);
  const isEmailChangeCoolingDown = isEmailChange && emailChangeCooldownSeconds > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Input
        id="profileName"
        label="Name"
        error={errors.name?.message}
        disabled={loading}
        {...register('name')}
      />
      <Alert title="Changing your sign-in email" variant="info">
        <ol className="list-decimal space-y-1 pl-4">
          <li>Enter the new address and submit this form.</li>
          <li>Open the confirmation sent to your current email.</li>
          <li>Open the separate confirmation sent to your new email.</li>
          <li>Sign in with the new address after both confirmations are complete.</li>
        </ol>
      </Alert>
      <Input
        id="profileEmail"
        label="Email"
        type="email"
        autoComplete="email"
        helperText="Your current email remains active until both secure confirmations are completed."
        error={errors.email?.message}
        disabled={loading}
        {...register('email')}
      />
      {isEmailChangeCoolingDown && (
        <Alert title="Email-change cooldown active" variant="warning">
          You can request new confirmation links in {formatCooldown(emailChangeCooldownSeconds)}.
          Existing confirmation links can still be used.
        </Alert>
      )}
      <Button type="submit" loading={loading} disabled={isEmailChangeCoolingDown}>
        {isEmailChangeCoolingDown
          ? `Try again in ${formatCooldown(emailChangeCooldownSeconds)}`
          : 'Update profile'}
      </Button>
    </form>
  );
}

export function ChangePasswordForm({ onSubmit, loading, error }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const handlePasswordSubmit = async (values) => {
    const succeeded = await onSubmit(values);
    if (succeeded) reset();
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Input
        id="currentPassword"
        label="Current Password"
        type="password"
        error={errors.currentPassword?.message}
        disabled={loading}
        {...register('currentPassword')}
      />
      <Input
        id="newPassword"
        label="New Password"
        type="password"
        error={errors.newPassword?.message}
        disabled={loading}
        {...register('newPassword')}
      />
      <Button type="submit" variant="outline" loading={loading}>
        Change password
      </Button>
    </form>
  );
}
