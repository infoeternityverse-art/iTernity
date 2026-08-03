export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS || 45000),
  appName: import.meta.env.VITE_APP_NAME || 'GPU Cloud Marketplace',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://iternityverse.com').replace(/\/+$/g, ''),
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@example.com',
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  cloudinaryAssetFolder: import.meta.env.VITE_CLOUDINARY_ASSET_FOLDER || 'gpu-cloud-marketplace',
};
