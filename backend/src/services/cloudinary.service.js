import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';

const hasCloudinaryConfig = Boolean(
  config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

const toDataUri = (buffer, mimeType) => `data:${mimeType};base64,${buffer.toString('base64')}`;

class CloudinaryService {
  get isEnabled() {
    return hasCloudinaryConfig;
  }

  buildFolder(folder = '') {
    return [config.cloudinary.uploadFolder, folder]
      .map((part) => String(part || '').trim().replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');
  }

  async uploadImage({ buffer, mimeType, publicId, folder, tags = [] }) {
    if (!this.isEnabled) {
      return null;
    }

    const response = await cloudinary.uploader.upload(toDataUri(buffer, mimeType), {
      resource_type: 'image',
      folder: this.buildFolder(folder),
      public_id: publicId,
      overwrite: false,
      unique_filename: true,
      use_filename: false,
      tags,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return {
      publicId: response.public_id,
      width: response.width,
      height: response.height,
      bytes: response.bytes,
      format: response.format,
      imageUrl: cloudinary.url(response.public_id, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
    };
  }

  async uploadLocalImage({ filePath, publicId, folder, overwrite = false, tags = [] }) {
    if (!this.isEnabled) {
      return null;
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: this.buildFolder(folder),
      public_id: publicId,
      overwrite,
      unique_filename: false,
      use_filename: false,
      tags,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return {
      publicId: response.public_id,
      width: response.width,
      height: response.height,
      bytes: response.bytes,
      format: response.format,
      imageUrl: cloudinary.url(response.public_id, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
    };
  }
}

export const cloudinaryService = new CloudinaryService();
