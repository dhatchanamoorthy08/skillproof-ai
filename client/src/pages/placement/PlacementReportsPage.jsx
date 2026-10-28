import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
} from 'lucide-react';
import api from '../../services/api';

export const PlacementReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/placement/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load report stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExport = (format) => {
    const link = document.createElement('a');
    link.href = `/api/v1/placement/reports/export?format=${format}`;
    link.download = `SkillProof_Placement_Report.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Accreditation & Placement Reports</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Generate certified export records for NAAC / NBA audit compliance, placement records, and institutional review.
        </p>
      </div>

      {/* Export Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* PDF Export Card */}
        <div className="card" style={{ padding: '2.25rem', borderTop: '5px solid #2563eb' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <FileText size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Comprehensive Executive PDF Report
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Formatted executive summary containing institutional readiness metrics, department-by-department breakdowns, corporate accreditation logs, and early alert distributions.
          </p>
          <button onClick={() => handleExport('pdf')} className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
            <Download size={16} />
            <span>Download Certified PDF Report</span>
          </button>
        </div>

        {/* CSV Export Card */}
        <div className="card" style={{ padding: '2.25rem', borderTop: '5px solid #059669' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <FileSpreadsheet size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Candidate Level CSV Dataset
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Raw student-by-student export including roll numbers, verified skills counts, Job Readiness Indices, CGPA, and placement company status for spreadsheet analysis.
          </p>
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-primary"
            style={{ width: '100%', backgroundColor: '#059669', gap: '0.5rem' }}
          >
            <Download size={16} />
            <span>Export Raw CSV Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* Report Summary Data Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Live Placement Conversion Audit</h3>
            <p className="card-subtitle">Real-time statistics compiled across all campus departments</p>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Enrolled Candidates</th>
                <th>Placement Ready (&gt;75%)</th>
                <th>Offers Extended</th>
                <th>Placement Conversion</th>
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
    </div>
  );
};
