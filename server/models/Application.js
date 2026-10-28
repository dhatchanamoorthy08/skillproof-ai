const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchBreakdown: {
      matchedRequiredSkills: [String],
      missingRequiredSkills: [String],
      matchedPreferredSkills: [String],
      assessedScoreAverage: Number,
      evidenceStrength: String,
      explanation: String,
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'],
      default: 'applied',
    },
    interviewSchedule: {
      scheduledAt: Date,
      mode: { type: String, enum: ['Google Meet', 'Microsoft Teams', 'On-Campus Placement Cell', 'Phone Screening'], default: 'Google Meet' },
      meetingLink: { type: String, default: '' },
      roundName: { type: String, default: 'Technical Evaluation Round 1' },
      notes: { type: String, default: '' },
    },
    recruiterFeedback: {
      type: String,
      default: '',
    },
    timeline: [
      {
        stage: String,
        updatedBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
