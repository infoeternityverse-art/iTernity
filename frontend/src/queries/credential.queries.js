import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { credentialService } from '@/services/credential-service.js';
import { useAuthStore } from '@/store/auth-store.js';

export const useCustomerCredentials = (params = {}, options = {}) => {
  const customerId = useAuthStore((state) => state.user?.id || state.user?._id);

  return useQuery({
    queryKey: [...queryKeys.credentials.customerList(params), customerId],
    queryFn: () => credentialService.listCustomer(params),
    enabled: Boolean(customerId) && (options.enabled ?? true),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAdminCredentials = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.credentials.adminList(params),
    queryFn: () => credentialService.listAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });
