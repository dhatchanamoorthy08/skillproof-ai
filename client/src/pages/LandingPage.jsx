import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Award,
  BarChart3,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  Code2,
  FileSearch,
  Lock,
  Camera,
  Smartphone,
  Eye,
  Maximize2,
  FileCheck2,
  Check,
  ChevronRight,
  Menu,
  X,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF5', color: '#142D2B', overflowX: 'hidden' }}>
      {/* =========================================================================
          1. PREMIUM TOP NAVIGATION BAR (Glassmorphism & Dark Navy)
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7, 13, 27, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.9rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.025em',
                  color: '#FFFFFF',
                }}
              >
                SkillProof <span style={{ color: '#10B981' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Enterprise Skill Passport
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              gap: '2rem',
              alignItems: 'center',
            }}
            className="desktop-nav-links"
          >
            <a href="#solutions" style={{ color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}>
              Solutions
            </a>
            <a href="#flywheel" style={{ color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}>
              Verification Flywheel
            </a>
            <a href="#security" style={{ color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}>
              Anti-Cheating Security
            </a>
            <a href="#ecosystem" style={{ color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}>
              Role Portals
            </a>
          </nav>

          {/* Auth CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/login"
              style={{
                color: '#E2E8F0',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-emerald-glow"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                padding: '4px',
                cursor: 'pointer',
              }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Solutions
            </a>
            <a
              href="#flywheel"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Verification Flywheel
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Anti-Cheating Security
            </a>
            <a
              href="#ecosystem"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Role Portals
            </a>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION — PREMIUM DARK NAVY + TECHNOLOGY GRID + AURA GLOWS
          ========================================================================= */}
      <section
        className="bg-navy-hero bg-tech-grid-dark"
        style={{
          padding: '5rem 1.5rem 6.5rem 1.5rem',
          position: 'relative',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        {/* Ambient Glow Spheres */}
        <div className="glow-ambient-emerald" style={{ top: '-10%', left: '15%' }} />
        <div className="glow-ambient-cyan" style={{ top: '25%', right: '10%' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Announcement Telemetry Pill */}
          <div
            className="telemetry-pill telemetry-pill-emerald"
            style={{
              marginBottom: '1.75rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            }}
          >
            <span className="pulse-dot-emerald" />
            <span>AI Proctoring Engine 2.0 &bull; Computer Vision Phone Detection Active</span>
          </div>

          {/* Main Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              margin: '0 auto 1.5rem auto',
              maxWidth: '980px',
            }}
          >
            Prove Verified Skills. <br />
            <span className="text-emerald-gradient">
              Eliminate Resume Inflation.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#94A3B8',
              maxWidth: '780px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            The world-class SaaS skill passport platform connecting engineering talent with campus
            recruiters through proctored evaluations, code audit trails, and transparent Job Readiness Indexing.
          </p>

          {/* Hero Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <Link
              to="/register"
              className="btn-emerald-glow"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="btn-glass-navy"
              style={{
                padding: '0.85rem 1.85rem',
                fontSize: '1.025rem',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              <span>Explore Demo Portals</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* =========================================================================
              3. FLOATING INTERACTIVE SAAS UI MOCKUP SHOWCASE
              ========================================================================= */}
          <div
            className="glass-panel-dark"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
              textAlign: 'left',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Mockup Browser Window Header */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: 'rgba(10, 19, 38, 0.85)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 14px',
                  borderRadius: '6px',
                  fontSize: '0.725rem',
                  color: '#94A3B8',
                  fontFamily: 'monospace',
                }}
              >
                https://skillproof.ai/passport/verify/c89f2a41
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.725rem', color: '#10B981', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Cryptographically Verified
              </div>
            </div>

            {/* Mockup Content Dashboard Body */}
            <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Left Column: Candidate & Job Readiness Index */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981, #047857)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      color: '#ffffff',
                    }}
                  >
                    AS
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Arjun Sharma</div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8' }}>B.Tech Computer Science &bull; Class of 2026</div>
                  </div>
                </div>

                {/* Score Dial Box */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      Job Readiness Index (JRI)
                    </span>
                    <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700 }}>Top 4% Batch</span>
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#10B981', lineHeight: 1 }}>
                    92<span style={{ fontSize: '1.1rem', color: '#64748B' }}>/100</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                    High-probability match for Tier-1 Systems & Backend engineering roles.
                  </div>
                </div>
              </div>

              {/* Right Column: Proctored Competency Matrix & Proctoring Telemetry */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Verified Skills Audit Trail
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Distributed Systems & Databases</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>30/30 Questions &bull; Proctored 45 min</div>
                    </div>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                      96% Verified
                    </span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>React & High-Performance Web UI</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Project Audit &bull; Production Code Review</div>
                    </div>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                      91% Verified
                    </span>
                  </div>

                  {/* Proctor Telemetry Status */}
                  <div
                    style={{
                      marginTop: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                      <strong>AI Proctor Telemetry:</strong> 0 Violations &bull; Fullscreen Maintained &bull; No Device Detected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FOUR-STAGE VERIFICATION FLYWHEEL (Mint & Clean Palette)
          ========================================================================= */}
      <section
        id="flywheel"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="telemetry-pill telemetry-pill-emerald" style={{ marginBottom: '0.75rem' }}>
            <Award size={14} /> Cryptographic Proof Pipeline
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#142D2B', letterSpacing: '-0.025em' }}>
            How SkillProof AI Verifies Real Competency
          </h2>
          <p style={{ color: '#68756F', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
            A rigorous 4-step framework transitioning candidate claims into unassailable evidence.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', background: '#FEF8ED', padding: '3px 8px', borderRadius: '4px' }}>
                STAGE 01
              </span>
              <FileSearch size={22} color="#F59E0B" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Claimed Skill
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#68756F', lineHeight: 1.6 }}>
              Student inputs claimed proficiencies and uploads institutional certificates or coursework artifacts.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#142D2B', background: '#EDF3F1', padding: '3px 8px', borderRadius: '4px' }}>
                STAGE 02
              </span>
              <Lock size={22} color="#07866A" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Proctored Exam
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#68756F', lineHeight: 1.6 }}>
              Timed, randomized question pool in fullscreen mode with TensorFlow.js phone detection and tab lock.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#F0F7F4', padding: '3px 8px', borderRadius: '4px' }}>
                STAGE 03
              </span>
              <Code2 size={22} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Code Audit Trail
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#68756F', lineHeight: 1.6 }}>
              Automated git repository verification, test-suite coverage audits, and peer code analysis.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card-saas" style={{ border: '2px solid #10B981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', background: '#EFF8F2', padding: '3px 8px', borderRadius: '4px' }}>
                STAGE 04
              </span>
              <ShieldCheck size={22} color="#047857" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Verified Skill Passport
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#68756F', lineHeight: 1.6 }}>
              Cryptographically signed Digital Skill Passport recognized directly by campus recruiting partners.
            </p>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '3.5rem',
            padding: '2rem',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #DFE8E1',
            boxShadow: '0 4px 16px rgba(20, 45, 43, 0.04)',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>99.4%</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#68756F', textTransform: 'uppercase', marginTop: '6px' }}>
              Proctoring Integrity
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#142D2B', lineHeight: 1 }}>18,500+</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#68756F', textTransform: 'uppercase', marginTop: '6px' }}>
              Assessed Candidates
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>520+</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#68756F', textTransform: 'uppercase', marginTop: '6px' }}>
              Hiring Organizations
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>3.8x</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#68756F', textTransform: 'uppercase', marginTop: '6px' }}>
              Faster Shortlisting
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ROLE-SPECIFIC SAAS PLATFORM SOLUTIONS (Candidates, HR, Deans)
          ========================================================================= */}
      <section
        id="ecosystem"
        style={{
          padding: '5.5rem 1.5rem',
          backgroundColor: '#F3FAF6',
          borderTop: '1px solid #DFE8E1',
          borderBottom: '1px solid #DFE8E1',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="telemetry-pill telemetry-pill-emerald" style={{ marginBottom: '0.75rem' }}>
              <Users size={14} /> Multi-Stakeholder Ecosystem
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#142D2B', letterSpacing: '-0.025em' }}>
              Built Specifically for the Campus Hiring Pipeline
            </h2>
            <p style={{ color: '#68756F', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
              Three dedicated, secure dashboards serving candidates, corporate recruiters, and college placement directors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Student Card */}
            <div className="card-saas" style={{ background: '#FFFFFF' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#EFF8F2',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.75rem' }}>
                For Candidates & Students
              </h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Transform your raw effort into an undeniable, verified digital portfolio that recruiters actually trust.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Digital Skill Passport:</strong> Verifiable competency badges</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Job Readiness Index (JRI):</strong> Real-time benchmark</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>AI Resume Auditor:</strong> ATS matching against real jobs</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Targeted Roadmaps:</strong> Guided study paths for skill gaps</span>
                </li>
              </ul>
            </div>

            {/* Recruiter Card */}
            <div className="card-saas" style={{ background: '#FFFFFF' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#FEF8ED',
                  color: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Building2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.75rem' }}>
                For Talent Recruiters
              </h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Skip the keyword roulette. Discover pre-audited candidates matched mathematically against your production stack.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Pre-Verified Pipeline:</strong> Authenticated coding exams</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Explainable Match Scores:</strong> Understand candidate fits</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Verified Code Artifacts:</strong> Inspect audited GitHub repos</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Institutional Accreditation:</strong> Direct college access</span>
                </li>
              </ul>
            </div>

            {/* Placement Director Card */}
            <div className="card-saas" style={{ background: '#FFFFFF' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#EDF3F1',
                  color: '#142D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.75rem' }}>
                For Placement Officers
              </h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Complete batch-wide visibility over placement readiness, proactive at-risk alerts, and accreditation reporting.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Batch Readiness Radar:</strong> Real-time placement analytics</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Early Warning System:</strong> Intervene before drives begin</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>Drive Orchestration:</strong> Manage corporate campus drives</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  <span><strong>NBA/NAAC Export:</strong> One-click verified placement logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ADVANCED ASSESSMENT SECURITY & ANTI-CHEATING ARCHITECTURE (Dark Navy)
          ========================================================================= */}
      <section
        id="security"
        className="bg-navy-hero bg-tech-grid-dark"
        style={{
          padding: '6rem 1.5rem',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="telemetry-pill telemetry-pill-emerald" style={{ marginBottom: '0.75rem' }}>
              <ShieldAlert size={14} /> Zero-Tolerance Exam Security
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em' }}>
              Enterprise Anti-Cheating Architecture
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '680px', margin: '0.5rem auto 0 auto' }}>
              Multi-layered proctoring engine with client-side computer vision, browser sandboxing, and immutable audit logs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {/* Security Feature 1: Fullscreen Mode */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Maximize2 size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Dedicated Fullscreen Mode
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Completely removes the navbar, sidebar, and dashboard. Exiting fullscreen immediately triggers an audit violation.
              </p>
            </div>

            {/* Security Feature 2: Phone Detection */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Smartphone size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Computer Vision Phone Detection
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Powered by in-browser TensorFlow.js (COCO-SSD). Detects visible mobile phones with confidence ratings without fake alerts.
              </p>
            </div>

            {/* Security Feature 3: Tab Switch & Focus Loss */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Eye size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Tab & External App Monitoring
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Granular Page Visibility and window blur detectors flag external window focus loss, chat apps, and desktop switching.
              </p>
            </div>

            {/* Security Feature 4: Clipboard & DevTools Shield */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Lock size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Clipboard & DevTools Shield
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Blocks copy, cut, paste, right-click context menus, PrintScreen screenshot shortcuts, and browser inspection keys.
              </p>
            </div>

            {/* Security Feature 5: Server-Side Timing */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Clock size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Backend Timer Validation
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Examination timers are enforced server-side. Page refreshes preserve running countdowns and prevent artificial extensions.
              </p>
            </div>

            {/* Security Feature 6: Admin Audit Trail */}
            <div className="card-saas-dark">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Proctor Audit Log Drawer
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Detailed chronological logs with timestamps, violation severities, actions taken, and authorized retake controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONVERSION CALL TO ACTION BANNER
          ========================================================================= */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #070D1B 0%, #0F203D 60%, #08162E 100%)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="glow-ambient-emerald" style={{ top: '-30%', right: '10%' }} />

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Ready to Build a Verifiable Engineering Passport?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Join thousands of engineering students and over 500 recruiters who have replaced paper resumes with verified proof of work.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn-emerald-glow"
              style={{
                padding: '0.85rem 2.25rem',
                fontSize: '1.05rem',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn-glass-navy"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. MODERN SAAS ENTERPRISE FOOTER
          ========================================================================= */}
      <footer
        style={{
          backgroundColor: '#070D1B',
          color: '#94A3B8',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4rem 2rem 2.5rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                SkillProof <span style={{ color: '#10B981' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#64748B' }}>
              Enterprise Evidence-Based Skill Passport & Campus Job Readiness Platform. Designed for verified engineering outcomes.
            </p>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Ecosystem Portals</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Link to="/student/home" style={{ color: '#94A3B8', textDecoration: 'none' }}>Student Passport</Link>
              <Link to="/assessments" style={{ color: '#94A3B8', textDecoration: 'none' }}>Proctored Assessments</Link>
              <Link to="/recruiter/dashboard" style={{ color: '#94A3B8', textDecoration: 'none' }}>Recruiter Talent Search</Link>
              <Link to="/placement/dashboard" style={{ color: '#94A3B8', textDecoration: 'none' }}>Placement Officer Command</Link>
            </div>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Anti-Cheat Security</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>TensorFlow.js Vision Detection</span>
              <span style={{ color: '#94A3B8' }}>Fullscreen Sandboxing</span>
              <span style={{ color: '#94A3B8' }}>Tab Switch & Focus Logging</span>
              <span style={{ color: '#94A3B8' }}>Server-Side Auto-Scoring</span>
            </div>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Platform Status</h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10B981', marginBottom: '0.75rem' }}>
              <span className="pulse-dot-emerald" style={{ width: '6px', height: '6px' }} />
              All Systems Operational
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              ISO/IEC 27001 & SOC-2 Architecture Aligned
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#64748B',
          }}
        >
          <div>&copy; {new Date().getFullYear()} SkillProof AI Platform. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" style={{ color: '#64748B', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ color: '#64748B', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
