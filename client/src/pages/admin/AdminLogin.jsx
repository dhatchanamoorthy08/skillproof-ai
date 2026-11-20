import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@skillproof.ai');
    setPassword('Password@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F1E9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E1D7',
          boxShadow: '0 12px 32px rgba(37, 37, 37, 0.06)',
          padding: '36px 32px',
        }}
      >
        {/* Branding & Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: '#252525',
              color: '#FAF6EF',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={28} color="#C46A45" />
          </div>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#C46A45',
              backgroundColor: 'rgba(196, 106, 69, 0.08)',
              padding: '4px 10px',
              borderRadius: '9999px',
              marginBottom: '8px',
            }}
          >
            Master Administration Console
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#252525', margin: '0 0 6px 0' }}>
            SkillProof AI Admin
          </h1>
          <p style={{ fontSize: '13px', color: '#77736D', margin: 0 }}>
            Website Owner &amp; Freelancer Administrative Portal
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div
          style={{
            backgroundColor: '#FAF6EF',
            border: '1px solid #E8E1D7',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#252525' }}>
              Owner Demo Credentials
            </div>
            <div style={{ fontSize: '11px', color: '#77736D' }}>
              admin@skillproof.ai &bull; Password@123
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              backgroundColor: '#252525',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Key size={12} color="#B89B6A" /> Auto-Fill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#991B1B',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#252525',
                marginBottom: '6px',
              }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#77736D"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillproof.ai"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #E8E1D7',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  color: '#252525',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#252525',
                marginBottom: '6px',
              }}
            >
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#77736D"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #E8E1D7',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  color: '#252525',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: '#C46A45',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(196, 106, 69, 0.25)',
              transition: 'background-color 0.2s',
            }}
          >
            {submitting ? 'Authenticating Admin Session...' : 'Enter Admin Panel'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Security Disclaimers */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid #E8E1D7',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#77736D' }}>
            <CheckCircle size={13} color="#B89B6A" /> Role-based authorization: Admin access strictly enforced.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#77736D' }}>
            <CheckCircle size={13} color="#B89B6A" /> All management actions logged with timestamp and IP address.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link
            to="/"
            style={{
              fontSize: '12px',
              color: '#77736D',
              textDecoration: 'none',
            }}
          >
            &larr; Return to SkillProof AI Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
