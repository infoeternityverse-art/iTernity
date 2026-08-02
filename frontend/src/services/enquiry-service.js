import { apiClient } from './api-client.js';
import { buildRequestConfig, normalizeApiData, normalizeApiList } from './service-utils.js';

export const enquiryService = {
  create: async (payload) => normalizeApiData(await apiClient.post('/enquiries', payload)),
  getById: async (id, params) =>
    normalizeApiData(await apiClient.get(`/enquiries/${id}`, buildRequestConfig(params))),
  listCustomer: async (params) =>
    normalizeApiList(await apiClient.get('/customer/enquiries', buildRequestConfig(params))),
  listAdmin: async (params) =>
    normalizeApiList(await apiClient.get('/admin/enquiries', buildRequestConfig(params))),
  analyze: async (payload) =>
    normalizeApiData(await apiClient.post('/admin/ai/enquiry-analysis', payload)),
  updateAdmin: async (id, payload) =>
    normalizeApiData(await apiClient.patch(`/admin/enquiries/${id}`, payload)),
};
