import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { contactEnquiryService } from '@/services/contact-enquiry-service.js';

export const useAdminContactEnquiries = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.contactEnquiries.adminList(params),
    queryFn: () => contactEnquiryService.listAdmin(params),
    placeholderData: keepPreviousData,
    ...options,
  });
