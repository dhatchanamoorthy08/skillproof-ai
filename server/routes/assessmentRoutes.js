const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  getActiveAttempt,
  startAssessment,
  logViolation,
  submitAssessment,
  terminateAssessment,
  allowAttemptRestart,
  getAttemptResult,
  getAssessmentAttempts,
  updateAttemptStatus,
} = require('../controllers/assessmentController');
const { protect, optionalProtect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public catalog listing of assessments (with optional authentication context)
router.get('/', optionalProtect, getAssessments);
router.get('/:id', optionalProtect, getAssessmentById);

// Protected actions (attempt, violations, submissions)
router.use(protect);

// Proctoring Monitoring Dashboard for Placement Officers, Recruiters & Admins
router.get(
  '/monitoring/attempts',
  authorize('placement_officer', 'recruiter', 'admin'),
  getAssessmentAttempts
);
router.post(
  '/monitoring/attempts/:id/status',
  authorize('placement_officer', 'recruiter', 'admin'),
  updateAttemptStatus
);
router.post(
  '/monitoring/attempts/:id/allow-restart',
  authorize('placement_officer', 'recruiter', 'admin'),
  allowAttemptRestart
);

router.get('/:id/active', authorize('student'), getActiveAttempt);
router.post('/:id/start', authorize('student'), startAssessment);
router.post('/:id/violations', authorize('student'), logViolation);
router.post('/:id/submit', authorize('student'), submitAssessment);
router.post('/:id/terminate', authorize('student'), terminateAssessment);
router.get('/results/:id', getAttemptResult);

module.exports = router;
