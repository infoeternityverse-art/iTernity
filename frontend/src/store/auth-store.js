import { create } from 'zustand';
import { authService } from '@/services/auth-service.js';
import { queryClient } from '@/config/query-client.js';

let activeRestoreRequest = null;

const applyAuthData = (data, set) => {
  queryClient.clear();
  set({
    user: data.user,
    isAuthenticated: true,
    isRestoring: false,
    hasRestored: true,
    error: null,
    pendingVerification: false,
    pendingVerificationEmail: null,
  });
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isRestoring: false,
  hasRestored: false,
  isLoading: false,
  error: null,
  pendingVerification: false,
  pendingVerificationEmail: null,

  clearSession: () => {
    queryClient.clear();
    set({
      user: null,
      isAuthenticated: false,
      isRestoring: false,
      hasRestored: true,
      isLoading: false,
      error: null,
      pendingVerification: false,
      pendingVerificationEmail: null,
    });
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.register(payload);
      if (data.user) {
        applyAuthData(data, set);
      } else {
        set({
          pendingVerification: true,
          pendingVerificationEmail: data.email || payload.email,
          isRestoring: false,
          hasRestored: true,
          error: null,
        });
      }
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false, isRestoring: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.login(payload);
      applyAuthData(data, set);
      return data.user;
    } catch (error) {
      set({ error: error.message, isLoading: false, isRestoring: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resendConfirmation: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await authService.resendConfirmation(payload);
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  adminLogin: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.adminLogin(payload);
      applyAuthData(data, set);
      return data.user;
    } catch (error) {
      set({ error: error.message, isLoading: false, isRestoring: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  googleLogin: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await authService.googleLogin(payload);
      return null;
    } catch (error) {
      set({ error: error.message, isLoading: false, isRestoring: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } catch {
      // Logout must clear the local session even if the token is already expired.
    } finally {
      get().clearSession();
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const currentEmail = String(get().user?.email || '').toLowerCase();
      const requestedEmail = String(payload.email || '').toLowerCase().trim();
      const emailChangePending = Boolean(requestedEmail && requestedEmail !== currentEmail);
      const currentName = String(get().user?.name || '').trim();
      const requestedName = String(payload.name || '').trim();
      let updatedUser = get().user;

      if (requestedName && requestedName !== currentName) {
        const data = await authService.updateMe({ name: requestedName });
        updatedUser = data.user;
        set({ user: updatedUser, error: null });
      }

      if (emailChangePending) {
        await authService.requestEmailChange({ newEmail: requestedEmail });
      }

      set({ isLoading: false, error: null });
      return { user: updatedUser, emailChangePending };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  changePassword: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await authService.changePassword(payload);
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  restoreSession: async () => {
    if (get().hasRestored) return get().user;
    if (activeRestoreRequest) return activeRestoreRequest;

    activeRestoreRequest = (async () => {
      set({ isRestoring: true });
      let supabaseSession = null;

      try {
        supabaseSession = await authService.getSupabaseSession();
      } catch {
        supabaseSession = null;
      }

      if (supabaseSession?.access_token) {
        try {
          const data = await authService.createSession(supabaseSession);
          applyAuthData(data, set);
          return data.user;
        } catch {
          // A backend cookie may still be valid, so continue with normal restoration.
        }
      }

      try {
        const data = await authService.me();
        set({
          user: data.user,
          isAuthenticated: true,
          isRestoring: false,
          hasRestored: true,
          error: null,
        });
        return data.user;
      } catch {
        set({
          user: null,
          isAuthenticated: false,
          isRestoring: false,
          hasRestored: true,
          pendingVerification: false,
          pendingVerificationEmail: null,
        });
        return null;
      }
    })();

    try {
      return await activeRestoreRequest;
    } finally {
      activeRestoreRequest = null;
    }
  },
}));
