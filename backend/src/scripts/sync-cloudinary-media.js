import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cloudinaryService } from '../services/cloudinary.service.js';

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const mediaDirectory = path.resolve(currentDirectory, '../../../frontend/public/media');
const shouldOverwrite = process.argv.includes('--overwrite');

const toPosixPath = (value) => value.split(path.sep).join('/');

const walkFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(entryPath);
      }

      return entry.isFile() ? [entryPath] : [];
    })
  );

  return files.flat();
};

if (!cloudinaryService.isEnabled) {
  throw new Error(
    'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
  );
}

const files = (await walkFiles(mediaDirectory)).filter((filePath) =>
  supportedExtensions.has(path.extname(filePath).toLowerCase())
);

for (const filePath of files) {
  const relativePath = toPosixPath(path.relative(mediaDirectory, filePath));
  const parsedPath = path.parse(relativePath);
  const publicId = toPosixPath(path.join(parsedPath.dir, parsedPath.name));
  const upload = await cloudinaryService.uploadLocalImage({
    filePath,
    publicId,
    overwrite: shouldOverwrite,
    tags: ['public-media'],
  });

  console.log(`${upload.publicId} (${Math.round(upload.bytes / 1024)} KB)`);
}

console.log(`Synced ${files.length} media file${files.length === 1 ? '' : 's'} to Cloudinary.`);
