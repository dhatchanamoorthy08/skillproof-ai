const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const SkillPassport = require('../models/SkillPassport');
const Evidence = require('../models/Evidence');
const StudentProfile = require('../models/StudentProfile');
const { calculateJobReadinessIndex } = require('../services/matching/hybridMatcher');
const { normalizeSkill } = require('../services/matching/skillNormalizer');
const {
  fallbackAssessments,
  fallbackPassports,
  fallbackPassport,
  fallbackAssessmentAttempts,
  fallbackUsers,
  saveStore,
} = require('../services/fallbackStore');
const { getRandomizedQuestions } = require('../services/assessments/assessmentBank');

// In-memory active attempts store for offline & active sessions
const memoryAttempts = {};

// @desc    Get all available active assessments with per-account attempt status
// @route   GET /api/v1/assessments
// @access  Public / Private (Extracts student context if logged in)
const getAssessments = async (req, res, next) => {
  try {
    const studentId = req.user && req.user.role === 'student' ? req.user._id?.toString() : null;

    if (mongoose.connection.readyState !== 1) {
      // Find attempts strictly matching this specific student account!
      const userAttempts = studentId
        ? (fallbackAssessmentAttempts || []).filter((att) => att.student?.toString() === studentId)
        : [];
      const attemptsMap = new Map();
      userAttempts.forEach((att) => attemptsMap.set(att.assessment?.toString(), att));

      const enriched = fallbackAssessments.map((ass) => {
        const att = attemptsMap.get(ass._id?.toString());
        return {
          _id: ass._id,
          title: ass.title,
          domain: ass.domain,
          description: ass.description,
          durationMinutes: ass.durationMinutes,
          passingScorePercentage: ass.passingScorePercentage,
          primarySkills: ass.primarySkills,
          difficulty: ass.difficulty,
          questionCount: ass.questions?.length || 0,
          userAttempt: att
            ? {
                status: att.status || 'completed',
                scorePercentage: att.scorePercentage,
                passed: att.passed,
                submittedAt: att.submittedAt,
              }
            : null,
        };
      });
      return res.json({ success: true, count: enriched.length, assessments: enriched });
    }

    const assessments = await Assessment.find({ isActive: true })
      .select('-questions.options.isCorrect -questions.explanation')
      .sort({ createdAt: -1 });

    let attempts = [];
    if (studentId) {
      attempts = await AssessmentAttempt.find({ student: studentId });
    }

    const attemptsMap = new Map();
    attempts.forEach((att) => attemptsMap.set(att.assessment.toString(), att));

    const enriched = assessments.map((ass) => {
      const att = attemptsMap.get(ass._id.toString());
      return {
        _id: ass._id,
        title: ass.title,
        domain: ass.domain,
        description: ass.description,
        durationMinutes: ass.durationMinutes,
        passingScorePercentage: ass.passingScorePercentage,
        primarySkills: ass.primarySkills,
        difficulty: ass.difficulty,
        questionCount: ass.questions?.length || 0,
        userAttempt: att
          ? {
              status: att.status || 'completed',
              scorePercentage: att.scorePercentage,
              passed: att.passed,
              submittedAt: att.submittedAt,
            }
          : null,
      };
    });

    res.json({ success: true, count: enriched.length, assessments: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment detail for starting exam
// @route   GET /api/v1/assessments/:id
// @access  Public / Private
const getAssessmentById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ass = fallbackAssessments.find((a) => a._id === req.params.id) || fallbackAssessments[0];
      return res.json({ success: true, assessment: ass });
    }

    const assessment = await Assessment.findById(req.params.id)
      .select('-questions.options.isCorrect -questions.explanation');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Start an assessment attempt with dynamic, account-specific question variation
// @route   POST /api/v1/assessments/:id/start
// @access  Private (Student)
const startAssessment = async (req, res, next) => {
  try {
    const ass =
      mongoose.connection.readyState === 1
        ? await Assessment.findById(req.params.id)
        : fallbackAssessments.find((a) => a._id === req.params.id) || fallbackAssessments[0];

    if (!ass) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    const attemptId = `66800000000000000000${Date.now().toString().slice(-4)}`;
    const expiresAt = new Date(Date.now() + ass.durationMinutes * 60 * 1000 + 30 * 1000);

    // Randomize all 30 questions from this domain with shuffled option choices
    // This ensures different questions ordering & option order across different accounts and attempts!
    const selectedQuestions = getRandomizedQuestions(ass, 30);

    const candidateName = req.user?.fullName || 'Student Candidate';
    const candidateEmail = req.user?.email || '';
    const maxAllowedViolations = 5;

    memoryAttempts[attemptId] = {
      attemptId,
      assessmentId: ass._id,
      assessmentTitle: ass.title,
      assessmentDomain: ass.domain,
      studentId: req.user?._id?.toString(),
      candidateName,
      candidateEmail,
      cameraStatus: 'connected',
      cameraInterruptions: 0,
      tabSwitches: 0,
      focusLossCount: 0,
      startedAt: new Date(),
      expiresAt,
      status: 'in_progress',
      violations: [],
      violationCount: 0,
      maxAllowedViolations,
      questions: selectedQuestions, // includes full option objects with isCorrect for grading
    };

    res.status(201).json({
      success: true,
      message: 'Assessment attempt initialized with webcam proctoring & randomized questions.',
      attemptId,
      expiresAt,
      maxAllowedViolations,
      assessment: {
        id: ass._id,
        title: ass.title,
        durationMinutes: ass.durationMinutes,
        // Sanitize questions: strip isCorrect from options when delivering to browser
        questions: selectedQuestions.map((q) => ({
          _id: q._id,
          questionText: q.questionText,
          type: q.type,
          codeSnippet: q.codeSnippet,
          points: q.points || 10,
          skillTag: q.skillTag,
          options: q.options.map((opt) => ({ text: opt.text })),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log proctoring violation & track webcam/focus events
// @route   POST /api/v1/assessments/:id/violations
// @access  Private (Student)
const logViolation = async (req, res, next) => {
  try {
    const { attemptId, type, details, cameraStatus } = req.body;

    if (memoryAttempts[attemptId]) {
      const att = memoryAttempts[attemptId];
      const event = {
        type: type || 'focus_loss',
        details: details || '',
        timestamp: new Date(),
      };
      att.violations.push(event);
      att.violationCount = att.violations.length;

      if (type === 'tab_hidden') att.tabSwitches = (att.tabSwitches || 0) + 1;
      if (type === 'focus_loss') att.focusLossCount = (att.focusLossCount || 0) + 1;
      if (type === 'camera_disconnected' || type === 'camera_permission_revoked') {
        att.cameraInterruptions = (att.cameraInterruptions || 0) + 1;
        att.cameraStatus = 'disconnected';
      } else if (cameraStatus) {
        att.cameraStatus = cameraStatus;
      }

      const limit = att.maxAllowedViolations || 5;
      const shouldAutoSubmit = att.violationCount >= limit;
      const shouldPause = type === 'camera_disconnected' || type === 'camera_permission_revoked';

      if (shouldAutoSubmit) {
        att.status = 'flagged';
      } else if (shouldPause) {
        att.status = 'paused';
      } else if (att.status === 'paused' && type === 'camera_resumed') {
        att.status = 'in_progress';
        att.cameraStatus = 'connected';
      }

      return res.json({
        success: true,
        violationCount: att.violationCount,
        tabSwitches: att.tabSwitches || 0,
        focusLossCount: att.focusLossCount || 0,
        cameraInterruptions: att.cameraInterruptions || 0,
        cameraStatus: att.cameraStatus,
        shouldAutoSubmit,
        shouldPause,
        maxAllowedViolations: limit,
        status: att.status,
      });
    }

    if (mongoose.connection.readyState === 1) {
      const attempt = await AssessmentAttempt.findById(attemptId);
      if (attempt) {
        attempt.violations.push({ type, details, timestamp: new Date() });
        attempt.violationCount = attempt.violations.length;
        if (type === 'tab_hidden') attempt.tabSwitches = (attempt.tabSwitches || 0) + 1;
        if (type === 'focus_loss') attempt.focusLossCount = (attempt.focusLossCount || 0) + 1;
        if (type === 'camera_disconnected' || type === 'camera_permission_revoked') {
          attempt.cameraInterruptions = (attempt.cameraInterruptions || 0) + 1;
          attempt.cameraStatus = 'disconnected';
        }
        await attempt.save();
        return res.json({
          success: true,
          violationCount: attempt.violationCount,
          shouldAutoSubmit: attempt.violationCount >= 5,
        });
      }
    }

    res.json({ success: true, violationCount: 1, shouldAutoSubmit: false, shouldPause: false });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment & auto-score against served question variation
// @route   POST /api/v1/assessments/:id/submit
// @access  Private (Student)
const submitAssessment = async (req, res, next) => {
  try {
    const { attemptId, userAnswers } = req.body;
    const studentId = req.user?._id?.toString();

    const ass =
      mongoose.connection.readyState === 1
        ? await Assessment.findById(req.params.id)
        : fallbackAssessments.find((a) => a._id === req.params.id) || fallbackAssessments[0];

    const activeAttempt = memoryAttempts[attemptId];
    // Grade against the exact question set and option orders served to this attempt!
    const questionsToGrade = activeAttempt?.questions || ass.questions;

    let totalPoints = 0;
    let earnedPoints = 0;

    questionsToGrade.forEach((q) => {
      totalPoints += q.points || 10;
      const submitted = (userAnswers || []).find((ua) => ua.questionId === q._id?.toString());
      const selectedIndex = submitted?.selectedOptionIndex;

      let isCorrect = false;
      if (selectedIndex !== undefined && selectedIndex !== null && q.options && q.options[selectedIndex]) {
        isCorrect = q.options[selectedIndex].isCorrect === true;
      }

      if (isCorrect) earnedPoints += q.points || 10;
    });

    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercentage >= ass.passingScorePercentage;
    const violationCount = activeAttempt?.violationCount || 0;

    // Record attempt for this specific student in offline / fallback store
    if (studentId) {
      const candidateName = activeAttempt?.candidateName || req.user?.fullName || 'Candidate';
      const candidateEmail = activeAttempt?.candidateEmail || req.user?.email || '';

      const attemptRecord = {
        _id: attemptId || `66800000000000000000${Date.now().toString().slice(-4)}`,
        student: studentId,
        candidateName,
        candidateEmail,
        assessment: ass._id,
        assessmentTitle: ass.title,
        assessmentDomain: ass.domain,
        scorePercentage,
        earnedPoints,
        totalPoints,
        passed,
        status: violationCount >= 3 ? 'flagged' : 'completed',
        cameraStatus: activeAttempt?.cameraStatus || 'connected',
        cameraInterruptions: activeAttempt?.cameraInterruptions || 0,
        tabSwitches: activeAttempt?.tabSwitches || 0,
        focusLossCount: activeAttempt?.focusLossCount || 0,
        violationCount,
        violations: activeAttempt?.violations || [],
        startedAt: activeAttempt?.startedAt || new Date(Date.now() - 20 * 60000),
        submittedAt: new Date(),
      };

      const existingIdx = fallbackAssessmentAttempts.findIndex(
        (a) => a.student?.toString() === studentId && a.assessment?.toString() === ass._id?.toString()
      );
      if (existingIdx >= 0) {
        fallbackAssessmentAttempts[existingIdx] = attemptRecord;
      } else {
        fallbackAssessmentAttempts.push(attemptRecord);
      }

      // Update student's isolated Skill Passport
      let studentPassport = fallbackPassports[studentId];
      if (!studentPassport) {
        studentPassport = {
          _id: `66200000000000000000${Date.now().toString().slice(-4)}`,
          student: studentId,
          skills: [],
          jobReadinessIndex: 40,
          readinessTier: 'Developing',
          readinessBreakdown: {
            assessedScore: 0,
            demonstratedScore: 10,
            verifiedScore: 10,
            profileCompletenessScore: 20,
          },
          actionableSuggestions: [],
        };
        fallbackPassports[studentId] = studentPassport;
      }

      if (passed) {
        // Upgrade / add assessed skills to this student's passport
        (ass.primarySkills || []).forEach((skillName) => {
          let existingSkill = studentPassport.skills.find(
            (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
          );
          if (existingSkill) {
            existingSkill.status = 'assessed';
            existingSkill.assessmentScore = scorePercentage;
            existingSkill.proficiency = scorePercentage >= 85 ? 'Advanced' : 'Intermediate';
            existingSkill.statusReason = `Assessed with ${scorePercentage}% in ${ass.title}.`;
          } else {
            studentPassport.skills.push({
              skillName,
              normalizedName: skillName.toLowerCase(),
              category: ass.domain || 'Technical',
              status: 'assessed',
              proficiency: scorePercentage >= 85 ? 'Advanced' : 'Intermediate',
              assessmentScore: scorePercentage,
              statusReason: `Assessed with ${scorePercentage}% in ${ass.title}.`,
            });
          }
        });

        // Recalculate student's JRI
        const assessedCount = studentPassport.skills.filter(
          (s) => s.status === 'assessed' || s.status === 'verified'
        ).length;
        const avgScore =
          studentPassport.skills.reduce((acc, s) => acc + (s.assessmentScore || 70), 0) /
          Math.max(studentPassport.skills.length, 1);
        const newJri = Math.min(Math.round(40 + assessedCount * 10 + avgScore * 0.2), 98);
        studentPassport.jobReadinessIndex = newJri;
        studentPassport.readinessTier =
          newJri >= 80 ? 'Job Ready' : newJri >= 60 ? 'Competitive' : 'Developing';
        studentPassport.readinessBreakdown.assessedScore = Math.min(Math.round(assessedCount * 12), 35);
      }

      saveStore();
    }

    res.json({
      success: true,
      message: passed ? 'Assessment Passed! Skill Passport updated.' : 'Assessment submitted.',
      result: {
        scorePercentage,
        passed,
        earnedPoints,
        totalPoints,
        passingThreshold: ass.passingScorePercentage,
        violationCount,
        proctorFlag: violationCount >= 3,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result of assessment attempt
// @route   GET /api/v1/assessments/results/:id
// @access  Private
const getAttemptResult = async (req, res, next) => {
  try {
    const studentId = req.user?._id?.toString();
    const attempt = fallbackAssessmentAttempts.find(
      (a) => a._id === req.params.id || (studentId && a.student === studentId && a.assessment === req.params.id)
    );
    if (attempt) {
      return res.json({
        success: true,
        result: {
          scorePercentage: attempt.scorePercentage,
          passed: attempt.passed,
          violationCount: attempt.violationCount || 0,
        },
      });
    }
    res.json({
      success: true,
      result: {
        scorePercentage: 0,
        passed: false,
        violationCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment attempts for Admin & Placement Officer proctoring monitoring
// @route   GET /api/v1/assessments/monitoring/attempts
// @access  Private (Placement Officer, Recruiter, Admin)
const getAssessmentAttempts = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let allAttempts = [];

    // Collect active memory attempts
    Object.values(memoryAttempts).forEach((m) => {
      allAttempts.push({
        _id: m.attemptId,
        student: m.studentId,
        candidateName: m.candidateName || 'Candidate',
        candidateEmail: m.candidateEmail || '',
        assessment: m.assessmentId,
        assessmentTitle: m.assessmentTitle || 'Technical Assessment',
        assessmentDomain: m.assessmentDomain || 'Computer Science',
        startedAt: m.startedAt,
        submittedAt: null,
        status: m.status || 'in_progress',
        cameraStatus: m.cameraStatus || 'connected',
        cameraInterruptions: m.cameraInterruptions || 0,
        tabSwitches: m.tabSwitches || 0,
        focusLossCount: m.focusLossCount || 0,
        violationCount: m.violationCount || 0,
        violations: m.violations || [],
        scorePercentage: null,
        passed: null,
      });
    });

    // Merge persistent fallback attempts
    (fallbackAssessmentAttempts || []).forEach((att) => {
      if (!allAttempts.some((a) => a._id === att._id)) {
        const studentObj = (fallbackUsers || []).find((u) => u._id === att.student?.toString());
        const assObj = (fallbackAssessments || []).find((a) => a._id === att.assessment?.toString());
        allAttempts.push({
          _id: att._id,
          student: att.student,
          candidateName: att.candidateName || studentObj?.fullName || 'Aarav Mehta',
          candidateEmail: att.candidateEmail || studentObj?.email || 'student@skillproof.ai',
          assessment: att.assessment,
          assessmentTitle: att.assessmentTitle || assObj?.title || 'Full Stack Web Engineering Assessment',
          assessmentDomain: att.assessmentDomain || assObj?.domain || 'Full Stack Development',
          startedAt: att.startedAt || new Date(new Date(att.submittedAt).getTime() - 25 * 60000),
          submittedAt: att.submittedAt,
          status: att.status || (att.violationCount >= 3 ? 'flagged' : 'completed'),
          cameraStatus: att.cameraStatus || 'connected',
          cameraInterruptions: att.cameraInterruptions || 0,
          tabSwitches: att.tabSwitches || 0,
          focusLossCount: att.focusLossCount || 0,
          violationCount: att.violationCount || 0,
          violations: att.violations || [],
          scorePercentage: att.scorePercentage,
          passed: att.passed,
        });
      }
    });

    // Filter by status if provided
    if (status && status !== 'all') {
      allAttempts = allAttempts.filter((a) => a.status === status);
    }

    // Filter by search query if provided
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allAttempts = allAttempts.filter(
        (a) =>
          (a.candidateName && a.candidateName.toLowerCase().includes(q)) ||
          (a.candidateEmail && a.candidateEmail.toLowerCase().includes(q)) ||
          (a.assessmentTitle && a.assessmentTitle.toLowerCase().includes(q))
      );
    }

    // Sort by startedAt or submittedAt descending
    allAttempts.sort((a, b) => new Date(b.startedAt || b.submittedAt) - new Date(a.startedAt || a.submittedAt));

    const stats = {
      totalAttempts: allAttempts.length,
      inProgressCount: allAttempts.filter((a) => a.status === 'in_progress').length,
      flaggedCount: allAttempts.filter((a) => a.status === 'flagged').length,
      completedCount: allAttempts.filter((a) => a.status === 'completed').length,
      pausedCount: allAttempts.filter((a) => a.status === 'paused').length,
    };

    res.json({
      success: true,
      stats,
      count: allAttempts.length,
      attempts: allAttempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update proctoring status of attempt (Admin / Placement Officer)
// @route   POST /api/v1/assessments/monitoring/attempts/:id/status
// @access  Private (Placement Officer, Recruiter, Admin)
const updateAttemptStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (memoryAttempts[id]) {
      memoryAttempts[id].status = status;
      if (reviewNotes) memoryAttempts[id].proctorSummary = reviewNotes;
      return res.json({ success: true, message: `Attempt status updated to ${status}.` });
    }

    const att = (fallbackAssessmentAttempts || []).find((a) => a._id === id);
    if (att) {
      att.status = status;
      if (reviewNotes) att.proctorSummary = reviewNotes;
      saveStore();
      return res.json({ success: true, message: `Attempt status updated to ${status}.` });
    }

    res.status(404).json({ success: false, message: 'Assessment attempt not found.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssessments,
  getAssessmentById,
  startAssessment,
  logViolation,
  submitAssessment,
  getAttemptResult,
  getAssessmentAttempts,
  updateAttemptStatus,
};
