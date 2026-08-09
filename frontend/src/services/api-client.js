import axios from 'axios';
import { env } from '@/config/env.js';
import { notifySessionExpired } from '@/utils/token-storage.js';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshRequest = null;

const parseRetryAfterSeconds = (value) => {
  if (!value) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, Math.ceil(seconds));

  const retryAt = Date.parse(value);
  return Number.isNaN(retryAt) ? null : Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
};

const readResponseHeader = (headers, name) => {
  if (!headers) return null;
  if (typeof headers.get === 'function') return headers.get(name);
  return headers[name.toLowerCase()] ?? headers[name] ?? null;
};

const NON_REFRESHABLE_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/admin/login',
  '/auth/session',
  '/auth/refresh',
  '/auth/reset-password',
]);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url === '/auth/refresh';
    const canRefreshRequest = !NON_REFRESHABLE_AUTH_PATHS.has(originalRequest?.url);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      canRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        refreshRequest ||= apiClient.post('/auth/refresh');
        await refreshRequest;
        return apiClient(originalRequest);
      } catch {
        notifySessionExpired();
      } finally {
        refreshRequest = null;
      }
    } else if (error.response?.status === 401 && isRefreshRequest) {
      notifySessionExpired();
    }

    const normalizedError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Something went wrong.',
      errors: error.response?.data?.errors || [],
      retryAfterSeconds: parseRetryAfterSeconds(
        readResponseHeader(error.response?.headers, 'Retry-After')
      ),
      originalError: error,
    };

    return Promise.reject(normalizedError);
  }
);
