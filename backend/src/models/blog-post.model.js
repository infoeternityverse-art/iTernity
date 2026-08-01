import mongoose from 'mongoose';

export const BLOG_POST_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived',
};

export const BLOG_POST_CATEGORIES = {
  AI_INFRASTRUCTURE: 'AI Infrastructure',
  GPU_STRATEGY: 'GPU Strategy',
  MODEL_OPERATIONS: 'Model Operations',
  SECURITY: 'Security',
  RESEARCH: 'Research',
};

const blogSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    copy: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { _id: false }
);

const blogMetricsSchema = new mongoose.Schema(
  {
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    engagement: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    leads: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: Object.values(BLOG_POST_CATEGORIES),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(BLOG_POST_STATUSES),
      default: BLOG_POST_STATUSES.DRAFT,
      index: true,
    },
    author: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'iTernityverse Editorial',
    },
    heroTone: {
      type: String,
      trim: true,
      maxlength: 32,
      default: 'teal',
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },
    imageAlt: {
      type: String,
      trim: true,
      maxlength: 180,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    body: {
      type: [blogSectionSchema],
      default: [],
    },
    metrics: {
      type: blogMetricsSchema,
      default: () => ({}),
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 180,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
blogPostSchema.index({ createdAt: -1 });

blogPostSchema.virtual('isPublished').get(function getIsPublished() {
  return this.status === BLOG_POST_STATUSES.PUBLISHED;
});

blogPostSchema.static('findBySlug', function findBySlug(slug) {
  return this.findOne({ slug: String(slug).toLowerCase().trim() });
});

blogPostSchema.pre('save', function normalizeBlogPost(next) {
  if (this.isModified('slug') && this.slug) {
    this.slug = this.slug.toLowerCase().trim();
  }

  if (this.isModified('tags')) {
    this.tags = [...new Set(this.tags.map((tag) => tag.trim()).filter(Boolean))];
  }

  if (this.isModified('status') && this.status === BLOG_POST_STATUSES.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
