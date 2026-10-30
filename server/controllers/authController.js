const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const PlacementOfficerProfile = require('../models/PlacementOfficerProfile');
const SkillPassport = require('../models/SkillPassport');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');
const {
  fallbackUsers,
  fallbackStudentProfiles,
  fallbackRecruiterProfiles,
  fallbackPlacementProfiles,
  fallbackPassports,
  fallbackStudentProfile,
  fallbackRecruiterProfile,
  fallbackPlacementProfile,
  saveStore,
} = require('../services/fallbackStore');
const {
  generateAndSendOtp,
  verifyOtp,
  validateVerificationStatus,
  consumeVerifiedEmail,
} = require('../services/emailService');
const { isDashboardRestricted, RESTRICTION_MESSAGE } = require('../config/restriction');
const { logSecurityEvent } = require('../services/auditService');

// Generate JWT token helper
const generateToken = (id, email, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server.');
  }
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Send verification OTP to email
// @route   POST /api/v1/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let existingUser = null;
    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({ email: normalizedEmail });
    } else {
      existingUser = (fallbackUsers || []).find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    const result = await generateAndSendOtp(normalizedEmail);
    res.json({
      success: true,
      message: 'A 6-digit verification code has been dispatched to your email.',
      expiresInSeconds: 60,
      cooldownSeconds: 30,
      emailDispatched: result.emailDispatched,
    });
  } catch (error) {
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        cooldownRemaining: error.cooldownRemaining,
      });
    }
    next(error);
  }
};

// @desc    Verify OTP for email
// @route   POST /api/v1/auth/verify-otp
// @access  Public
const confirmOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and 6-digit OTP code.',
      });
    }

    const result = await verifyOtp(email, otp);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.message,
        remainingAttempts: result.remainingAttempts,
      });
    }

    res.json({
      success: true,
      message: 'Email verified successfully.',
      verificationToken: result.verificationToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      fullName,
      role,
      companyName,
      collegeName,
      department,
      batch,
      targetRole,
      dob,
      yearOfPassing,
      degree,
      cgpa,
      city,
      pincode,
      address,
      country,
      state,
      district,
      avatar,
      rollNumber,
      // Recruiter fields
      website,
      officialEmail,
      registrationNumber,
      industry,
      companySize,
      designation,
      phone,
      hiringDomains,
      // Placement Officer fields
      collegeCode,
      institutionType,
      employeeId,
      otp,
      verificationToken,
    } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, full name, and select a role.',
      });
    }

    // Role Escalation Defense: Placement Officer & Admin accounts cannot be self-registered
    if (role === 'placement_officer' || role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Placement Officer and Administrator accounts cannot be self-registered. They must be provisioned directly by campus administration.',
      });
    }

    if (role !== 'student' && role !== 'recruiter') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration role. Only Student and Recruiter accounts can be created.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long for account security.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check duplicate user
    if (mongoose.connection.readyState !== 1) {
      const existingUser = (fallbackUsers || []).find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
    } else {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
    }

    // Direct account registration - email verification process stopped per user request

    if (mongoose.connection.readyState !== 1) {
      // Hash user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = `66000000000000000000${Date.now().toString().slice(-4)}`;
      const newMockUser = {
        _id: userId,
        email: normalizedEmail,
        password: hashedPassword,
        fullName,
        role,
        avatar: avatar || '',
        isEmailVerified: true,
        status: 'active',
        createdAt: new Date(),
      };
      fallbackUsers.push(newMockUser);

      // Create role profile and default assets in persistent store
      if (role === 'student') {
        fallbackStudentProfiles[userId] = {
          _id: `66100000000000000000${Date.now().toString().slice(-4)}`,
          user: userId,
          rollNumber: rollNumber || `2026${Date.now().toString().slice(-4)}`,
          collegeName: collegeName || 'National Institute of Technology',
          degree: degree || 'B.Tech',
          department: department || 'Computer Science & Engineering',
          batch: yearOfPassing || batch || '2026',
          cgpa: cgpa || '8.5',
          dob: dob || '',
          country: country || 'India',
          state: state || '',
          district: district || '',
          city: city || '',
          pincode: pincode || '',
          address: address || '',
          avatar: avatar || '',
          phone: '',
          bio: `Aspiring ${targetRole || 'Full Stack Developer'}`,
          targetRole: targetRole || 'Full Stack Developer',
          links: { github: '', linkedin: '', portfolio: '' },
          profileCompletion: 80,
          placementStatus: 'unplaced',
          mentoringNotes: [],
        };

        fallbackPassports[userId] = {
          _id: `66200000000000000000${Date.now().toString().slice(-4)}`,
          student: userId,
          skills: [
            {
              skillName: 'JavaScript',
              normalizedName: 'javascript',
              category: 'Languages',
              status: 'claimed',
              proficiency: 'Intermediate',
              statusReason: 'Claimed during onboarding registration.',
            },
            {
              skillName: 'React',
              normalizedName: 'react',
              category: 'Frontend',
              status: 'claimed',
              proficiency: 'Intermediate',
              statusReason: 'Claimed during onboarding registration.',
            },
          ],
          jobReadinessIndex: 50,
          readinessTier: 'Developing',
          readinessBreakdown: {
            assessedScore: 15,
            demonstratedScore: 15,
            verifiedScore: 10,
            profileCompletenessScore: 10,
          },
          actionableSuggestions: [
            {
              text: 'Take your first technical assessment to upgrade your Skill Passport to Assessed tier.',
              actionType: 'assessment',
              targetSkill: 'Full Stack Web Engineering',
            },
          ],
        };
      } else if (role === 'recruiter') {
        fallbackRecruiterProfiles[userId] = {
          _id: `66100000000000000000${Date.now().toString().slice(-4)}`,
          user: userId,
          companyName: companyName || `${fullName}'s Organization`,
          officialEmail: officialEmail || email,
          website: website || '',
          registrationNumber: registrationNumber || '',
          industry: industry || 'Information Technology & Software Services',
          companySize: companySize || '51-200',
          designation: designation || 'Senior HR Manager',
          phone: phone || '',
          location: city ? `${city}, ${state ? state + ', ' : ''}India` : 'Bangalore, India',
          country: country || 'India',
          state: state || '',
          district: district || '',
          city: city || '',
          pincode: pincode || '',
          address: address || '',
          hiringDomains: hiringDomains || 'Full Stack & Cloud Systems',
          verificationStatus: 'pending',
          verificationStep: 1,
        };
      } else if (role === 'placement_officer') {
        fallbackPlacementProfiles[userId] = {
          _id: `66100000000000000000${Date.now().toString().slice(-4)}`,
          user: userId,
          collegeName: collegeName || 'National Institute of Technology',
          collegeCode: collegeCode || '',
          institutionType: institutionType || 'Autonomous Engineering Institute',
          designation: designation || 'Head of Training & Placement',
          department: department || 'Central Placement Office',
          employeeId: employeeId || '',
          phone: phone || '+91 98765 43210',
          website: website || '',
          officialEmail: officialEmail || email,
          country: country || 'India',
          state: state || '',
          district: district || '',
          city: city || '',
          pincode: pincode || '',
          address: address || '',
        };
      }

      saveStore();
      consumeVerifiedEmail(email);

      const token = generateToken(newMockUser._id, newMockUser.email, newMockUser.role);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newMockUser._id,
          email: newMockUser.email,
          fullName: newMockUser.fullName,
          role: newMockUser.role,
        },
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      fullName,
      role,
      avatar: avatar || '',
      isEmailVerified: true,
    });

    // Create role-specific profile
    if (role === 'student') {
      await StudentProfile.create({
        user: user._id,
        rollNumber: rollNumber || `2026${Date.now().toString().slice(-4)}`,
        collegeName: collegeName || 'National Institute of Technology',
        degree: degree || 'B.Tech',
        department: department || 'Computer Science & Engineering',
        batch: yearOfPassing || batch || '2026',
        cgpa: cgpa || '8.5',
        dob: dob || '',
        country: country || 'India',
        state: state || '',
        district: district || '',
        city: city || '',
        pincode: pincode || '',
        address: address || '',
        avatar: avatar || '',
        targetRole: targetRole || 'Full Stack Developer',
      });

      await SkillPassport.create({
        student: user._id,
        skills: [
          {
            skillName: 'JavaScript',
            normalizedName: 'javascript',
            category: 'Languages',
            status: 'claimed',
            proficiency: 'Intermediate',
            statusReason: 'Claimed during onboarding registration.',
          },
          {
            skillName: 'React',
            normalizedName: 'react',
            category: 'Frontend',
            status: 'claimed',
            proficiency: 'Intermediate',
            statusReason: 'Claimed during onboarding registration.',
          },
        ],
        jobReadinessIndex: 45,
        readinessTier: 'Developing',
      });
    } else if (role === 'recruiter') {
      await RecruiterProfile.create({
        user: user._id,
        companyName: companyName || `${fullName}'s Organization`,
        officialEmail: officialEmail || email,
        website: website || '',
        registrationNumber: registrationNumber || '',
        industry: industry || 'Information Technology & Software Services',
        companySize: companySize || '51-200',
        designation: designation || 'Senior HR Manager',
        phone: phone || '',
        location: city ? `${city}, ${state ? state + ', ' : ''}India` : 'Bangalore, India',
        country: country || 'India',
        state: state || '',
        district: district || '',
        city: city || '',
        pincode: pincode || '',
        address: address || '',
        hiringDomains: hiringDomains || 'Full Stack & Cloud Systems',
        verificationStatus: 'pending',
        verificationStep: 1,
      });
    } else if (role === 'placement_officer') {
      await PlacementOfficerProfile.create({
        user: user._id,
        collegeName: collegeName || 'National Institute of Technology',
        collegeCode: collegeCode || '',
        institutionType: institutionType || 'Autonomous Engineering Institute',
        designation: designation || 'Head of Training & Placement',
        department: department || 'Central Placement Office',
        employeeId: employeeId || '',
        phone: phone || '+91 98765 43210',
        website: website || '',
        officialEmail: officialEmail || email,
        country: country || 'India',
        state: state || '',
        district: district || '',
        city: city || '',
        pincode: pincode || '',
        address: address || '',
      });
    }

    consumeVerifiedEmail(email);
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Temporary restriction on Student, HR Recruiter, and Placement Officer dashboards
    if (isDashboardRestricted()) {
      return res.status(503).json({
        success: false,
        restricted: true,
        message: RESTRICTION_MESSAGE,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback login - find by normalized email, including placement/officer alias
      let matched = (fallbackUsers || []).find((u) => u.email.toLowerCase() === normalizedEmail);
      if (!matched && (normalizedEmail === 'placement@skillproof.ai' || normalizedEmail === 'officer@skillproof.ai')) {
        matched = (fallbackUsers || []).find(
          (u) => u.email.toLowerCase() === 'placement@skillproof.ai' || u.email.toLowerCase() === 'officer@skillproof.ai'
        );
      }

      if (!matched) {
        logSecurityEvent({
          userEmail: normalizedEmail,
          action: 'LOGIN_FAILED',
          resourceType: 'AUTH',
          details: { reason: 'User not found' },
          ipAddress: req.ip,
        });
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      let isMatch = false;
      const targetHash =
        matched.password && (matched.password.startsWith('$2a$') || matched.password.startsWith('$2b$'))
          ? matched.password
          : '$2a$10$szOfS8nvaTI1LtccbNIk0.BAxbEDGJ6pKRM5iO1nmk7ACvoJ9crPi';

      isMatch = await bcrypt.compare(password, targetHash);

      // Support legacy unhashed password if stored, and auto-upgrade to bcrypt hash
      if (!isMatch && matched.password === password) {
        isMatch = true;
        matched.password = await bcrypt.hash(password, 10);
        saveStore();
      } else if (isMatch && (!matched.password || !matched.password.startsWith('$2a$'))) {
        matched.password = targetHash;
        saveStore();
      }

      if (!isMatch) {
        logSecurityEvent({
          user: matched._id,
          userEmail: matched.email,
          userRole: matched.role,
          action: 'LOGIN_FAILED',
          resourceType: 'AUTH',
          details: { reason: 'Password mismatch' },
          ipAddress: req.ip,
        });
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      logSecurityEvent({
        user: matched._id,
        userEmail: matched.email,
        userRole: matched.role,
        action: 'LOGIN_SUCCESS',
        resourceType: 'AUTH',
        ipAddress: req.ip,
      });

      const token = generateToken(matched._id, matched.email, matched.role);
      return res.json({
        success: true,
        token,
        user: {
          id: matched._id,
          email: matched.email,
          fullName: matched.fullName,
          role: matched.role,
        },
      });
    }

    // MongoDB connection mode
    const searchConditions = [{ email: normalizedEmail }];
    if (normalizedEmail === 'placement@skillproof.ai') {
      searchConditions.push({ email: 'officer@skillproof.ai' });
    } else if (normalizedEmail === 'officer@skillproof.ai') {
      searchConditions.push({ email: 'placement@skillproof.ai' });
    }

    const user = await User.findOne({ $or: searchConditions }).select('+password');
    if (!user) {
      logSecurityEvent({
        userEmail: normalizedEmail,
        action: 'LOGIN_FAILED',
        resourceType: 'AUTH',
        details: { reason: 'User not found in DB' },
        ipAddress: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logSecurityEvent({
        user: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: 'LOGIN_FAILED',
        resourceType: 'AUTH',
        details: { reason: 'Password mismatch' },
        ipAddress: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    if (user.status === 'suspended') {
      logSecurityEvent({
        user: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: 'LOGIN_BLOCKED_SUSPENDED',
        resourceType: 'AUTH',
        ipAddress: req.ip,
      });
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    logSecurityEvent({
      user: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      resourceType: 'AUTH',
      ipAddress: req.ip,
    });

    const token = generateToken(user._id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & role profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = req.user;
      let profile = null;
      if (user.role === 'student') {
        profile = fallbackStudentProfiles[user._id] || fallbackStudentProfile;
      } else if (user.role === 'recruiter') {
        profile = fallbackRecruiterProfiles[user._id] || fallbackRecruiterProfile;
      } else if (user.role === 'placement_officer') {
        profile = fallbackPlacementProfiles[user._id] || fallbackPlacementProfile;
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar || profile?.avatar || '',
          status: user.status,
        },
        profile,
      });
    }

    const user = await User.findById(req.user.id || req.user._id);
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id });
    } else if (user.role === 'placement_officer') {
      profile = await PlacementOfficerProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-detect City, District, State from 6-digit Indian PIN code using India Post API
// @route   GET /api/v1/auth/pincode/:pincode
// @access  Public
const getPincodeDetails = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    const cleanPin = (pincode || '').trim();

    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Indian PIN code format. PIN code must be a 6-digit number starting with 1-9.',
      });
    }

    // Call reliable India Post PIN Code API
    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      headers: { 'User-Agent': 'SkillProof-AI-PIN-Detector/1.0' },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: 'Could not contact postal verification service. Please enter location manually.',
      });
    }

    const data = await response.json();
    if (
      !Array.isArray(data) ||
      data.length === 0 ||
      data[0].Status !== 'Success' ||
      !Array.isArray(data[0].PostOffice) ||
      data[0].PostOffice.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: `No location found for PIN code ${cleanPin}. Please verify the code or enter manually.`,
      });
    }

    const offices = data[0].PostOffice;
    const primary = offices[0] || {};
    const city = primary.District || primary.Block || primary.Name || '';
    const district = primary.District || '';
    const state = primary.State || '';
    const country = primary.Country || 'India';

    res.json({
      success: true,
      pincode: cleanPin,
      city,
      district,
      state,
      country,
      postOffices: offices.map((o) => ({
        name: o.Name,
        branchType: o.BranchType,
        deliveryStatus: o.DeliveryStatus,
        district: o.District,
        state: o.State,
      })),
      formattedLocation: `${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  confirmOtp,
  register,
  login,
  getMe,
  getPincodeDetails,
};
