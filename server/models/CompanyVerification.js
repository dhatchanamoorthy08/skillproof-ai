const mongoose = require('mongoose');

const companyVerificationSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
    },
    domainMatchesEmail: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
      required: true,
    },
    businessRegistrationNumber: {
      type: String,
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      default: '',
    },
    documentOriginalName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_info'],
      default: 'pending',
    },
    submissionStage: {
      type: Number,
      enum: [1, 2],
      default: 2,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewerName: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      default: '',
    },
    history: [
      {
        status: String,
        reviewer: String,
        comment: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanyVerification', companyVerificationSchema);
