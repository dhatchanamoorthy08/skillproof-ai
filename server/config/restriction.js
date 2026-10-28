// Central configuration for temporary dashboard access restriction
// Requirements:
// 1. Temporarily restrict access to Student, HR Recruiter, and Placement Officer dashboards.
// 2. Easily toggleable via RESTRICT_DASHBOARDS in server/.env without code changes or rebuilding.

const RESTRICTION_MESSAGE =
  'Login access is temporarily unavailable. We are working on improvements. Please try again later.';

const isDashboardRestricted = () => {
  const envVal = process.env.RESTRICT_DASHBOARDS;
  if (envVal !== undefined) {
    return envVal === 'true' || envVal === '1';
  }
  // Default to false
  return false;
};

module.exports = {
  isDashboardRestricted,
  RESTRICTION_MESSAGE,
};
