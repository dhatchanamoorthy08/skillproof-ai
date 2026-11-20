const mongoose = require('mongoose');

const freeCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    url: { type: String, required: true },
    skillCovered: { type: String },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: { type: String, default: 'Self-paced' },
    isFree: { type: Boolean, default: true },
    hasCertificate: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'inactive', 'needs_review'],
      default: 'active',
    },
  },
  { _id: true }
);

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    estimatedMinutes: { type: Number, default: 45 },
    studyMaterial: {
      introduction: { type: String, default: '' },
      keyConcepts: [{ type: String }],
      detailedNotes: { type: String, default: '' },
      codeSnippet: {
        language: { type: String, default: 'javascript' },
        code: { type: String, default: '' },
        explanation: { type: String, default: '' },
      },
      practicalExamples: [{ type: String }],
      stepByStep: [{ type: String }],
      practiceExercises: [
        {
          id: { type: String },
          question: { type: String },
          initialCode: { type: String },
          solution: { type: String },
          hints: [{ type: String }],
        },
      ],
      interviewQuestions: [
        {
          question: { type: String },
          answer: { type: String },
          difficulty: { type: String, default: 'Medium' },
        },
      ],
      summaryNotes: { type: String, default: '' },
    },
    freeCourses: [freeCourseSchema],
    miniProject: {
      title: { type: String },
      description: { type: String },
      deliverables: [{ type: String }],
    },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    moduleId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    estimatedHours: { type: Number, default: 10 },
    topics: [topicSchema],
  },
  { _id: false }
);

const levelSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    modules: [moduleSchema],
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Software Engineering',
    },
    icon: {
      type: String,
      default: 'Compass',
    },
    estimatedDuration: {
      type: String,
      default: '6 Months',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    requiredSkills: [{ type: String }],
    levels: [levelSchema],
    finalProject: {
      title: { type: String },
      description: { type: String },
      requirements: [{ type: String }],
    },
    skillAssessment: {
      title: { type: String },
      description: { type: String },
      recommendedAssessmentId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
