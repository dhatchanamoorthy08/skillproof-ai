import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BRAND_NAME = 'SkillProof AI';
const DEFAULT_TITLE = 'SkillProof AI | Verified Skills. Real Opportunities.';

const ROUTE_TITLES = {
  '/': DEFAULT_TITLE,
  '/login': `Sign In | ${BRAND_NAME}`,
  '/register': `Get Started | ${BRAND_NAME}`,

  // Student Routes
  '/student/home': `Student Dashboard | ${BRAND_NAME}`,
  '/student/passport': `Skill Passport | ${BRAND_NAME}`,
  '/student/evidence': `Certificate Evidence | ${BRAND_NAME}`,
  '/student/roadmap': `Career Roadmap | ${BRAND_NAME}`,
  '/student/gaps': `Skill Gap Analysis | ${BRAND_NAME}`,
  '/student/jobs': `Jobs & Internships | ${BRAND_NAME}`,
  '/student/resume': `Resume Analysis | ${BRAND_NAME}`,
  '/student/interview-prep': `Interview Preparation | ${BRAND_NAME}`,
  '/student/trends': `Industry Trends | ${BRAND_NAME}`,
  '/student/settings': `Settings | ${BRAND_NAME}`,

  // Assessment Routes
  '/assessments': `Online Assessments | ${BRAND_NAME}`,

  // Recruiter Routes
  '/recruiter/dashboard': `HR Recruiter Dashboard | ${BRAND_NAME}`,
  '/recruiter/candidates': `Search Candidates | ${BRAND_NAME}`,
  '/recruiter/post-job': `Post a Job | ${BRAND_NAME}`,
  '/recruiter/applications': `Applications Pipeline | ${BRAND_NAME}`,
  '/recruiter/verification': `Company Verification | ${BRAND_NAME}`,
  '/recruiter/settings': `Recruiter Settings | ${BRAND_NAME}`,

  // Placement Officer Routes
  '/placement/dashboard': `Placement Officer Dashboard | ${BRAND_NAME}`,
  '/placement/proctoring': `Proctoring Monitor | ${BRAND_NAME}`,
  '/placement/evidence-review': `Certificate Verification | ${BRAND_NAME}`,
  '/placement/students': `Student Directory | ${BRAND_NAME}`,
  '/placement/alerts': `Early Alerts | ${BRAND_NAME}`,
  '/placement/verifications': `Recruiter Approvals | ${BRAND_NAME}`,
  '/placement/drives': `Hiring Drives | ${BRAND_NAME}`,
  '/placement/reports': `Placement Reports | ${BRAND_NAME}`,
  '/placement/settings': `Placement Settings | ${BRAND_NAME}`,

  // Admin Routes
  '/admin/login': `Admin Login | ${BRAND_NAME}`,
  '/admin': `Admin Dashboard | ${BRAND_NAME}`,
  '/admin/dashboard': `Admin Dashboard | ${BRAND_NAME}`,
};

export const PageTitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
    } else if (pathname.startsWith('/assessments/') && pathname.includes('/run')) {
      document.title = `Assessment Session | ${BRAND_NAME}`;
    } else if (pathname.startsWith('/admin')) {
      document.title = `Admin Dashboard | ${BRAND_NAME}`;
    } else if (pathname.startsWith('/student')) {
      document.title = `Student Portal | ${BRAND_NAME}`;
    } else if (pathname.startsWith('/recruiter')) {
      document.title = `HR Recruiter Portal | ${BRAND_NAME}`;
    } else if (pathname.startsWith('/placement')) {
      document.title = `Placement Portal | ${BRAND_NAME}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [location]);

  return null;
};

export default PageTitleManager;
