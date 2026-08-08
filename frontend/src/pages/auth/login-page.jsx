import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button.jsx';
import { LoginForm } from '@/components/forms/login-form.jsx';
import { Alert, PageHeader } from '@/components/ui/index.js';
import { useAuthStore } from '@/store/auth-store.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const from = location.state?.from?.pathname || '/dashboard';
  const notice = location.state?.message || '';
  const returnState = location.state?.enquiryDraft ? { enquiryDraft: location.state.enquiryDraft } : undefined;

  const handleSubmit = async (values) => {
    try {
      await login(values);
      navigate(from, { replace: true, state: returnState });
    } catch {
      // The store surfaces auth errors beside the form.
    }
  };

  const handleGoogleLogin = async () => {
    await googleLogin({ redirectTo: `${window.location.origin}${from}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Login" description="Access your customer dashboard." />
      {notice && <Alert variant="success">{notice}</Alert>}
      <LoginForm onSubmit={handleSubmit} loading={isLoading} error={error} />
      <GoogleSignInButton onClick={handleGoogleLogin} loading={isLoading} disabled={isLoading} />
      <p className="text-center text-sm text-[#8FA39B]">
        <Link to="/forgot-password" className="font-medium text-brand-400 hover:text-white">
          Forgot password?
        </Link>
      </p>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Need an account?{' '}
        <Link
          to="/register"
          className="font-medium text-brand-600 hover:underline dark:text-blue-300"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
