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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isVerified ? '#34d399' : '#fbbf24', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {isVerified ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
            {isVerified ? 'Accredited Campus Recruitment Partner' : 'Verification Under Placement Audit'}
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            {profile?.companyName || 'Corporate Partner'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Recruiter: <strong style={{ color: '#ffffff' }}>{user?.fullName}</strong> &bull; {profile?.location || 'Bangalore, India'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isVerified ? (
            <>
              <Link to="/recruiter/post-job" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Plus size={18} />
                <span>Post New Job</span>
              </Link>
              <Link to="/recruiter/candidates" className="btn btn-secondary" style={{ color: '#ffffff', backgroundColor: '#334155', border: 'none' }}>
                <Search size={18} />
                <span>Search Passports</span>
              </Link>
            </>
          ) : (
            <Link to="/recruiter/verification" className="btn btn-primary">
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
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>2-Step Company Verification Pending</strong>
              <p style={{ fontSize: '0.85rem', color: '#b45309', margin: '2px 0 0 0' }}>
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
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />

        <MetricCard
          title="Total Applications"
          value={analytics?.totalApplications || 0}
          subtitle="Received to date"
          icon={<Users size={22} />}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />

        <MetricCard
          title="Shortlisted Candidates"
          value={analytics?.shortlistedCount || 0}
          subtitle="Passed evidence screening"
          icon={<CheckCircle2 size={22} />}
          iconBg="#ecfdf5"
          iconColor="#059669"
        />

        <MetricCard
          title="Conversion Rate"
          value={`${analytics?.conversionRate || 0}%`}
          subtitle="Application to Offer"
          icon={<TrendingUp size={22} />}
          iconBg="#e0e7ff"
          iconColor="#4f46e5"
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
