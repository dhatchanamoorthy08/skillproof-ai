const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, applyToJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Optional auth for browse, but required for apply
router.get('/', (req, res, next) => {
  // Try protect optionally
  if (req.headers.authorization) {
    return protect(req, res, () => getAllJobs(req, res, next));
  }
  getAllJobs(req, res, next);
});

router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, () => getJobById(req, res, next));
  }
  getJobById(req, res, next);
});

router.post('/:id/apply', protect, authorize('student'), applyToJob);

module.exports = router;
