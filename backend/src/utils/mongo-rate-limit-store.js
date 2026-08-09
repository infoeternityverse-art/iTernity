import { RateLimitBucket } from '../models/rate-limit-bucket.model.js';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class MongoRateLimitStore {
  constructor({ prefix = 'rate-limit:' } = {}) {
    this.prefix = prefix;
    this.localKeys = false;
    this.windowMs = null;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  async increment(key) {
    const bucketKey = `${this.prefix}${key}`;
    const now = new Date();
    const nextResetAt = new Date(now.getTime() + this.windowMs);
    const shouldReset = {
      $or: [
        { $eq: [{ $type: '$resetAt' }, 'missing'] },
        { $lte: ['$resetAt', now] },
      ],
    };
    const update = [
      {
        $set: {
          hits: {
            $cond: [shouldReset, 1, { $add: [{ $ifNull: ['$hits', 0] }, 1] }],
          },
          resetAt: {
            $cond: [shouldReset, nextResetAt, '$resetAt'],
          },
        },
      },
    ];

    let bucket;

    try {
      bucket = await RateLimitBucket.findOneAndUpdate(
        { key: bucketKey },
        update,
        { upsert: true, new: true }
      ).lean();
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }

      bucket = await RateLimitBucket.findOneAndUpdate({ key: bucketKey }, update, {
        new: true,
      }).lean();
    }

    return {
      totalHits: bucket.hits,
      resetTime: bucket.resetAt,
    };
  }

  async decrement(key) {
    await RateLimitBucket.updateOne(
      { key: `${this.prefix}${key}` },
      [
        {
          $set: {
            hits: {
              $cond: [
                { $gt: [{ $ifNull: ['$hits', 0] }, 0] },
                { $subtract: ['$hits', 1] },
                0,
              ],
            },
          },
        },
      ]
    );
  }

  async resetKey(key) {
    await RateLimitBucket.deleteOne({ key: `${this.prefix}${key}` });
  }

  async resetAll() {
    await RateLimitBucket.deleteMany({
      key: { $regex: `^${escapeRegExp(this.prefix)}` },
    });
  }
}
