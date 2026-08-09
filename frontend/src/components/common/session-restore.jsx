import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store.js';
import { AUTH_SESSION_EXPIRED_EVENT } from '@/utils/token-storage.js';

/**
 * SessionEvents keeps cross-cutting session-expiry handling active without forcing
 * public routes to make authentication requests.
 */
export function SessionEvents({ children }) {
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  return children;
}
