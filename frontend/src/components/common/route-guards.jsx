import { Navigate, useLocation } from 'react-router-dom';
import { SparkLoader } from '@/components/common/spark-loader.jsx';
import { useAuthStore } from '@/store/auth-store.js';

const RouteLoader = () => <SparkLoader label="Checking your spark" />;

/**
 * ProtectedRoute requires an authenticated customer session before rendering dashboard routes.
 */
export function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== 'customer') {
    return <Navigate to="/403" replace />;
  }

  return children;
}

/**
 * PublicRoute wraps routes available to all visitors.
 */
export function PublicRoute({ children }) {
  return children;
}

/**
 * AdminRoute requires an authenticated admin session before rendering admin routes.
 */
export function AdminRoute({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (user?.role !== 'admin') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
          message: 'Please sign in with an admin account to access the admin console.',
        }}
      />
    );
  }

  return children;
}

/**
 * GuestRoute keeps authenticated users away from login and registration screens.
 */
export function GuestRoute({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) {
    return <RouteLoader />;
  }

  if (isAuthenticated) {
    if (location.pathname === '/admin/login' && user?.role !== 'admin') {
      return children;
    }

    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}
