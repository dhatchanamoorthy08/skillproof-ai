const mongoose = require('mongoose');

const placementOfficerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    collegeName: {
      type: String,
      default: 'National Institute of Technology',
      trim: true,
    },
    designation: {
      type: String,
      default: 'Head of Training & Placement',
      trim: true,
    },
    department: {
      type: String,
      default: 'University Placement Cell',
    },
    employeeId: {
      type: String,
      default: '',
      trim: true,
    },
    collegeCode: {
      type: String,
      default: '',
      trim: true,
    },
    institutionType: {
      type: String,
      default: 'Autonomous Engineering Institute',
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    officialEmail: {
      type: String,
      default: '',
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    district: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlacementOfficerProfile', placementOfficerProfileSchema);
