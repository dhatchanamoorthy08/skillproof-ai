const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Course provider is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Course URL is required'],
      trim: true,
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: 'Self-paced',
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    hasCertificate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    category: {
      type: String,
      default: 'Web Development',
    },
    assignedRoadmapSlug: {
      type: String,
      default: '',
    },
    assignedTopicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
