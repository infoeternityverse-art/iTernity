import mongoose from 'mongoose';

export const SITE_MEDIA_SLOTS = {
  HERO_HOME: 'hero_home',
  HERO_GPU: 'hero_gpu',
  HERO_ABOUT: 'hero_about',
  HERO_CONTACT: 'hero_contact',
  FOOTER_BG: 'footer_bg',
};

const siteMediaAssetSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      enum: Object.values(SITE_MEDIA_SLOTS),
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: 800,
      default: '',
    },
    publicId: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    provider: {
      type: String,
      enum: ['cloudinary'],
      default: 'cloudinary',
    },
    originalFileName: {
      type: String,
      trim: true,
      maxlength: 180,
      default: '',
    },
    mimeType: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    width: {
      type: Number,
      min: 0,
      default: 0,
    },
    height: {
      type: Number,
      min: 0,
      default: 0,
    },
    bytes: {
      type: Number,
      min: 0,
      default: 0,
    },
    version: {
      type: Number,
      min: 0,
      default: 0,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      immutable: true,
    },
    media: {
      type: Map,
      of: siteMediaAssetSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true, flattenMaps: true },
    toObject: { virtuals: true, flattenMaps: true },
  }
);

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
