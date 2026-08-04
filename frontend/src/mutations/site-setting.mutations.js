import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries } from './mutation-helpers.js';
import { queryKeys } from '@/queries/query-keys.js';
import { siteSettingService } from '@/services/site-setting-service.js';

export const useUploadSiteMedia = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => siteSettingService.uploadMedia(payload),
    onSuccess: (settings, variables, context) => {
      queryClient.setQueryData(queryKeys.siteSettings.detail(), settings);
      queryClient.setQueryData(queryKeys.siteSettings.adminDetail(), settings);
      invalidateQueries(queryClient, queryKeys.siteSettings.all);
      options.onSuccess?.(settings, variables, context);
    },
    ...options,
  });
};
