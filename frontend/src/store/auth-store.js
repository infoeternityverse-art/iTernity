import { create } from 'zustand';
import { authService } from '@/services/auth-service.js';
import { tokenStorage } from '@/utils/token-storage.js';

const initialAccessToken = tokenStorage.getAccessToken();

const applyAuthData = (data, set) => {
  tokenStorage.setTokens({
    accessToken: data.tokens?.accessToken,
    refreshToken: data.tokens?.refreshToken,
  });

  set({
    user: data.user,
    accessToken: data.tokens?.accessToken || tokenStorage.getAccessToken(),
    isAuthenticated: true,
    isRestoring: false,
    error: null,
    pendingVerification: false,
    pendingVerificationEmail: null,
  });
};

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: initialAccessToken,
  isAuthenticated: Boolean(initialAccessToken),
  isRestoring: Boolean(initialAccessToken),
  isLoading: false,
  error: null,
  pendingVerification: false,
  pendingVerificationEmail: null,

  clearSession: () => {
    tokenStorage.clearTokens();
    set({
      user: null,
      accessToken: null,
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
      if (data.tokens?.accessToken) {
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
    const hadToken = Boolean(get().accessToken);
    set({ isLoading: true });

    try {
      if (hadToken) {
        await authService.logout();
      }
    } catch {
      // Logout must clear the local session even if the token is already expired.
    } finally {
      tokenStorage.clearTokens();
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
    let token = tokenStorage.getAccessToken();
    let supabaseSession = null;

    try {
      supabaseSession = await authService.getSupabaseSession();
    } catch {
      supabaseSession = null;
    }

    if (supabaseSession?.access_token) {
      tokenStorage.setTokens({
        accessToken: supabaseSession.access_token,
        refreshToken: supabaseSession.refresh_token,
      });
      token = supabaseSession.access_token;
    }

    if (!token) {
      set({
        isRestoring: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        pendingVerification: false,
        pendingVerificationEmail: null,
      });
      return null;
    }

    set({ isRestoring: true, accessToken: token });

    try {
      const data = await authService.me();
      set({
        user: data.user,
        accessToken: token,
        isAuthenticated: true,
        isRestoring: false,
        error: null,
      });
      return data.user;
    } catch {
      tokenStorage.clearTokens();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isRestoring: false,
        pendingVerification: false,
        pendingVerificationEmail: null,
      });
      return null;
    }
  },
}));
