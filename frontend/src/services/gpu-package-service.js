import { apiClient } from './api-client.js';
import { buildRequestConfig, normalizeApiData, normalizeApiList } from './service-utils.js';

export const gpuPackageService = {
  list: async (params) =>
    normalizeApiList(await apiClient.get('/gpu-packages', buildRequestConfig(params))),
  getById: async (id, params) =>
    normalizeApiData(await apiClient.get(`/gpu-packages/${id}`, buildRequestConfig(params))),
  listAdmin: async (params) =>
    normalizeApiList(await apiClient.get('/admin/gpu-packages', buildRequestConfig(params))),
  getAdminById: async (id, params) =>
    normalizeApiData(await apiClient.get(`/admin/gpu-packages/${id}`, buildRequestConfig(params))),
  generateCopy: async (payload) =>
    normalizeApiData(await apiClient.post('/admin/ai/gpu-package-copy', payload)),
  create: async (payload) => normalizeApiData(await apiClient.post('/admin/gpu-packages', payload)),
  update: async (id, payload) =>
    normalizeApiData(await apiClient.patch(`/admin/gpu-packages/${id}`, payload)),
  remove: async (id) => normalizeApiData(await apiClient.delete(`/admin/gpu-packages/${id}`)),
};
