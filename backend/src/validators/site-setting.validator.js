import { z } from 'zod';
import { UPLOADABLE_SITE_MEDIA_SLOTS } from '../models/index.js';

export const uploadSiteMediaSchema = z.object({
  body: z
    .object({
      slot: z.enum(UPLOADABLE_SITE_MEDIA_SLOTS),
      image: z
        .string()
        .min(100)
        .max(11_500_000)
        .regex(
          /^data:image\/(png|jpeg|jpg|webp|avif|gif);base64,[a-z0-9+/=]+$/i,
          'Upload a valid image file.'
        ),
      fileName: z.string().trim().min(1).max(180).optional(),
    })
    .strict(),
});
