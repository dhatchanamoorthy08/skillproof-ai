const express = require('express');
const router = express.Router();
const { uploadAndAnalyzeResume, syncSkillsToPassport } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// Public overview / redirect for browser navigation to /api/v1/resumes
router.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.redirect('/student/resume');
  }
  res.json({
    success: true,
    module: 'Resume Diagnostic & ATS API',
    endpoints: {
      upload: { method: 'POST', path: '/api/v1/resumes/upload', desc: 'Upload PDF and run ATS analysis' },
      syncSkills: { method: 'POST', path: '/api/v1/resumes/sync-skills', desc: 'Sync extracted skills to passport' },
    },
    webUrl: '/student/resume',
  });
});

router.use(protect);
router.use(authorize('student'));

router.post('/upload', upload.single('resumeFile'), uploadAndAnalyzeResume);
router.post('/sync-skills', syncSkillsToPassport);

module.exports = router;
