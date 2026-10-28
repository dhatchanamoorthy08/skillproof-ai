import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Award,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';

export const PlacementDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacementStats = async () => {
      try {
        const res = await api.get('/placement/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load placement stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacementStats();
  }, []);

  const handleExport = (format) => {
    window.open(`/api/v1/placement/reports/export?format=${format}`, '_blank');
  };

  return (
    <div>
      {/* Top Banner */}
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <GraduationCap size={16} /> University Placement & Career Command Center
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            {profile?.collegeName || 'National Institute of Technology'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Director: <strong style={{ color: '#ffffff' }}>{user?.fullName}</strong> &bull; Central Placement Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-secondary"
            style={{ color: '#ffffff', backgroundColor: '#334155', border: 'none', gap: '0.4rem' }}
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <FileText size={16} />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <MetricCard
          title="Placement Conversion"
          value={`${stats?.placementPercentage || 0}%`}
          subtitle={`${stats?.placedCount || 0} of ${stats?.totalStudents || 0} placed`}
          icon={<TrendingUp size={22} />}
          iconBg="#ecfdf5"
          iconColor="#059669"
        />

        <MetricCard
          title="Placement Ready (>75%)"
          value={stats?.placementReadyCount || 0}
          subtitle="Meets corporate benchmarks"
          icon={<ShieldCheck size={22} />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />

        <MetricCard
          title="Needs Support (<50%)"
          value={stats?.supportNeededCount || 0}
          subtitle="Flagged in early alerts"
          icon={<AlertTriangle size={22} />}
          iconBg="#fee2e2"
          iconColor="#dc2626"
        />

        <MetricCard
          title="Approved Recruiters"
          value={stats?.approvedRecruiters || 0}
          subtitle={`${stats?.pendingVerifications || 0} pending reviews`}
          icon={<Building2 size={22} />}
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
      </div>

      {/* Main Stats Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Department Placement Statistics */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Department Placement Statistics</h3>
              <p className="card-subtitle">Enrolled vs. Verified Placement Ready candidates</p>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Enrolled</th>
                  <th>Ready</th>
                  <th>Placed</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats?.departmentStats?.map((dept) => (
                  <tr key={dept.name}>
                    <td style={{ fontWeight: 600 }}>{dept.name}</td>
                    <td>{dept.total}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{dept.ready}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>{dept.placed}</span>
                    </td>
                    <td>
                      <span className="badge badge-ready">{dept.placementRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Assessment Proctoring Alert */}
          <div
            className="card"
            style={{
              borderLeft: '5px solid #14b8a6',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                Online Assessment Proctoring Monitor
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Live webcam monitoring, tab-switch tracking, and proctoring security logs.
              </p>
            </div>
            <Link to="/placement/proctoring" className="btn btn-secondary btn-sm">
              Security Console &rarr;
            </Link>
          </div>

          {/* Student Certificate Verification Alert */}
          <div
            className="card"
            style={{
              borderLeft: '5px solid #2563eb',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                Student Certificate Verification Queue
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Audit uploaded course, internship, and project certificates to elevate Skill Passport competencies.
              </p>
            </div>
            <Link to="/placement/evidence-review" className="btn btn-primary btn-sm">
              Audit Queue &rarr;
            </Link>
          </div>

          {/* Pending Verifications Alert */}
          <div
            className="card"
            style={{
              borderLeft: '5px solid #f59e0b',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {stats?.pendingVerifications || 0} Recruiter Verifications Pending
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Review corporate documents before granting on-campus job publishing access.
              </p>
            </div>
            <Link to="/placement/verifications" className="btn btn-secondary btn-sm">
              Review &rarr;
            </Link>
          </div>

          {/* Early Alerts Action */}
          <div
            className="card"
            style={{
              borderLeft: '5px solid #dc2626',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {stats?.supportNeededCount || 0} Students Flagged as At-Risk
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Low Job Readiness Index or incomplete assessments detected.
              </p>
            </div>
            <Link to="/placement/alerts" className="btn btn-secondary btn-sm">
              Inspect Alerts &rarr;
            </Link>
          </div>

          {/* Hiring Drives Action */}
          <div
            className="card"
            style={{
              borderLeft: '5px solid #2563eb',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {stats?.activeDrives || 0} Active Campus Hiring Drives
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Coordinate upcoming corporate visit dates and student eligibility criteria.
              </p>
            </div>
            <Link to="/placement/drives" className="btn btn-secondary btn-sm">
              Manage Drives &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
