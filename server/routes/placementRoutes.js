const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getStudentsDirectory,
  getEarlyAlerts,
  getPendingVerifications,
  reviewRecruiterVerification,
  createHiringDrive,
  getHiringDrives,
  addMentoringNote,
  exportReports,
  getAllEvidenceSubmissions,
  reviewEvidenceSubmission,
} = require('../controllers/placementController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const { isDashboardRestricted } = require('../config/restriction');

// Public overview / redirect for browser navigation to /api/v1/placement
router.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.redirect(isDashboardRestricted() ? '/login' : '/placement/dashboard');
  }
  res.json({
    success: true,
    module: 'Placement Officer Platform API',
    endpoints: {
      dashboard: '/api/v1/placement/dashboard',
      students: '/api/v1/placement/students',
      alerts: '/api/v1/placement/alerts',
      verifications: '/api/v1/placement/verifications',
      drives: '/api/v1/placement/drives',
      reports: '/api/v1/placement/reports/export',
    },
    webUrl: '/placement/dashboard',
  });
});

router.use(protect);
router.use(authorize('placement_officer'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudentsDirectory);
router.get('/alerts', getEarlyAlerts);
router.get('/verifications', getPendingVerifications);
router.post('/verifications/:id/review', reviewRecruiterVerification);
router.post('/drives', createHiringDrive);
router.get('/drives', getHiringDrives);
router.post('/students/:id/mentoring', addMentoringNote);
router.get('/reports/export', exportReports);
router.get('/evidence', getAllEvidenceSubmissions);
router.post('/evidence/:id/review', reviewEvidenceSubmission);

module.exports = router;
