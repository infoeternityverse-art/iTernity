import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Button, Input, PageHeader } from '@/components/ui/index.js';
import { resetPasswordSchema } from '@/schemas/auth.schemas.js';
import { authService } from '@/services/auth-service.js';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (values) => {
    setStatus({ loading: true, error: '', success: '' });

    try {
      await authService.resetPassword({ email, token, password: values.password });
      setStatus({ loading: false, error: '', success: 'Password reset successful.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const missingLinkData = !email || !token;

  return (
    <div className="space-y-6">
      <PageHeader title="Create New Password" description="Complete your secure password reset." />
      {missingLinkData ? (
        <Alert variant="danger">This password reset link is invalid or incomplete.</Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {status.error && <Alert variant="danger">{status.error}</Alert>}
          {status.success && <Alert variant="success">{status.success}</Alert>}
          <Input
            id="password"
            label="New Password"
            type="password"
            autoComplete="new-password"
            disabled={status.loading || Boolean(status.success)}
            error={errors.password?.message}
            {...register('password')}
          />
          <Button
            type="submit"
            className="w-full"
            loading={status.loading}
            disabled={Boolean(status.success)}
          >
            Reset password
          </Button>
        </form>
      )}
      <p className="text-center text-sm text-[#8FA39B]">
        <Link to="/login" className="font-semibold text-brand-400 hover:text-white">
          Back to login
        </Link>
      </p>
    </div>
  );
}
