const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'fullscreen_exit',
      'tab_hidden',
      'focus_loss',
      'camera_disconnected',
      'camera_permission_revoked',
      'no_face_detected',
      'clipboard_blocked',
      'context_menu',
      'navigation_attempt',
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    default: '',
  },
});

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
});

const assessmentAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidateName: {
      type: String,
      default: '',
    },
    candidateEmail: {
      type: String,
      default: '',
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'paused', 'completed', 'timed_out', 'flagged'],
      default: 'in_progress',
    },
    cameraStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'permission_denied', 'unmonitored'],
      default: 'connected',
    },
    cameraInterruptions: {
      type: Number,
      default: 0,
    },
    tabSwitches: {
      type: Number,
      default: 0,
    },
    focusLossCount: {
      type: Number,
      default: 0,
    },
    maxAllowedViolations: {
      type: Number,
      default: 5,
    },
    answers: [answerSchema],
    totalPoints: {
      type: Number,
      default: 0,
    },
    earnedPoints: {
      type: Number,
      default: 0,
    },
    scorePercentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    violations: [violationSchema],
    violationCount: {
      type: Number,
      default: 0,
    },
    proctorFlag: {
      type: Boolean,
      default: false,
    },
    proctorSummary: {
      type: String,
      default: 'Assessment conducted with continuous proctored webcam & security monitoring.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
