import mongoose from 'mongoose';

export const CONTACT_ENQUIRY_STATUSES = {
  NEW: 'new',
  IN_REVIEW: 'in_review',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const contactEnquirySchema = new mongoose.Schema(
  {
    contactName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: Object.values(CONTACT_ENQUIRY_STATUSES),
      default: CONTACT_ENQUIRY_STATUSES.NEW,
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contactEnquirySchema.index({ contactName: 1 });
contactEnquirySchema.index({ createdAt: -1 });

contactEnquirySchema.pre('save', function normalizeContactEnquiry(next) {
  if (this.isModified('contactEmail') && this.contactEmail) {
    this.contactEmail = this.contactEmail.toLowerCase().trim();
  }

  next();
});

export const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);
