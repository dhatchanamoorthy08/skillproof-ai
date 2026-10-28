import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SkillPassportPage } from './pages/student/SkillPassportPage';
import { EvidenceSubmissionPage } from './pages/student/EvidenceSubmissionPage';
import { RoadmapPage } from './pages/student/RoadmapPage';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { JobsPage } from './pages/student/JobsPage';
import { ResumeAnalysisPage } from './pages/student/ResumeAnalysisPage';
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';
import { IndustryTrendsPage } from './pages/student/IndustryTrendsPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Assessment Pages
import { AssessmentListPage } from './pages/assessment/AssessmentListPage';
import { AssessmentRunnerPage } from './pages/assessment/AssessmentRunnerPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyVerificationPage } from './pages/recruiter/CompanyVerificationPage';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { CandidateSearchPage } from './pages/recruiter/CandidateSearchPage';
import { RecruiterApplicationsPage } from './pages/recruiter/RecruiterApplicationsPage';

// Placement Officer Pages
import { PlacementDashboard } from './pages/placement/PlacementDashboard';
import { EvidenceReviewPage } from './pages/placement/EvidenceReviewPage';
import { AssessmentMonitoringPage } from './pages/placement/AssessmentMonitoringPage';
import { StudentsDirectoryPage } from './pages/placement/StudentsDirectoryPage';
import { EarlyAlertsPage } from './pages/placement/EarlyAlertsPage';
import { RecruiterApprovalsPage } from './pages/placement/RecruiterApprovalsPage';
import { HiringDrivesPage } from './pages/placement/HiringDrivesPage';
import { PlacementReportsPage } from './pages/placement/PlacementReportsPage';

// Protected Route Component with Temporary Dashboard Access Restriction
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isRestricted, restrictionMessage } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
        Verifying authorization...
      </div>
    );
  }

  // Enforce temporary dashboard restriction: redirect any direct URL entry to login page
  if (isRestricted) {
    return (
      <Navigate
        to="/login?restricted=true"
        state={{ message: restrictionMessage }}
        replace
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student/home" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'placement_officer') return <Navigate to="/placement/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<StudentDashboard />} />
            <Route path="passport" element={<SkillPassportPage />} />
            <Route path="evidence" element={<EvidenceSubmissionPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="gaps" element={<SkillGapPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="resume" element={<ResumeAnalysisPage />} />
            <Route path="interview-prep" element={<InterviewPrepPage />} />
            <Route path="trends" element={<IndustryTrendsPage />} />
            <Route path="settings" element={<StudentSettingsPage />} />
          </Route>

          {/* Assessment Proctored Routes */}
          <Route
            path="/assessments"
            element={
              <ProtectedRoute allowedRoles={['student', 'placement_officer', 'recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AssessmentListPage />} />
            <Route path=":id/run" element={<AssessmentRunnerPage />} />
          </Route>

          {/* Recruiter Protected Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="verification" element={<CompanyVerificationPage />} />
            <Route path="post-job" element={<PostJobPage />} />
            <Route path="candidates" element={<CandidateSearchPage />} />
            <Route path="applications" element={<RecruiterApplicationsPage />} />
            <Route path="settings" element={<RecruiterDashboard />} />
          </Route>

          {/* Placement Officer Protected Routes */}
          <Route
            path="/placement"
            element={
              <ProtectedRoute allowedRoles={['placement_officer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<PlacementDashboard />} />
            <Route path="proctoring" element={<AssessmentMonitoringPage />} />
            <Route path="evidence-review" element={<EvidenceReviewPage />} />
            <Route path="students" element={<StudentsDirectoryPage />} />
            <Route path="alerts" element={<EarlyAlertsPage />} />
            <Route path="verifications" element={<RecruiterApprovalsPage />} />
            <Route path="drives" element={<HiringDrivesPage />} />
            <Route path="reports" element={<PlacementReportsPage />} />
            <Route path="settings" element={<PlacementDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
