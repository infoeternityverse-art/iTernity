import mongoose from 'mongoose';

const rateLimitBucketSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 512,
    },
    hits: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    resetAt: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

rateLimitBucketSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimitBucket = mongoose.model('RateLimitBucket', rateLimitBucketSchema);
