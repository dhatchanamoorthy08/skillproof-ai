import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillProofLogo } from '../../components/SkillProofLogo';
import {
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  GraduationCap,
  FileCheck,
  Award,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Download,
  Printer,
  Shield,
  Key,
  Trash2,
  Edit,
  Eye,
  Check,
  ChevronRight,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // 1. Dashboard Overview State
  const [overviewStats, setOverviewStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // 2. User Management State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoleModal, setUserRoleModal] = useState(null);
  const [newRoleVal, setNewRoleVal] = useState('student');

  // 3. Career Roadmaps State
  const [roadmaps, setRoadmaps] = useState([]);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [roadmapFormData, setRoadmapFormData] = useState({
    title: '',
    slug: '',
    category: 'Software Engineering',
    estimatedDuration: '6 Months',
    description: '',
    requiredSkills: '',
    status: 'published',
  });
  const [selectedRoadmapModules, setSelectedRoadmapModules] = useState(null);

  // 4. Study Materials State
  const [selectedRoadmapForMaterial, setSelectedRoadmapForMaterial] = useState('');
  const [selectedTopicIdForMaterial, setSelectedTopicIdForMaterial] = useState('');
  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'notes',
    content: '',
    url: '',
  });
  const [materialFile, setMaterialFile] = useState(null);

  // 5. Free Courses State
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    provider: '',
    url: '',
    skillLevel: 'Beginner',
    duration: '4 Weeks',
    isFree: true,
    hasCertificate: false,
    category: 'General',
    assignedRoadmapSlug: '',
  });

  // 6. Assessments State
  const [assessments, setAssessments] = useState([]);
  const [assessmentAttempts, setAssessmentAttempts] = useState([]);
  const [assessmentViolations, setAssessmentViolations] = useState([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentFormData, setAssessmentFormData] = useState({
    title: '',
    domain: 'Software Engineering',
    description: '',
    durationMinutes: 40,
    passingScorePercentage: 75,
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ],
  });

  // 7. Evidence Management State
  const [evidenceList, setEvidenceList] = useState([]);
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const [verifyModal, setVerifyModal] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [verifyRemarks, setVerifyRemarks] = useState('');

  // 8. Reports State
  const [reportType, setReportType] = useState('users');

  // 9. Admin Settings State
  const [adminProfile, setAdminProfile] = useState({ fullName: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [newAdminForm, setNewAdminForm] = useState({ fullName: '', email: '', password: '' });
  const [auditLogs, setAuditLogs] = useState([]);

  // Auto-clear feedback banner
  const triggerFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  };

  // Safe Logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'overview') {
          const res = await api.get('/admin/dashboard/overview');
          if (res.data.success) {
            setOverviewStats(res.data.stats);
            setRecentActivities(res.data.recentActivities || []);
          }
        } else if (activeTab === 'users') {
          const res = await api.get('/admin/users');
          if (res.data.success) {
            setUsers(res.data.users || []);
          }
        } else if (activeTab === 'roadmaps' || activeTab === 'materials') {
          const res = await api.get('/admin/roadmaps');
          if (res.data.success) {
            setRoadmaps(res.data.roadmaps || []);
            if (res.data.roadmaps?.length > 0 && !selectedRoadmapForMaterial) {
              setSelectedRoadmapForMaterial(res.data.roadmaps[0].slug || res.data.roadmaps[0]._id);
            }
          }
        } else if (activeTab === 'courses') {
          const res = await api.get('/admin/courses');
          if (res.data.success) {
            setCourses(res.data.courses || []);
          }
        } else if (activeTab === 'assessments') {
          const res = await api.get('/admin/assessments');
          if (res.data.success) {
            setAssessments(res.data.assessments || []);
            setAssessmentAttempts(res.data.attempts || []);
            setAssessmentViolations(res.data.violations || []);
          }
        } else if (activeTab === 'evidence') {
          const res = await api.get(`/admin/evidence?status=${evidenceFilter}`);
          if (res.data.success) {
            setEvidenceList(res.data.evidence || []);
          }
        } else if (activeTab === 'settings') {
          const [profRes, logsRes] = await Promise.all([
            api.get('/admin/profile'),
            api.get('/admin/settings/audit-logs'),
          ]);
          if (profRes.data.success) {
            setAdminProfile({
              fullName: profRes.data.admin.fullName || '',
              email: profRes.data.admin.email || '',
            });
          }
          if (logsRes.data.success) {
            setAuditLogs(logsRes.data.logs || []);
          }
        }
      } catch (err) {
        console.error('Failed to load admin tab data:', err);
        triggerFeedback('error', err.response?.data?.message || 'Error communicating with server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, refreshTrigger, evidenceFilter]);

  // ==========================================
  // USER MANAGEMENT HANDLERS
  // ==========================================
  const handleUpdateUserStatus = async (userId, status) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status });
      if (res.data.success) {
        triggerFeedback('success', `User account marked as ${status}.`);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleUpdateUserRole = async () => {
    if (!userRoleModal) return;
    try {
      const res = await api.patch(`/admin/users/${userRoleModal._id}/role`, { role: newRoleVal });
      if (res.data.success) {
        triggerFeedback('success', `User role successfully assigned to ${newRoleVal}.`);
        setUserRoleModal(null);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to change user role.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'all' || (u.status || 'active') === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  // ==========================================
  // ROADMAP MANAGEMENT HANDLERS
  // ==========================================
  const handleSaveRoadmap = async (e) => {
    e.preventDefault();
    try {
      if (editingRoadmap) {
        const res = await api.put(`/admin/roadmaps/${editingRoadmap._id || editingRoadmap.slug}`, roadmapFormData);
        if (res.data.success) {
          triggerFeedback('success', 'Roadmap updated successfully.');
        }
      } else {
        const res = await api.post('/admin/roadmaps', roadmapFormData);
        if (res.data.success) {
          triggerFeedback('success', 'New Career Roadmap published.');
        }
      }
      setShowRoadmapModal(false);
      setEditingRoadmap(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to save roadmap.');
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm('Are you sure you want to remove or deactivate this roadmap?')) return;
    try {
      const res = await api.delete(`/admin/roadmaps/${id}`);
      if (res.data.success) {
        triggerFeedback('success', 'Roadmap deleted successfully.');
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to delete roadmap.');
    }
  };

  const handleToggleRoadmapPublish = async (rm) => {
    const newStatus = rm.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put(`/admin/roadmaps/${rm._id || rm.slug}`, { status: newStatus });
      if (res.data.success) {
        triggerFeedback('success', `Roadmap status toggled to ${newStatus}.`);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  // ==========================================
  // STUDY MATERIAL HANDLERS
  // ==========================================
  const handleUploadStudyMaterial = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapForMaterial || !selectedTopicIdForMaterial) {
      triggerFeedback('error', 'Please select both a Roadmap and a Topic.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', materialForm.title);
      formData.append('type', materialForm.type);
      formData.append('content', materialForm.content);
      formData.append('url', materialForm.url);
      if (materialFile) {
        formData.append('materialFile', materialFile);
      }

      const res = await api.post(
        `/admin/roadmaps/${selectedRoadmapForMaterial}/topics/${selectedTopicIdForMaterial}/materials`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        triggerFeedback('success', 'Study material successfully assigned to topic.');
        setMaterialForm({ title: '', type: 'notes', content: '', url: '' });
        setMaterialFile(null);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to upload study material.');
    }
  };

  // ==========================================
  // FREE COURSES HANDLERS
  // ==========================================
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await api.put(`/admin/courses/${editingCourse._id}`, courseFormData);
        if (res.data.success) {
          triggerFeedback('success', 'Course updated successfully.');
        }
      } else {
        const res = await api.post('/admin/courses', courseFormData);
        if (res.data.success) {
          triggerFeedback('success', 'New free course integrated.');
        }
      }
      setShowCourseModal(false);
      setEditingCourse(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to save course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course from the free curriculum?')) return;
    try {
      const res = await api.delete(`/admin/courses/${id}`);
      if (res.data.success) {
        triggerFeedback('success', 'Course removed successfully.');
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to delete course.');
    }
  };

  // ==========================================
  // ASSESSMENT HANDLERS
  // ==========================================
  const handleAddQuestionToAssessment = () => {
    setAssessmentFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
      ],
    }));
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/assessments', assessmentFormData);
      if (res.data.success) {
        triggerFeedback('success', 'New Proctored Assessment created.');
        setShowAssessmentModal(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to create assessment.');
    }
  };

  // ==========================================
  // EVIDENCE VERIFICATION HANDLERS
  // ==========================================
  const handleVerifyEvidence = async () => {
    if (!verifyModal) return;
    try {
      const res = await api.put(`/admin/evidence/${verifyModal._id}/verify`, {
        status: verifyStatus,
        remarks: verifyRemarks,
      });
      if (res.data.success) {
        triggerFeedback('success', `Evidence submission marked as ${verifyStatus}.`);
        setVerifyModal(null);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to verify evidence.');
    }
  };

  // ==========================================
  // REPORT EXPORT HANDLERS
  // ==========================================
  const handleExportCSV = () => {
    const token = localStorage.getItem('token');
    const url = `/api/v1/admin/reports/export/csv?type=${reportType}&token=${token || ''}`;
    window.open(url, '_blank');
  };

  const handleExportPDF = () => {
    const token = localStorage.getItem('token');
    const url = `/api/v1/admin/reports/export/pdf?token=${token || ''}`;
    window.open(url, '_blank');
  };

  // ==========================================
  // SETTINGS HANDLERS
  // ==========================================
  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/admin/profile', adminProfile);
      if (res.data.success) {
        triggerFeedback('success', 'Admin profile updated.');
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      triggerFeedback('error', 'New password and confirmation do not match.');
      return;
    }
    try {
      const res = await api.put('/admin/settings/password', passwordForm);
      if (res.data.success) {
        triggerFeedback('success', 'Master password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleCreateAdminAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/settings/admins', newAdminForm);
      if (res.data.success) {
        triggerFeedback('success', 'Authorized administrator account registered.');
        setNewAdminForm({ fullName: '', email: '', password: '' });
      }
    } catch (err) {
      triggerFeedback('error', err.response?.data?.message || 'Failed to register admin account.');
    }
  };

  // Current topics list for material selection
  const currentTopics = useMemo(() => {
    const rm = roadmaps.find((r) => r.slug === selectedRoadmapForMaterial || r._id === selectedRoadmapForMaterial);
    if (!rm) return [];
    const list = [];
    (rm.modules || []).forEach((m) => {
      (m.topics || []).forEach((t) => {
        list.push({ topicId: t.topicId, title: `${m.title} — ${t.title}` });
      });
    });
    return list;
  }, [roadmaps, selectedRoadmapForMaterial]);

  // Design Tokens (Charcoal #252525, Warm Ivory #F5F1E9, Terracotta #C46A45, Muted Gold #B89B6A)
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F5F1E9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#252525',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#252525',
      color: '#FAF6EF',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid #383838',
    },
    sidebarHeader: {
      padding: '24px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 18px',
      margin: '3px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: active ? 700 : 500,
      color: active ? '#252525' : '#D1C8BA',
      backgroundColor: active ? '#FAF6EF' : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: active ? '1px solid #B89B6A' : '1px solid transparent',
    }),
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    },
    topNav: {
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E8E1D7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    },
    contentArea: {
      padding: '28px',
      flex: 1,
    },
    card: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8E1D7',
      borderRadius: '12px',
      padding: '22px',
      boxShadow: '0 2px 8px rgba(37, 37, 37, 0.04)',
      marginBottom: '24px',
    },
    btnPrimary: {
      backgroundColor: '#C46A45',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    btnSecondary: {
      backgroundColor: '#FAF6EF',
      color: '#252525',
      border: '1px solid #E8E1D7',
      borderRadius: '8px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      textAlign: 'left',
    },
    th: {
      padding: '12px 16px',
      borderBottom: '1px solid #E8E1D7',
      color: '#77736D',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: '11px',
      letterSpacing: '0.05em',
      backgroundColor: '#FAF6EF',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #F0EAE1',
      color: '#252525',
    },
    badge: (type) => {
      let bg = '#F0EAE1';
      let fg = '#252525';
      if (type === 'active' || type === 'verified' || type === 'published') {
        bg = '#ECFDF5';
        fg = '#065F46';
      } else if (type === 'suspended' || type === 'draft' || type === 'pending') {
        bg = '#FFFBEB';
        fg = '#92400E';
      } else if (type === 'deactivated' || type === 'rejected') {
        bg = '#FEF2F2';
        fg = '#991B1B';
      }
      return {
        padding: '3px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'capitalize',
        backgroundColor: bg,
        color: fg,
        display: 'inline-block',
      };
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(37, 37, 37, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    },
    modalBox: {
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      width: '100%',
      maxWidth: '620px',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: '28px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR NAVIGATION */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <SkillProofLogo size={34} theme="dark" subtitle="ADMIN CONTROL PANEL" />
        </div>

        <nav style={{ padding: '14px 0', flex: 1, overflowY: 'auto' }}>
          <div style={styles.navItem(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} color={activeTab === 'overview' ? '#C46A45' : '#D1C8BA'} />
            Dashboard Overview
          </div>
          <div style={styles.navItem(activeTab === 'users')} onClick={() => setActiveTab('users')}>
            <Users size={18} color={activeTab === 'users' ? '#C46A45' : '#D1C8BA'} />
            User Management
          </div>
          <div style={styles.navItem(activeTab === 'roadmaps')} onClick={() => setActiveTab('roadmaps')}>
            <Map size={18} color={activeTab === 'roadmaps' ? '#C46A45' : '#D1C8BA'} />
            Career Roadmaps
          </div>
          <div style={styles.navItem(activeTab === 'materials')} onClick={() => setActiveTab('materials')}>
            <BookOpen size={18} color={activeTab === 'materials' ? '#C46A45' : '#D1C8BA'} />
            Study Materials
          </div>
          <div style={styles.navItem(activeTab === 'courses')} onClick={() => setActiveTab('courses')}>
            <GraduationCap size={18} color={activeTab === 'courses' ? '#C46A45' : '#D1C8BA'} />
            Free Courses
          </div>
          <div style={styles.navItem(activeTab === 'assessments')} onClick={() => setActiveTab('assessments')}>
            <FileCheck size={18} color={activeTab === 'assessments' ? '#C46A45' : '#D1C8BA'} />
            Assessments &amp; Integrity
          </div>
          <div style={styles.navItem(activeTab === 'evidence')} onClick={() => setActiveTab('evidence')}>
            <Award size={18} color={activeTab === 'evidence' ? '#C46A45' : '#D1C8BA'} />
            Evidence Verification
          </div>
          <div style={styles.navItem(activeTab === 'reports')} onClick={() => setActiveTab('reports')}>
            <FileText size={18} color={activeTab === 'reports' ? '#C46A45' : '#D1C8BA'} />
            Institutional Reports
          </div>
          <div style={styles.navItem(activeTab === 'settings')} onClick={() => setActiveTab('settings')}>
            <Settings size={18} color={activeTab === 'settings' ? '#C46A45' : '#D1C8BA'} />
            Admin Settings &amp; Logs
          </div>
        </nav>

        {/* Sidebar Footer User Info */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAF6EF' }}>
              {user?.fullName || 'Website Owner'}
            </div>
            <div style={{ fontSize: '11px', color: '#B89B6A' }}>Master Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of Admin Panel"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#D1C8BA',
              padding: '6px',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div style={styles.main}>
        {/* Top Navbar */}
        <header style={styles.topNav}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, textTransform: 'capitalize' }}>
              {activeTab === 'overview' && 'Administrative Overview & Telemetry'}
              {activeTab === 'users' && 'Institutional User Directory'}
              {activeTab === 'roadmaps' && 'Career Learning Roadmaps'}
              {activeTab === 'materials' && 'Topic Study Materials & Documentation'}
              {activeTab === 'courses' && 'Free Curriculum & Course Integration'}
              {activeTab === 'assessments' && 'Assessment Engine & Integrity Logs'}
              {activeTab === 'evidence' && 'Skill Passport Evidence Audit'}
              {activeTab === 'reports' && 'Institutional Reports & Analytics'}
              {activeTab === 'settings' && 'Master Security Settings & Audit Trail'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              style={styles.btnSecondary}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Sync
            </button>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#C46A45',
                backgroundColor: 'rgba(196, 106, 69, 0.1)',
                padding: '4px 10px',
                borderRadius: '9999px',
              }}
            >
              Authorized Admin
            </span>
          </div>
        </header>

        {/* Feedback Alert Toast */}
        {feedback.message && (
          <div
            style={{
              margin: '16px 28px 0 28px',
              padding: '12px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: feedback.type === 'success' ? '#065F46' : '#991B1B',
              border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
            }}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Content Area */}
        <main style={styles.contentArea}>
          {/* ==================================================== */}
          {/* 1. OVERVIEW TAB */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div>
              {/* Telemetry Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Registered Students
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#252525', marginTop: '6px' }}>
                    {overviewStats?.totalStudents ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    HR Recruiters
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#252525', marginTop: '6px' }}>
                    {overviewStats?.totalRecruiters ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Placement Officers
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#252525', marginTop: '6px' }}>
                    {overviewStats?.totalPlacementOfficers ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Active Accounts
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#065F46', marginTop: '6px' }}>
                    {overviewStats?.totalActiveUsers ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Career Roadmaps
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#C46A45', marginTop: '6px' }}>
                    {overviewStats?.totalRoadmaps ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Free Courses
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#B89B6A', marginTop: '6px' }}>
                    {overviewStats?.totalCourses ?? 0}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Code Assessments
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#252525', marginTop: '6px' }}>
                    {overviewStats?.totalAssessments ?? 0}
                  </div>
                </div>
              </div>

              {/* Quick Actions & System Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0', color: '#252525' }}>
                    Administrative Quick Actions
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={styles.btnPrimary} onClick={() => { setActiveTab('roadmaps'); setShowRoadmapModal(true); }}>
                      <Plus size={14} /> Add Roadmap
                    </button>
                    <button style={styles.btnSecondary} onClick={() => { setActiveTab('courses'); setShowCourseModal(true); }}>
                      <Plus size={14} /> Add Free Course
                    </button>
                    <button style={styles.btnSecondary} onClick={() => { setActiveTab('assessments'); setShowAssessmentModal(true); }}>
                      <Plus size={14} /> Create Assessment
                    </button>
                    <button style={styles.btnSecondary} onClick={() => setActiveTab('evidence')}>
                      <Award size={14} /> Verify Evidence
                    </button>
                    <button style={styles.btnSecondary} onClick={() => setActiveTab('reports')}>
                      <Download size={14} /> Export Institutional Reports
                    </button>
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0', color: '#252525' }}>
                    Platform Health
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#77736D' }}>REST API Status</span>
                      <span style={styles.badge('active')}>Operational</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#77736D' }}>Proctor AI Service</span>
                      <span style={styles.badge('active')}>Zero-Tolerance Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#77736D' }}>Security Protocol</span>
                      <span style={{ fontWeight: 600, color: '#C46A45' }}>AES-256 + RBAC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities & Security Audit Table */}
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#252525' }}>
                    Recent System &amp; Administrative Activities
                  </h3>
                  <button style={styles.btnSecondary} onClick={() => setActiveTab('settings')}>
                    View All Audit Logs &rarr;
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Timestamp</th>
                        <th style={styles.th}>Action Event</th>
                        <th style={styles.th}>Initiator</th>
                        <th style={styles.th}>Target Type</th>
                        <th style={styles.th}>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            No recent activity logs recorded yet.
                          </td>
                        </tr>
                      ) : (
                        recentActivities.slice(0, 10).map((act, idx) => (
                          <tr key={idx}>
                            <td style={styles.td}>
                              {new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString()}
                            </td>
                            <td style={{ ...styles.td, fontWeight: 700, color: '#C46A45' }}>{act.action}</td>
                            <td style={styles.td}>{act.userEmail || act.user || 'System'}</td>
                            <td style={styles.td}>{act.resourceType || 'SECURITY'}</td>
                            <td style={styles.td}>{act.ipAddress || '127.0.0.1'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. USER MANAGEMENT TAB */}
          {/* ==================================================== */}
          {activeTab === 'users' && (
            <div>
              {/* Search & Filters */}
              <div style={{ ...styles.card, padding: '16px 20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="#77736D" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by full name or email..."
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      border: '1px solid #E8E1D7',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E8E1D7',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    color: '#252525',
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="placement_officer">Placement Officers</option>
                  <option value="admin">Administrators</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E8E1D7',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    color: '#252525',
                  }}
                >
                  <option value="all">All Account Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>

              {/* Users Table */}
              <div style={styles.card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Full Name</th>
                        <th style={styles.th}>Email Address</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Registered</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            No users matched your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id}>
                            <td style={{ ...styles.td, fontWeight: 700 }}>{u.fullName}</td>
                            <td style={styles.td}>{u.email}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(u.role)}>{u.role.replace('_', ' ')}</span>
                            </td>
                            <td style={styles.td}>
                              <span style={styles.badge(u.status || 'active')}>{u.status || 'active'}</span>
                            </td>
                            <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => setSelectedUser(u)}
                                  title="View User Details"
                                  style={{ ...styles.btnSecondary, padding: '4px 8px' }}
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => {
                                    setUserRoleModal(u);
                                    setNewRoleVal(u.role);
                                  }}
                                  title="Change Role"
                                  style={{ ...styles.btnSecondary, padding: '4px 8px' }}
                                >
                                  <UserCheck size={13} />
                                </button>
                                {u.status !== 'suspended' && (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u._id, 'suspended')}
                                    title="Suspend User"
                                    style={{ ...styles.btnSecondary, padding: '4px 8px', color: '#B45309' }}
                                  >
                                    Suspend
                                  </button>
                                )}
                                {u.status === 'suspended' && (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u._id, 'active')}
                                    title="Activate User"
                                    style={{ ...styles.btnSecondary, padding: '4px 8px', color: '#065F46' }}
                                  >
                                    Activate
                                  </button>
                                )}
                                {u.status !== 'deactivated' && (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u._id, 'deactivated')}
                                    title="Deactivate User"
                                    style={{ ...styles.btnSecondary, padding: '4px 8px', color: '#991B1B' }}
                                  >
                                    Deactivate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View Details Modal */}
              {selectedUser && (
                <div style={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
                  <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>User Profile Intelligence</h3>
                      <button onClick={() => setSelectedUser(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <XCircle size={20} color="#77736D" />
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      <div><strong>Full Name:</strong> {selectedUser.fullName}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      <div><strong>Role:</strong> <span style={styles.badge(selectedUser.role)}>{selectedUser.role}</span></div>
                      <div><strong>Status:</strong> <span style={styles.badge(selectedUser.status || 'active')}>{selectedUser.status || 'active'}</span></div>
                      <div><strong>User ID:</strong> <code style={{ backgroundColor: '#FAF6EF', padding: '2px 6px', borderRadius: '4px' }}>{selectedUser._id}</code></div>
                      <div><strong>Registered At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                      <div><strong>Email Verified:</strong> {selectedUser.isEmailVerified ? 'Yes' : 'Pending Verification'}</div>
                    </div>
                    <div style={{ marginTop: '24px', textAlign: 'right' }}>
                      <button style={styles.btnSecondary} onClick={() => setSelectedUser(null)}>Close</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Role Modal */}
              {userRoleModal && (
                <div style={styles.modalOverlay} onClick={() => setUserRoleModal(null)}>
                  <div style={{ ...styles.modalBox, maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', fontWeight: 800 }}>
                      Change User Role
                    </h3>
                    <p style={{ fontSize: '13px', color: '#77736D', margin: '0 0 16px 0' }}>
                      Modify institutional authorization for <strong>{userRoleModal.fullName}</strong> ({userRoleModal.email}).
                    </p>
                    <select
                      value={newRoleVal}
                      onChange={(e) => setNewRoleVal(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E8E1D7',
                        fontSize: '13px',
                        marginBottom: '20px',
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="recruiter">HR Recruiter</option>
                      <option value="placement_officer">Placement Officer</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button style={styles.btnSecondary} onClick={() => setUserRoleModal(null)}>Cancel</button>
                      <button style={styles.btnPrimary} onClick={handleUpdateUserRole}>Save Role Assignment</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. CAREER ROADMAPS TAB */}
          {/* ==================================================== */}
          {activeTab === 'roadmaps' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Career Learning Paths</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#77736D' }}>
                    Publish, edit, and organize curriculum paths and skill competencies.
                  </p>
                </div>
                <button
                  style={styles.btnPrimary}
                  onClick={() => {
                    setEditingRoadmap(null);
                    setRoadmapFormData({
                      title: '',
                      slug: '',
                      category: 'Software Engineering',
                      estimatedDuration: '6 Months',
                      description: '',
                      requiredSkills: '',
                      status: 'published',
                    });
                    setShowRoadmapModal(true);
                  }}
                >
                  <Plus size={14} /> Create Career Roadmap
                </button>
              </div>

              {/* Roadmaps Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {roadmaps.map((rm) => (
                  <div key={rm._id || rm.slug} style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={styles.badge(rm.status || 'published')}>{rm.status || 'published'}</span>
                      <span style={{ fontSize: '11px', color: '#77736D', fontWeight: 600 }}>{rm.category}</span>
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#252525' }}>
                      {rm.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#77736D', margin: '0 0 14px 0', minHeight: '34px' }}>
                      {rm.description || 'Structured learning roadmap with hands-on practice modules.'}
                    </p>

                    <div style={{ fontSize: '12px', color: '#252525', marginBottom: '14px', display: 'flex', gap: '16px' }}>
                      <div><strong>Duration:</strong> {rm.estimatedDuration}</div>
                      <div><strong>Modules:</strong> {rm.modules?.length || 0}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8E1D7', paddingTop: '14px' }}>
                      <button
                        onClick={() => handleToggleRoadmapPublish(rm)}
                        style={{ ...styles.btnSecondary, padding: '4px 8px', fontSize: '11px' }}
                      >
                        {rm.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingRoadmap(rm);
                            setRoadmapFormData({
                              title: rm.title,
                              slug: rm.slug,
                              category: rm.category,
                              estimatedDuration: rm.estimatedDuration,
                              description: rm.description,
                              requiredSkills: Array.isArray(rm.requiredSkills) ? rm.requiredSkills.join(', ') : rm.requiredSkills,
                              status: rm.status || 'published',
                            });
                            setShowRoadmapModal(true);
                          }}
                          style={{ ...styles.btnSecondary, padding: '4px 8px' }}
                          title="Edit Roadmap"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoadmap(rm._id || rm.slug)}
                          style={{ ...styles.btnSecondary, padding: '4px 8px', color: '#991B1B' }}
                          title="Delete Roadmap"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create / Edit Roadmap Modal */}
              {showRoadmapModal && (
                <div style={styles.modalOverlay} onClick={() => setShowRoadmapModal(false)}>
                  <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>
                      {editingRoadmap ? 'Edit Career Roadmap' : 'Create New Career Roadmap'}
                    </h3>

                    <form onSubmit={handleSaveRoadmap}>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          Roadmap Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={roadmapFormData.title}
                          onChange={(e) => setRoadmapFormData({ ...roadmapFormData, title: e.target.value })}
                          placeholder="e.g. Full Stack Web Developer"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          required
                          value={roadmapFormData.slug}
                          onChange={(e) => setRoadmapFormData({ ...roadmapFormData, slug: e.target.value })}
                          placeholder="e.g. full-stack-web-developer"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                          <input
                            type="text"
                            value={roadmapFormData.category}
                            onChange={(e) => setRoadmapFormData({ ...roadmapFormData, category: e.target.value })}
                            placeholder="e.g. Web Development"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Duration</label>
                          <input
                            type="text"
                            value={roadmapFormData.estimatedDuration}
                            onChange={(e) => setRoadmapFormData({ ...roadmapFormData, estimatedDuration: e.target.value })}
                            placeholder="e.g. 6 Months"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={roadmapFormData.description}
                          onChange={(e) => setRoadmapFormData({ ...roadmapFormData, description: e.target.value })}
                          placeholder="Comprehensive career path overview..."
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          Required Skills (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={roadmapFormData.requiredSkills}
                          onChange={(e) => setRoadmapFormData({ ...roadmapFormData, requiredSkills: e.target.value })}
                          placeholder="JavaScript, React, Node.js, MongoDB"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" style={styles.btnSecondary} onClick={() => setShowRoadmapModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" style={styles.btnPrimary}>
                          Save Roadmap
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. STUDY MATERIALS TAB */}
          {/* ==================================================== */}
          {activeTab === 'materials' && (
            <div>
              <div style={{ ...styles.card, maxWidth: '720px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>
                  Upload &amp; Assign Topic Study Materials
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#77736D' }}>
                  Upload learning documents (PDF, notes) or configure external reference documentation for student roadmap topics.
                </p>

                <form onSubmit={handleUploadStudyMaterial}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        Select Career Roadmap *
                      </label>
                      <select
                        value={selectedRoadmapForMaterial}
                        onChange={(e) => {
                          setSelectedRoadmapForMaterial(e.target.value);
                          setSelectedTopicIdForMaterial('');
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px' }}
                      >
                        {roadmaps.map((r) => (
                          <option key={r.slug || r._id} value={r.slug || r._id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        Select Target Topic *
                      </label>
                      <select
                        value={selectedTopicIdForMaterial}
                        onChange={(e) => setSelectedTopicIdForMaterial(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px' }}
                      >
                        <option value="">-- Choose Module Topic --</option>
                        {currentTopics.map((t) => (
                          <option key={t.topicId} value={t.topicId}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      Material Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                      placeholder="e.g. REST API Principles &amp; Architecture Notes"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        Material Type
                      </label>
                      <select
                        value={materialForm.type}
                        onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px' }}
                      >
                        <option value="notes">Concept Notes</option>
                        <option value="code">Code Syntax &amp; Examples</option>
                        <option value="interview_qa">Interview Questions &amp; Answers</option>
                        <option value="document">PDF / Learning Document</option>
                        <option value="link">Official Documentation Link</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        External URL Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={materialForm.url}
                        onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                        placeholder="https://developer.mozilla.org"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      Upload Learning Document (PDF, PNG, etc.)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setMaterialFile(e.target.files[0] || null)}
                      style={{ fontSize: '13px', color: '#77736D' }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      Study Notes / Code Snippet / Body Content
                    </label>
                    <textarea
                      rows={5}
                      value={materialForm.content}
                      onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                      placeholder="Enter detailed study explanations, important concepts, interview preparation notes..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button type="submit" style={styles.btnPrimary}>
                    <Plus size={14} /> Assign Study Material to Topic
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 5. FREE COURSES TAB */}
          {/* ==================================================== */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Free Curriculum Directory</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#77736D' }}>
                    Manage verified free educational courses from Harvard, FreeCodeCamp, Coursera, and MIT.
                  </p>
                </div>
                <button
                  style={styles.btnPrimary}
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseFormData({
                      title: '',
                      provider: '',
                      url: '',
                      skillLevel: 'Beginner',
                      duration: '4 Weeks',
                      isFree: true,
                      hasCertificate: false,
                      category: 'General',
                      assignedRoadmapSlug: '',
                    });
                    setShowCourseModal(true);
                  }}
                >
                  <Plus size={14} /> Add Free Course
                </button>
              </div>

              {/* Course Directory Table */}
              <div style={styles.card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Course Title</th>
                        <th style={styles.th}>Provider</th>
                        <th style={styles.th}>Level</th>
                        <th style={styles.th}>Duration</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>URL</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            No courses found. Click 'Add Free Course' to add one.
                          </td>
                        </tr>
                      ) : (
                        courses.map((crs) => (
                          <tr key={crs._id}>
                            <td style={{ ...styles.td, fontWeight: 700 }}>{crs.title}</td>
                            <td style={styles.td}>{crs.provider}</td>
                            <td style={styles.td}>
                              <span style={styles.badge('active')}>{crs.skillLevel}</span>
                            </td>
                            <td style={styles.td}>{crs.duration}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(crs.isFree ? 'published' : 'draft')}>
                                {crs.isFree ? 'Free' : 'Paid'}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <a
                                href={crs.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#C46A45', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                Visit <ExternalLink size={12} />
                              </a>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => {
                                    setEditingCourse(crs);
                                    setCourseFormData(crs);
                                    setShowCourseModal(true);
                                  }}
                                  style={{ ...styles.btnSecondary, padding: '4px 8px' }}
                                  title="Edit Course"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(crs._id)}
                                  style={{ ...styles.btnSecondary, padding: '4px 8px', color: '#991B1B' }}
                                  title="Delete Course"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add / Edit Course Modal */}
              {showCourseModal && (
                <div style={styles.modalOverlay} onClick={() => setShowCourseModal(false)}>
                  <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>
                      {editingCourse ? 'Edit Free Course' : 'Add Free Educational Course'}
                    </h3>

                    <form onSubmit={handleSaveCourse}>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          Course Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={courseFormData.title}
                          onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                          placeholder="e.g. CS50: Introduction to Computer Science"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                            Course Provider *
                          </label>
                          <input
                            type="text"
                            required
                            value={courseFormData.provider}
                            onChange={(e) => setCourseFormData({ ...courseFormData, provider: e.target.value })}
                            placeholder="Harvard University / FreeCodeCamp"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                            Course URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={courseFormData.url}
                            onChange={(e) => setCourseFormData({ ...courseFormData, url: e.target.value })}
                            placeholder="https://pll.harvard.edu/course/cs50..."
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                            Skill Level
                          </label>
                          <select
                            value={courseFormData.skillLevel}
                            onChange={(e) => setCourseFormData({ ...courseFormData, skillLevel: e.target.value })}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px' }}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                            Estimated Duration
                          </label>
                          <input
                            type="text"
                            value={courseFormData.duration}
                            onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                            placeholder="e.g. 6 Weeks (Self-paced)"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={courseFormData.isFree}
                            onChange={(e) => setCourseFormData({ ...courseFormData, isFree: e.target.checked })}
                          />
                          100% Free Access
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={courseFormData.hasCertificate}
                            onChange={(e) => setCourseFormData({ ...courseFormData, hasCertificate: e.target.checked })}
                          />
                          Includes Certificate of Completion
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" style={styles.btnSecondary} onClick={() => setShowCourseModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" style={styles.btnPrimary}>
                          Save Course
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 6. ASSESSMENTS TAB */}
          {/* ==================================================== */}
          {activeTab === 'assessments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Proctored Assessments &amp; Integrity Logs</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#77736D' }}>
                    Configure proctored question banks, test parameters, and inspect student camera violation records.
                  </p>
                </div>
                <button style={styles.btnPrimary} onClick={() => setShowAssessmentModal(true)}>
                  <Plus size={14} /> Create Assessment
                </button>
              </div>

              {/* Assessment Catalogs */}
              <div style={{ ...styles.card, marginBottom: '28px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700 }}>Configured Assessments</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Domain</th>
                        <th style={styles.th}>Duration</th>
                        <th style={styles.th}>Passing %</th>
                        <th style={styles.th}>Questions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a) => (
                        <tr key={a._id}>
                          <td style={{ ...styles.td, fontWeight: 700 }}>{a.title}</td>
                          <td style={styles.td}>{a.domain}</td>
                          <td style={styles.td}>{a.durationMinutes} Minutes</td>
                          <td style={styles.td}>{a.passingScorePercentage}%</td>
                          <td style={styles.td}>{a.questions?.length || 0} Questions</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Integrity Violation Logs Table */}
              <div style={styles.card}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#991B1B' }}>
                  Student Integrity Violation Audit Log
                </h4>
                <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#77736D' }}>
                  Zero-tolerance camera phone detections, tab switching flags, and termination records.
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Student</th>
                        <th style={styles.th}>Assessment</th>
                        <th style={styles.th}>Attempt Status</th>
                        <th style={styles.th}>Violations Count</th>
                        <th style={styles.th}>Violation Detail / Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessmentViolations.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            Zero violations reported. All student sessions verified integrity-compliant.
                          </td>
                        </tr>
                      ) : (
                        assessmentViolations.map((att, idx) => (
                          <tr key={idx}>
                            <td style={{ ...styles.td, fontWeight: 700 }}>
                              {att.student?.fullName || att.student?.email || 'Student'}
                            </td>
                            <td style={styles.td}>{att.assessment?.title || 'Assessment'}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(att.status)}>{att.status}</span>
                            </td>
                            <td style={{ ...styles.td, color: '#991B1B', fontWeight: 800 }}>
                              {att.violations?.length || 0} Flags
                            </td>
                            <td style={styles.td}>
                              {att.violations?.map((v, i) => (
                                <div key={i} style={{ fontSize: '11px', color: '#991B1B' }}>
                                  &bull; {v.reason || v.type} ({new Date(v.timestamp).toLocaleTimeString()})
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Assessment Modal */}
              {showAssessmentModal && (
                <div style={styles.modalOverlay} onClick={() => setShowAssessmentModal(false)}>
                  <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>
                      Create New Proctored Assessment
                    </h3>

                    <form onSubmit={handleSaveAssessment}>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                          Assessment Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={assessmentFormData.title}
                          onChange={(e) => setAssessmentFormData({ ...assessmentFormData, title: e.target.value })}
                          placeholder="e.g. Advanced Distributed Systems &amp; Concurrency"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Domain</label>
                          <input
                            type="text"
                            value={assessmentFormData.domain}
                            onChange={(e) => setAssessmentFormData({ ...assessmentFormData, domain: e.target.value })}
                            placeholder="Software Engineering"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Duration (Minutes)</label>
                          <input
                            type="number"
                            value={assessmentFormData.durationMinutes}
                            onChange={(e) => setAssessmentFormData({ ...assessmentFormData, durationMinutes: parseInt(e.target.value) || 40 })}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      {/* Questions Section */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 700 }}>
                            Questions ({assessmentFormData.questions.length})
                          </label>
                          <button
                            type="button"
                            onClick={handleAddQuestionToAssessment}
                            style={{ ...styles.btnSecondary, padding: '4px 8px', fontSize: '11px' }}
                          >
                            + Add Question
                          </button>
                        </div>

                        {assessmentFormData.questions.map((q, qIndex) => (
                          <div key={qIndex} style={{ backgroundColor: '#FAF6EF', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                              Question {qIndex + 1}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Enter question text..."
                              value={q.questionText}
                              onChange={(e) => {
                                const newQ = [...assessmentFormData.questions];
                                newQ[qIndex].questionText = e.target.value;
                                setAssessmentFormData({ ...assessmentFormData, questions: newQ });
                              }}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E8E1D7', fontSize: '12px', marginBottom: '8px', boxSizing: 'border-box' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <input
                                    type="radio"
                                    name={`correct_${qIndex}`}
                                    checked={q.correctAnswer === oIndex}
                                    onChange={() => {
                                      const newQ = [...assessmentFormData.questions];
                                      newQ[qIndex].correctAnswer = oIndex;
                                      setAssessmentFormData({ ...assessmentFormData, questions: newQ });
                                    }}
                                  />
                                  <input
                                    type="text"
                                    required
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                    value={opt}
                                    onChange={(e) => {
                                      const newQ = [...assessmentFormData.questions];
                                      newQ[qIndex].options[oIndex] = e.target.value;
                                      setAssessmentFormData({ ...assessmentFormData, questions: newQ });
                                    }}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E8E1D7', fontSize: '11px', boxSizing: 'border-box' }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" style={styles.btnSecondary} onClick={() => setShowAssessmentModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" style={styles.btnPrimary}>
                          Save Assessment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 7. EVIDENCE MANAGEMENT TAB */}
          {/* ==================================================== */}
          {activeTab === 'evidence' && (
            <div>
              <div style={{ ...styles.card, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Skill Passport Evidence Review</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#77736D' }}>
                    Audit certificates, capstone projects, and GitHub repositories submitted by students.
                  </p>
                </div>

                <select
                  value={evidenceFilter}
                  onChange={(e) => setEvidenceFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E8E1D7',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Audit</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Evidence Table */}
              <div style={styles.card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Evidence Title</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Issuer / Platform</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Submitted Date</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Audit Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evidenceList.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            No evidence submissions found for the selected filter.
                          </td>
                        </tr>
                      ) : (
                        evidenceList.map((ev) => (
                          <tr key={ev._id}>
                            <td style={{ ...styles.td, fontWeight: 700 }}>
                              {ev.student?.fullName || ev.student?.email || 'Student'}
                            </td>
                            <td style={styles.td}>{ev.title}</td>
                            <td style={styles.td}>{ev.type}</td>
                            <td style={styles.td}>{ev.issuer || ev.platform || 'Institutional'}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(ev.verificationStatus)}>{ev.verificationStatus}</span>
                            </td>
                            <td style={styles.td}>{new Date(ev.createdAt).toLocaleDateString()}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                              <button
                                style={{ ...styles.btnPrimary, padding: '5px 10px', fontSize: '11px' }}
                                onClick={() => {
                                  setVerifyModal(ev);
                                  setVerifyStatus(ev.verificationStatus === 'verified' ? 'verified' : 'verified');
                                  setVerifyRemarks('');
                                }}
                              >
                                Audit &amp; Verify
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Modal */}
              {verifyModal && (
                <div style={styles.modalOverlay} onClick={() => setVerifyModal(null)}>
                  <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ margin: '0 0 14px 0', fontSize: '18px', fontWeight: 800 }}>
                      Verify Evidence Submission
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '18px' }}>
                      <div><strong>Student:</strong> {verifyModal.student?.fullName} ({verifyModal.student?.email})</div>
                      <div><strong>Evidence Title:</strong> {verifyModal.title}</div>
                      <div><strong>Type:</strong> {verifyModal.type}</div>
                      {verifyModal.verificationUrl && (
                        <div>
                          <strong>Verification URL:</strong>{' '}
                          <a href={verifyModal.verificationUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C46A45' }}>
                            {verifyModal.verificationUrl} <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Verification Verdict
                      </label>
                      <select
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px' }}
                      >
                        <option value="verified">Approve &amp; Verify into Skill Passport</option>
                        <option value="rejected">Reject Submission (Ineligible or Fraudulent)</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        Verification Comments / Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={verifyRemarks}
                        onChange={(e) => setVerifyRemarks(e.target.value)}
                        placeholder="Add institutional audit notes explaining the verification decision..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button style={styles.btnSecondary} onClick={() => setVerifyModal(null)}>Cancel</button>
                      <button style={styles.btnPrimary} onClick={handleVerifyEvidence}>Submit Verification</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 8. REPORTS TAB */}
          {/* ==================================================== */}
          {activeTab === 'reports' && (
            <div>
              <div style={styles.card}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>
                  Institutional Reports &amp; Data Export
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#77736D' }}>
                  Generate comprehensive audit summaries for website owners, stakeholders, and institutional leadership.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E8E1D7',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF',
                      minWidth: '220px',
                    }}
                  >
                    <option value="users">Registered Users &amp; Roles Report</option>
                    <option value="assessments">Assessment Results &amp; Integrity Report</option>
                    <option value="learning">Career Roadmap &amp; Progress Report</option>
                    <option value="evidence">Evidence &amp; Credential Verification Report</option>
                  </select>

                  <button style={styles.btnPrimary} onClick={handleExportCSV}>
                    <Download size={14} /> Export CSV Spreadsheet
                  </button>

                  <button style={styles.btnSecondary} onClick={handleExportPDF}>
                    <Printer size={14} /> Print / Save PDF Summary
                  </button>
                </div>

                <div style={{ backgroundColor: '#FAF6EF', padding: '16px', borderRadius: '8px', border: '1px solid #E8E1D7' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#252525', marginBottom: '4px' }}>
                    Automated Compliance &amp; Audit Ready
                  </div>
                  <div style={{ fontSize: '12px', color: '#77736D' }}>
                    All exported reports include real-time timestamping, cryptographic admin session verification, and full adherence to institutional records standards.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 9. ADMIN SETTINGS TAB */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                {/* Profile Settings */}
                <div style={styles.card}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800 }}>Admin Master Profile</h3>
                  <form onSubmit={handleUpdateAdminProfile}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={adminProfile.fullName}
                        onChange={(e) => setAdminProfile({ ...adminProfile, fullName: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        Admin Email
                      </label>
                      <input
                        type="email"
                        required
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button type="submit" style={styles.btnPrimary}>Save Profile Changes</button>
                  </form>
                </div>

                {/* Password Change */}
                <div style={styles.card}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800 }}>Change Master Password</h3>
                  <form onSubmit={handleChangeAdminPassword}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button type="submit" style={styles.btnPrimary}>Update Password</button>
                  </form>
                </div>
              </div>

              {/* Create Authorized Admin */}
              <div style={{ ...styles.card, maxWidth: '640px', marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Create Authorized Admin Account</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#77736D' }}>
                  Provision access for a co-freelancer, system architect, or platform owner.
                </p>
                <form onSubmit={handleCreateAdminAccount}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Admin Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAdminForm.fullName}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                        placeholder="e.g. Platform Administrator"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Admin Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        placeholder="newadmin@skillproof.ai"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Temporary Password *</label>
                    <input
                      type="password"
                      required
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E1D7', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button type="submit" style={styles.btnPrimary}>Create Admin Account</button>
                </form>
              </div>

              {/* Comprehensive Audit Logs Table */}
              <div style={styles.card}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800 }}>Comprehensive Audit Activity Logs</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Timestamp</th>
                        <th style={styles.th}>Action</th>
                        <th style={styles.th}>User / Initiator</th>
                        <th style={styles.th}>Target Resource</th>
                        <th style={styles.th}>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#77736D' }}>
                            No audit logs available.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td style={styles.td}>
                              {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td style={{ ...styles.td, fontWeight: 700, color: '#C46A45' }}>{log.action}</td>
                            <td style={styles.td}>{log.userEmail || log.user || 'System'}</td>
                            <td style={styles.td}>{log.resourceType || 'SECURITY'}</td>
                            <td style={styles.td}>{log.ipAddress || '127.0.0.1'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
