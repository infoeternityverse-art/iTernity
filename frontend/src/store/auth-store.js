import { create } from 'zustand';
import { authService } from '@/services/auth-service.js';

const applyAuthData = (data, set) => {
  set({
    user: data.user,
    isAuthenticated: true,
    isRestoring: false,
    error: null,
    pendingVerification: false,
    pendingVerificationEmail: null,
  });
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isRestoring: true,
  isLoading: false,
  error: null,
  pendingVerification: false,
  pendingVerificationEmail: null,

  clearSession: () => {
    set({
      user: null,
      isAuthenticated: false,
      isRestoring: false,
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
      const data = await authService.updateMe(payload);
      set({ user: data.user, isLoading: false, error: null });
      return data.user;
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

    set({ isRestoring: true });

    try {
      const data = await authService.me();
      set({
        user: data.user,
        isAuthenticated: true,
        isRestoring: false,
        error: null,
      });
      return data.user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isRestoring: false,
        pendingVerification: false,
        pendingVerificationEmail: null,
      });
      return null;
    }
  },
}));
