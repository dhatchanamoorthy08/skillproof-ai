import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
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
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border-light)',
          padding: '1.25rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            SkillProof <span style={{ color: 'var(--primary)' }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '5.5rem 2rem 4rem 2rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            border: '1px solid var(--primary-border)',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
          }}
        >
          <Sparkles size={16} /> Enterprise Evidence-Based Skill Passport Platform
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            color: 'var(--text-main)',
            maxWidth: '920px',
            margin: '0 auto 1.5rem auto',
            letterSpacing: '-0.03em',
          }}
        >
          Prove Your Real Skills. <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Showcase Verified Potential.
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '760px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}
        >
          Replace unverified claims with verifiable evidence. SkillProof AI combines
          proctored technical evaluations, code audit trails, and transparent Job Readiness Indexing to
          connect top talent directly with institutional campus recruiters.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.65rem' }}>
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Explore Demo Portals
          </Link>
        </div>

        {/* 4 State Badges Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <span className="badge badge-claimed" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            1. Claimed Skill
          </span>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-assessed" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            2. Assessed Knowledge
          </span>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-demonstrated" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            3. Demonstrated Project
          </span>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-verified" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            4. Verified Evidence
          </span>
        </div>

        {/* Key Platform Stats Counter Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginTop: '4rem',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              98.4%
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verification Accuracy
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-heading)' }}>
              12,500+
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assessed Candidates
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#4f46e5', fontFamily: 'var(--font-heading)' }}>
              480+
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recruiter Organizations
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-heading)' }}>
              85%
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Campus Placement Rate
            </div>
          </div>
        </div>
      </section>

      {/* Role Value Propositions */}
      <section style={{ backgroundColor: 'var(--bg-main)', padding: '5rem 2rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Tailored For The Entire Hiring Ecosystem</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Three dedicated, secure dashboards built specifically for candidates, corporate talent scouts, and campus placement cells.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Student */}
            <div className="card" style={{ padding: '2.25rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>For Students</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Build an undeniable proof-of-work portfolio. Verify your skills through proctored coding assessments and project audits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Dynamic Job Readiness Index (JRI)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> PDF Resume Parser & ATS completeness check
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Personalized roadmaps & practice interviews
                </li>
              </ul>
            </div>

            {/* Recruiter */}
            <div className="card" style={{ padding: '2.25rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>For HR Recruiters</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                End the resume keyword roulette. Discover pre-verified technical candidates matched against your exact production stack.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> 2-Step verified corporate hiring access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Explainable candidate matching breakdown
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Filter by audited code repos & test scores
                </li>
              </ul>
            </div>

            {/* Placement Officer */}
            <div className="card" style={{ padding: '2.25rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>For Placement Officers</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Real-time visibility over batch readiness. Identify at-risk students before recruitment drives begin and export accredited reports.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Automated early alerts for unassessed students
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Recruiter accreditation & drive orchestration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="#16a34a" /> Instant PDF & CSV placement readiness exports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Integrity Architecture */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Integrity-First Assessment Architecture</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Built with multi-layered browser monitoring, server-side timer validation, and violation auditing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Lock size={22} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Fullscreen API Enforcement</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Monitors exit attempts, displays transparent warnings, and logs timestamped events for review.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <FileSearch size={22} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Page Visibility Monitoring</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Tracks tab changes and background window blur events with granular heartbeat updates.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Code2 size={22} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Clipboard & Context Shield</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Restricts unauthorized copy-paste operations and suppresses browser context menus during tests.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Award size={22} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Server-Side Auto-Scoring</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Correct answer keys never touch client JavaScript. Submissions are scored and verified on the server.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '4rem 2rem 2.5rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} color="#38bdf8" />
              SkillProof AI
            </div>
            <p style={{ fontSize: '0.875rem', maxWidth: '400px' }}>
              Evidence-Based Skill Passport & Campus Job Readiness Platform. Designed for verified engineering outcomes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: '#ffffff' }}>Sign In</Link>
            <Link to="/register" style={{ color: '#ffffff' }}>Register Account</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} SkillProof AI Platform. All rights reserved. Built for accredited institutions & engineering recruiters.
        </div>
      </footer>
    </div>
  );
};
