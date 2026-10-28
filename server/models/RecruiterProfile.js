const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    officialEmail: {
      type: String,
      trim: true,
      default: '',
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      default: 'Information Technology & Software Services',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      default: '51-200',
    },
    location: {
      type: String,
      default: 'Bangalore, India',
    },
    about: {
      type: String,
      default: 'Leading tech enterprise building high-throughput cloud infrastructure and AI solutions.',
    },
    designation: {
      type: String,
      default: 'Senior HR Manager',
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    hiringDomains: {
      type: String,
      trim: true,
      default: 'Full Stack & Cloud Systems',
    },
    verificationStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'approved', 'rejected', 'needs_info'],
      default: 'unsubmitted',
    },
    verificationStep: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    verificationDocuments: [
      {
        title: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    verificationNotes: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
