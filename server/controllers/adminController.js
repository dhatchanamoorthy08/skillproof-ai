const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const SkillPassport = require('../models/SkillPassport');
const Evidence = require('../models/Evidence');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Roadmap = require('../models/Roadmap');
const StudentRoadmapProgress = require('../models/StudentRoadmapProgress');
const { logSecurityEvent, getRecentAuditLogs } = require('../services/auditService');
const {
  fallbackUsers,
  fallbackStudentProfiles,
  fallbackPassports,
  fallbackEvidence,
  fallbackAssessments,
  fallbackAssessmentAttempts,
  fallbackRoadmaps,
  fallbackStudentRoadmapProgress,
  saveStore,
} = require('../services/fallbackStore');

// @desc    Get Admin Overview Telemetry & Statistics
// @route   GET /api/v1/admin/overview
// @access  Private (Admin)
const getAdminOverview = async (req, res, next) => {
  try {
    let totalStudents = 0;
    let activeRoadmaps = 0;
    let totalAttempts = 0;
    let pendingEvidence = 0;
    let verifiedEvidence = 0;
    let recentViolations = [];
    let auditLogs = [];

    if (mongoose.connection.readyState === 1) {
      const [studentsCount, roadmapsCount, attemptsCount, pendingEvCount, verifiedEvCount, violationAttempts] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Roadmap.countDocuments({ status: 'published' }),
        AssessmentAttempt.countDocuments(),
        Evidence.countDocuments({ verificationStatus: 'pending' }),
        Evidence.countDocuments({ verificationStatus: 'verified' }),
        AssessmentAttempt.find({ 'violations.0': { $exists: true } })
          .sort({ updatedAt: -1 })
          .limit(10)
          .populate('student', 'fullName email')
          .populate('assessment', 'title domain'),
      ]);

      totalStudents = studentsCount;
      activeRoadmaps = roadmapsCount;
      totalAttempts = attemptsCount;
      pendingEvidence = pendingEvCount;
      verifiedEvidence = verifiedEvCount;
      recentViolations = violationAttempts;
      auditLogs = getRecentAuditLogs(20);
    } else {
      totalStudents = (fallbackUsers || []).filter((u) => u.role === 'student').length;
      activeRoadmaps = (fallbackRoadmaps || []).filter((r) => r.status === 'published').length;
      totalAttempts = (fallbackAssessmentAttempts || []).length;
      pendingEvidence = (fallbackEvidence || []).filter((e) => e.verificationStatus === 'pending').length;
      verifiedEvidence = (fallbackEvidence || []).filter((e) => e.verificationStatus === 'verified').length;
      recentViolations = (fallbackAssessmentAttempts || []).filter((a) => (a.violations || []).length > 0).slice(0, 10);
      auditLogs = getRecentAuditLogs(20);
    }

    res.json({
      success: true,
      metrics: {
        totalStudents,
        activeRoadmaps,
        totalAttempts,
        pendingEvidence,
        verifiedEvidence,
      },
      recentViolations,
      recentAuditLogs: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// A. ROADMAP MANAGEMENT
// ==========================================

// @desc    List all roadmaps for admin
// @route   GET /api/v1/admin/roadmaps
// @access  Private (Admin)
const getAdminRoadmaps = async (req, res, next) => {
  try {
    let roadmaps = [];
    if (mongoose.connection.readyState === 1) {
      roadmaps = await Roadmap.find().sort({ createdAt: -1 });
      if (!roadmaps || roadmaps.length === 0) roadmaps = fallbackRoadmaps;
    } else {
      roadmaps = fallbackRoadmaps;
    }
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new career roadmap
// @route   POST /api/v1/admin/roadmaps
// @access  Private (Admin)
const createRoadmap = async (req, res, next) => {
  try {
    const { title, slug, description, category, estimatedDuration, requiredSkills, levels } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and URL slug are required.' });
    }

    const normalizedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-');

    if (mongoose.connection.readyState !== 1) {
      const existing = (fallbackRoadmaps || []).find((r) => r.slug === normalizedSlug);
      if (existing) {
        return res.status(400).json({ success: false, message: 'A roadmap with this slug already exists.' });
      }

      const newRoadmap = {
        _id: `rm_${Date.now()}`,
        title,
        slug: normalizedSlug,
        description: description || '',
        category: category || 'Software Engineering',
        estimatedDuration: estimatedDuration || '6 Months',
        status: 'published',
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
        levels: levels || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      fallbackRoadmaps.unshift(newRoadmap);
      saveStore();

      logSecurityEvent({
        user: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'ROADMAP_CREATED',
        resourceType: 'ROADMAP',
        resourceId: normalizedSlug,
        details: { title, slug: normalizedSlug },
        ipAddress: req.ip,
      });

      return res.status(201).json({ success: true, roadmap: newRoadmap });
    }

    const existing = await Roadmap.findOne({ slug: normalizedSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A roadmap with this slug already exists.' });
    }

    const roadmap = await Roadmap.create({
      title,
      slug: normalizedSlug,
      description,
      category,
      estimatedDuration,
      status: 'published',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      levels: levels || [],
    });

    logSecurityEvent({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'ROADMAP_CREATED',
      resourceType: 'ROADMAP',
      resourceId: roadmap._id.toString(),
      details: { title, slug: normalizedSlug },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

// @desc    Update roadmap details, status, or module structure
// @route   PUT /api/v1/admin/roadmaps/:id
// @access  Private (Admin)
const updateRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState !== 1) {
      const rm = (fallbackRoadmaps || []).find((r) => r._id === id || r.slug === id);
      if (!rm) {
        return res.status(404).json({ success: false, message: 'Roadmap not found.' });
      }

      Object.assign(rm, updates, { updatedAt: new Date() });
      saveStore();

      logSecurityEvent({
        user: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'ROADMAP_UPDATED',
        resourceType: 'ROADMAP',
        resourceId: rm.slug,
        details: { fields: Object.keys(updates) },
        ipAddress: req.ip,
      });

      return res.json({ success: true, roadmap: rm });
    }

    const roadmap = await Roadmap.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }] },
      { $set: updates },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    logSecurityEvent({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'ROADMAP_UPDATED',
      resourceType: 'ROADMAP',
      resourceId: roadmap._id.toString(),
      details: { fields: Object.keys(updates) },
      ipAddress: req.ip,
    });

    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update study notes for a specific topic
// @route   POST /api/v1/admin/roadmaps/:id/topics/:topicId/material
// @access  Private (Admin)
const updateTopicStudyMaterial = async (req, res, next) => {
  try {
    const { id, topicId } = req.params;
    const { introduction, detailedNotes, codeSnippet, practicalExamples, practiceExercises, interviewQuestions } = req.body;

    let targetRoadmap = null;
    if (mongoose.connection.readyState !== 1) {
      targetRoadmap = (fallbackRoadmaps || []).find((r) => r._id === id || r.slug === id);
      if (!targetRoadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

      let foundTopic = null;
      for (const lvl of targetRoadmap.levels || []) {
        for (const mod of lvl.modules || []) {
          const t = (mod.topics || []).find((x) => x.topicId === topicId);
          if (t) {
            foundTopic = t;
            break;
          }
        }
      }

      if (!foundTopic) return res.status(404).json({ success: false, message: 'Topic not found in roadmap.' });

      if (!foundTopic.studyMaterial) foundTopic.studyMaterial = {};
      if (introduction !== undefined) foundTopic.studyMaterial.introduction = introduction;
      if (detailedNotes !== undefined) foundTopic.studyMaterial.detailedNotes = detailedNotes;
      if (codeSnippet !== undefined) foundTopic.studyMaterial.codeSnippet = codeSnippet;
      if (practicalExamples !== undefined) foundTopic.studyMaterial.practicalExamples = practicalExamples;
      if (practiceExercises !== undefined) foundTopic.studyMaterial.practiceExercises = practiceExercises;
      if (interviewQuestions !== undefined) foundTopic.studyMaterial.interviewQuestions = interviewQuestions;

      saveStore();
      return res.json({ success: true, message: 'Topic study material updated successfully.', topic: foundTopic });
    }

    const roadmap = await Roadmap.findOne({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }],
    });

    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    let foundTopic = null;
    for (const lvl of roadmap.levels || []) {
      for (const mod of lvl.modules || []) {
        const t = (mod.topics || []).find((x) => x.topicId === topicId);
        if (t) {
          foundTopic = t;
          break;
        }
      }
    }

    if (!foundTopic) return res.status(404).json({ success: false, message: 'Topic not found in roadmap.' });

    if (!foundTopic.studyMaterial) foundTopic.studyMaterial = {};
    if (introduction !== undefined) foundTopic.studyMaterial.introduction = introduction;
    if (detailedNotes !== undefined) foundTopic.studyMaterial.detailedNotes = detailedNotes;
    if (codeSnippet !== undefined) foundTopic.studyMaterial.codeSnippet = codeSnippet;
    if (practicalExamples !== undefined) foundTopic.studyMaterial.practicalExamples = practicalExamples;
    if (practiceExercises !== undefined) foundTopic.studyMaterial.practiceExercises = practiceExercises;
    if (interviewQuestions !== undefined) foundTopic.studyMaterial.interviewQuestions = interviewQuestions;

    await roadmap.save();

    res.json({ success: true, message: 'Topic study material updated successfully.', topic: foundTopic });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a verified free course link to a topic
// @route   POST /api/v1/admin/roadmaps/:id/topics/:topicId/courses
// @access  Private (Admin)
const addFreeCourseLink = async (req, res, next) => {
  try {
    const { id, topicId } = req.params;
    const { title, provider, url, skillCovered, level, duration, isFree, hasCertificate } = req.body;

    if (!title || !provider || !url) {
      return res.status(400).json({ success: false, message: 'Course title, provider, and URL are required.' });
    }

    const courseItem = {
      title,
      provider,
      url,
      skillCovered: skillCovered || 'Technical Core',
      level: level || 'Beginner',
      duration: duration || 'Self-paced',
      isFree: isFree !== undefined ? isFree : true,
      hasCertificate: hasCertificate !== undefined ? hasCertificate : false,
      status: 'active',
    };

    if (mongoose.connection.readyState !== 1) {
      const rm = (fallbackRoadmaps || []).find((r) => r._id === id || r.slug === id);
      if (!rm) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

      for (const lvl of rm.levels || []) {
        for (const mod of lvl.modules || []) {
          const t = (mod.topics || []).find((x) => x.topicId === topicId);
          if (t) {
            if (!t.freeCourses) t.freeCourses = [];
            t.freeCourses.push({ ...courseItem, _id: `crs_${Date.now()}` });
            saveStore();
            return res.status(201).json({ success: true, freeCourses: t.freeCourses });
          }
        }
      }
      return res.status(404).json({ success: false, message: 'Topic not found.' });
    }

    const roadmap = await Roadmap.findOne({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }],
    });

    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    for (const lvl of roadmap.levels || []) {
      for (const mod of lvl.modules || []) {
        const t = (mod.topics || []).find((x) => x.topicId === topicId);
        if (t) {
          if (!t.freeCourses) t.freeCourses = [];
          t.freeCourses.push(courseItem);
          await roadmap.save();
          return res.status(201).json({ success: true, freeCourses: t.freeCourses });
        }
      }
    }

    res.status(404).json({ success: false, message: 'Topic not found.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// D. STUDENT MANAGEMENT
// ==========================================

// @desc    Get all students with search & filter
// @route   GET /api/v1/admin/students
// @access  Private (Admin)
const getStudentsList = async (req, res, next) => {
  try {
    const { search, department, status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let students = (fallbackUsers || []).filter((u) => u.role === 'student');

      if (search) {
        const q = search.toLowerCase();
        students = students.filter(
          (s) => s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
        );
      }
      if (status && status !== 'all') {
        students = students.filter((s) => s.status === status);
      }

      const results = students.map((s) => {
        const prof = fallbackStudentProfiles[s._id] || {};
        const pass = fallbackPassports[s._id] || {};
        const evList = (fallbackEvidence || []).filter((e) => e.student === s._id);
        const attempts = (fallbackAssessmentAttempts || []).filter((a) => a.student === s._id);

        return {
          _id: s._id,
          fullName: s.fullName,
          email: s.email,
          status: s.status || 'active',
          avatar: s.avatar || prof.avatar || '',
          rollNumber: prof.rollNumber || 'N/A',
          department: prof.department || 'Computer Science',
          cgpa: prof.cgpa || '8.0',
          batch: prof.batch || '2026',
          targetRole: prof.targetRole || 'Full Stack Developer',
          jobReadinessIndex: pass.jobReadinessIndex || 45,
          readinessTier: pass.readinessTier || 'Developing',
          evidenceCount: evList.length,
          verifiedEvidenceCount: evList.filter((e) => e.verificationStatus === 'verified').length,
          assessmentsCount: attempts.length,
          createdAt: s.createdAt || new Date(),
        };
      });

      return res.json({ success: true, count: results.length, students: results });
    }

    const query = { role: 'student' };
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    const studentIds = students.map((s) => s._id);
    const [profiles, passports, evidenceList, attempts] = await Promise.all([
      StudentProfile.find({ user: { $in: studentIds } }),
      SkillPassport.find({ student: { $in: studentIds } }),
      Evidence.find({ student: { $in: studentIds } }),
      AssessmentAttempt.find({ student: { $in: studentIds } }),
    ]);

    const profMap = new Map(profiles.map((p) => [p.user.toString(), p]));
    const passMap = new Map(passports.map((p) => [p.student.toString(), p]));

    const results = students.map((s) => {
      const sId = s._id.toString();
      const prof = profMap.get(sId) || {};
      const pass = passMap.get(sId) || {};
      const ev = evidenceList.filter((e) => e.student.toString() === sId);
      const att = attempts.filter((a) => a.student.toString() === sId);

      return {
        _id: s._id,
        fullName: s.fullName,
        email: s.email,
        status: s.status,
        avatar: s.avatar || prof.avatar || '',
        rollNumber: prof.rollNumber || 'N/A',
        department: prof.department || 'Computer Science',
        cgpa: prof.cgpa || '8.0',
        batch: prof.batch || '2026',
        targetRole: prof.targetRole || 'Full Stack Developer',
        jobReadinessIndex: pass.jobReadinessIndex || 45,
        readinessTier: pass.readinessTier || 'Developing',
        evidenceCount: ev.length,
        verifiedEvidenceCount: ev.filter((e) => e.verificationStatus === 'verified').length,
        assessmentsCount: att.length,
        createdAt: s.createdAt,
      };
    });

    res.json({ success: true, count: results.length, students: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student account status (active / suspended)
// @route   PUT /api/v1/admin/students/:id/status
// @access  Private (Admin)
const updateStudentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status (active, suspended) is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const student = (fallbackUsers || []).find((u) => u._id === id);
      if (!student) return res.status(404).json({ success: false, message: 'Student account not found.' });

      student.status = status;
      saveStore();

      logSecurityEvent({
        user: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'STUDENT_STATUS_UPDATED',
        resourceType: 'USER',
        resourceId: id,
        details: { newStatus: status, targetEmail: student.email },
        ipAddress: req.ip,
      });

      return res.json({ success: true, message: `Student status updated to ${status}.`, student });
    }

    const student = await User.findByIdAndUpdate(id, { $set: { status } }, { new: true }).select('-password');
    if (!student) return res.status(404).json({ success: false, message: 'Student account not found.' });

    logSecurityEvent({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'STUDENT_STATUS_UPDATED',
      resourceType: 'USER',
      resourceId: id,
      details: { newStatus: status, targetEmail: student.email },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Student status updated to ${status}.`, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed student learning records, evidence & assessment attempts
// @route   GET /api/v1/admin/students/:id
// @access  Private (Admin)
const getStudentDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const user = (fallbackUsers || []).find((u) => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'Student not found.' });

      const profile = fallbackStudentProfiles[id] || {};
      const passport = fallbackPassports[id] || {};
      const evidence = (fallbackEvidence || []).filter((e) => e.student === id);
      const attempts = (fallbackAssessmentAttempts || []).filter((a) => a.student === id);
      const roadmapProgress = (fallbackStudentRoadmapProgress[id]) || {};

      return res.json({
        success: true,
        student: {
          ...user,
          profile,
          passport,
          evidence,
          attempts,
          roadmapProgress,
        },
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Student not found.' });

    const [profile, passport, evidence, attempts, roadmapProgress] = await Promise.all([
      StudentProfile.findOne({ user: id }),
      SkillPassport.findOne({ student: id }),
      Evidence.find({ student: id }).sort({ createdAt: -1 }),
      AssessmentAttempt.find({ student: id }).populate('assessment', 'title domain').sort({ createdAt: -1 }),
      StudentRoadmapProgress.find({ student: id }),
    ]);

    res.json({
      success: true,
      student: {
        ...user.toObject(),
        profile,
        passport,
        evidence,
        attempts,
        roadmapProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// E. ASSESSMENT & PROCTORING MANAGEMENT
// ==========================================

// @desc    Get assessments and proctoring violation telemetry
// @route   GET /api/v1/admin/assessments
// @access  Private (Admin)
const getAdminAssessments = async (req, res, next) => {
  try {
    let assessments = [];
    let violationLogs = [];

    if (mongoose.connection.readyState === 1) {
      assessments = await Assessment.find().sort({ createdAt: -1 });
      violationLogs = await AssessmentAttempt.find({ 'violations.0': { $exists: true } })
        .populate('student', 'fullName email')
        .populate('assessment', 'title domain')
        .sort({ updatedAt: -1 })
        .limit(30);
    } else {
      assessments = fallbackAssessments || [];
      violationLogs = (fallbackAssessmentAttempts || []).filter((a) => (a.violations || []).length > 0).slice(0, 30);
    }

    res.json({
      success: true,
      assessments,
      violationLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assessment
// @route   POST /api/v1/admin/assessments
// @access  Private (Admin)
const createAssessment = async (req, res, next) => {
  try {
    const { title, domain, description, durationMinutes, passingScorePercentage, questions, primarySkills } = req.body;

    if (!title || !domain) {
      return res.status(400).json({ success: false, message: 'Title and domain are required.' });
    }

    const payload = {
      title,
      domain,
      description: description || '',
      durationMinutes: durationMinutes || 40,
      passingScorePercentage: passingScorePercentage || 75,
      questions: questions || [],
      primarySkills: primarySkills || [domain],
    };

    if (mongoose.connection.readyState !== 1) {
      const newAss = {
        _id: `ass_${Date.now()}`,
        ...payload,
        createdAt: new Date(),
      };
      fallbackAssessments.unshift(newAss);
      saveStore();

      logSecurityEvent({
        user: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'ASSESSMENT_CREATED',
        resourceType: 'ASSESSMENT',
        resourceId: newAss._id,
        details: { title, domain },
        ipAddress: req.ip,
      });

      return res.status(201).json({ success: true, assessment: newAss });
    }

    const assessment = await Assessment.create(payload);

    logSecurityEvent({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'ASSESSMENT_CREATED',
      resourceType: 'ASSESSMENT',
      resourceId: assessment._id.toString(),
      details: { title, domain },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// F. EVIDENCE VERIFICATION
// ==========================================

// @desc    Get all evidence across students
// @route   GET /api/v1/admin/evidence
// @access  Private (Admin)
const getAdminEvidence = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = fallbackEvidence || [];
      if (status && status !== 'all') {
        list = list.filter((e) => e.verificationStatus === status);
      }

      const hydrated = list.map((e) => {
        const studentUser = (fallbackUsers || []).find((u) => u._id === e.student?.toString());
        return {
          ...e,
          student: studentUser ? { _id: studentUser._id, fullName: studentUser.fullName, email: studentUser.email } : e.student,
        };
      });

      return res.json({ success: true, count: hydrated.length, evidence: hydrated });
    }

    const query = {};
    if (status && status !== 'all') query.verificationStatus = status;

    const evidence = await Evidence.find(query).populate('student', 'fullName email').sort({ createdAt: -1 });
    res.json({ success: true, count: evidence.length, evidence });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject student evidence with remarks
// @route   PUT /api/v1/admin/evidence/:id/verify
// @access  Private (Admin)
const verifyEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const ev = (fallbackEvidence || []).find((e) => e._id === id);
      if (!ev) return res.status(404).json({ success: false, message: 'Evidence record not found.' });

      ev.verificationStatus = status;
      ev.verificationNotes = remarks || `Evaluated by Admin: ${status}`;
      ev.verifiedBy = req.user._id;
      ev.verifiedAt = new Date();

      saveStore();

      logSecurityEvent({
        user: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: `EVIDENCE_${status.toUpperCase()}`,
        resourceType: 'EVIDENCE',
        resourceId: id,
        details: { remarks, studentId: ev.student },
        ipAddress: req.ip,
      });

      return res.json({ success: true, message: `Evidence marked as ${status}.`, evidence: ev });
    }

    const evidence = await Evidence.findByIdAndUpdate(
      id,
      {
        $set: {
          verificationStatus: status,
          verificationNotes: remarks || `Evaluated by Admin: ${status}`,
          verifiedBy: req.user._id,
          verifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!evidence) return res.status(404).json({ success: false, message: 'Evidence record not found.' });

    logSecurityEvent({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: `EVIDENCE_${status.toUpperCase()}`,
      resourceType: 'EVIDENCE',
      resourceId: id,
      details: { remarks, studentId: evidence.student },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Evidence marked as ${status}.`, evidence });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// G. CSV EXPORTS & AUDIT LOGS
// ==========================================

// @desc    Export administrative reports as CSV
// @route   GET /api/v1/admin/reports/export
// @access  Private (Admin)
const exportReportCSV = async (req, res, next) => {
  try {
    const { type } = req.query; // 'students' | 'assessments' | 'evidence'

    let csvContent = '';
    let filename = `skillproof-${type || 'report'}-${Date.now()}.csv`;

    if (type === 'students') {
      csvContent = 'Student ID,Full Name,Email,Status,Department,CGPA,Job Readiness Index,Readiness Tier\n';
      const students = (fallbackUsers || []).filter((u) => u.role === 'student');
      students.forEach((s) => {
        const prof = fallbackStudentProfiles[s._id] || {};
        const pass = fallbackPassports[s._id] || {};
        csvContent += `"${s._id}","${s.fullName}","${s.email}","${s.status || 'active'}","${prof.department || 'N/A'}","${prof.cgpa || 'N/A'}","${pass.jobReadinessIndex || 45}%","${pass.readinessTier || 'Developing'}"\n`;
      });
    } else if (type === 'assessments') {
      csvContent = 'Attempt ID,Student Name,Assessment Title,Domain,Score Percentage,Status,Violations Count,Date\n';
      const attempts = fallbackAssessmentAttempts || [];
      attempts.forEach((a) => {
        const student = (fallbackUsers || []).find((u) => u._id === (a.student?._id || a.student)?.toString());
        csvContent += `"${a._id}","${student?.fullName || 'Student'}","${a.assessment?.title || 'Assessment'}","${a.assessment?.domain || 'Core'}","${a.scorePercentage || 0}%","${a.status}","${(a.violations || []).length}","${new Date(a.createdAt).toISOString()}"\n`;
      });
    } else {
      csvContent = 'Evidence ID,Title,Type,Student ID,Verification Status,Issuing Organization,Date\n';
      const list = fallbackEvidence || [];
      list.forEach((e) => {
        csvContent += `"${e._id}","${e.title}","${e.type}","${e.student}","${e.verificationStatus}","${e.issuingOrganization || e.courseProvider || 'N/A'}","${new Date(e.createdAt).toISOString()}"\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
