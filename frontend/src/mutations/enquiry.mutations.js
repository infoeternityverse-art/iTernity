import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, setListItemInCache } from './mutation-helpers.js';
import { queryKeys } from '@/queries/query-keys.js';
import { enquiryService } from '@/services/enquiry-service.js';

export const useCreateEnquiry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => enquiryService.create(payload),
    onSuccess: (createdEnquiry, variables, context) => {
      invalidateQueries(queryClient, queryKeys.enquiries.all);
      options.onSuccess?.(createdEnquiry, variables, context);
    },
  });
};

export const useUpdateAdminEnquiry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => enquiryService.updateAdmin(id, payload),
    onSuccess: (updatedEnquiry, variables, context) => {
      queryClient.setQueryData(queryKeys.enquiries.detail(variables.id), updatedEnquiry);
      setListItemInCache(queryClient, queryKeys.enquiries.adminLists(), updatedEnquiry);
      invalidateQueries(queryClient, queryKeys.enquiries.all);
      options.onSuccess?.(updatedEnquiry, variables, context);
    },
    ...options,
  });
};
