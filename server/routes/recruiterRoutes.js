const express = require('express');
const router = express.Router();
const {
  getRecruiterProfile,
  submitCompanyVerification,
  createJob,
  getMyJobs,
  updateJob,
  searchCandidates,
  getMatchesForJob,
  getRecruiterApplications,
  updateApplicationStatus,
  getRecruiterAnalytics,
  deleteCandidate,
} = require('../controllers/recruiterController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const upload = require('../middleware/upload');

const { isDashboardRestricted } = require('../config/restriction');

// Public overview / redirect for browser navigation to /api/v1/recruiters
router.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.redirect(isDashboardRestricted() ? '/login' : '/recruiter/dashboard');
  }
  res.json({
    success: true,
    module: 'Recruiter Platform API',
    endpoints: {
      profile: '/api/v1/recruiters/profile',
      jobs: '/api/v1/recruiters/jobs',
      candidates: '/api/v1/recruiters/candidates',
      applications: '/api/v1/recruiters/applications',
      analytics: '/api/v1/recruiters/analytics',
    },
    webUrl: '/recruiter/dashboard',
  });
});

router.use(protect);
router.use(authorize('recruiter'));

router.get('/profile', getRecruiterProfile);
router.post('/company-verification', upload.single('verificationDoc'), submitCompanyVerification);
router.post('/jobs', createJob);
router.get('/jobs', getMyJobs);
router.put('/jobs/:id', updateJob);
router.get('/candidates', searchCandidates);
router.get('/jobs/:id/matches', getMatchesForJob);
router.get('/applications', getRecruiterApplications);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/analytics', getRecruiterAnalytics);

module.exports = router;
