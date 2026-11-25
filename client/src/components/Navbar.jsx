import React from 'react';
import { Bell, ShieldCheck, User, CheckCircle2, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, profile } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'recruiter':
        return { label: 'Corporate Recruiter', bg: '#F5F8FF', color: '#2455D6', border: '#BFC7D5' };
      case 'placement_officer':
        return { label: 'Placement Director', bg: '#F5F8FF', color: '#17233D', border: '#BFC7D5' };
      case 'student':
      default:
        return { label: 'Candidate', bg: '#EBF1FF', color: '#2455D6', border: '#C5D5FA' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <header
      className="topbar"
      style={{
        height: '70px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #BFC7D5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(23, 35, 61, 0.03)',
      }}
    >
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="mobile-menu-toggle"
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#17233D',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={22} />
        </button>

        {/* Institution / College Pill */}
        <div
          className="institution-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            backgroundColor: '#F5F8FF',
            border: '1px solid #BFC7D5',
            borderRadius: '9999px',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: '#17233D',
          }}
        >
          <ShieldCheck size={16} color="#2455D6" />
          <span>
            {profile?.collegeName || profile?.companyName || 'National Institute of Technology'}
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 800,
              backgroundColor: '#FFFFFF',
              color: '#2455D6',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              border: '1px solid #BFC7D5',
            }}
          >
            <CheckCircle2 size={10} /> Verified
          </span>
        </div>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Telemetry / Live Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.775rem',
            fontWeight: 700,
            color: '#2455D6',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#EBF1FF',
            borderRadius: '9999px',
            border: '1px solid #C5D5FA',
          }}
        >
          <span className="pulse-dot-cobalt" style={{ width: '7px', height: '7px' }} />
          <span>Evidence Sync Active</span>
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: '#FFFFFF',
            border: '1px solid #BFC7D5',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5A6882',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(23, 35, 61, 0.04)',
            transition: 'all 0.15s ease',
          }}
          title="Notifications"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2455D6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#BFC7D5')}
        >
          <Bell size={17} />
          <span
            style={{
              position: 'absolute',
              top: '7px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#C44545',
              boxShadow: '0 0 0 2px #FFFFFF',
            }}
          />
        </button>

        {/* User Identity Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.35rem 0.85rem 0.35rem 0.5rem',
            borderRadius: '9999px',
            background: '#FFFFFF',
            border: '1px solid #BFC7D5',
            boxShadow: '0 1px 3px rgba(23, 35, 61, 0.04)',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#17233D',
              color: '#FFFFFF',
              border: '2px solid #2455D6',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {user?.avatar || profile?.avatar ? (
              <img
                src={user?.avatar || profile?.avatar}
                alt={user?.fullName || 'User'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.fullName?.charAt(0) || <User size={16} />
            )}
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '0.825rem', color: '#17233D', lineHeight: 1.2 }}>
              {user?.fullName || 'User Account'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: roleBadge.bg,
                  color: roleBadge.color,
                  border: `1px solid ${roleBadge.border}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {roleBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
