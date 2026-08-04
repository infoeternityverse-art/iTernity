import { env } from '@/config/env.js';

const CLOUDINARY_BASE = env.cloudinaryCloudName
  ? `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload`
  : '';

const trimSlashes = (value = '') => String(value).replace(/^\/+|\/+$/g, '');
const isLocalDevelopment = env.appEnv === 'development';

const publicMediaMap = {
  '/media/hero_home.webp': 'hero_home',
  '/media/hero_gpu.webp': 'hero_gpu',
  '/media/hero_about.webp': 'hero_about',
  '/media/hero_contact.webp': 'hero_contact',
  '/media/footer_bg.jpg': 'footer_bg',
};

const publicIdFromMediaPath = (src) => {
  if (!src.startsWith('/media/')) {
    return '';
  }

  return trimSlashes(src.replace(/^\/media\//, '')).replace(/\.[a-z0-9]+$/i, '');
};

export const cloudinaryImageUrl = (
  publicId,
  { width, quality = 'auto', format = 'auto', crop = 'limit', version } = {}
) => {
  if (!CLOUDINARY_BASE || !publicId) {
    return '';
  }

  const transforms = [`f_${format}`, `q_${quality}`];

  if (width) {
    transforms.push(`c_${crop}`, `w_${width}`);
  }

  const assetFolder = trimSlashes(env.cloudinaryAssetFolder);
  const normalizedPublicId = trimSlashes(publicId);
  const finalPublicId = assetFolder && !normalizedPublicId.includes('/')
    ? `${assetFolder}/${normalizedPublicId}`
    : normalizedPublicId;

  const versionSegment = version ? `/v${version}` : '';

  return `${CLOUDINARY_BASE}/${transforms.join(',')}${versionSegment}/${finalPublicId}`;
};

export const mediaUrl = (src, options) => {
  if (!src || /^https?:\/\//i.test(src) || !CLOUDINARY_BASE) {
    return src;
  }

  if (isLocalDevelopment && src.startsWith('/media/')) {
    return src;
  }

  const publicId = publicMediaMap[src] || publicIdFromMediaPath(src);

  if (!publicId) {
    return src;
  }

  return cloudinaryImageUrl(publicId, options) || src;
};
