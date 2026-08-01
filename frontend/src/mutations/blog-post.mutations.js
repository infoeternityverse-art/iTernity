import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, setListItemInCache } from './mutation-helpers.js';
import { queryKeys } from '@/queries/query-keys.js';
import { blogPostService } from '@/services/blog-post-service.js';

export const useCreateBlogPost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => blogPostService.create(payload),
    onSuccess: (createdPost, variables, context) => {
      invalidateQueries(queryClient, queryKeys.blogPosts.all);
      options.onSuccess?.(createdPost, variables, context);
    },
    ...options,
  });
};

export const useUpdateBlogPost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload }) => blogPostService.update(slug, payload),
    onSuccess: (updatedPost, variables, context) => {
      queryClient.setQueryData(queryKeys.blogPosts.adminDetail(variables.slug), updatedPost);
      queryClient.setQueryData(queryKeys.blogPosts.detail(variables.slug), updatedPost);
      setListItemInCache(queryClient, queryKeys.blogPosts.adminLists(), updatedPost);
      setListItemInCache(queryClient, queryKeys.blogPosts.lists(), updatedPost);
      invalidateQueries(queryClient, queryKeys.blogPosts.all);
      options.onSuccess?.(updatedPost, variables, context);
    },
    ...options,
  });
};

export const useDeleteBlogPost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => blogPostService.remove(slug),
    onSuccess: (deletedPost, variables, context) => {
      invalidateQueries(queryClient, queryKeys.blogPosts.all);
      options.onSuccess?.(deletedPost, variables, context);
    },
    ...options,
  });
};
