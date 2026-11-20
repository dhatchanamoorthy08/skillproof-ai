import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SkillProofLogo } from '../components/SkillProofLogo';
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
  Maximize2,
  FileCheck2,
  Check,
  ChevronRight,
  Clock,
  Layers,
  Cpu,
  Globe2,
  Compass,
} from 'lucide-react';

export const LandingPage = () => {

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E9', color: '#252525', overflowX: 'hidden' }}>
      {/* =========================================================================
          1. PREMIUM TOP NAVIGATION BAR (Charcoal Glassmorphism)
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(37, 37, 37, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(232, 225, 215, 0.12)',
          padding: '0.85rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand Logo (Top-Left) */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <SkillProofLogo size={38} theme="dark" subtitle="Enterprise Skill Standard" />
          </Link>

          {/* Top-Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <Link
              to="/login"
              style={{
                color: '#F5F1E9',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(232, 225, 215, 0.22)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.5rem 1.15rem',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                color: '#FFFFFF',
                backgroundColor: '#C46A45',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(196, 106, 69, 0.35)',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. CORPORATE HERO SECTION (Charcoal Black #252525 + Warm Highlights)
          ========================================================================= */}
      <section
        className="bg-charcoal-hero bg-tech-grid-dark"
        style={{
          padding: '5.5rem 1.5rem 6.5rem 1.5rem',
          position: 'relative',
          color: '#FFFFFF',
        }}
      >
        <div className="glow-ambient-terracotta" style={{ top: '-100px', left: '15%' }} />
        <div className="glow-ambient-gold" style={{ bottom: '-150px', right: '10%' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Top Pill Announcement */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              className="telemetry-pill telemetry-pill-terracotta"
              style={{
                boxShadow: '0 4px 16px rgba(196, 106, 69, 0.25)',
                padding: '0.45rem 1.15rem',
                borderRadius: '9999px',
                background: 'rgba(196, 106, 69, 0.15)',
                border: '1px solid rgba(196, 106, 69, 0.35)',
              }}
            >
              <span className="pulse-dot-terracotta" />
              <span style={{ color: '#F5F1E9', fontSize: '0.85rem' }}>
                SkillProof 3.0 Enterprise Architecture Live
              </span>
            </div>
          </div>

          {/* Hero Headline */}
          <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto 3rem auto' }}>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                marginBottom: '1.5rem',
                color: '#FFFFFF',
              }}
            >
              The Verified Skill Standard for the{' '}
              <span className="text-terracotta-gradient">Modern Workforce</span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#D9D0C3',
                maxWidth: '780px',
                margin: '0 auto 2.5rem auto',
                fontWeight: 400,
              }}
            >
              Eliminate resume inflation. SkillProof AI combines automated 4-tier competency verification,
              tamper-proof skill passports, and distraction-free proctored assessments into one unified platform.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/register"
                className="btn btn-terracotta-glow btn-lg"
                style={{
                  padding: '0.95rem 2.25rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                }}
              >
                <span>Deploy Skill Passport Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-glass-charcoal btn-lg"
                style={{
                  padding: '0.95rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                }}
              >
                <span>Candidate Sign In</span>
              </Link>
            </div>
          </div>

          {/* SaaS Telemetry Dashboard Mockup */}
          <div
            className="glass-panel-dark"
            style={{
              maxWidth: '1080px',
              margin: '0 auto',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(232, 225, 215, 0.1)',
            }}
          >
            {/* Window Topbar */}
            <div
              style={{
                background: 'rgba(28, 28, 28, 0.95)',
                padding: '0.85rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(232, 225, 215, 0.1)',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C44545', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#B89B6A', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C46A45', display: 'inline-block' }} />
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#B89B6A',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Lock size={12} />
                <span>app.skillproof.ai/passport/candidate-sp-9082</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9C9790', fontWeight: 600 }}>
                Status: Verified
              </div>
            </div>

            {/* Mockup Dashboard Content */}
            <div style={{ padding: '2rem', backgroundColor: '#F5F1E9', color: '#252525' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                {/* Metric Card 1 */}
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E1D7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                      Overall Readiness Score
                    </span>
                    <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> Certified Tier 1
                    </span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#252525', margin: '0.4rem 0 0.2rem 0' }}>
                    94.8%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#B89B6A', fontWeight: 600 }}>
                    Top 2% in Algorithmic System Architecture
                  </div>
                </div>

                {/* Metric Card 2 */}
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E1D7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                      Proctored Assessments
                    </span>
                    <span className="badge badge-demonstrated" style={{ fontSize: '0.7rem' }}>
                      Zero Violations
                    </span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#252525', margin: '0.4rem 0 0.2rem 0' }}>
                    12 / 12
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#77736D' }}>
                    Proctored &bull; Strict Phone &amp; Fullscreen Monitored
                  </div>
                </div>

                {/* Metric Card 3 */}
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E1D7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                      Institution Accreditation
                    </span>
                    <span className="badge badge-ready" style={{ fontSize: '0.7rem' }}>
                      Placement Authorized
                    </span>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#252525', margin: '0.6rem 0 0.2rem 0' }}>
                    National Institute of Tech
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#C46A45', fontWeight: 600 }}>
                    Official Signature Verified #SP-88319
                  </div>
                </div>
              </div>

              {/* Skills Verification Grid Sample */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E8E1D7',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#252525', marginBottom: '0.85rem' }}>
                  Live Competency Breakdown (Cryptographically Verified)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Distributed Systems (98%)
                  </span>
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> React &amp; TypeScript (95%)
                  </span>
                  <span className="badge badge-demonstrated">
                    <Code2 size={13} /> Microservices Architecture (91%)
                  </span>
                  <span className="badge badge-demonstrated">
                    <Code2 size={13} /> PostgreSQL &amp; Query Optimization (89%)
                  </span>
                  <span className="badge badge-assessed">
                    <Award size={13} /> Docker &amp; Kubernetes (87%)
                  </span>
                  <span className="badge badge-claimed">
                    <Clock size={13} /> Cloud Native Security
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. STATS STRIP (Warm Ivory Background with Charcoal Text)
          ========================================================================= */}
      <section style={{ backgroundColor: '#FAF6EF', borderBottom: '1px solid #E8E1D7', padding: '3.5rem 1.5rem' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#C46A45', lineHeight: 1.1 }}>
              99.4%
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#252525', marginTop: '0.35rem' }}>
              Anti-Cheating Precision
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736D' }}>ML mobile phone &amp; fullscreen security</div>
          </div>
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#252525', lineHeight: 1.1 }}>
              4x Faster
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#252525', marginTop: '0.35rem' }}>
              Corporate Screening Time
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736D' }}>Verified evidence replaces resumes</div>
          </div>
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#B89B6A', lineHeight: 1.1 }}>
              100%
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#252525', marginTop: '0.35rem' }}>
              Privacy-Friendly Proctoring
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736D' }}>No face or eye tracking surveillance</div>
          </div>
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#C46A45', lineHeight: 1.1 }}>
              25,000+
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#252525', marginTop: '0.35rem' }}>
              Validated Credentials
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736D' }}>Accredited by placement boards</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 4-TIER VERIFICATION FLYWHEEL SECTION
          ========================================================================= */}
      <section id="flywheel" style={{ padding: '6rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#C46A45',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}
          >
            <Layers size={16} /> Four-Tier Skill Architecture
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#252525', marginBottom: '1rem' }}>
            Transforming Unverified Claims into Mathematical Proof
          </h2>
          <p style={{ color: '#77736D', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Resumes are self-reported words. The SkillProof Verification Flywheel converts raw claims into four distinct
            levels of proof backed by proctored code, Git commits, and institutional verification.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Level 1: Claimed */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-claimed">Tier 1: Claimed</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D' }}>Weight: 10%</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#252525' }}>
              Self-Reported Baseline
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736D', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Candidate declares their claimed skills, tools, and target career competencies during onboarding.
            </p>
            <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: '1rem', fontSize: '0.8rem', color: '#77736D' }}>
              <strong>Verification Step:</strong> Dynamic skill assessment generator unlocks custom test pools.
            </div>
          </div>

          {/* Level 2: Assessed */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-assessed">Tier 2: Assessed</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D' }}>Weight: 35%</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#252525' }}>
              Proctored Technical Exam
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736D', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Candidate sits for randomized, proctored examinations with phone detection and anti-cheat enforcement.
            </p>
            <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: '1rem', fontSize: '0.8rem', color: '#77736D' }}>
              <strong>Verification Step:</strong> Shuffled questions dynamically scored on the server.
            </div>
          </div>

          {/* Level 3: Demonstrated */}
          <div className="card-saas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-demonstrated">Tier 3: Demonstrated</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C46A45' }}>Weight: 75%</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#252525' }}>
              Production Project Evidence
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736D', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Code repositories, system architecture proofs, and live deployments verified by automated AST parsers.
            </p>
            <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: '1rem', fontSize: '0.8rem', color: '#77736D' }}>
              <strong>Verification Step:</strong> Git commit analysis and deployed artifact validation.
            </div>
          </div>

          {/* Level 4: Verified */}
          <div className="card-saas" style={{ border: '2px solid #C46A45', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-verified">Tier 4: Verified</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C46A45' }}>Weight: 100%</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#252525' }}>
              Institutional Accreditation
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736D', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              University placement officers and accredited faculty officially attest to candidate integrity and credentials.
            </p>
            <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: '1rem', fontSize: '0.8rem', color: '#C46A45', fontWeight: 600 }}>
              <strong>Verification Step:</strong> Tamper-proof institutional seal on the Skill Passport.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. TRI-PARTY ECOSYSTEM (Students, Recruiters, Placement Officers)
          ========================================================================= */}
      <section id="solutions" style={{ backgroundColor: '#FAF6EF', padding: '6rem 1.5rem', borderTop: '1px solid #E8E1D7', borderBottom: '1px solid #E8E1D7' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#C46A45',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              <Users size={16} /> Unified Stakeholder Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#252525', marginBottom: '1rem' }}>
              Engineered for Every Pillar of the Placement Ecosystem
            </h2>
            <p style={{ color: '#77736D', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Three specialized portals built on one shared cryptographic competency ledger.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Student Card */}
            <div className="card-saas">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#FBF4F0',
                  color: '#C46A45',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem', color: '#252525' }}>
                For Candidates &amp; Students
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Build an incontrovertible proof of competence. Replace vulnerable paper resumes with verified skill passports.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Personalized AI Career Roadmap with gap identification
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Proctored standardized skill assessments
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Direct matching with vetted corporate opportunities
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Create Candidate Passport <ArrowRight size={16} />
              </Link>
            </div>

            {/* Recruiter Card */}
            <div className="card-saas">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#FAF6EF',
                  color: '#B89B6A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Building2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem', color: '#252525' }}>
                For Corporate HR &amp; Recruiters
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Stop screening fabricated claims. Filter candidate pipelines by cryptographically verified skills and code evidence.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Semantic talent search across verified competency levels
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Instant verification of university accreditation status
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Direct hiring pipeline with pre-assessed candidates
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Deploy Recruiter Suite <ArrowRight size={16} />
              </Link>
            </div>

            {/* Placement Officer Card */}
            <div className="card-saas">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#F5F1E9',
                  color: '#252525',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem', color: '#252525' }}>
                For Placement Officers &amp; Deans
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Centralize campus hiring intelligence. Monitor student assessment integrity and accelerate corporate placement ratios.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Real-time exam proctoring &amp; violation monitoring
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Batch certificate verification &amp; institutional seals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#252525' }}>
                  <span className="saas-check-bullet"><Check size={13} /></span>
                  Hiring drive orchestrator with automated status tracking
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Launch Placement Console <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ADVANCED PROCTORING & ANTI-CHEATING SECURITY
          ========================================================================= */}
      <section
        id="security"
        className="bg-charcoal-hero bg-tech-grid-dark"
        style={{
          padding: '6rem 1.5rem',
          color: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
            <div
              className="telemetry-pill telemetry-pill-terracotta"
              style={{
                marginBottom: '1rem',
                background: 'rgba(196, 106, 69, 0.15)',
                border: '1px solid rgba(196, 106, 69, 0.35)',
                color: '#F5F1E9',
              }}
            >
              <Lock size={14} color="#C46A45" /> Zero-Trust Examination Engine
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
              Rigorous Security with Strict Privacy Standards
            </h2>
            <p style={{ color: '#D9D0C3', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Comprehensive integrity enforcement without intrusive facial surveillance. Candidates are verified fairly and transparently.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Security Item 1 */}
            <div className="card-saas-dark">
              <div style={{ color: '#C46A45', marginBottom: '1rem' }}>
                <Maximize2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Fullscreen Examination Lockdown
              </h3>
              <p style={{ color: '#B8AD9E', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Dedicated standalone assessment view completely isolates the candidate. Navbars, dashboards, and sidebars are excluded.
              </p>
            </div>

            {/* Security Item 2 */}
            <div className="card-saas-dark">
              <div style={{ color: '#B89B6A', marginBottom: '1rem' }}>
                <Smartphone size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Zero-Tolerance Phone Detection
              </h3>
              <p style={{ color: '#B8AD9E', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Computer vision ML detects visible mobile phones in the webcam view and immediately terminates the attempt with zero warnings.
              </p>
            </div>

            {/* Security Item 3 */}
            <div className="card-saas-dark">
              <div style={{ color: '#C46A45', marginBottom: '1rem' }}>
                <ShieldAlert size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Tab &amp; Window Focus Surveillance
              </h3>
              <p style={{ color: '#B8AD9E', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Immediate logging and enforcement if a student switches browser tabs, minimizes the window, or triggers external software.
              </p>
            </div>

            {/* Security Item 4 */}
            <div className="card-saas-dark">
              <div style={{ color: '#B89B6A', marginBottom: '1rem' }}>
                <Clock size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Server-Validated Time Lock
              </h3>
              <p style={{ color: '#B8AD9E', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Duration timing persists across reloads on the backend. When time expires, exams auto-submit with zero grace extension.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. INSTITUTIONAL GOVERNANCE & COMPLIANCE
          ========================================================================= */}
      <section id="governance" style={{ padding: '6rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#C46A45',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              <Globe2 size={16} /> Enterprise Governance
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#252525', marginBottom: '1.25rem' }}>
              Compliant with Academic and Corporate Hiring Standards
            </h2>
            <p style={{ color: '#77736D', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              SkillProof AI operates on an auditable cryptographic architecture. Every skill verified by an institution
              is signed with timestamps and immutable verification keys.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FBF4F0', color: '#C46A45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#252525', margin: '0 0 0.25rem 0' }}>Privacy-First Design</h4>
                  <p style={{ fontSize: '0.875rem', color: '#77736D', margin: 0 }}>No facial recognition or identity logging. Zero video recordings stored on disk.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FAF6EF', color: '#B89B6A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#252525', margin: '0 0 0.25rem 0' }}>Universal Portability</h4>
                  <p style={{ fontSize: '0.875rem', color: '#77736D', margin: 0 }}>Candidates retain their verified credentials across job transitions and university graduations.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F5F1E9', color: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#252525', margin: '0 0 0.25rem 0' }}>Audit-Ready Telemetry</h4>
                  <p style={{ fontSize: '0.875rem', color: '#77736D', margin: 0 }}>Every proctoring flag and evaluation event is permanently recorded in the institutional audit log.</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '2.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E1D7',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#252525', marginBottom: '1.25rem' }}>
              Institutional Attestation Snapshot
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#F5F1E9', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736D' }}>Accreditation Standard</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#252525' }}>ISO / IEEE Competency Matrix</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#F5F1E9', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736D' }}>Proctoring Verification</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C46A45' }}>Zero-Tolerance Automated</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#F5F1E9', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736D' }}>Student Data Retention</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#B89B6A' }}>Encrypted &bull; FERPA Compliant</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#F5F1E9', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736D' }}>Audit Integrity Hash</span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#252525' }}>SHA-256: 8f9b...a34e</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION SECTION
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#252525',
          color: '#FFFFFF',
          padding: '6rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="glow-ambient-terracotta" style={{ top: '-150px', left: '30%' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', fontWeight: 800, marginBottom: '1.25rem', color: '#FFFFFF' }}>
            Ready to Verify Real Competency?
          </h2>
          <p style={{ color: '#D9D0C3', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Join forward-thinking universities and enterprise hiring teams moving beyond the unverified resume.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-terracotta-glow btn-lg">
              Start Free Assessment <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-glass-charcoal btn-lg">
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. PROFESSIONAL FOOTER
          ========================================================================= */}
      <footer style={{ backgroundColor: '#1A1A1A', color: '#9C9790', padding: '4.5rem 1.5rem 2.5rem 1.5rem', borderTop: '1px solid #333333' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <SkillProofLogo size={32} theme="dark" />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#9C9790' }}>
              Standardizing verified competencies with cryptographically auditable skill passports.
            </p>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Solutions
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/assessments" style={{ color: '#9C9790', textDecoration: 'none' }}>Proctored Assessments</Link></li>
              <li><Link to="/register" style={{ color: '#9C9790', textDecoration: 'none' }}>Skill Passport Engine</Link></li>
              <li><Link to="/register" style={{ color: '#9C9790', textDecoration: 'none' }}>Recruiter Search</Link></li>
              <li><Link to="/register" style={{ color: '#9C9790', textDecoration: 'none' }}>Placement Director Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security &amp; Standards
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><span style={{ color: '#9C9790' }}>Phone Detection AI</span></li>
              <li><span style={{ color: '#9C9790' }}>Fullscreen Isolation</span></li>
              <li><span style={{ color: '#9C9790' }}>Privacy Code of Conduct</span></li>
              <li><span style={{ color: '#9C9790' }}>Server-Side Time Locks</span></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portal Access
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Link to="/login" style={{ color: '#C46A45', fontWeight: 600 }}>Candidate Sign In &rarr;</Link>
              <Link to="/login" style={{ color: '#B89B6A', fontWeight: 600 }}>Corporate Recruiter Sign In &rarr;</Link>
              <Link to="/login" style={{ color: '#D9D0C3', fontWeight: 600 }}>Placement Officer Sign In &rarr;</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid #2D2D2D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
          <div>&copy; {new Date().getFullYear()} SkillProof AI, Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
