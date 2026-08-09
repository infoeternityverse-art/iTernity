import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { workspaceService } from '@/services/workspace-service.js';
import { useAuthStore } from '@/store/auth-store.js';

export const useAdminWorkspaces = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.workspaces.adminList(params),
    queryFn: () => workspaceService.listAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });

export const useAdminWorkspace = (id, params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.workspaces.adminDetail(id, params),
    queryFn: () => workspaceService.getAdminById(id, params),
    enabled: Boolean(id) && (options.enabled ?? true),
    ...options,
  });

export const useCustomerWorkspace = (params = {}, options = {}) => {
  const customerId = useAuthStore((state) => state.user?.id || state.user?._id);

  return useQuery({
    queryKey: [...queryKeys.workspaces.customerDetail(params), customerId],
    queryFn: () => workspaceService.getCustomerWorkspace(params),
    enabled: Boolean(customerId) && (options.enabled ?? true),
    ...options,
  });
};
