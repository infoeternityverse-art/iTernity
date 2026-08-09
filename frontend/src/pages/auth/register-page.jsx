import { Link, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button.jsx';
import { RegisterForm } from '@/components/forms/register-form.jsx';
import { PageHeader } from '@/components/ui/index.js';
import { useAuthStore } from '@/store/auth-store.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (values) => {
    const result = await register(values);
    if (result?.verificationRequired) {
      navigate('/login', {
        replace: true,
        state: { message: `We sent a confirmation link to ${result.email || values.email}.` },
      });
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  const handleGoogleLogin = async () => {
    await googleLogin({ redirectTo: `${window.location.origin}/dashboard` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Register" description="Create your customer account." />
      <GoogleSignInButton onClick={handleGoogleLogin} loading={isLoading} disabled={isLoading} />
      <RegisterForm onSubmit={handleSubmit} loading={isLoading} error={error} />
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-blue-300">
          Login
        </Link>
      </p>
    </div>
  );
}
