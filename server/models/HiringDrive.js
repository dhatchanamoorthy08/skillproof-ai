const mongoose = require('mongoose');

const hiringDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      default: 'National Institute of Technology',
    },
    batch: {
      type: String,
      default: '2026',
    },
    description: {
      type: String,
      default: '',
    },
    eligibleDepartments: [
      {
        type: String,
      },
    ],
    minCgpa: {
      type: Number,
      default: 7.0,
    },
    minJobReadinessIndex: {
      type: Number,
      default: 65,
    },
    driveDate: {
      type: Date,
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    participatingCompanies: [
      {
        companyName: String,
        recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
      },
    ],
    registeredStudents: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'archived'],
      default: 'upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HiringDrive', hiringDriveSchema);
