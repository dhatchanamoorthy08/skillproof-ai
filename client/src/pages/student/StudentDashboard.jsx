import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Briefcase,
  FileCode2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';
import { ReadinessTierBadge, SkillBadge } from '../../components/Badge';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [passport, setPassport] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const demonstratedCount = passport?.skills.filter(
    (s) => s.status === 'demonstrated' || s.status === 'verified'
  ).length || 0;
  const verifiedCount = passport?.skills.filter((s) => s.status === 'verified').length || 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Evidence-Backed Candidate Profile
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            Welcome back, {user?.fullName || 'Student'}!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px' }}>
            {profile?.department || 'Computer Science'} &bull; Target Role:{' '}
            <strong style={{ color: '#e2e8f0' }}>{profile?.targetRole || 'Full Stack Developer'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/student/evidence" className="btn" style={{ gap: '0.5rem', background: '#14B8A6', color: '#ffffff', border: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <FileCode2 size={18} />
            <span>Submit Certificates</span>
          </Link>
          <Link to="/student/passport" className="btn btn-primary" style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
            <ShieldCheck size={18} />
            <span>View Skill Passport</span>
          </Link>
          <Link to="/assessments" className="btn btn-secondary" style={{ color: '#ffffff', backgroundColor: '#334155', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} />
            <span>Take Assessment</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <MetricCard
          title="Job Readiness Index"
          value={`${passport?.jobReadinessIndex || 50}%`}
          subtitle={<ReadinessTierBadge tier={passport?.readinessTier} />}
          icon={<TrendingUp size={22} />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />

        <MetricCard
          title="Profile Completeness"
          value={`${profile?.profileCompletion || 65}%`}
          subtitle="Add links and resume"
          icon={<CheckCircle2 size={22} />}
          iconBg="#ecfdf5"
          iconColor="#059669"
        />

        <MetricCard
          title="Demonstrated Skills"
          value={demonstratedCount}
          subtitle="Backed by code/projects"
          icon={<FileCode2 size={22} />}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />

        <MetricCard
          title="Verified Evidence"
          value={verifiedCount}
          subtitle="Audited by placement"
          icon={<ShieldCheck size={22} />}
          iconBg="#e0e7ff"
          iconColor="#4f46e5"
        />
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Readiness Breakdown & Suggestions */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Job Readiness Breakdown</h3>
              <p className="card-subtitle">Transparent mathematical weights calculated by SkillProof AI</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Assessed Knowledge (Weight 35%)</span>
                <span>{passport?.readinessBreakdown?.assessedScore || 0} / 35</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((passport?.readinessBreakdown?.assessedScore || 0) / 35) * 100}%`,
                    height: '100%',
                    backgroundColor: '#6366f1',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Demonstrated Projects (Weight 25%)</span>
                <span>{passport?.readinessBreakdown?.demonstratedScore || 0} / 25</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((passport?.readinessBreakdown?.demonstratedScore || 0) / 25) * 100}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Verified Evidence (Weight 25%)</span>
                <span>{passport?.readinessBreakdown?.verifiedScore || 0} / 25</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((passport?.readinessBreakdown?.verifiedScore || 0) / 25) * 100}%`,
                    height: '100%',
                    backgroundColor: '#2563eb',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Profile Completeness (Weight 15%)</span>
                <span>{passport?.readinessBreakdown?.profileCompletenessScore || 0} / 15</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((passport?.readinessBreakdown?.profileCompletenessScore || 0) / 15) * 100}%`,
                    height: '100%',
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Personalized Improvement Actions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {passport?.actionableSuggestions?.map((sug, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderLeft: '4px solid var(--primary)',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{sug.text}</span>
                <Link
                  to={sug.actionType === 'assessment' ? '/assessments' : '/student/passport'}
                  style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}
                >
                  Take Action &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Matching Jobs</h3>
              <p className="card-subtitle">Prioritized by verified evidence & assessment performance</p>
            </div>
            <Link to="/student/jobs" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No active jobs currently posted. Check back soon.
              </div>
            ) : (
              jobs.map(({ job, matchScore, matchBreakdown }) => (
                <div
                  key={job._id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {job.companyName} &bull; {job.location} ({job.workMode})
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: matchScore >= 75 ? '#ecfdf5' : '#eff6ff',
                        color: matchScore >= 75 ? '#047857' : '#1d4ed8',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {matchScore}% Match
                    </div>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {matchBreakdown?.explanation}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {job.requiredSkills.slice(0, 3).map((sk) => (
                        <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.7rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                    <Link to="/student/jobs" className="btn btn-primary btn-sm">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
