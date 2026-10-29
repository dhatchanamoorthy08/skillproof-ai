import React from 'react';
import { Bell, ShieldCheck, User, CheckCircle2, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, profile } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'recruiter':
        return { label: 'Corporate Recruiter', bg: '#FEF8ED', color: '#B27315', border: '#F7D49E' };
      case 'placement_officer':
        return { label: 'Placement Director', bg: '#EDF3F1', color: '#142D2B', border: '#CADAD4' };
      case 'student':
      default:
        return { label: 'Candidate', bg: '#F0F7F4', color: '#07866A', border: '#B9E2D8' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <header className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="mobile-menu-toggle"
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#202824',
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

        <div className="institution-pill">
          <ShieldCheck size={16} color="#07866A" />
          <span>
            {profile?.collegeName || profile?.companyName || 'National Institute of Technology'}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: '#EFF8F2',
              color: '#247A48',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              border: '1px solid #A9DCBC',
            }}
          >
            <CheckCircle2 size={10} /> Verified
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Network & Live Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.775rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            padding: '0.35rem 0.75rem',
            backgroundColor: '#F4F6F2',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
          }}
        >
          <span className="live-indicator-dot" />
          <span>Evidence Sync Active</span>
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.15s ease',
          }}
          title="Notifications"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
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
              backgroundColor: '#C83E4D',
              boxShadow: '0 0 0 2px #ffffff',
            }}
          />
        </button>

        {/* User Identity Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.35rem 0.75rem 0.35rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#142D2B',
              color: '#FAFAF5',
              border: '1.5px solid #07866A',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {(user?.avatar || profile?.avatar) ? (
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
            <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user?.fullName || 'User Account'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
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
