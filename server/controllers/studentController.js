const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const SkillPassport = require('../models/SkillPassport');
const Evidence = require('../models/Evidence');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateJobReadinessIndex, calculateJobMatch } = require('../services/matching/hybridMatcher');
const { normalizeSkill } = require('../services/matching/skillNormalizer');
const { generateCareerRoadmap, evaluateInterviewAnswer } = require('../services/ai/llmService');
const {
  fallbackPassport,
  fallbackPassports,
  fallbackEvidence,
  fallbackStudentProfile,
  fallbackStudentProfiles,
  fallbackJobs,
  fallbackSkills,
  fallbackUsers,
  saveStore,
} = require('../services/fallbackStore');

// @desc    Get current student's full profile
// @route   GET /api/v1/students/me
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const profile = fallbackStudentProfiles[req.user._id] || fallbackStudentProfile;
      const user = (fallbackUsers || []).find((u) => u._id === req.user._id) || req.user;
      return res.json({
        success: true,
        profile: {
          ...profile,
          avatar: profile?.avatar || user?.avatar || '',
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user?.avatar || profile?.avatar || '',
            role: user.role,
          },
        },
      });
    }
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'fullName email avatar');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/v1/students/me
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const {
      rollNumber,
      collegeName,
      degree,
      department,
      batch,
      yearOfPassing,
      cgpa,
      dob,
      city,
      pincode,
      address,
      avatar,
      phone,
      bio,
      targetRole,
      links,
      fullName,
    } = req.body;

    const finalBatch = yearOfPassing !== undefined ? yearOfPassing : batch;

    if (mongoose.connection.readyState !== 1) {
      if (!fallbackStudentProfiles[req.user._id]) {
        fallbackStudentProfiles[req.user._id] = {
          _id: `66100000000000000000${req.user._id.toString().slice(-4)}`,
          user: req.user._id,
          rollNumber: '',
          collegeName: 'National Institute of Technology',
          degree: 'B.Tech',
          department: 'Computer Science & Engineering',
          batch: '2026',
          cgpa: '8.5',
          dob: '',
          city: '',
          pincode: '',
          address: '',
          avatar: '',
          phone: '',
          bio: '',
          targetRole: 'Full Stack Developer',
          links: { github: '', linkedin: '', portfolio: '' },
          profileCompletion: 85,
          placementStatus: 'unplaced',
          mentoringNotes: [],
        };
      }

      const profile = fallbackStudentProfiles[req.user._id];
      Object.assign(profile, {
        rollNumber: rollNumber !== undefined ? rollNumber : profile.rollNumber,
        collegeName: collegeName !== undefined ? collegeName : profile.collegeName,
        degree: degree !== undefined ? degree : (profile.degree || 'B.Tech'),
        department: department !== undefined ? department : profile.department,
        batch: finalBatch !== undefined ? finalBatch : profile.batch,
        cgpa: cgpa !== undefined ? cgpa : profile.cgpa,
        dob: dob !== undefined ? dob : (profile.dob || ''),
        city: city !== undefined ? city : (profile.city || ''),
        pincode: pincode !== undefined ? pincode : (profile.pincode || ''),
        address: address !== undefined ? address : (profile.address || ''),
        avatar: avatar !== undefined ? avatar : (profile.avatar || ''),
        phone: phone !== undefined ? phone : profile.phone,
        bio: bio !== undefined ? bio : profile.bio,
        targetRole: targetRole !== undefined ? targetRole : profile.targetRole,
        links: links ? { ...profile.links, ...links } : profile.links,
      });

      const userIdx = (fallbackUsers || []).findIndex((u) => u._id === req.user._id);
      if (userIdx !== -1) {
        if (avatar !== undefined) fallbackUsers[userIdx].avatar = avatar;
        if (fullName !== undefined && fullName.trim()) fallbackUsers[userIdx].fullName = fullName;
      }
      if (avatar !== undefined) req.user.avatar = avatar;
      if (fullName !== undefined && fullName.trim()) req.user.fullName = fullName;

      saveStore();
      return res.json({
        success: true,
        profile,
        user: req.user,
        message: 'Profile settings updated successfully.',
      });
    }

    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user._id });
    }

    if (rollNumber !== undefined) profile.rollNumber = rollNumber;
    if (collegeName !== undefined) profile.collegeName = collegeName;
    if (degree !== undefined) profile.degree = degree;
    if (department !== undefined) profile.department = department;
    if (finalBatch !== undefined) profile.batch = finalBatch;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (dob !== undefined) profile.dob = dob;
    if (city !== undefined) profile.city = city;
    if (pincode !== undefined) profile.pincode = pincode;
    if (address !== undefined) profile.address = address;
    if (avatar !== undefined) profile.avatar = avatar;
    if (phone !== undefined) profile.phone = phone;
    if (bio !== undefined) profile.bio = bio;
    if (targetRole !== undefined) profile.targetRole = targetRole;
    if (links) {
      profile.links = { ...profile.links, ...links };
    }

    await profile.save();

    const userUpdates = {};
    if (avatar !== undefined) userUpdates.avatar = avatar;
    if (fullName !== undefined && fullName.trim()) userUpdates.fullName = fullName;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    res.json({ success: true, profile, message: 'Profile settings updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's Skill Passport
// @route   GET /api/v1/students/me/passport
// @access  Private (Student)
const getSkillPassport = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let passport = fallbackPassports[req.user._id];
      if (!passport) {
        // If demo user Aarav Mehta, provide defaultPassport
        if (req.user._id === '660000000000000000000001') {
          passport = fallbackPassport;
        } else {
          passport = {
            _id: `66200000000000000000${Date.now().toString().slice(-4)}`,
            student: req.user._id,
            skills: [
              {
                skillName: 'JavaScript',
                normalizedName: 'javascript',
                category: 'Languages',
                status: 'claimed',
                proficiency: 'Intermediate',
                statusReason: 'Claimed competency awaiting standardized assessment verification.',
              },
              {
                skillName: 'React',
                normalizedName: 'react',
                category: 'Frontend',
                status: 'claimed',
                proficiency: 'Intermediate',
                statusReason: 'Claimed competency awaiting standardized assessment verification.',
              },
            ],
            jobReadinessIndex: 45,
            readinessTier: 'Developing',
            readinessBreakdown: {
              assessedScore: 0,
              demonstratedScore: 15,
              verifiedScore: 10,
              profileCompletenessScore: 20,
            },
            actionableSuggestions: [
              {
                text: 'Take a proctored technical assessment to upgrade your Skill Passport to Assessed tier.',
                actionType: 'assessment',
                targetSkill: 'Full Stack Web Engineering',
              },
            ],
          };
          fallbackPassports[req.user._id] = passport;
          saveStore();
        }
      }
      const evList = (fallbackEvidence || []).filter((e) => e.student === req.user._id);
      return res.json({
        success: true,
        passport,
        evidenceCount: evList.length,
        verifiedCount: evList.filter((e) => e.verificationStatus === 'verified').length,
      });
    }

    let passport = await SkillPassport.findOne({ student: req.user._id }).populate({
      path: 'skills.evidenceRefs',
      model: 'Evidence',
    });

    const evidenceList = await Evidence.find({ student: req.user._id });
    const profile = await StudentProfile.findOne({ user: req.user._id });

    if (!passport) {
      passport = await SkillPassport.create({
        student: req.user._id,
        skills: [],
      });
    }

    res.json({
      success: true,
      passport,
      evidenceCount: evidenceList.length,
      verifiedCount: evidenceList.filter((e) => e.verificationStatus === 'verified').length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a claimed skill to passport
// @route   POST /api/v1/students/me/skills
// @access  Private (Student)
const claimSkill = async (req, res, next) => {
  try {
    const { skillName, category, proficiency } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const passport = fallbackPassports[req.user._id] || fallbackPassport;
      passport.skills.push({
        skillName,
        normalizedName: skillName.toLowerCase(),
        category: category || 'Core Fundamentals',
        proficiency: proficiency || 'Intermediate',
        status: 'claimed',
        statusReason: 'Claimed by student. Pending assessment or verified project evidence.',
      });
      saveStore();
      return res.status(201).json({ success: true, passport });
    }

    let passport = await SkillPassport.findOne({ student: req.user._id });
    if (!passport) {
      passport = await SkillPassport.create({ student: req.user._id, skills: [] });
    }

    const norm = normalizeSkill(skillName);
    passport.skills.push({
      skillName,
      normalizedName: norm.toLowerCase(),
      category: category || 'Core Fundamentals',
      proficiency: proficiency || 'Intermediate',
      status: 'claimed',
      statusReason: 'Claimed by student. Pending assessment or verified project evidence.',
    });

    await passport.save();
    res.status(201).json({ success: true, passport });
  } catch (error) {
    next(error);
  }
};

// @desc    Add student evidence (Course certificate, internship certificate, project evidence)
// @route   POST /api/v1/students/me/evidence
// @access  Private (Student)
const addEvidence = async (req, res, next) => {
  try {
    const {
      type,
      title,
      description,
      associatedSkills,
      externalUrl,
      issueDate,
      issuingOrganization,
      courseName,
      courseProvider,
      relatedSkill,
      certificateId,
      companyName,
      internshipRole,
      internshipDomain,
      startDate,
      endDate,
      skillsGained,
    } = req.body;

    let fileUrl = '';
    let fileName = '';
    let fileSize = 0;
    let fileMimeType = '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
      fileMimeType = req.file.mimetype;
    }

    const parseList = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim()) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [];
    };

    const parsedSkills = parseList(associatedSkills);
    const parsedSkillsGained = parseList(skillsGained);

    // Dynamic clean title
    let finalTitle = title;
    if (!finalTitle || !finalTitle.trim()) {
      if (type === 'course' && courseName) {
        finalTitle = `${courseName} - ${courseProvider || 'Course Certificate'}`;
      } else if (type === 'internship' && companyName) {
        finalTitle = `${internshipRole || 'Intern'} at ${companyName}`;
      } else {
        finalTitle = `${(type || 'Skill').toUpperCase()} Evidence Submission`;
      }
    }

    const studentUser = req.user || {};
    let studentRoll = '';
    let studentDept = '';

    if (mongoose.connection.readyState === 1) {
      const sp = await StudentProfile.findOne({ user: studentUser._id });
      if (sp) {
        studentRoll = sp.rollNumber || '';
        studentDept = sp.department || '';
      }
    } else {
      const sp = fallbackStudentProfiles[studentUser._id] || (studentUser._id === '660000000000000000000001' ? fallbackStudentProfile : null);
      if (sp) {
        studentRoll = sp.rollNumber || '';
        studentDept = sp.department || '';
      }
    }

    const evidenceData = {
      student: studentUser._id,
      type: type || 'course',
      title: finalTitle.trim(),
      description: description || '',
      associatedSkills: parsedSkills.length ? parsedSkills : relatedSkill ? [relatedSkill] : [],
      courseName: courseName || '',
      courseProvider: courseProvider || '',
      relatedSkill: relatedSkill || '',
      certificateId: certificateId || '',
      companyName: companyName || '',
      internshipRole: internshipRole || '',
      internshipDomain: internshipDomain || '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      skillsGained: parsedSkillsGained,
      fileUrl,
      fileName,
      fileSize,
      fileMimeType,
      externalUrl: externalUrl || '',
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      issuingOrganization: issuingOrganization || courseProvider || companyName || 'SkillProof AI',
      verificationStatus: 'pending',
      verificationNotes: 'Evidence submitted by student. Awaiting placement reviewer audit.',
      studentName: studentUser.fullName || 'Student',
      studentEmail: studentUser.email || '',
      studentRollNumber: studentRoll,
      studentDepartment: studentDept,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState !== 1) {
      const newEv = {
        _id: `66300000000000000000${Date.now().toString().slice(-4)}`,
        ...evidenceData,
      };
      fallbackEvidence.unshift(newEv);
      saveStore();
      return res.status(201).json({
        success: true,
        evidence: newEv,
        message: 'Evidence submitted successfully! Pending verification by placement reviewer.',
      });
    }

    const evidence = await Evidence.create(evidenceData);
    res.status(201).json({
      success: true,
      evidence,
      message: 'Evidence submitted successfully! Pending verification by placement reviewer.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / resubmit rejected evidence
// @route   PUT /api/v1/students/me/evidence/:id
// @access  Private (Student)
const updateEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.fileUrl = `/uploads/${req.file.filename}`;
      updates.fileName = req.file.originalname;
      updates.fileSize = req.file.size;
      updates.fileMimeType = req.file.mimetype;
    }

    if (updates.associatedSkills && typeof updates.associatedSkills === 'string') {
      updates.associatedSkills = updates.associatedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (updates.skillsGained && typeof updates.skillsGained === 'string') {
      updates.skillsGained = updates.skillsGained.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Reset status to pending upon student resubmission
    updates.verificationStatus = 'pending';
    updates.verificationNotes = 'Resubmitted with updated certificate. Pending re-evaluation.';

    if (mongoose.connection.readyState !== 1) {
      const ev = (fallbackEvidence || []).find((e) => e._id === id && e.student?.toString() === req.user._id?.toString());
      if (!ev) {
        return res.status(404).json({ success: false, message: 'Evidence record not found or access denied.' });
      }
      Object.assign(ev, updates, { updatedAt: new Date() });
      saveStore();
      return res.json({ success: true, evidence: ev, message: 'Evidence updated and resubmitted for verification.' });
    }

    const evidence = await Evidence.findOneAndUpdate(
      { _id: id, student: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence record not found or access denied.' });
    }

    res.json({ success: true, evidence, message: 'Evidence updated and resubmitted for verification.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student evidence
// @route   DELETE /api/v1/students/me/evidence/:id
// @access  Private (Student)
const deleteEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = (fallbackEvidence || []).findIndex((e) => e._id === id && e.student?.toString() === req.user._id?.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Evidence record not found or access denied.' });
      }
      fallbackEvidence.splice(idx, 1);
      saveStore();
      return res.json({ success: true, message: 'Evidence removed successfully.' });
    }

    const evidence = await Evidence.findOneAndDelete({ _id: id, student: req.user._id });
    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence record not found or access denied.' });
    }

    res.json({ success: true, message: 'Evidence removed successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's submitted evidence list
// @route   GET /api/v1/students/me/evidence
// @access  Private (Student)
const getEvidenceList = async (req, res, next) => {
  try {
    const { type, status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = (fallbackEvidence || []).filter((e) => e.student?.toString() === req.user._id?.toString());
      if (type && type !== 'all') list = list.filter((e) => e.type === type);
      if (status && status !== 'all') list = list.filter((e) => e.verificationStatus === status);

      return res.json({ success: true, count: list.length, evidence: list });
    }

    const query = { student: req.user._id };
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.verificationStatus = status;

    const evidence = await Evidence.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: evidence.length, evidence });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized career roadmap
// @route   GET /api/v1/students/me/roadmap
// @access  Private (Student)
const getRoadmap = async (req, res, next) => {
  try {
    const targetRole = req.query.role || 'Full Stack Developer';
    const currentSkills = ['React', 'Node.js', 'MongoDB', 'JavaScript'];
    const roadmap = await generateCareerRoadmap(currentSkills, targetRole);
    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill gap analysis against target role
// @route   GET /api/v1/students/me/skill-gaps
// @access  Private (Student)
const getSkillGaps = async (req, res, next) => {
  try {
    const targetRole = req.query.role || 'Full Stack Developer';
    const benchmarkSkills = ['React', 'Node.js', 'Express.js', 'MongoDB', 'Data Structures & Algorithms', 'Git', 'REST API', 'Docker'];

    const demonstrated = [
      { skillName: 'React', status: 'verified', score: 100 },
      { skillName: 'Node.js', status: 'verified', score: 100 },
      { skillName: 'Data Structures & Algorithms', status: 'assessed', score: 90 },
      { skillName: 'MongoDB', status: 'demonstrated', score: 85 },
    ];
    const partial = [
      { skillName: 'Express.js', status: 'claimed', reason: 'Claimed only, project repo pending faculty audit.' },
    ];
    const missing = [
      { skillName: 'Docker', priority: 'High', action: 'Take Cloud & DevOps assessment' },
    ];

    res.json({
      success: true,
      targetRole,
      coveragePercentage: 78,
      demonstrated,
      partial,
      missing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended jobs sorted by match score
// @route   GET /api/v1/students/me/job-matches
// @access  Private (Student)
const getJobMatches = async (req, res, next) => {
  try {
    const jobs = mongoose.connection.readyState === 1 ? await Job.find({ status: 'active' }) : fallbackJobs;

    const activePassport = fallbackPassports[req.user._id] || fallbackPassport;
    const activeProfile = fallbackStudentProfiles[req.user._id] || fallbackStudentProfile;

    let studentSkills = activePassport?.skills || fallbackSkills || [];
    if (mongoose.connection.readyState === 1) {
      const passport = await SkillPassport.findOne({ student: req.user._id });
      if (passport && passport.skills) {
        studentSkills = passport.skills;
      }
    }

    const rankedJobs = jobs.map((job) => {
      const matchResult = calculateJobMatch(studentSkills, job, activeProfile);
      return {
        job,
        matchScore: matchResult.matchScore,
        matchBreakdown: matchResult,
      };
    });

    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, count: rankedJobs.length, matches: rankedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications submitted by student
// @route   GET /api/v1/students/me/applications
// @access  Private (Student)
const getApplications = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 1,
        applications: [
          {
            _id: '667000000000000000000001',
            job: fallbackJobs[0],
            recruiter: { fullName: 'Elena Rostova', email: 'elena@nexiscloud.io' },
            matchScore: 92,
            matchBreakdown: {
              explanation: 'Exceptional match! Candidate covers all 4 required skills with verified and assessed evidence.',
            },
            status: 'shortlisted',
            interviewSchedule: {
              scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              mode: 'Google Meet',
              meetingLink: 'https://meet.google.com/xyz-demo-skillproof',
              roundName: 'Technical Architecture & Code Evaluation',
            },
            recruiterFeedback: 'Strong candidate with verified evidence portfolio. Shortlisted for Round 1.',
          },
        ],
      });
    }

    const applications = await Application.find({ student: req.user._id })
      .populate('job')
      .populate('recruiter', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit mock interview answer for instant AI feedback
// @route   POST /api/v1/students/me/interview-practice
// @access  Private (Student)
const practiceInterview = async (req, res, next) => {
  try {
    const { question, role, studentAnswer } = req.body;
    const evaluation = await evaluateInterviewAnswer({
      question,
      role: role || 'Full Stack Engineer',
      studentAnswer,
    });
    res.json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getSkillPassport,
  claimSkill,
  addEvidence,
  updateEvidence,
  deleteEvidence,
  getEvidenceList,
  getRoadmap,
  getSkillGaps,
  getJobMatches,
  getApplications,
  practiceInterview,
};
