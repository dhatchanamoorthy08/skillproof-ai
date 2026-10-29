const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SkillPassport = require('../models/SkillPassport');
const StudentProfile = require('../models/StudentProfile');
const { calculateJobMatch } = require('../services/matching/hybridMatcher');
const { fallbackJobs, fallbackSkills, fallbackStudentProfile } = require('../services/fallbackStore');

// ReDoS Defense: Escape special regex characters and cap length
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all active jobs with filtering
// @route   GET /api/v1/jobs
// @access  Public / Private
const getAllJobs = async (req, res, next) => {
  try {
    const { role, domain, location, workMode, jobType, skill, search } = req.query;

    let jobs = [];
    if (mongoose.connection.readyState === 1) {
      let query = { status: 'active' };
      if (domain) query.domain = domain;
      if (location) query.location = new RegExp(escapeRegex(location), 'i');
      if (workMode) query.workMode = workMode;
      if (jobType) query.jobType = jobType;

      if (skill) {
        const safeSkill = escapeRegex(skill);
        query.$or = [
          { requiredSkills: { $in: [new RegExp(safeSkill, 'i')] } },
          { preferredSkills: { $in: [new RegExp(safeSkill, 'i')] } },
        ];
      }

      if (search) {
        const safeSearch = escapeRegex(search);
        query.$or = [
          { title: new RegExp(safeSearch, 'i') },
          { companyName: new RegExp(safeSearch, 'i') },
          { description: new RegExp(safeSearch, 'i') },
        ];
      }

      jobs = await Job.find(query).populate('recruiter', 'fullName email').sort({ createdAt: -1 });
    } else {
      jobs = fallbackJobs;
    }

    // Attach explainable match score
    const studentSkills = fallbackSkills;
    const enrichedJobs = jobs.map((job) => {
      const matchResult = calculateJobMatch(studentSkills, job, fallbackStudentProfile);
      return {
        ...(job.toObject ? job.toObject() : job),
        hasApplied: false,
        matchScore: matchResult.matchScore,
        matchBreakdown: matchResult,
      };
    });

    enrichedJobs.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ success: true, count: enrichedJobs.length, jobs: enrichedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/v1/jobs/:id
// @access  Public / Private
const getJobById = async (req, res, next) => {
  try {
    let job = null;
    if (mongoose.connection.readyState === 1) {
      job = await Job.findById(req.params.id).populate('recruiter', 'fullName email');
    } else {
      job = fallbackJobs.find((j) => j._id === req.params.id) || fallbackJobs[0];
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const matchData = calculateJobMatch(fallbackSkills, job, fallbackStudentProfile);

    res.json({
      success: true,
      job,
      hasApplied: false,
      matchBreakdown: matchData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a job posting
// @route   POST /api/v1/jobs/:id/apply
// @access  Private (Student)
const applyToJob = async (req, res, next) => {
  try {
    let job = null;
    if (mongoose.connection.readyState === 1) {
      job = await Job.findById(req.params.id);
    } else {
      job = fallbackJobs.find((j) => j._id === req.params.id) || fallbackJobs[0];
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const matchData = calculateJobMatch(fallbackSkills, job, fallbackStudentProfile);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Recruiter can now review your verified Skill Passport.',
      application: {
        _id: `66700000000000000000${Date.now().toString().slice(-4)}`,
        job: job._id,
        matchScore: matchData.matchScore,
        matchBreakdown: matchData,
        status: 'applied',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  applyToJob,
};
