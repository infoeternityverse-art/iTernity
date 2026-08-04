import { apiClient } from './api-client.js';
import { normalizeApiData } from './service-utils.js';

export const siteSettingService = {
  get: async () => normalizeApiData(await apiClient.get('/site-settings')),
  getAdmin: async () => normalizeApiData(await apiClient.get('/admin/site-settings')),
  uploadMedia: async (payload) =>
    normalizeApiData(await apiClient.post('/admin/site-settings/media', payload)),
};
