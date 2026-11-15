const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
  },
  type: {
    type: String,
    enum: [
      'fullscreen_exit',
      'tab_hidden',
      'focus_loss',
      'camera_disconnected',
      'camera_permission_revoked',
      'no_face_detected',
      'face_missing',
      'multiple_faces',
      'phone_detected',
      'copy_paste_attempt',
      'clipboard_blocked',
      'context_menu',
      'navigation_attempt',
      'suspicious_navigation',
      'screenshot_attempt',
      'devtools_attempt',
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  actionTaken: {
    type: String,
    enum: ['warning_displayed', 'warning_recorded', 'session_paused', 'session_terminated', 'audit_flagged'],
    default: 'warning_recorded',
  },
  confidence: {
    type: Number,
    default: 1.0,
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
      enum: ['not_started', 'in_progress', 'paused', 'completed', 'timed_out', 'flagged', 'terminated'],
      default: 'in_progress',
    },
    terminationReason: {
      type: String,
      default: '',
    },
    terminatedAt: {
      type: Date,
    },
    fullscreenExits: {
      type: Number,
      default: 0,
    },
    isRestartAllowed: {
      type: Boolean,
      default: false,
    },
    adminResetBy: {
      type: String,
      default: '',
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
    phoneDetections: {
      type: Number,
      default: 0,
    },
    multipleFaceDetections: {
      type: Number,
      default: 0,
    },
    copyPasteAttempts: {
      type: Number,
      default: 0,
    },
    suspiciousNavigationCount: {
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
