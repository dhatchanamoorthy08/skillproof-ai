const path = require('path');
const mongoose = require('mongoose');
const StudentProfile = require('../models/StudentProfile');
const SkillPassport = require('../models/SkillPassport');
const { extractResumeData } = require('../services/resume/pdfExtractor');
const { normalizeSkill } = require('../services/matching/skillNormalizer');
const {
  fallbackStudentProfile,
  fallbackStudentProfiles,
  fallbackPassport,
  fallbackPassports,
  saveStore,
} = require('../services/fallbackStore');

// @desc    Upload resume PDF and run ATS analysis
// @route   POST /api/v1/resumes/upload
// @access  Private (Student)
const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid PDF resume file.' });
    }

    const filePath = req.file.path;
    const resumeUrl = `/uploads/${req.file.filename}`;

    // Extract text, skills, and sections
    const extractedData = await extractResumeData(filePath);

    // Save extracted info to student profile (in-memory fallback or MongoDB)
    if (mongoose.connection.readyState !== 1) {
      const profile = fallbackStudentProfiles[req.user._id] || fallbackStudentProfile;
      if (profile) {
        profile.resumeUrl = resumeUrl;
        profile.resumeParsedData = {
          extractedSkills: extractedData.extractedSkills,
          extractedProjects: extractedData.extractedProjects,
          extractedEducation: extractedData.extractedEducation,
          completenessScore: extractedData.completenessScore,
          atsFeedback: extractedData.atsFeedback,
          parsedAt: new Date(),
        };
        saveStore();
      }
    } else {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        profile.resumeUrl = resumeUrl;
        profile.resumeParsedData = {
          extractedSkills: extractedData.extractedSkills,
          extractedProjects: extractedData.extractedProjects,
          extractedEducation: extractedData.extractedEducation,
          completenessScore: extractedData.completenessScore,
          atsFeedback: extractedData.atsFeedback,
          parsedAt: new Date(),
        };
        await profile.save();
      }
    }

    res.json({
      success: true,
      message: 'Resume parsed and analyzed successfully.',
      resumeUrl,
      analysis: extractedData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync extracted resume skills to student Skill Passport
// @route   POST /api/v1/resumes/sync-skills
// @access  Private (Student)
const syncSkillsToPassport = async (req, res, next) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills array is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const passport = fallbackPassports[req.user._id] || fallbackPassport;
      let newlyAddedCount = 0;
      skills.forEach((skillName) => {
        const norm = normalizeSkill(skillName).toLowerCase();
        const exists = passport.skills.some((s) => s.normalizedName === norm);

        if (!exists) {
          passport.skills.push({
            skillName,
            normalizedName: norm,
            category: 'Core Fundamentals',
            status: 'claimed',
            proficiency: 'Intermediate',
            statusReason: 'Extracted from uploaded resume PDF. Verified via document parser.',
          });
          newlyAddedCount++;
        }
      });

      saveStore();

      return res.json({
        success: true,
        message: `Successfully synchronized ${newlyAddedCount} new skills to your Skill Passport.`,
        passport,
      });
    }

    let passport = await SkillPassport.findOne({ student: req.user._id });
    if (!passport) {
      passport = await SkillPassport.create({ student: req.user._id, skills: [] });
    }

    let newlyAddedCount = 0;
    skills.forEach((skillName) => {
      const norm = normalizeSkill(skillName).toLowerCase();
      const exists = passport.skills.some((s) => s.normalizedName === norm);

      if (!exists) {
        passport.skills.push({
          skillName,
          normalizedName: norm,
          category: 'Core Fundamentals',
          status: 'claimed',
          proficiency: 'Intermediate',
          statusReason: 'Extracted from uploaded resume PDF. Verified via document parser.',
        });
        newlyAddedCount++;
      }
    });

    await passport.save();

    res.json({
      success: true,
      message: `Successfully synchronized ${newlyAddedCount} new skills to your Skill Passport.`,
      passport,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  syncSkillsToPassport,
};
