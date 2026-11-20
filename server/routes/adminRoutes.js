const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAdminRoadmaps,
  createRoadmap,
  updateRoadmap,
  updateTopicStudyMaterial,
  addFreeCourseLink,
  getStudentsList,
  updateStudentStatus,
  getStudentDetail,
  getAdminAssessments,
  createAssessment,
  getAdminEvidence,
  verifyEvidence,
  exportReportCSV,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Strict Admin-only middleware guard
router.use(protect);
router.use(authorize('admin'));

// Telemetry & Overview
router.get('/overview', getAdminOverview);

// Roadmap Management
router.get('/roadmaps', getAdminRoadmaps);
router.post('/roadmaps', createRoadmap);
router.put('/roadmaps/:id', updateRoadmap);
router.post('/roadmaps/:id/topics/:topicId/material', updateTopicStudyMaterial);
router.post('/roadmaps/:id/topics/:topicId/courses', addFreeCourseLink);

// Student Management
router.get('/students', getStudentsList);
router.get('/students/:id', getStudentDetail);
router.put('/students/:id/status', updateStudentStatus);

// Assessment & Proctoring Management
router.get('/assessments', getAdminAssessments);
router.post('/assessments', createAssessment);

// Evidence Verification
router.get('/evidence', getAdminEvidence);
router.put('/evidence/:id/verify', verifyEvidence);

// Reports & CSV Export
router.get('/reports/export', exportReportCSV);

module.exports = router;
