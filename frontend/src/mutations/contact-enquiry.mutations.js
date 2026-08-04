import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, setListItemInCache } from './mutation-helpers.js';
import { queryKeys } from '@/queries/query-keys.js';
import { contactEnquiryService } from '@/services/contact-enquiry-service.js';

export const useCreateContactEnquiry = (options = {}) =>
  useMutation({
    mutationFn: (payload) => contactEnquiryService.create(payload),
    ...options,
  });

export const useUpdateAdminContactEnquiry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => contactEnquiryService.updateAdmin(id, payload),
    onSuccess: (updatedContactEnquiry, variables, context) => {
      setListItemInCache(
        queryClient,
        queryKeys.contactEnquiries.adminLists(),
        updatedContactEnquiry
      );
      invalidateQueries(queryClient, queryKeys.contactEnquiries.all);
      options.onSuccess?.(updatedContactEnquiry, variables, context);
    },
    ...options,
  });
};
