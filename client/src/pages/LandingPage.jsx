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
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF5', color: '#202824' }}>
      {/* Navigation */}
      <header
        style={{
          borderBottom: '1px solid #DFE8E1',
          padding: '1.2rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'rgba(250, 250, 245, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              background: '#07866A',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', color: '#142D2B' }}>
            SkillProof <span style={{ color: '#E8A23A' }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#ffffff', borderColor: '#DFE8E1', color: '#202824' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ backgroundColor: '#07866A', color: '#ffffff' }}>
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
            borderRadius: '9999px',
            background: '#F0F7F4',
            color: '#07866A',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            border: '1px solid #DFE8E1',
          }}
        >
          <Sparkles size={16} /> Enterprise Evidence-Based Skill Passport Platform
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#142D2B',
            maxWidth: '920px',
            margin: '0 auto 1.5rem auto',
            letterSpacing: '-0.03em',
          }}
        >
          Prove Your Real Skills. <br />
          <span style={{ color: '#07866A' }}>
            Showcase Verified Potential.
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: '#68756F',
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
          <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.65rem', backgroundColor: '#07866A', color: '#ffffff' }}>
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', borderColor: '#DFE8E1', color: '#202824' }}>
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
            marginTop: '3.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span className="badge badge-claimed" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
            1. Claimed Skill
          </span>
          <span style={{ color: '#68756F', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-assessed" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
            2. Assessed Knowledge
          </span>
          <span style={{ color: '#68756F', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-demonstrated" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
            3. Demonstrated Project
          </span>
          <span style={{ color: '#68756F', fontWeight: 700 }}>&rarr;</span>
          <span className="badge badge-verified" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
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
            borderRadius: '12px',
            border: '1px solid #DFE8E1',
            boxShadow: '0 2px 8px rgba(20, 45, 43, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#07866A', fontFamily: 'var(--font-heading)' }}>
              98.4%
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verification Accuracy
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#247A48', fontFamily: 'var(--font-heading)' }}>
              12,500+
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assessed Candidates
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#142D2B', fontFamily: 'var(--font-heading)' }}>
              480+
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recruiter Organizations
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#E8A23A', fontFamily: 'var(--font-heading)' }}>
              85%
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Campus Placement Rate
            </div>
          </div>
        </div>
      </section>

      {/* Role Value Propositions */}
      <section style={{ backgroundColor: '#FAFAF5', padding: '5rem 2rem', borderTop: '1px solid #DFE8E1' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: '#142D2B' }}>Tailored For The Entire Hiring Ecosystem</h2>
            <p style={{ color: '#68756F', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Three dedicated, secure dashboards built specifically for candidates, corporate talent scouts, and campus placement cells.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Student */}
            <div className="card" style={{ padding: '2.25rem', backgroundColor: '#FFFFFF', borderColor: '#DFE8E1' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: '#F0F7F4',
                  color: '#07866A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#142D2B' }}>For Students</h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Build an undeniable proof-of-work portfolio. Verify your skills through proctored coding assessments and project audits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Dynamic Job Readiness Index (JRI)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> PDF Resume Parser & ATS completeness check
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Personalized roadmaps & practice interviews
                </li>
              </ul>
            </div>

            {/* Recruiter */}
            <div className="card" style={{ padding: '2.25rem', backgroundColor: '#FFFFFF', borderColor: '#DFE8E1' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: '#FEF7ED',
                  color: '#E8A23A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#142D2B' }}>For HR Recruiters</h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                End the resume keyword roulette. Discover pre-verified technical candidates matched against your exact production stack.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> 2-Step verified corporate hiring access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Explainable candidate matching breakdown
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Filter by audited code repos & test scores
                </li>
              </ul>
            </div>

            {/* Placement Officer */}
            <div className="card" style={{ padding: '2.25rem', backgroundColor: '#FFFFFF', borderColor: '#DFE8E1' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: '#F0F4F8',
                  color: '#142D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#142D2B' }}>For Placement Officers</h3>
              <p style={{ color: '#68756F', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Real-time visibility over batch readiness. Identify at-risk students before recruitment drives begin and export accredited reports.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Automated early alerts for unassessed students
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Recruiter accreditation & drive orchestration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#202824' }}>
                  <CheckCircle2 size={16} color="#247A48" /> Instant PDF & CSV placement readiness exports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Integrity Architecture */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: '#142D2B' }}>Integrity-First Assessment Architecture</h2>
          <p style={{ color: '#68756F', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Built with multi-layered browser monitoring, server-side timer validation, and violation auditing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #DFE8E1', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
            <Lock size={22} color="#07866A" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#142D2B' }}>Fullscreen API Enforcement</h4>
            <p style={{ fontSize: '0.875rem', color: '#68756F' }}>
              Monitors exit attempts, displays transparent warnings, and logs timestamped events for review.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #DFE8E1', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
            <FileSearch size={22} color="#07866A" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#142D2B' }}>Page Visibility Monitoring</h4>
            <p style={{ fontSize: '0.875rem', color: '#68756F' }}>
              Tracks tab changes and background window blur events with granular heartbeat updates.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #DFE8E1', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
            <Code2 size={22} color="#07866A" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#142D2B' }}>Clipboard & Context Shield</h4>
            <p style={{ fontSize: '0.875rem', color: '#68756F' }}>
              Restricts unauthorized copy-paste operations and suppresses browser context menus during tests.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #DFE8E1', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
            <Award size={22} color="#07866A" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#142D2B' }}>Server-Side Auto-Scoring</h4>
            <p style={{ fontSize: '0.875rem', color: '#68756F' }}>
              Correct answer keys never touch client JavaScript. Submissions are scored and verified on the server.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer
        style={{
          borderTop: '1px solid #DFE8E1',
          backgroundColor: '#142D2B',
          color: '#A3B8B2',
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
              <Sparkles size={20} color="#E8A23A" />
              SkillProof <span style={{ color: '#E8A23A' }}>AI</span>
            </div>
            <p style={{ fontSize: '0.875rem', maxWidth: '400px', color: '#A3B8B2' }}>
              Evidence-Based Skill Passport & Campus Job Readiness Platform. Designed for verified engineering outcomes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: '#FAFAF5', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ color: '#E8A23A', textDecoration: 'none', fontWeight: 600 }}>Register Account</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.8rem', color: '#7E9890' }}>
          &copy; {new Date().getFullYear()} SkillProof AI Platform. All rights reserved. Built for accredited institutions & engineering recruiters.
        </div>
      </footer>
    </div>
  );
};
