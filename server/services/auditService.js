const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');

// In-memory / persistent audit cache for fallback mode
const fallbackAuditLogs = [];

/**
 * Record a security or operational event to AuditLog
 */
const logSecurityEvent = async ({
  user = null,
  userEmail = '',
  userRole = '',
  action,
  resourceType,
  resourceId = '',
  details = {},
  ipAddress = '',
}) => {
  const timestamp = new Date();
  const eventData = {
    user: user || null,
    userEmail: userEmail || 'anonymous',
    userRole: userRole || 'none',
    action,
    resourceType,
    resourceId: resourceId || '',
    details,
    ipAddress: ipAddress || '127.0.0.1',
    createdAt: timestamp,
  };

  try {
    if (mongoose.connection.readyState === 1) {
      await AuditLog.create(eventData);
    } else {
      fallbackAuditLogs.push(eventData);
      // Keep most recent 500 records
      if (fallbackAuditLogs.length > 500) {
        fallbackAuditLogs.shift();
      }
    }
  } catch (err) {
    console.error('[AUDIT LOG ERROR] Failed to record audit log:', err.message);
  }
};

const getRecentAuditLogs = (limit = 100) => {
  return fallbackAuditLogs.slice(-limit).reverse();
};

module.exports = {
  logSecurityEvent,
  getRecentAuditLogs,
};
