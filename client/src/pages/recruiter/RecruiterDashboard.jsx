import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';

export const RecruiterDashboard = () => {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const [anaRes, jobsRes] = await Promise.all([
          api.get('/recruiters/analytics'),
          api.get('/recruiters/jobs'),
        ]);

        if (anaRes.data.success) setAnalytics(anaRes.data.analytics);
        if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Failed to load recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  const isVerified = profile?.verificationStatus === 'approved';

  return (
    <div>
      {/* Top Company Banner */}
      <div
        className="card"
        style={{
          background: '#142D2B',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: '1px solid rgba(223, 232, 225, 0.15)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isVerified ? '#247A48' : '#E8A23A',
              backgroundColor: isVerified ? 'rgba(36, 122, 72, 0.15)' : 'rgba(232, 162, 58, 0.15)',
              border: `1px solid ${isVerified ? 'rgba(36, 122, 72, 0.3)' : 'rgba(232, 162, 58, 0.3)'}`,
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {isVerified ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
            {isVerified ? 'Accredited Campus Recruitment Partner' : 'Verification Under Placement Audit'}
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#FAFAF5', marginBottom: '0.4rem', fontWeight: 800 }}>
            {profile?.companyName || 'Corporate Partner'}
          </h2>
          <p style={{ color: '#A3B8B2', fontSize: '0.95rem' }}>
            Recruiter: <strong style={{ color: '#FAFAF5' }}>{user?.fullName}</strong> &bull; {profile?.location || 'Bangalore, India'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isVerified ? (
            <>
              <Link to="/recruiter/post-job" className="btn btn-primary" style={{ gap: '0.5rem', fontWeight: 700 }}>
                <Plus size={18} />
                <span>Post New Job</span>
              </Link>
              <Link to="/recruiter/candidates" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Search size={18} />
                <span>Search Passports</span>
              </Link>
            </>
          ) : (
            <Link to="/recruiter/verification" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Complete Company Verification &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Verification Warning if not approved */}
      {!isVerified && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--warning-light)',
            border: '1px solid var(--warning-border)',
            color: '#B27315',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#E8A23A" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>2-Step Company Verification Pending</strong>
              <p style={{ fontSize: '0.85rem', color: '#92400E', margin: '2px 0 0 0' }}>
                Per institutional guidelines, only approved recruiters can publish jobs or browse candidate passports.
              </p>
            </div>
          </div>
          <Link to="/recruiter/verification" className="btn btn-sm btn-primary">
            View Verification Status
          </Link>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="stat-grid">
        <MetricCard
          title="Active Openings"
          value={analytics?.activeJobs || 0}
          subtitle="Currently published"
          icon={<Briefcase size={22} />}
          iconBg="#F0F7F4"
          iconColor="#07866A"
        />

        <MetricCard
          title="Total Applications"
          value={analytics?.totalApplications || 0}
          subtitle="Received to date"
          icon={<Users size={22} />}
          iconBg="#FEF8ED"
          iconColor="#E8A23A"
        />

        <MetricCard
          title="Shortlisted Candidates"
          value={analytics?.shortlistedCount || 0}
          subtitle="Passed evidence screening"
          icon={<CheckCircle2 size={22} />}
          iconBg="#EFF8F2"
          iconColor="#247A48"
        />

        <MetricCard
          title="Conversion Rate"
          value={`${analytics?.conversionRate || 0}%`}
          subtitle="Application to Offer"
          icon={<TrendingUp size={22} />}
          iconBg="#EDF3F1"
          iconColor="#142D2B"
        />
      </div>

      {/* Active Jobs Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Manage Job Postings</h3>
            <p className="card-subtitle">Active roles and applicant count</p>
          </div>
          <Link to="/recruiter/post-job" className="btn btn-secondary btn-sm">
            Post Job
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Domain</th>
                <th>Location / Mode</th>
                <th>Required Skills</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No job postings yet. Click "Post New Job" to recruit candidates.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 700 }}>{job.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{job.domain}</td>
                    <td>{job.location} ({job.workMode})</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {job.requiredSkills.slice(0, 3).map((sk) => (
                          <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.7rem' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{job.applicantsCount || 0}</span>
                    </td>
                    <td>
                      <span className="badge badge-ready">{job.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
