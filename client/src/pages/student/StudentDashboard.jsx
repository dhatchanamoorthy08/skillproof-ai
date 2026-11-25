import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  FileCode2,
  Award,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Info,
  XCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ReadinessTierBadge } from '../../components/Badge';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [passport, setPassport] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [passRes, jobsRes, appsRes] = await Promise.all([
          api.get('/students/me/passport'),
          api.get('/students/me/job-matches'),
          api.get('/students/me/applications'),
        ]);

        if (passRes.data.success) setPassport(passRes.data.passport);
        if (jobsRes.data.success) setJobs(jobsRes.data.matches.slice(0, 3));
        if (appsRes.data.success) setApplications(appsRes.data.applications);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute actual backend values
  const demonstratedCount = useMemo(() => {
    return (
      passport?.skills?.filter(
        (s) => s.status === 'demonstrated' || s.status === 'verified'
      ).length || 0
    );
  }, [passport]);

  const verifiedCount = useMemo(() => {
    return passport?.skills?.filter((s) => s.status === 'verified').length || 0;
  }, [passport]);

  const profileCompleteness = useMemo(() => {
    if (typeof profile?.profileCompletion === 'number') return profile.profileCompletion;
    if (passport?.readinessBreakdown?.profileCompletenessScore) {
      return Math.round((passport.readinessBreakdown.profileCompletenessScore / 15) * 100);
    }
    return 65;
  }, [profile, passport]);

  const topMatchScore = useMemo(() => {
    if (!jobs || jobs.length === 0) return 0;
    return Math.max(...jobs.map((j) => j.matchScore || 0));
  }, [jobs]);

  return (
    <div
      className="student-home-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ========================================================= */}
      {/* 1. WELCOME SECTION (WITH 4 INTEGRATED KEY STATISTICS) */}
      {/* ========================================================= */}
      <section
        className="student-welcome-section"
        style={{
          backgroundColor: '#17233D',
          color: '#F5F8FF',
          borderRadius: '14px',
          border: '1px solid rgba(191, 199, 213, 0.16)',
          boxShadow: '0 8px 24px rgba(23, 35, 61, 0.08)',
          padding: '1.25rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(380px, 1.35fr)',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Left: Greeting & Candidate Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#2455D6',
                backgroundColor: 'rgba(36, 85, 214, 0.14)',
                border: '1px solid rgba(36, 85, 214, 0.28)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <ShieldCheck size={13} color="#2455D6" /> Verified Candidate Profile
            </span>
            <ReadinessTierBadge tier={passport?.readinessTier} />
          </div>

          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#F5F8FF',
              margin: '0.15rem 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Welcome back, {user?.fullName || 'Student'}!
          </h2>

          <p
            style={{
              color: '#BFC7D5',
              fontSize: '0.85rem',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {profile?.department || 'Computer Science & Engineering'} &bull; Target Role:{' '}
            <strong style={{ color: '#FFFFFF' }}>
              {profile?.targetRole || 'Full Stack Developer'}
            </strong>
          </p>

          <div style={{ marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setShowBreakdownModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2455D6',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: 0,
              }}
            >
              <Info size={13} />
              <span>Inspect Mathematical JRI Weight Breakdown &rarr;</span>
            </button>
          </div>
        </div>

        {/* Right: 4 Important Statistics (2x2 Grid utilizing blank space) */}
        <div
          className="welcome-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.65rem',
          }}
        >
          {/* 1. Job Readiness Index */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(191, 199, 213, 0.12)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '74px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#BFC7D5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Job Readiness Index
              </span>
              <TrendingUp size={15} color="#2455D6" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F8FF', lineHeight: 1 }}>
                {passport?.jobReadinessIndex ?? 50}%
              </span>
              <span style={{ fontSize: '0.72rem', color: '#2455D6', fontWeight: 600 }}>
                {passport?.readinessTier ? passport.readinessTier.replace(/_/g, ' ') : 'Job Ready'}
              </span>
            </div>

            {/* Visual mini progress bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '0.35rem',
              }}
            >
              <div
                style={{
                  width: `${Math.min(passport?.jobReadinessIndex ?? 50, 100)}%`,
                  height: '100%',
                  backgroundColor: '#2455D6',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          {/* 2. Profile Completeness */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(191, 199, 213, 0.12)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '74px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#BFC7D5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Profile Completeness
              </span>
              <CheckCircle2 size={15} color="#2455D6" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F8FF', lineHeight: 1 }}>
                {profileCompleteness}%
              </span>
              <span style={{ fontSize: '0.72rem', color: '#2455D6', fontWeight: 600 }}>
                Bio &amp; Portfolio
              </span>
            </div>

            {/* Visual mini progress bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '0.35rem',
              }}
            >
              <div
                style={{
                  width: `${Math.min(profileCompleteness, 100)}%`,
                  height: '100%',
                  backgroundColor: '#2455D6',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          {/* 3. Demonstrated Skills */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(191, 199, 213, 0.12)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '74px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#BFC7D5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Demonstrated Skills
              </span>
              <FileCode2 size={15} color="#F5F8FF" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F8FF', lineHeight: 1 }}>
                {demonstratedCount}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#BFC7D5', fontWeight: 500 }}>
                Code &amp; Repo backed
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  color: '#F5F8FF',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                Git / Assessment Proof
              </span>
            </div>
          </div>

          {/* 4. Verified Evidence */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(191, 199, 213, 0.12)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '74px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#BFC7D5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Verified Evidence
              </span>
              <Award size={15} color="#2455D6" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F8FF', lineHeight: 1 }}>
                {verifiedCount}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#BFC7D5', fontWeight: 500 }}>
                Audited credentials
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  color: '#2455D6',
                  backgroundColor: 'rgba(36, 85, 214, 0.16)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                Institutional Audit Approved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. JOB MATCHING SECTION (DIRECTLY BELOW WELCOME SECTION) */}
      {/* ========================================================= */}
      <section
        className="student-job-matching-section"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #BFC7D5',
          boxShadow: '0 2px 8px rgba(23, 35, 61, 0.03)',
          padding: '1.15rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderBottom: '1px solid #EAEFFA',
            paddingBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#F5F8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #BFC7D5',
              }}
            >
              <Briefcase size={18} color="#2455D6" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#17233D',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Job Matching &amp; Recommendations
                </h3>
                {topMatchScore > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#065F46',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    Top Match: {topMatchScore}%
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#5A6882', margin: 0, marginTop: '2px' }}>
                Recommended opportunities prioritized by your verified evidence, proctored assessments, and demonstrated skills.
              </p>
            </div>
          </div>

          <Link
            to="/student/jobs"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#2455D6',
              backgroundColor: '#F5F8FF',
              border: '1px solid #BFC7D5',
              padding: '6px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>View All Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Recommended Job Opportunities List */}
        <div>
          {jobs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                color: '#5A6882',
                fontSize: '0.85rem',
                backgroundColor: '#F5F8FF',
                borderRadius: '8px',
                border: '1px dashed #BFC7D5',
              }}
            >
              No active job matches found for your current skill passport. Browse open campus drives and requisitions in the Jobs catalog.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {jobs.map(({ job, matchScore, matchBreakdown }) => (
                <div
                  key={job._id}
                  style={{
                    backgroundColor: '#F5F8FF',
                    border: '1px solid #BFC7D5',
                    borderRadius: '10px',
                    padding: '0.95rem 1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.55rem',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {/* Job Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#17233D',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {job.title}
                      </h4>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '6px',
                          backgroundColor: matchScore >= 75 ? 'rgba(36, 85, 214, 0.12)' : 'rgba(36, 85, 214, 0.12)',
                          color: matchScore >= 75 ? '#2455D6' : '#2455D6',
                          border: `1px solid ${matchScore >= 75 ? 'rgba(36, 85, 214, 0.3)' : 'rgba(36, 85, 214, 0.3)'}`,
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {matchScore}% Match
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: '#5A6882', margin: '4px 0 0 0' }}>
                      <strong style={{ color: '#17233D' }}>{job.companyName}</strong> &bull; {job.location} ({job.workMode})
                    </p>
                  </div>

                  {/* Matching Explanation */}
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#5A6882',
                      margin: 0,
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {matchBreakdown?.explanation || 'Aligned with your demonstrated technical skills and verified project evidence.'}
                  </p>

                  {/* Skills & Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.2rem',
                      borderTop: '1px solid rgba(191, 199, 213, 0.6)',
                      paddingTop: '0.45rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {job.requiredSkills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            backgroundColor: '#FFFFFF',
                            color: '#17233D',
                            border: '1px solid #BFC7D5',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/student/jobs"
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: '#2455D6',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Apply Now &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TRANSPARENT MATHEMATICAL JRI WEIGHT BREAKDOWN MODAL */}
      {/* ========================================================= */}
      {showBreakdownModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(23, 35, 61, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '16px',
          }}
          onClick={() => setShowBreakdownModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#17233D' }}>
                  Job Readiness Index Breakdown
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5A6882' }}>
                  Transparent mathematical formula calculated by SkillProof AI
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <XCircle size={20} color="#5A6882" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
              {/* Assessed Knowledge (Weight 35%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#17233D' }}>Assessed Knowledge (Weight 35%)</span>
                  <span style={{ fontWeight: 800, color: '#2455D6' }}>
                    {passport?.readinessBreakdown?.assessedScore || 0} / 35
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F5F8FF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((passport?.readinessBreakdown?.assessedScore || 0) / 35) * 100}%`,
                      height: '100%',
                      backgroundColor: '#2455D6',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              {/* Demonstrated Projects (Weight 25%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#17233D' }}>Demonstrated Projects (Weight 25%)</span>
                  <span style={{ fontWeight: 800, color: '#17233D' }}>
                    {passport?.readinessBreakdown?.demonstratedScore || 0} / 25
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F5F8FF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((passport?.readinessBreakdown?.demonstratedScore || 0) / 25) * 100}%`,
                      height: '100%',
                      backgroundColor: '#17233D',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              {/* Verified Evidence (Weight 25%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#17233D' }}>Verified Evidence (Weight 25%)</span>
                  <span style={{ fontWeight: 800, color: '#2455D6' }}>
                    {passport?.readinessBreakdown?.verifiedScore || 0} / 25
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F5F8FF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((passport?.readinessBreakdown?.verifiedScore || 0) / 25) * 100}%`,
                      height: '100%',
                      backgroundColor: '#2455D6',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              {/* Profile Completeness (Weight 15%) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#17233D' }}>Profile Completeness (Weight 15%)</span>
                  <span style={{ fontWeight: 800, color: '#5A6882' }}>
                    {passport?.readinessBreakdown?.profileCompletenessScore || 0} / 15
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F5F8FF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((passport?.readinessBreakdown?.profileCompletenessScore || 0) / 15) * 100}%`,
                      height: '100%',
                      backgroundColor: '#A89F91',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {passport?.actionableSuggestions?.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#17233D', marginBottom: '0.5rem' }}>
                  Actionable Next Steps
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {passport.actionableSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.55rem 0.8rem',
                        borderRadius: '6px',
                        backgroundColor: '#F5F8FF',
                        borderLeft: '3px solid #2455D6',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: '#17233D' }}>{sug.text}</span>
                      <Link
                        to={sug.actionType === 'assessment' ? '/assessments' : '/student/passport'}
                        onClick={() => setShowBreakdownModal(false)}
                        style={{ color: '#2455D6', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '8px' }}
                      >
                        {sug.actionType === 'assessment' ? 'Start Assessment →' : 'Take Action →'}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowBreakdownModal(false)}
                style={{
                  backgroundColor: '#17233D',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
