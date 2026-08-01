import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/forms/login-form.jsx';
import { Alert, PageHeader } from '@/components/ui/index.js';
import { useAuthStore } from '@/store/auth-store.js';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (values) => {
    try {
      await adminLogin(values);
      navigate(from, { replace: true });
    } catch {
      // The auth store already exposes the message for the form alert.
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Login" description="Access the admin console." />
      {location.state?.message && <Alert>{location.state.message}</Alert>}
      <LoginForm
        onSubmit={handleSubmit}
        loading={isLoading}
        error={error}
        submitLabel="Login as admin"
      />
    </div>
  );
}
