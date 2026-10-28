import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useAuth, RESTRICTION_MESSAGE } from '../../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isRestricted } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a protected URL attempt, immediately display the restriction message
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (location.state?.message) {
      setError(location.state.message);
    } else if (searchParams.get('restricted') === 'true') {
      setError(RESTRICTION_MESSAGE);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Requirement: Block dashboard access & prevent login navigation
    // Even if valid credentials are entered, display restriction message and block navigation
    if (isRestricted) {
      setError(RESTRICTION_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      const role = data.user.role;
      if (role === 'student') {
        navigate('/student/home');
      } else if (role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (role === 'placement_officer') {
        navigate('/placement/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (!err.response) {
        setError(
          'Cannot reach SkillProof backend API at http://localhost:5000. Please ensure the backend server is running.'
        );
      } else {
        setError(err.message || RESTRICTION_MESSAGE);
      }
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.75rem 2.5rem',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to access your SkillProof AI platform
          </p>
        </div>

        {/* Temporary Restriction Alert Banner */}
        {error && (
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
              lineHeight: 1.45,
            }}
          >
            <ShieldAlert size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} color="#64748b" /> Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="#64748b" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem', fontSize: '0.95rem' }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textAlign: 'center',
              marginBottom: '0.85rem',
            }}
          >
            One-Click Demo Portals
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => autofillDemo('student@skillproof.ai', 'Password@123')}
              style={{ fontSize: '0.78rem', gap: '0.3rem', padding: '0.45rem 0.5rem' }}
            >
              <GraduationCap size={14} color="#2563eb" />
              <span>Student</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => autofillDemo('recruiter@skillproof.ai', 'Password@123')}
              style={{ fontSize: '0.78rem', gap: '0.3rem', padding: '0.45rem 0.5rem' }}
            >
              <Building2 size={14} color="#d97706" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => autofillDemo('officer@skillproof.ai', 'Password@123')}
              style={{ fontSize: '0.78rem', gap: '0.3rem', padding: '0.45rem 0.5rem' }}
            >
              <Users size={14} color="#4f46e5" />
              <span>Placement</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
