const mongoose = require('mongoose');

const studentRoadmapProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roadmapSlug: {
      type: String,
      required: true,
      index: true,
    },
    completedTopics: [{ type: String }],
    completedModules: [{ type: String }],
    lastActiveTopicId: { type: String, default: '' },
    lastActiveModuleId: { type: String, default: '' },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    exerciseSubmissions: [
      {
        topicId: { type: String },
        exerciseId: { type: String },
        code: { type: String },
        passed: { type: Boolean, default: true },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
  }
);

studentRoadmapProgressSchema.index({ student: 1, roadmapSlug: 1 }, { unique: true });

module.exports = mongoose.model('StudentRoadmapProgress', studentRoadmapProgressSchema);
