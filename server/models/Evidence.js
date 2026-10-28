const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['course', 'internship', 'project', 'certification', 'workshop', 'assessment', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    associatedSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    // Course Certificate specific fields
    courseName: {
      type: String,
      trim: true,
      default: '',
    },
    courseProvider: {
      type: String,
      trim: true,
      default: '', // Coursera, NPTEL, Udemy, edX, etc.
    },
    relatedSkill: {
      type: String,
      trim: true,
      default: '',
    },
    certificateId: {
      type: String,
      trim: true,
      default: '',
    },
    // Internship Certificate specific fields
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    internshipRole: {
      type: String,
      trim: true,
      default: '',
    },
    internshipDomain: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    skillsGained: [
      {
        type: String,
        trim: true,
      },
    ],
    // Additional Evidence fields
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileMimeType: {
      type: String,
      default: '',
    },
    externalUrl: {
      type: String,
      default: '',
    },
    issueDate: {
      type: Date,
    },
    issuingOrganization: {
      type: String,
      default: '',
    },
    // Student metadata for fast reviewer indexing
    studentName: {
      type: String,
      default: '',
    },
    studentEmail: {
      type: String,
      default: '',
    },
    studentRollNumber: {
      type: String,
      default: '',
    },
    studentDepartment: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    verificationNotes: {
      type: String,
      default: 'Evidence pending faculty / placement audit review.',
    },
    verificationAudit: [
      {
        status: String,
        actionBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Evidence', evidenceSchema);
