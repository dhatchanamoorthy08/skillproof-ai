import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  Users,
  Award,
  FileCheck2,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  ExternalLink,
  Edit,
  Trash2,
  BookOpen,
  Eye,
  RefreshCw,
  FolderGit2,
  Clock,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';
import { MetricCard } from '../../components/MetricCard';

export const AdminDashboard = () => {
  // Navigation tabs: 'overview' | 'roadmaps' | 'students' | 'assessments' | 'evidence' | 'reports'
  const [activeTab, setActiveTab] = useState('overview');

  // Overview Data
  const [metrics, setMetrics] = useState(null);
  const [recentViolations, setRecentViolations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Roadmaps State
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(false);
  const [showCreateRoadmapModal, setShowCreateRoadmapModal] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Software Engineering',
    estimatedDuration: '6 Months',
    requiredSkills: '',
  });

  // Material & Course Link Modal State
  const [selectedRoadmapForContent, setSelectedRoadmapForContent] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    provider: 'MDN Web Docs',
    url: '',
    skillCovered: '',
    level: 'Beginner',
    duration: '10 Hours',
    isFree: true,
    hasCertificate: false,
  });
  const [targetTopicId, setTargetTopicId] = useState('');

  // Students State
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [loadingStudentDetail, setLoadingStudentDetail] = useState(false);

  // Assessments State
  const [assessments, setAssessments] = useState([]);
  const [violationLogs, setViolationLogs] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [showCreateAssessmentModal, setShowCreateAssessmentModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    domain: 'Full Stack',
    durationMinutes: 40,
    passingScorePercentage: 75,
    description: '',
  });

  // Evidence Verification State
  const [evidenceList, setEvidenceList] = useState([]);
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');

  // 1. Fetch Overview on Mount
  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await api.get('/admin/overview');
      if (res.data.success) {
        setMetrics(res.data.metrics);
        setRecentViolations(res.data.recentViolations || []);
        setAuditLogs(res.data.recentAuditLogs || []);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // 2. Fetch Tab-Specific Data
  useEffect(() => {
    if (activeTab === 'roadmaps') fetchRoadmaps();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'assessments') fetchAssessments();
    if (activeTab === 'evidence') fetchEvidence();
  }, [activeTab]);

  const fetchRoadmaps = async () => {
    setLoadingRoadmaps(true);
    try {
      const res = await api.get('/admin/roadmaps');
      if (res.data.success) setRoadmaps(res.data.roadmaps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoadmaps(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.get(`/admin/students?search=${encodeURIComponent(studentSearch)}&status=${studentStatusFilter}`);
      if (res.data.success) setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchAssessments = async () => {
    setLoadingAssessments(true);
    try {
      const res = await api.get('/admin/assessments');
      if (res.data.success) {
        setAssessments(res.data.assessments);
        setViolationLogs(res.data.violationLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAssessments(false);
    }
  };

  const fetchEvidence = async () => {
    setLoadingEvidence(true);
    try {
      const res = await api.get(`/admin/evidence?status=${evidenceFilter}`);
      if (res.data.success) setEvidenceList(res.data.evidence);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  // Student Deep Dive
  const handleOpenStudentDetail = async (studentId) => {
    setLoadingStudentDetail(true);
    try {
      const res = await api.get(`/admin/students/${studentId}`);
      if (res.data.success) {
        setSelectedStudentDetail(res.data.student);
      }
    } catch (err) {
      alert('Failed to load student details.');
    } finally {
      setLoadingStudentDetail(false);
    }
  };

  // Student Account Status Toggle
  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark this student account as ${nextStatus}?`)) return;

    try {
      const res = await api.put(`/admin/students/${studentId}/status`, { status: nextStatus });
      if (res.data.success) {
        fetchStudents();
        if (selectedStudentDetail && selectedStudentDetail._id === studentId) {
          setSelectedStudentDetail((prev) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status.');
    }
  };

  // Evidence Verification Action
  const handleVerifyEvidence = async (evidenceId, status) => {
    try {
      const res = await api.put(`/admin/evidence/${evidenceId}/verify`, {
        status,
        remarks: verificationRemarks || `Audited by Administrator: ${status}`,
      });
      if (res.data.success) {
        setVerificationRemarks('');
        setVerifyingId(null);
        fetchEvidence();
        fetchOverview();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify evidence.');
    }
  };

  // Create Roadmap Action
  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/roadmaps', newRoadmap);
      if (res.data.success) {
        setShowCreateRoadmapModal(false);
        setNewRoadmap({
          title: '',
          slug: '',
          description: '',
          category: 'Software Engineering',
          estimatedDuration: '6 Months',
          requiredSkills: '',
        });
        fetchRoadmaps();
        fetchOverview();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create roadmap.');
    }
  };

  // Add Free Course Link Action
  const handleAddCourseLink = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapForContent || !targetTopicId) return;

    try {
      const res = await api.post(`/admin/roadmaps/${selectedRoadmapForContent.slug}/topics/${targetTopicId}/courses`, newCourse);
      if (res.data.success) {
        setShowAddCourseModal(false);
        setNewCourse({
          title: '',
          provider: 'MDN Web Docs',
          url: '',
          skillCovered: '',
          level: 'Beginner',
          duration: '10 Hours',
          isFree: true,
          hasCertificate: false,
        });
        fetchRoadmaps();
        alert('Verified free course link successfully attached to topic.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to attach course link.');
    }
  };

  // Create Assessment Action
  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/assessments', newAssessment);
      if (res.data.success) {
        setShowCreateAssessmentModal(false);
        setNewAssessment({
          title: '',
          domain: 'Full Stack',
          durationMinutes: 40,
          passingScorePercentage: 75,
          description: '',
        });
        fetchAssessments();
        fetchOverview();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assessment.');
    }
  };

  // Download CSV
  const handleDownloadCSV = (type) => {
    window.open(`/api/v1/admin/reports/export?type=${type}`, '_blank');
  };

  return (
    <div>
      {/* Admin Command Header */}
      <div
        className="card"
        style={{
          background: '#252525',
          color: '#FFFFFF',
          marginBottom: '2rem',
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: '1px solid rgba(232, 225, 215, 0.15)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#B89B6A',
              backgroundColor: 'rgba(184, 155, 106, 0.15)',
              border: '1px solid rgba(184, 155, 106, 0.3)',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldCheck size={14} /> Institutional Master Administration
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#F5F1E9', marginBottom: '0.4rem', fontWeight: 800 }}>
            Platform Admin Control Command
          </h2>
          <p style={{ color: '#D9D0C3', fontSize: '0.95rem', maxWidth: '650px', margin: 0 }}>
            Manage career roadmaps, educational study materials, verified free courses, student accounts, proctoring integrity, and institutional reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleDownloadCSV('students')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
          >
            <Download size={16} />
            <span>Export Students CSV</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('roadmaps');
              setShowCreateRoadmapModal(true);
            }}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>New Career Roadmap</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          borderBottom: '1px solid #E8E1D7',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { key: 'overview', label: 'Overview & Telemetry', icon: <LayoutDashboard size={16} /> },
          { key: 'roadmaps', label: 'Career Roadmaps', icon: <Compass size={16} /> },
          { key: 'students', label: 'Student Accounts', icon: <Users size={16} /> },
          { key: 'assessments', label: 'Assessments & Integrity', icon: <Award size={16} /> },
          { key: 'evidence', label: 'Evidence Verification', icon: <FileCheck2 size={16} /> },
          { key: 'reports', label: 'Reports & CSV Exports', icon: <BarChart3 size={16} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                borderRadius: '8px',
                gap: '0.4rem',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metric Grid */}
          <div className="stat-grid" style={{ marginBottom: '2rem' }}>
            <MetricCard
              title="Registered Students"
              value={metrics?.totalStudents || 0}
              subtitle="Verified candidate profiles"
              icon={<Users size={22} />}
              iconBg="#FBF4F0"
              iconColor="#C46A45"
            />
            <MetricCard
              title="Active Roadmaps"
              value={metrics?.activeRoadmaps || 0}
              subtitle="Published curriculum tracks"
              icon={<Compass size={22} />}
              iconBg="#FAF6EF"
              iconColor="#B89B6A"
            />
            <MetricCard
              title="Assessments Taken"
              value={metrics?.totalAttempts || 0}
              subtitle="Standardized proctored attempts"
              icon={<Award size={22} />}
              iconBg="#FAF6EF"
              iconColor="#B89B6A"
            />
            <MetricCard
              title="Pending Evidence"
              value={metrics?.pendingEvidence || 0}
              subtitle="Awaiting administrative review"
              icon={<FileCheck2 size={22} />}
              iconBg="#F5F1E9"
              iconColor="#252525"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
            {/* Recent Proctoring Violation Feed */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#252525', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={18} color="#C46A45" /> Recent Exam Integrity Flagged Sessions
                </h3>
                <span className="badge badge-claimed">{recentViolations.length} Flagged</span>
              </div>

              {recentViolations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#77736D', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={32} color="#B89B6A" style={{ margin: '0 auto 0.5rem' }} />
                  No security integrity violations recorded. Proctored sessions operating smoothly.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentViolations.map((att, idx) => (
                    <div
                      key={att._id || idx}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #E8E1D7',
                        background: '#FCF8F5',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div>
                        <strong>{att.student?.fullName || 'Candidate'}</strong> &bull; {att.assessment?.title || 'Technical Exam'}
                        <div style={{ fontSize: '0.75rem', color: '#C46A45', marginTop: '2px' }}>
                          Status: <strong>{att.status}</strong> &bull; Violations Logged: {att.violations?.length || 0}
                        </div>
                      </div>
                      <span className="badge badge-support">Reviewed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Administrative Audit Logs Stream */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#252525', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="#B89B6A" /> Administrative Security Audit Trail
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#77736D' }}>Immutable Logs</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '350px', overflowY: 'auto' }}>
                {auditLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#77736D', fontSize: '0.85rem' }}>
                    Audit stream initialized.
                  </div>
                ) : (
                  auditLogs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        background: '#FAF6EF',
                        border: '1px solid #E8E1D7',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ color: '#C46A45' }}>{log.action}</strong>
                        <span style={{ color: '#77736D', fontSize: '0.72rem' }}>
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: '#252525' }}>
                        User: {log.userEmail} &bull; Target: {log.resourceType}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ROADMAPS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'roadmaps' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#252525' }}>
                Career Roadmaps & Learning Curriculum
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                Create, edit modules, add topic notes, and attach verified free courses.
              </p>
            </div>

            <button
              onClick={() => setShowCreateRoadmapModal(true)}
              className="btn btn-primary"
              style={{ gap: '0.4rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>Create New Roadmap</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {roadmaps.map((rm) => (
              <div
                key={rm.slug}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #E8E1D7',
                  padding: '1.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-assessed">{rm.category}</span>
                    <span className="badge badge-ready">{rm.status}</span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#252525', marginBottom: '0.4rem' }}>
                    {rm.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#77736D', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {rm.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#77736D', marginBottom: '1rem' }}>
                    Duration: <strong>{rm.estimatedDuration}</strong> &bull; Levels: <strong>{(rm.levels || []).length}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setSelectedRoadmapForContent(rm);
                      // Pick first topic if available
                      const firstTopic = rm.levels?.[0]?.modules?.[0]?.topics?.[0]?.topicId || '';
                      setTargetTopicId(firstTopic);
                      setShowAddCourseModal(true);
                    }}
                    className="btn btn-sm btn-secondary"
                    style={{ gap: '0.35rem', fontWeight: 600 }}
                  >
                    <BookOpen size={14} /> Attach Free Course
                  </button>

                  <Link
                    to="/student/roadmap"
                    className="btn btn-sm btn-primary"
                    style={{ gap: '0.35rem', fontWeight: 700 }}
                  >
                    <Eye size={14} /> Student View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STUDENT MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div>
          {/* Filter Bar */}
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="#77736D" />
              <input
                type="text"
                className="form-control"
                placeholder="Search students by name, email, or roll number..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                style={{ flex: 1 }}
              />
              <button onClick={fetchStudents} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                Search
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="#77736D" />
              <select
                className="form-control form-select"
                value={studentStatusFilter}
                onChange={(e) => {
                  setStudentStatusFilter(e.target.value);
                  setTimeout(fetchStudents, 50);
                }}
                style={{ width: '160px' }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Student Candidate</th>
                    <th>Department & Batch</th>
                    <th>Readiness Index</th>
                    <th>Evidence</th>
                    <th>Account Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#252525' }}>{s.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#77736D' }}>{s.email}</div>
                      </td>
                      <td>
                        <div>{s.department}</div>
                        <div style={{ fontSize: '0.75rem', color: '#77736D' }}>Batch: {s.batch} &bull; CGPA: {s.cgpa}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#C46A45' }}>{s.jobReadinessIndex}%</strong>
                        <div style={{ fontSize: '0.75rem', color: '#77736D' }}>{s.readinessTier}</div>
                      </td>
                      <td>
                        <span>{s.verifiedEvidenceCount} / {s.evidenceCount} Verified</span>
                      </td>
                      <td>
                        <span className={`badge ${s.status === 'active' ? 'badge-ready' : 'badge-support'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenStudentDetail(s._id)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.65rem' }}
                          >
                            Deep Dive
                          </button>
                          <button
                            onClick={() => handleToggleStudentStatus(s._id, s.status)}
                            className={`btn btn-sm ${s.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ padding: '0.3rem 0.65rem' }}
                          >
                            {s.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ASSESSMENTS & INTEGRITY */}
      {/* ======================================================== */}
      {activeTab === 'assessments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#252525' }}>
                Standardized Assessments & Anti-Cheat Telemetry
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                Review question configurations and exam security violation audits.
              </p>
            </div>

            <button
              onClick={() => setShowCreateAssessmentModal(true)}
              className="btn btn-primary"
              style={{ gap: '0.4rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>Create Assessment</span>
            </button>
          </div>

          {/* Assessment Catalog List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {assessments.map((a) => (
              <div key={a._id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-assessed">{a.domain}</span>
                  <span style={{ fontSize: '0.8rem', color: '#77736D', fontWeight: 600 }}>
                    <Clock size={13} /> {a.durationMinutes} Mins
                  </span>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#252525', marginBottom: '0.4rem' }}>
                  {a.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#77736D', marginBottom: '0.75rem' }}>
                  Passing Score: <strong>{a.passingScorePercentage}%</strong> &bull; Total Questions: <strong>{a.questions?.length || 30}</strong>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/assessments`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    View Examination Engine
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Integrity Violations Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8E1D7', background: '#FAF6EF' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#252525', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={18} color="#C46A45" /> Proctored Violation Telemetry Logs
              </h4>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Assessment</th>
                    <th>Violations Count</th>
                    <th>Violation Types</th>
                    <th>Session Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {violationLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#77736D' }}>
                        No proctoring violations recorded.
                      </td>
                    </tr>
                  ) : (
                    violationLogs.map((log, idx) => (
                      <tr key={log._id || idx}>
                        <td>
                          <strong>{log.student?.fullName || 'Candidate'}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#77736D' }}>{log.student?.email}</div>
                        </td>
                        <td>{log.assessment?.title || 'Technical Assessment'}</td>
                        <td>
                          <span style={{ color: '#C46A45', fontWeight: 800 }}>{(log.violations || []).length} event(s)</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {(log.violations || []).slice(0, 3).map((v, vIdx) => (
                              <span key={vIdx} className="badge badge-support" style={{ fontSize: '0.7rem' }}>
                                {v.type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${log.status === 'terminated' ? 'badge-support' : 'badge-claimed'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#77736D' }}>
                          {new Date(log.updatedAt || log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: EVIDENCE VERIFICATION */}
      {/* ======================================================== */}
      {activeTab === 'evidence' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#252525' }}>
                Certificate & Project Evidence Verification
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                Audit student certificate submissions, course credentials, and project portfolios.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'pending', 'verified', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setEvidenceFilter(st);
                    setTimeout(fetchEvidence, 50);
                  }}
                  className={`btn ${evidenceFilter === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Evidence Title & Type</th>
                    <th>Candidate</th>
                    <th>Issuing Organization</th>
                    <th>Associated Skills</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Audit Action</th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceList.map((ev) => (
                    <tr key={ev._id}>
                      <td>
                        <strong>{ev.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#77736D', textTransform: 'uppercase' }}>
                          Type: {ev.type}
                        </div>
                      </td>
                      <td>
                        <div>{ev.student?.fullName || 'Candidate'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#77736D' }}>{ev.student?.email}</div>
                      </td>
                      <td>{ev.issuingOrganization || ev.courseProvider || ev.companyName || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {(ev.associatedSkills || []).map((sk) => (
                            <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.7rem' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${ev.verificationStatus === 'verified' ? 'badge-ready' : ev.verificationStatus === 'rejected' ? 'badge-support' : 'badge-claimed'}`}>
                          {ev.verificationStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {ev.verificationStatus === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleVerifyEvidence(ev._id, 'verified')}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '0.3rem 0.65rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyEvidence(ev._id, 'rejected')}
                              className="btn btn-sm btn-secondary"
                              style={{ padding: '0.3rem 0.65rem' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#77736D' }}>
                            {ev.verificationNotes || 'Audited'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: REPORTS & EXPORTS */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div>
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#252525', marginBottom: '0.5rem' }}>
              Institutional Analytics & CSV Data Exports
            </h3>
            <p style={{ color: '#77736D', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Download complete institutional records for accreditation, placement reporting, and student progress tracking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '10px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#252525', marginBottom: '0.35rem' }}>
                  Students & Learning Progress
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#77736D', marginBottom: '1.25rem' }}>
                  Complete roster of students with CGPA, Job Readiness Index, completed roadmap topics, and profile completion.
                </p>
                <button
                  onClick={() => handleDownloadCSV('students')}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem', fontWeight: 700 }}
                >
                  <Download size={14} /> Download Students CSV
                </button>
              </div>

              <div style={{ background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '10px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#252525', marginBottom: '0.35rem' }}>
                  Standardized Assessment Records
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#77736D', marginBottom: '1.25rem' }}>
                  Examination scores, passing percentages, attempt timestamps, and security violation counts.
                </p>
                <button
                  onClick={() => handleDownloadCSV('assessments')}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem', fontWeight: 700 }}
                >
                  <Download size={14} /> Download Assessments CSV
                </button>
              </div>

              <div style={{ background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '10px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#252525', marginBottom: '0.35rem' }}>
                  Evidence & Verification Audit
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#77736D', marginBottom: '1.25rem' }}>
                  Comprehensive audit trail of student certificate submissions and administrative verification notes.
                </p>
                <button
                  onClick={() => handleDownloadCSV('evidence')}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem', fontWeight: 700 }}
                >
                  <Download size={14} /> Download Evidence CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* Modal: Create Roadmap */}
      <Modal
        isOpen={showCreateRoadmapModal}
        onClose={() => setShowCreateRoadmapModal(false)}
        title="Create New Career Roadmap"
      >
        <form onSubmit={handleCreateRoadmap} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Roadmap Title:
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g., Mobile App Developer (Flutter/React Native)"
              value={newRoadmap.title}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                setNewRoadmap({ ...newRoadmap, title, slug });
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              URL Slug:
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g., mobile-app-developer"
              value={newRoadmap.slug}
              onChange={(e) => setNewRoadmap({ ...newRoadmap, slug: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Category:
              </label>
              <input
                type="text"
                className="form-control"
                value={newRoadmap.category}
                onChange={(e) => setNewRoadmap({ ...newRoadmap, category: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Estimated Duration:
              </label>
              <input
                type="text"
                className="form-control"
                value={newRoadmap.estimatedDuration}
                onChange={(e) => setNewRoadmap({ ...newRoadmap, estimatedDuration: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Description:
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={newRoadmap.description}
              onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Required Skills (comma separated):
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Flutter, Dart, Firebase, REST APIs"
              value={newRoadmap.requiredSkills}
              onChange={(e) => setNewRoadmap({ ...newRoadmap, requiredSkills: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setShowCreateRoadmapModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Create Roadmap
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Attach Verified Free Course */}
      <Modal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        title={`Attach Verified Free Course to ${selectedRoadmapForContent?.title || ''}`}
      >
        <form onSubmit={handleAddCourseLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Target Topic ID:
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. fsw-t1-html-semantics"
              value={targetTopicId}
              onChange={(e) => setTargetTopicId(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Course / Resource Title:
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Learn React Quick Start"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Platform / Provider:
              </label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="freeCodeCamp, MDN, Official Docs"
                value={newCourse.provider}
                onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Skill Level:
              </label>
              <select
                className="form-control form-select"
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Direct Learning URL:
            </label>
            <input
              type="url"
              className="form-control"
              required
              placeholder="https://..."
              value={newCourse.url}
              onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newCourse.isFree}
                onChange={(e) => setNewCourse({ ...newCourse, isFree: e.target.checked })}
              />
              100% Free Resource
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newCourse.hasCertificate}
                onChange={(e) => setNewCourse({ ...newCourse, hasCertificate: e.target.checked })}
              />
              Free Verified Certificate Available
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setShowAddCourseModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Attach Course Link
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Assessment */}
      <Modal
        isOpen={showCreateAssessmentModal}
        onClose={() => setShowCreateAssessmentModal(false)}
        title="Create Standardized Assessment"
      >
        <form onSubmit={handleCreateAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Assessment Title:
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Distributed Cloud Systems & Microservices"
              value={newAssessment.title}
              onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Domain:
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={newAssessment.domain}
                onChange={(e) => setNewAssessment({ ...newAssessment, domain: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Duration (Minutes):
              </label>
              <input
                type="number"
                className="form-control"
                value={newAssessment.durationMinutes}
                onChange={(e) => setNewAssessment({ ...newAssessment, durationMinutes: parseInt(e.target.value, 10) || 40 })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Passing Threshold (%):
            </label>
            <input
              type="number"
              className="form-control"
              value={newAssessment.passingScorePercentage}
              onChange={(e) => setNewAssessment({ ...newAssessment, passingScorePercentage: parseInt(e.target.value, 10) || 75 })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setShowCreateAssessmentModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Create Assessment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Student Detail Deep Dive */}
      <Modal
        isOpen={!!selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        title={selectedStudentDetail?.fullName ? `Student Deep Dive: ${selectedStudentDetail.fullName}` : 'Student Record'}
      >
        {selectedStudentDetail && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #E8E1D7' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedStudentDetail.fullName}</h4>
                <div style={{ fontSize: '0.85rem', color: '#77736D' }}>{selectedStudentDetail.email}</div>
                <div style={{ fontSize: '0.8rem', color: '#252525', marginTop: '2px' }}>
                  {selectedStudentDetail.profile?.department || 'Engineering'} &bull; CGPA: {selectedStudentDetail.profile?.cgpa || 'N/A'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${selectedStudentDetail.status === 'active' ? 'badge-ready' : 'badge-support'}`}>
                  {selectedStudentDetail.status}
                </span>
                <div style={{ fontSize: '0.8rem', color: '#C46A45', fontWeight: 800, marginTop: '4px' }}>
                  Readiness: {selectedStudentDetail.passport?.jobReadinessIndex || 45}%
                </div>
              </div>
            </div>

            {/* Assessment History */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#252525', marginBottom: '0.5rem' }}>
                Standardized Assessment Attempts ({(selectedStudentDetail.attempts || []).length})
              </h5>
              {(selectedStudentDetail.attempts || []).length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#77736D' }}>No assessment attempts recorded.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedStudentDetail.attempts.map((att, aIdx) => (
                    <div
                      key={aIdx}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '6px',
                        background: '#FAF6EF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span>{att.assessment?.title || 'Technical Assessment'}</span>
                      <strong>Score: {att.scorePercentage}% ({att.status})</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submitted Evidence */}
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#252525', marginBottom: '0.5rem' }}>
                Submitted Certificates & Evidence ({(selectedStudentDetail.evidence || []).length})
              </h5>
              {(selectedStudentDetail.evidence || []).length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#77736D' }}>No evidence submissions on file.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedStudentDetail.evidence.map((ev, eIdx) => (
                    <div
                      key={eIdx}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '6px',
                        background: '#FAF6EF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span>{ev.title} ({ev.type})</span>
                      <span className={`badge ${ev.verificationStatus === 'verified' ? 'badge-ready' : 'badge-claimed'}`} style={{ fontSize: '0.65rem' }}>
                        {ev.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedStudentDetail(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
