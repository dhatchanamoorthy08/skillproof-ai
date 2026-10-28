const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      default: '',
    },
    collegeName: {
      type: String,
      default: 'National Institute of Technology',
      trim: true,
    },
    degree: {
      type: String,
      default: 'B.Tech',
      trim: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    batch: {
      type: String,
      default: '2026',
      trim: true,
    },
    cgpa: {
      type: String,
      default: '8.5',
      trim: true,
    },
    dob: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    district: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: 'Aspiring software engineer passionate about scalable systems and evidence-based engineering.',
    },
    targetRole: {
      type: String,
      default: 'Full Stack Developer',
      trim: true,
    },
    links: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      portfolio: { type: String, default: '' },
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeParsedData: {
      extractedSkills: [String],
      extractedProjects: [String],
      extractedEducation: [String],
      parsedAt: Date,
      completenessScore: Number,
      atsFeedback: [String],
    },
    profileCompletion: {
      type: Number,
      default: 65,
      min: 0,
      max: 100,
    },
    placementStatus: {
      type: String,
      enum: ['unplaced', 'interviewing', 'placed'],
      default: 'unplaced',
    },
    placedCompany: {
      type: String,
      default: '',
    },
    mentoringNotes: [
      {
        note: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        officerName: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
