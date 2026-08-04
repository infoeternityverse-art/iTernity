import { SiteSetting } from '../models/index.js';
import { buildServiceResponse } from '../utils/response-builder.js';

class SiteSettingService {
  async getSettings() {
    const settings = await SiteSetting.findOneAndUpdate(
      { key: 'default' },
      { $setOnInsert: { key: 'default' } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return settings;
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    const media = Object.fromEntries(
      [...settings.media.entries()].map(([slot, asset]) => [
        slot,
        {
          slot,
          imageUrl: asset.imageUrl,
          publicId: asset.publicId,
          provider: asset.provider,
          width: asset.width,
          height: asset.height,
          version: asset.version,
        },
      ])
    );

    return buildServiceResponse({
      data: {
        key: settings.key,
        media,
        updatedAt: settings.updatedAt,
      },
      message: 'Site settings fetched successfully.',
    });
  }

  async getAdminSettings() {
    const settings = await this.getSettings();
    return buildServiceResponse({
      data: settings,
      message: 'Site settings fetched successfully.',
    });
  }

  async setMediaAsset(slot, asset) {
    const settings = await this.getSettings();
    settings.media.set(slot, {
      ...asset,
      slot,
      updatedAt: new Date(),
    });

    await settings.save();

    return buildServiceResponse({
      data: settings,
      message: 'Site media updated successfully.',
    });
  }
}

export const siteSettingService = new SiteSettingService();
