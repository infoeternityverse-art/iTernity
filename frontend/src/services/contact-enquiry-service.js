import { apiClient } from './api-client.js';
import { buildRequestConfig, normalizeApiData, normalizeApiList } from './service-utils.js';

export const contactEnquiryService = {
  create: async (payload) => normalizeApiData(await apiClient.post('/contact-enquiries', payload)),
  listAdmin: async (params) =>
    normalizeApiList(await apiClient.get('/admin/contact-enquiries', buildRequestConfig(params))),
  updateAdmin: async (id, payload) =>
    normalizeApiData(await apiClient.patch(`/admin/contact-enquiries/${id}`, payload)),
};
