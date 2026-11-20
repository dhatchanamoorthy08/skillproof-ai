const mongoose = require('mongoose');

const studyMaterialSubSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['document', 'link', 'notes'], default: 'notes' },
    url: { type: String, default: '' },
    content: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const freeCourseSubSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    url: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'Beginner' },
    duration: { type: String, default: 'Self-paced' },
    isFree: { type: Boolean, default: true },
    hasCertificate: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const topicSubSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    materials: [studyMaterialSubSchema],
    freeCourses: [freeCourseSubSchema],
  },
  { _id: false }
);

const moduleSubSchema = new mongoose.Schema(
  {
    moduleId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    topics: [topicSubSchema],
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Roadmap title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Roadmap slug is required'],
      unique: true,
      lowercase: true,
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
    estimatedDuration: {
      type: String,
      default: '6 Months',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'deactivated'],
      default: 'published',
    },
    requiredSkills: [{ type: String }],
    modules: [moduleSubSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
