import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys.js';
import { siteSettingService } from '@/services/site-setting-service.js';

export const useSiteSettings = (options = {}) =>
  useQuery({
    queryKey: queryKeys.siteSettings.detail(),
    queryFn: siteSettingService.get,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useAdminSiteSettings = (options = {}) =>
  useQuery({
    queryKey: queryKeys.siteSettings.adminDetail(),
    queryFn: siteSettingService.getAdmin,
    staleTime: 30 * 1000,
    ...options,
  });
