import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { blogPostService } from '@/services/blog-post-service.js';

export const useBlogPosts = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.blogPosts.list(params),
    queryFn: () => blogPostService.list(params),
    placeholderData: keepPreviousData,
    ...options,
  });

export const useBlogPost = (slug, params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.blogPosts.detail(slug),
    queryFn: () => blogPostService.getBySlug(slug, params),
    enabled: Boolean(slug) && (options.enabled ?? true),
    ...options,
  });

export const useAdminBlogPosts = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.blogPosts.adminList(params),
    queryFn: () => blogPostService.listAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });

export const useAdminBlogPost = (slug, params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.blogPosts.adminDetail(slug),
    queryFn: () => blogPostService.getAdminBySlug(slug, params),
    enabled: Boolean(slug) && (options.enabled ?? true),
    ...options,
  });
