import { apiClient } from './api-client.js';
import { normalizeApiData } from './service-utils.js';

export const aiService = {
  siteAssistant: async (payload) =>
    normalizeApiData(await apiClient.post('/ai/site-assistant', payload)),
};
