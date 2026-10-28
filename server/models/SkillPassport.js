const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  normalizedName: {
    type: String,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'AI & Data Science', 'Languages', 'Core Fundamentals'],
    default: 'Core Fundamentals',
  },
  status: {
    type: String,
    enum: ['claimed', 'assessed', 'demonstrated', 'verified'],
    default: 'claimed',
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  evidenceRefs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence',
    },
  ],
  assessmentScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  assessmentAttemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentAttempt',
  },
  statusReason: {
    type: String,
    default: 'Claimed by student during onboarding.',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const skillPassportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: [skillItemSchema],
    jobReadinessIndex: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    readinessTier: {
      type: String,
      enum: ['Placement Ready', 'Developing', 'Needs Immediate Support'],
      default: 'Developing',
    },
    readinessBreakdown: {
      assessedScore: { type: Number, default: 0 },
      demonstratedScore: { type: Number, default: 0 },
      verifiedScore: { type: Number, default: 0 },
      profileCompletenessScore: { type: Number, default: 0 },
    },
    actionableSuggestions: [
      {
        text: String,
        actionType: String,
        targetSkill: String,
      },
    ],
    lastCalculated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SkillPassport', skillPassportSchema);
