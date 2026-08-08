import { apiClient } from './api-client.js';
import { buildRequestConfig, normalizeApiData, normalizeApiList } from './service-utils.js';

export const userService = {
  list: async (params) =>
    normalizeApiList(await apiClient.get('/users', buildRequestConfig(params))),
  getById: async (id, params) =>
    normalizeApiData(await apiClient.get(`/users/${id}`, buildRequestConfig(params))),
  update: async (id, payload) => normalizeApiData(await apiClient.patch(`/users/${id}`, payload)),
  sendPasswordResetLink: async (id) =>
    normalizeApiData(await apiClient.post(`/users/${id}/send-password-reset`)),
  delete: async (id) => normalizeApiData(await apiClient.delete(`/users/${id}`)),
};
