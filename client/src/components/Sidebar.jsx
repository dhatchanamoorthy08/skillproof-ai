import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Compass,
  BarChart3,
  Briefcase,
  FileText,
  MessageSquare,
  Award,
  TrendingUp,
  Settings,
  Users,
  Search,
  CheckCircle,
  FileCheck2,
  GraduationCap,
  BellRing,
  ShieldAlert,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  // Structured Nav Groups for Student
  const studentNavGroups = [
    {
      title: 'Navigation',
      items: [
        { to: '/student/home', label: 'Home Feed', icon: <LayoutDashboard size={18} /> },
        { to: '/student/passport', label: 'Skill Passport', icon: <ShieldCheck size={18} /> },
        { to: '/student/evidence', label: 'Certificate Evidence', icon: <FileCheck2 size={18} /> },
        { to: '/student/roadmap', label: 'Career Roadmap', icon: <Compass size={18} /> },
      ],
    },
    {
      title: 'Assessment & Jobs',
      items: [
        { to: '/assessments', label: 'Online Assessments', icon: <Award size={18} /> },
        { to: '/student/jobs', label: 'Jobs & Internships', icon: <Briefcase size={18} /> },
        { to: '/student/interview-prep', label: 'Interview Prep', icon: <MessageSquare size={18} /> },
      ],
    },
    {
      title: 'Analytics & Tools',
      items: [
        { to: '/student/gaps', label: 'Skill Gap Analysis', icon: <BarChart3 size={18} /> },
        { to: '/student/resume', label: 'Resume Analysis', icon: <FileText size={18} /> },
        { to: '/student/trends', label: 'Industry Trends', icon: <TrendingUp size={18} /> },
        { to: '/student/settings', label: 'Settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  // Recruiter Nav Groups
  const recruiterNavGroups = [
    {
      title: 'Talent Discovery',
      items: [
        { to: '/recruiter/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { to: '/recruiter/candidates', label: 'Search Passports', icon: <Search size={18} /> },
        { to: '/recruiter/post-job', label: 'Post a Job', icon: <Briefcase size={18} /> },
      ],
    },
    {
      title: 'Pipeline & Accreditation',
      items: [
        { to: '/recruiter/applications', label: 'Applications Pipeline', icon: <Users size={18} /> },
        { to: '/recruiter/verification', label: 'Company Verification', icon: <CheckCircle size={18} /> },
        { to: '/recruiter/settings', label: 'Settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  // Placement Officer Nav Groups
  const placementNavGroups = [
    {
      title: 'Campus Command',
      items: [
        { to: '/placement/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { to: '/placement/proctoring', label: 'Proctoring Monitor', icon: <ShieldAlert size={18} /> },
        { to: '/placement/evidence-review', label: 'Certificate Verification', icon: <FileCheck2 size={18} /> },
        { to: '/placement/students', label: 'Student Directory', icon: <Users size={18} /> },
        { to: '/placement/alerts', label: 'Early Alerts', icon: <BellRing size={18} /> },
      ],
    },
    {
      title: 'Corporate Hiring',
      items: [
        { to: '/placement/drives', label: 'Hiring Drives', icon: <GraduationCap size={18} /> },
        { to: '/placement/verifications', label: 'Recruiter Approvals', icon: <FileCheck2 size={18} /> },
        { to: '/placement/reports', label: 'Placement Reports', icon: <BarChart3 size={18} /> },
        { to: '/placement/settings', label: 'Settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  let currentGroups = studentNavGroups;
  let roleTitle = 'Candidate Portal';
  let roleSubtitle = 'Evidence Engine';

  if (role === 'recruiter') {
    currentGroups = recruiterNavGroups;
    roleTitle = 'Corporate Talent';
    roleSubtitle = 'Recruiter Suite';
  } else if (role === 'placement_officer') {
    currentGroups = placementNavGroups;
    roleTitle = 'Placement Command';
    roleSubtitle = 'Institutional Console';
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
        <div className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <div style={{ lineHeight: 1.15, fontSize: '1.15rem' }}>
              SkillProof <span style={{ color: '#38bdf8' }}>AI</span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                marginTop: '2px',
              }}
            >
              {roleTitle}
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Groups Menu */}
      <nav className="sidebar-menu">
        {currentGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '0.5rem' }}>
            <div className="sidebar-section-title">{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer with Sign Out */}
      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="nav-link"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: '#f87171',
            borderRadius: 'var(--radius-md)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={18} />
          <span style={{ fontWeight: 600 }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
