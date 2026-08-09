import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { enquiryService } from '@/services/enquiry-service.js';
import { useAuthStore } from '@/store/auth-store.js';

export const useEnquiry = (id, params = {}, options = {}) => {
  const user = useAuthStore((state) => state.user);
  const identityScope = `${user?.role || 'guest'}:${user?.id || user?._id || 'anonymous'}`;

  return useQuery({
    queryKey: [...queryKeys.enquiries.detail(id), identityScope],
    queryFn: () => enquiryService.getById(id, params),
    enabled: Boolean(id) && (options.enabled ?? true),
    ...options,
  });
};

export const useCustomerEnquiries = (params = {}, options = {}) => {
  const customerId = useAuthStore((state) => state.user?.id || state.user?._id);

  return useQuery({
    queryKey: [...queryKeys.enquiries.customerList(params), customerId],
    queryFn: () => enquiryService.listCustomer(params),
    enabled: Boolean(customerId) && (options.enabled ?? true),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAdminEnquiries = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.enquiries.adminList(params),
    queryFn: () => enquiryService.listAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });
