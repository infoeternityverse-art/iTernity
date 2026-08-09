import { apiClient } from './api-client.js';
import { env } from '@/config/env.js';
import { isSupabaseConfigured, supabase } from '@/config/supabase-client.js';

const normalizeAuthPayload = (response) => response.data.data;

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  return supabase;
};

const fetchCurrentUserWithSession = async (session) => {
  if (!session?.access_token) {
    throw new Error('Authentication session was not returned.');
  }

  try {
    return normalizeAuthPayload(
      await apiClient.post(
        '/auth/session',
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
    );
  } catch (error) {
    if (supabase) {
      await supabase.auth.signOut();
    }

    throw error;
  }
};

export const authService = {
  register: async ({ name, email, password }) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${env.siteUrl}/login`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error(
        'Account registration could not be completed. Try logging in or resetting your password.'
      );
    }

    if (!data.session) {
      return {
        email,
        verificationRequired: true,
      };
    }

    return fetchCurrentUserWithSession(data.session);
  },
  login: async ({ email, password }) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      const authError = new Error(error.message);
      authError.code = error.code;
      throw authError;
    }

    return fetchCurrentUserWithSession(data.session);
  },
  resendConfirmation: async ({ email }) => {
    const client = requireSupabase();
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${env.siteUrl}/login`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return null;
  },
  adminLogin: async (payload) =>
    normalizeAuthPayload(await apiClient.post('/auth/admin/login', payload)),
  googleLogin: async ({ redirectTo } = {}) => {
    const client = requireSupabase();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return null;
  },
  getSupabaseSession: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },
  logout: async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // The backend cookie must still be cleared if Supabase is unavailable.
      }
    }

    return normalizeAuthPayload(await apiClient.post('/auth/logout'));
  },
  createSession: fetchCurrentUserWithSession,
  me: async () => normalizeAuthPayload(await apiClient.get('/auth/me')),
  updateMe: async (payload) => normalizeAuthPayload(await apiClient.patch('/auth/me', payload)),
  requestEmailChange: async ({ newEmail }) =>
    normalizeAuthPayload(await apiClient.post('/auth/email-change', { newEmail })),
  changePassword: async (payload) =>
    normalizeAuthPayload(await apiClient.patch('/auth/password', payload)),
  forgotPassword: async ({ email }) => {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.siteUrl}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return null;
  },
  resetPassword: async ({ email, token, password }) => {
    if (email && token) {
      return normalizeAuthPayload(
        await apiClient.post('/auth/reset-password', { email, token, password })
      );
    }

    const client = requireSupabase();
    const { error } = await client.auth.updateUser({ password });

    if (error) {
      throw new Error(error.message);
    }

    return null;
  },
};
