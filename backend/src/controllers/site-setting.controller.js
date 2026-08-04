import { auditLogService, cloudinaryService, siteSettingService } from '../services/index.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendServiceResponse } from '../utils/controller-response.js';
import { ApiError } from '../utils/api-error.js';

const SITE_MEDIA_MAX_BYTES = 8_000_000;

const safeFileStem = (value = 'site-media') =>
  value
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'site-media';

export const getSiteSettings = asyncHandler(async (req, res) => {
  const response = await siteSettingService.getPublicSettings();
  return sendServiceResponse(res, response);
});

export const getAdminSiteSettings = asyncHandler(async (req, res) => {
  const response = await siteSettingService.getAdminSettings();
  return sendServiceResponse(res, response);
});

export const uploadSiteMedia = asyncHandler(async (req, res) => {
  if (!cloudinaryService.isEnabled) {
    throw new ApiError(503, 'Cloudinary is not configured for site media uploads.');
  }

  const match = req.validated.body.image.match(
    /^data:(image\/(?:png|jpeg|jpg|webp|avif|gif));base64,(.+)$/i
  );

  if (!match) {
    throw new ApiError(400, 'Upload a valid image file.');
  }

  const [, mimeType, base64Content] = match;
  const imageBuffer = Buffer.from(base64Content, 'base64');

  if (!imageBuffer.length || imageBuffer.length > SITE_MEDIA_MAX_BYTES) {
    throw new ApiError(400, 'Site media image must be under 8 MB.');
  }

  const publicId = safeFileStem(req.validated.body.slot);
  const upload = await cloudinaryService.uploadImage({
    buffer: imageBuffer,
    mimeType: mimeType.toLowerCase() === 'image/jpg' ? 'image/jpeg' : mimeType,
    publicId,
    overwrite: true,
    invalidate: true,
    uniqueFilename: false,
    tags: ['site-media', req.validated.body.slot, 'admin-upload'],
  });

  const response = await siteSettingService.setMediaAsset(req.validated.body.slot, {
    imageUrl: upload.imageUrl,
    publicId: upload.publicId,
    provider: 'cloudinary',
    originalFileName: req.validated.body.fileName || '',
    mimeType,
    width: upload.width,
    height: upload.height,
    bytes: upload.bytes,
    version: upload.version,
    updatedBy: req.user._id,
  });

  await auditLogService.record({
    actor: req.user._id,
    action: 'site_setting.media_uploaded',
    entityType: 'SiteSetting',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: {
      slot: req.validated.body.slot,
      publicId: upload.publicId,
      bytes: upload.bytes,
      mimeType,
    },
  });

  return sendServiceResponse(res, response, 201);
});
