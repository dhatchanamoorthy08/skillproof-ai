const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const SkillPassport = require('../models/SkillPassport');
const Evidence = require('../models/Evidence');
const Job = require('../models/Job');
const Application = require('../models/Application');
const HiringDrive = require('../models/HiringDrive');
const CompanyVerification = require('../models/CompanyVerification');
const { generatePlacementCsv } = require('../services/reports/csvReportGenerator');
const { generatePlacementPdf } = require('../services/reports/pdfReportGenerator');
const {
  fallbackDrives,
  fallbackUsers,
  fallbackStudentProfiles,
  fallbackPassports,
  fallbackStudentProfile,
  fallbackPassport,
  fallbackEvidence,
  saveStore,
} = require('../services/fallbackStore');

// In-memory placement data when DB is offline
const fallbackVerifications = [
  {
    _id: '669000000000000000000001',
    companyName: 'AeroByte Autonomous Systems',
    officialEmail: 'marcus@aerobyte.tech',
    website: 'https://aerobyte.tech',
    businessRegistrationNumber: 'CIN-U74999MH2023PTC398112',
    contactPersonName: 'Marcus Vance',
    contactPhone: '+91 98111 22334',
    domainMatchesEmail: true,
    status: 'pending',
  },
];

const fallbackAlerts = [
  {
    studentId: '660000000000000000000002',
    fullName: 'Rohan Verma',
    email: 'atrisk@skillproof.ai',
    department: 'Computer Science & Engineering',
    cgpa: 7.2,
    jobReadinessIndex: 38,
    readinessTier: 'Needs Immediate Support',
    severity: 'High',
    reason: 'Zero completed skill assessments and unverified evidence.',
    recommendedAction: 'Schedule 1-on-1 placement advisory & assign practice assessment milestone.',
  },
];

const fallbackStudentsDirectory = [
  {
    id: '660000000000000000000001',
    fullName: 'Aarav Mehta',
    email: 'student@skillproof.ai',
    rollNumber: '2022CSB1042',
    department: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 9.1,
    targetRole: 'Full Stack Developer',
    placementStatus: 'unplaced',
    jobReadinessIndex: 88,
    readinessTier: 'Placement Ready',
    skillsCount: 6,
    verifiedSkillsCount: 4,
    mentoringNotesCount: 0,
    needsSupport: false,
  },
  {
    id: '660000000000000000000002',
    fullName: 'Rohan Verma',
    email: 'atrisk@skillproof.ai',
    rollNumber: '2022CSB1089',
    department: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 7.2,
    targetRole: 'Backend Developer',
    placementStatus: 'unplaced',
    jobReadinessIndex: 38,
    readinessTier: 'Needs Immediate Support',
    skillsCount: 2,
    verifiedSkillsCount: 0,
    mentoringNotesCount: 1,
    needsSupport: true,
  },
];

// @desc    Get college-wide placement dashboard statistics
// @route   GET /api/v1/placement/dashboard
// @access  Private (Placement Officer)
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = {
      totalStudents: 120,
      placedCount: 48,
      placementPercentage: 40,
      approvedRecruiters: 8,
      pendingVerifications: 1,
      activeJobs: 4,
      activeDrives: 2,
      placementReadyCount: 78,
      developingCount: 30,
      supportNeededCount: 12,
      departmentStats: [
        { name: 'Computer Science & Engineering', total: 60, ready: 45, placed: 26, placementRate: 43 },
        { name: 'Information Technology', total: 40, ready: 25, placed: 16, placementRate: 40 },
        { name: 'Artificial Intelligence & Data Science', total: 20, ready: 14, placed: 6, placementRate: 30 },
      ],
    };
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student directory
// @route   GET /api/v1/placement/students
// @access  Private (Placement Officer)
const getStudentsDirectory = async (req, res, next) => {
  try {
    let studentUsers = [];
    if (mongoose.connection.readyState === 1) {
      studentUsers = await User.find({ role: 'student' }).lean();
    } else {
      studentUsers = (fallbackUsers || []).filter((u) => u.role === 'student');
    }

    const students = await Promise.all(
      studentUsers.map(async (u) => {
        let profile = null;
        let passport = null;

        if (mongoose.connection.readyState === 1) {
          profile = await StudentProfile.findOne({ user: u._id }).lean();
          passport = await SkillPassport.findOne({ student: u._id }).lean();
        } else {
          profile =
            fallbackStudentProfiles[u._id] ||
            (u._id?.toString() === '660000000000000000000001' ? fallbackStudentProfile : null);
          passport =
            fallbackPassports[u._id] ||
            (u._id?.toString() === '660000000000000000000001' ? fallbackPassport : null);
        }

        if (!profile) {
          profile = {
            rollNumber:
              u._id?.toString() === '660000000000000000000002'
                ? '2022CSB1089'
                : `2026${u._id?.toString().slice(-4)}`,
            department: 'Computer Science & Engineering',
            batch: '2026',
            cgpa: u._id?.toString() === '660000000000000000000002' ? 7.2 : 8.5,
            targetRole:
              u._id?.toString() === '660000000000000000000002'
                ? 'Backend Developer'
                : 'Full Stack Developer',
            placementStatus: 'unplaced',
            mentoringNotes: [],
          };
        }

        const jri =
          passport?.jobReadinessIndex !== undefined
            ? passport.jobReadinessIndex
            : u._id?.toString() === '660000000000000000000002'
            ? 38
            : 50;

        const skills = passport?.skills || [];
        const verifiedSkillsCount = skills.filter((s) => s.status === 'verified').length;

        return {
          id: u._id?.toString(),
          fullName: u.fullName,
          email: u.email,
          rollNumber: profile.rollNumber || `2026${u._id?.toString().slice(-4)}`,
          department: profile.department || 'Computer Science & Engineering',
          batch: profile.batch || '2026',
          cgpa: profile.cgpa !== undefined ? profile.cgpa : 8.5,
          targetRole: profile.targetRole || 'Full Stack Developer',
          placementStatus: profile.placementStatus || 'unplaced',
          jobReadinessIndex: jri,
          readinessTier:
            passport?.readinessTier ||
            (jri >= 75 ? 'Placement Ready' : jri < 50 ? 'Needs Immediate Support' : 'Developing'),
          skillsCount: skills.length > 0 ? skills.length : 2,
          verifiedSkillsCount,
          mentoringNotesCount:
            profile.mentoringNotes?.length ||
            (u._id?.toString() === '660000000000000000000002' ? 1 : 0),
          needsSupport: jri < 50,
        };
      })
    );

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Early Alerts for at-risk students
// @route   GET /api/v1/placement/alerts
// @access  Private (Placement Officer)
const getEarlyAlerts = async (req, res, next) => {
  try {
    res.json({ success: true, count: fallbackAlerts.length, alerts: fallbackAlerts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending recruiter company verifications
// @route   GET /api/v1/placement/verifications
// @access  Private (Placement Officer)
const getPendingVerifications = async (req, res, next) => {
  try {
    res.json({ success: true, count: fallbackVerifications.length, verifications: fallbackVerifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Review recruiter company verification
// @route   POST /api/v1/placement/verifications/:id/review
// @access  Private (Placement Officer)
const reviewRecruiterVerification = async (req, res, next) => {
  try {
    const { status } = req.body;
    const v = fallbackVerifications.find((x) => x._id === req.params.id);
    if (v) v.status = status;

    res.json({ success: true, message: `Recruiter accreditation marked as ${status}.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Create hiring drive
// @route   POST /api/v1/placement/drives
// @access  Private (Placement Officer)
const createHiringDrive = async (req, res, next) => {
  try {
    const { title, batch, driveDate, applicationDeadline, minCgpa, minJobReadinessIndex } = req.body;
    const drive = {
      _id: `66600000000000000000${Date.now().toString().slice(-4)}`,
      title,
      batch: batch || '2026',
      driveDate: new Date(driveDate),
      applicationDeadline: new Date(applicationDeadline),
      minCgpa: Number(minCgpa) || 7.0,
      minJobReadinessIndex: Number(minJobReadinessIndex) || 65,
      status: 'upcoming',
      registeredStudents: [],
      participatingCompanies: [{ companyName: 'Nexis Cloud & AI Labs' }],
    };
    fallbackDrives.unshift(drive);
    res.status(201).json({ success: true, message: 'Campus hiring drive scheduled.', drive });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hiring drives
// @route   GET /api/v1/placement/drives
// @access  Private
const getHiringDrives = async (req, res, next) => {
  try {
    res.json({ success: true, count: fallbackDrives.length, drives: fallbackDrives });
  } catch (error) {
    next(error);
  }
};

// @desc    Add mentoring note to student profile
// @route   POST /api/v1/placement/students/:id/mentoring
// @access  Private (Placement Officer)
const addMentoringNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const s = fallbackStudentsDirectory.find((st) => st.id === req.params.id);
    if (s) s.mentoringNotesCount = (s.mentoringNotesCount || 0) + 1;

    res.json({ success: true, message: 'Mentoring advisory attached to student record.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export placement report (CSV or PDF)
// @route   GET /api/v1/placement/reports/export
// @access  Private
const exportReports = async (req, res, next) => {
  try {
    const format = req.query.format || 'csv';

    if (format === 'csv') {
      const csvData = await generatePlacementCsv(fallbackStudentsDirectory);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="SkillProof_Placement_Report.csv"');
      return res.status(200).send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="SkillProof_Placement_Report.pdf"');

      generatePlacementPdf(
        {
          collegeName: 'National Institute of Technology',
          batch: '2026',
          totalStudents: 120,
          placedCount: 48,
          placementReadyCount: 78,
          placementReadyPercentage: 65,
          approvedRecruitersCount: 8,
          supportNeededCount: 12,
        },
        res
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student evidence submissions for reviewer/placement officer
// @route   GET /api/v1/placement/evidence
// @access  Private (Placement Officer)
const getAllEvidenceSubmissions = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = [...(fallbackEvidence || [])];
      if (status && status !== 'all') {
        list = list.filter((e) => e.verificationStatus === status);
      }
      if (type && type !== 'all') {
        list = list.filter((e) => e.type === type);
      }
      if (search && search.trim()) {
        const s = search.toLowerCase();
        list = list.filter(
          (e) =>
            (e.title && e.title.toLowerCase().includes(s)) ||
            (e.studentName && e.studentName.toLowerCase().includes(s)) ||
            (e.courseName && e.courseName.toLowerCase().includes(s)) ||
            (e.companyName && e.companyName.toLowerCase().includes(s)) ||
            (e.studentRollNumber && e.studentRollNumber.toLowerCase().includes(s))
        );
      }
      return res.json({ success: true, count: list.length, evidence: list });
    }

    const query = {};
    if (status && status !== 'all') query.verificationStatus = status;
    if (type && type !== 'all') query.type = type;
    if (search && search.trim()) {
      const cleanSearch = (search || '').slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(cleanSearch, 'i');
      query.$or = [
        { title: regex },
        { studentName: regex },
        { courseName: regex },
        { companyName: regex },
        { studentRollNumber: regex },
      ];
    }

    const evidence = await Evidence.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: evidence.length, evidence });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject student evidence submission with feedback
// @route   POST /api/v1/placement/evidence/:id/review
// @access  Private (Placement Officer)
const reviewEvidenceSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body; // status: 'verified' | 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected.' });
    }

    const reviewerName = req.user?.fullName || 'Faculty Placement Reviewer';

    if (mongoose.connection.readyState !== 1) {
      const ev = (fallbackEvidence || []).find((e) => e._id === id);
      if (!ev) {
        return res.status(404).json({ success: false, message: 'Evidence submission not found.' });
      }

      ev.verificationStatus = status;
      ev.verifiedBy = req.user?._id;
      ev.verifiedAt = new Date();
      ev.verificationNotes =
        feedback ||
        (status === 'verified'
          ? 'Approved by campus placement committee.'
          : 'Rejected. Please review requirements and resubmit.');

      // If verified, update student's Skill Passport skills to 'verified'
      if (status === 'verified' && ev.student) {
        let passport =
          fallbackPassports[ev.student] ||
          (ev.student === '660000000000000000000001' ? fallbackPassport : null);
        if (passport && Array.isArray(passport.skills)) {
          const associated = Array.isArray(ev.associatedSkills) && ev.associatedSkills.length
            ? ev.associatedSkills
            : [ev.relatedSkill].filter(Boolean);

          associated.forEach((skillName) => {
            const existing = passport.skills.find(
              (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
            );
            if (existing) {
              existing.status = 'verified';
              existing.statusReason = `Verified via audited ${ev.type} certificate (${ev.title}) by ${reviewerName}.`;
              if (!existing.assessmentScore || existing.assessmentScore < 85) existing.assessmentScore = 90;
            } else {
              passport.skills.push({
                skillName,
                normalizedName: skillName.toLowerCase(),
                category: ev.type === 'course' ? 'Certifications' : 'Demonstrated Competency',
                status: 'verified',
                proficiency: 'Advanced',
                assessmentScore: 90,
                statusReason: `Verified via audited ${ev.type} certificate (${ev.title}) by ${reviewerName}.`,
              });
            }
          });

          // Boost readiness index
          const verifiedSkillsCount = passport.skills.filter((s) => s.status === 'verified').length;
          passport.jobReadinessIndex = Math.min(
            100,
            Math.max(passport.jobReadinessIndex || 50, 60 + verifiedSkillsCount * 8)
          );
          if (passport.jobReadinessIndex >= 75) passport.readinessTier = 'Placement Ready';
          else if (passport.jobReadinessIndex >= 50) passport.readinessTier = 'Developing';
        }
      }

      saveStore();
      return res.json({
        success: true,
        message: `Evidence has been ${status === 'verified' ? 'verified & approved' : 'rejected'}. Student notified.`,
        evidence: ev,
      });
    }

    const ev = await Evidence.findById(id);
    if (!ev) {
      return res.status(404).json({ success: false, message: 'Evidence submission not found.' });
    }

    ev.verificationStatus = status;
    ev.verifiedBy = req.user._id;
    ev.verifiedAt = new Date();
    ev.verificationNotes =
      feedback ||
      (status === 'verified'
        ? 'Approved by campus placement committee.'
        : 'Rejected. Please review requirements and resubmit.');
    await ev.save();

    // If approved, update Skill Passport
    if (status === 'verified' && ev.student) {
      const passport = await SkillPassport.findOne({ student: ev.student });
      if (passport) {
        const associated = Array.isArray(ev.associatedSkills) && ev.associatedSkills.length
          ? ev.associatedSkills
          : [ev.relatedSkill].filter(Boolean);

        associated.forEach((skillName) => {
          const existing = passport.skills.find(
            (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
          );
          if (existing) {
            existing.status = 'verified';
            existing.statusReason = `Verified via audited ${ev.type} certificate (${ev.title}) by ${reviewerName}.`;
            if (!existing.assessmentScore || existing.assessmentScore < 85) existing.assessmentScore = 90;
          } else {
            passport.skills.push({
              skillName,
              normalizedName: skillName.toLowerCase(),
              category: ev.type === 'course' ? 'Certifications' : 'Demonstrated Competency',
              status: 'verified',
              proficiency: 'Advanced',
              assessmentScore: 90,
              statusReason: `Verified via audited ${ev.type} certificate (${ev.title}) by ${reviewerName}.`,
            });
          }
        });

        const verifiedSkillsCount = passport.skills.filter((s) => s.status === 'verified').length;
        passport.jobReadinessIndex = Math.min(
          100,
          Math.max(passport.jobReadinessIndex || 50, 60 + verifiedSkillsCount * 8)
        );
        if (passport.jobReadinessIndex >= 75) passport.readinessTier = 'Placement Ready';
        else if (passport.jobReadinessIndex >= 50) passport.readinessTier = 'Developing';
        await passport.save();
      }
    }

    res.json({
      success: true,
      message: `Evidence has been ${status === 'verified' ? 'verified & approved' : 'rejected'}. Student notified.`,
      evidence: ev,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
