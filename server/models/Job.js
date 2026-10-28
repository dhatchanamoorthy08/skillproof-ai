const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      enum: [
        'Full Stack Development',
        'Frontend Development',
        'Backend Development',
        'Data Analytics & Engineering',
        'AI & Machine Learning',
        'Cloud & DevOps',
        'Cybersecurity',
      ],
      default: 'Full Stack Development',
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    minCgpa: {
      type: Number,
      default: 7.0,
    },
    minJobReadinessIndex: {
      type: Number,
      default: 60,
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher (2026 Batch)', '0-1 Years', '1-2 Years'],
      default: 'Fresher (2026 Batch)',
    },
    location: {
      type: String,
      default: 'Bangalore, India',
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Hybrid',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Internship + PPO'],
      default: 'Full-time',
    },
    salaryRange: {
      min: { type: Number, default: 800000 },
      max: { type: Number, default: 1400000 },
      currency: { type: String, default: 'INR' },
    },
    openings: {
      type: Number,
      default: 5,
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
    hiringDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HiringDrive',
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
