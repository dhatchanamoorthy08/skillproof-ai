import React from 'react';
import { Bell, ShieldCheck, User, CheckCircle2, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, profile } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'recruiter':
        return { label: 'Corporate Recruiter', bg: '#FAF6EF', color: '#B89B6A', border: '#E2D3B8' };
      case 'placement_officer':
        return { label: 'Placement Director', bg: '#F5F1E9', color: '#252525', border: '#E8E1D7' };
      case 'student':
      default:
        return { label: 'Candidate', bg: '#FBF4F0', color: '#C46A45', border: '#E8C2B2' };
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
        borderBottom: '1px solid #E8E1D7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(37, 37, 37, 0.03)',
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
            color: '#252525',
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
            backgroundColor: '#FAF6EF',
            border: '1px solid #E8E1D7',
            borderRadius: '9999px',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: '#252525',
          }}
        >
          <ShieldCheck size={16} color="#C46A45" />
          <span>
            {profile?.collegeName || profile?.companyName || 'National Institute of Technology'}
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 800,
              backgroundColor: '#FFFFFF',
              color: '#B89B6A',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              border: '1px solid #E2D3B8',
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
            color: '#C46A45',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#FBF4F0',
            borderRadius: '9999px',
            border: '1px solid #E8C2B2',
          }}
        >
          <span className="pulse-dot-terracotta" style={{ width: '7px', height: '7px' }} />
          <span>Evidence Sync Active</span>
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: '#FFFFFF',
            border: '1px solid #E8E1D7',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#77736D',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37, 37, 37, 0.04)',
            transition: 'all 0.15s ease',
          }}
          title="Notifications"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C46A45')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E1D7')}
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
            border: '1px solid #E8E1D7',
            boxShadow: '0 1px 3px rgba(37, 37, 37, 0.04)',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#252525',
              color: '#FFFFFF',
              border: '2px solid #C46A45',
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
            <div style={{ fontWeight: 800, fontSize: '0.825rem', color: '#252525', lineHeight: 1.2 }}>
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
