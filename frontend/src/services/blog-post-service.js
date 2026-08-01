import { apiClient } from './api-client.js';
import { buildRequestConfig, normalizeApiData, normalizeApiList } from './service-utils.js';

export const blogPostService = {
  list: async (params) =>
    normalizeApiList(await apiClient.get('/blog-posts', buildRequestConfig(params))),
  getBySlug: async (slug, params) =>
    normalizeApiData(await apiClient.get(`/blog-posts/${slug}`, buildRequestConfig(params))),
  listAdmin: async (params) =>
    normalizeApiList(await apiClient.get('/admin/blog-posts', buildRequestConfig(params))),
  getAdminBySlug: async (slug, params) =>
    normalizeApiData(await apiClient.get(`/admin/blog-posts/${slug}`, buildRequestConfig(params))),
  create: async (payload) => normalizeApiData(await apiClient.post('/admin/blog-posts', payload)),
  uploadImage: async (payload) =>
    normalizeApiData(await apiClient.post('/admin/blog-posts/image-uploads', payload)),
  update: async (slug, payload) =>
    normalizeApiData(await apiClient.patch(`/admin/blog-posts/${slug}`, payload)),
  remove: async (slug) => normalizeApiData(await apiClient.delete(`/admin/blog-posts/${slug}`)),
};
