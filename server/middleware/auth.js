const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { fallbackUsers } = require('../services/fallbackStore');

const { isDashboardRestricted, RESTRICTION_MESSAGE } = require('../config/restriction');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillproof_super_secret_jwt_key_2026_production_grade'
    );

    // If MongoDB is connected, query DB
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      // Offline fallback lookup
      req.user = fallbackUsers.find((u) => u._id === decoded.id || u.email === decoded.email) || {
        _id: decoded.id,
        email: decoded.email || 'student@skillproof.ai',
        fullName: 'Aarav Mehta',
        role: decoded.role || 'student',
        status: 'active',
      };
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (req.user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.',
      });
    }

    // Temporary restriction: Block backend API access to Student, Recruiter, and Placement Officer dashboards
    if (isDashboardRestricted() && req.user.role !== 'admin') {
      return res.status(503).json({
        success: false,
        restricted: true,
        message: RESTRICTION_MESSAGE,
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session invalid or expired. Please sign in again.',
    });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillproof_super_secret_jwt_key_2026_production_grade'
    );

    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = fallbackUsers.find((u) => u._id === decoded.id || u.email === decoded.email) || {
        _id: decoded.id,
        email: decoded.email || 'student@skillproof.ai',
        fullName: 'Student User',
        role: decoded.role || 'student',
        status: 'active',
      };
    }
  } catch (err) {
    // Ignore invalid token on optional route
  }
  next();
};

module.exports = { protect, optionalProtect };
