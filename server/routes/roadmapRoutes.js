const express = require('express');
const router = express.Router();
const {
  getRoadmaps,
  getRoadmapBySlug,
  getTopicDetails,
  getStudentProgress,
  toggleTopicCompletion,
  submitExercise,
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public / Student Catalog Routes
router.get('/', getRoadmaps);
router.get('/:slug', getRoadmapBySlug);
router.get('/:slug/topics/:topicId', getTopicDetails);

// Student Authenticated Progress Routes
router.get('/:slug/progress', protect, authorize('student', 'admin'), getStudentProgress);
router.post('/:slug/progress/toggle-topic', protect, authorize('student', 'admin'), toggleTopicCompletion);
router.post('/:slug/progress/save-exercise', protect, authorize('student', 'admin'), submitExercise);

module.exports = router;
