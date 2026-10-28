const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getSkillPassport,
  claimSkill,
  addEvidence,
  updateEvidence,
  deleteEvidence,
  getEvidenceList,
  getRoadmap,
  getSkillGaps,
  getJobMatches,
  getApplications,
  practiceInterview,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const upload = require('../middleware/upload');

const { isDashboardRestricted } = require('../config/restriction');

// Public overview / redirect for browser navigation to /api/v1/students
router.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.redirect(isDashboardRestricted() ? '/login' : '/student/home');
  }
  res.json({
    success: true,
    module: 'Student Platform API',
    endpoints: {
      profile: '/api/v1/students/me',
      passport: '/api/v1/students/me/passport',
      evidence: '/api/v1/students/me/evidence',
      roadmap: '/api/v1/students/me/roadmap',
      skillGaps: '/api/v1/students/me/skill-gaps',
      jobMatches: '/api/v1/students/me/job-matches',
      applications: '/api/v1/students/me/applications',
    },
    webUrl: '/student/home',
  });
});

// All student sub-routes require student authentication
router.use(protect);
router.use(authorize('student'));

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/me/passport', getSkillPassport);
router.post('/me/skills', claimSkill);
router.post('/me/evidence', upload.single('evidenceFile'), addEvidence);
router.put('/me/evidence/:id', upload.single('evidenceFile'), updateEvidence);
router.delete('/me/evidence/:id', deleteEvidence);
router.get('/me/evidence', getEvidenceList);
router.get('/me/roadmap', getRoadmap);
router.get('/me/skill-gaps', getSkillGaps);
router.get('/me/job-matches', getJobMatches);
router.get('/me/applications', getApplications);
router.post('/me/interview-practice', practiceInterview);

module.exports = router;
