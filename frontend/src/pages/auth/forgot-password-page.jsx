import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Alert, Button, Input, PageHeader } from '@/components/ui/index.js';
import { forgotPasswordSchema } from '@/schemas/auth.schemas.js';
import { authService } from '@/services/auth-service.js';

export function ForgotPasswordPage() {
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    setStatus({ loading: true, error: '', success: '' });

    try {
      await authService.forgotPassword(values);
      setStatus({
        loading: false,
        error: '',
        success: 'If an account exists, a secure reset link will be sent.',
      });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reset Password" description="Request a secure password reset link." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {status.error && <Alert variant="danger">{status.error}</Alert>}
        {status.success && <Alert variant="success">{status.success}</Alert>}
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          disabled={status.loading}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" className="w-full" loading={status.loading}>
          Send reset link
        </Button>
      </form>
      <p className="text-center text-sm text-[#8FA39B]">
        Remembered it?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:text-white">
          Login
        </Link>
      </p>
    </div>
  );
}
