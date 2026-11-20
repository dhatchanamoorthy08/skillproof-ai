const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  createAdminAccount,
  getAdminAuditLogs,
  getDashboardOverview,
  getUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  getAdminRoadmaps,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  addStudyMaterial,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getAssessments,
  createAssessment,
  updateAssessment,
  getEvidence,
  verifyEvidence,
  exportReportCSV,
  exportReportPDF,
} = require('../controllers/adminPanelController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// Public Admin Authentication Route
router.post('/auth/login', adminLogin);

// All subsequent routes require a valid JWT and 'admin' role
router.use(protect);
router.use(authorize('admin'));

// 1. Admin Profile & Settings
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/settings/password', changeAdminPassword);
router.post('/settings/admins', createAdminAccount);
router.get('/settings/audit-logs', getAdminAuditLogs);

// 2. Admin Dashboard Overview
router.get('/dashboard/overview', getDashboardOverview);

// 3. User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// 4. Career Roadmap Management
router.get('/roadmaps', getAdminRoadmaps);
router.post('/roadmaps', createRoadmap);
router.put('/roadmaps/:id', updateRoadmap);
router.delete('/roadmaps/:id', deleteRoadmap);

// 5. Study Material Upload & Assignment
router.post('/roadmaps/:slug/topics/:topicId/materials', upload.single('materialFile'), addStudyMaterial);

// 6. Free Course Management
router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// 7. Assessment Management & Results
router.get('/assessments', getAssessments);
router.post('/assessments', createAssessment);
router.put('/assessments/:id', updateAssessment);

// 8. Evidence Verification
router.get('/evidence', getEvidence);
router.put('/evidence/:id/verify', verifyEvidence);
router.patch('/evidence/:id/verify', verifyEvidence);

// 9. Institutional Reports & Exports
router.get('/reports/export/csv', exportReportCSV);
router.get('/reports/export/pdf', exportReportPDF);

module.exports = router;
