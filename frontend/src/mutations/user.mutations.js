import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, setListItemInCache } from './mutation-helpers.js';
import { queryKeys } from '@/queries/query-keys.js';
import { userService } from '@/services/user-service.js';

export const useUpdateUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => userService.update(id, payload),
    onSuccess: (updatedUser, variables, context) => {
      queryClient.setQueryData(queryKeys.users.detail(variables.id), updatedUser);
      setListItemInCache(queryClient, queryKeys.users.lists(), updatedUser);
      invalidateQueries(queryClient, queryKeys.users.all);
      options.onSuccess?.(updatedUser, variables, context);
    },
    ...options,
  });
};

export const useSendPasswordResetLink = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.sendPasswordResetLink(id),
    onSuccess: (updatedUser, id, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      options.onSuccess?.(updatedUser, id, context);
    },
    ...options,
  });
};

export const useDeleteUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: (deletedUser, id, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      options.onSuccess?.(deletedUser, id, context);
    },
    ...options,
  });
};
