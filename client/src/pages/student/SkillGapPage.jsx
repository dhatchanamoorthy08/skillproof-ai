import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SkillBadge } from '../../components/Badge';

export const SkillGapPage = () => {
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState(profile?.targetRole || 'Full Stack Developer');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGaps = async (role) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/me/skill-gaps?role=${encodeURIComponent(role)}`);
      if (res.data.success) {
        setGapData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch skill gap analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps(selectedRole);
  }, [selectedRole]);

  return (
    <div>
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <BarChart3 size={16} /> Market Readiness Benchmark
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Skill Gap Analysis</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Compare your verified Skill Passport against real production requirements for your target role.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role:</label>
          <select
            className="form-control form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ width: '240px' }}
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="AI & Machine Learning Specialist">AI & Machine Learning Specialist</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Computing evidence-weighted skill overlap...
        </div>
      ) : (
        <>
          {/* Overall Coverage Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h3 className="card-title">Role Competency Coverage</h3>
                <p className="card-subtitle">Calculated across verified assessments, code projects, and claimed skills</p>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {gapData?.coveragePercentage || 0}%
              </div>
            </div>

            <div style={{ height: '12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${gapData?.coveragePercentage || 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* 3 Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Demonstrated Skills */}
            <div className="card" style={{ borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Demonstrated / Assessed ({gapData?.demonstrated?.length || 0})
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                These skills are verified through test results or practical code delivery.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {gapData?.demonstrated?.map((item) => (
                  <div
                    key={item.skillName}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.skillName}</span>
                    <SkillBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Partially Supported */}
            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <HelpCircle size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Partially Supported ({gapData?.partial?.length || 0})
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Skills claimed in profile, but lacking proctored assessment or project proof.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {gapData?.partial?.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None in this state.</div>
                ) : (
                  gapData?.partial?.map((item) => (
                    <div
                      key={item.skillName}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#92400e' }}>{item.skillName}</span>
                        <span className="badge badge-claimed">Claimed Only</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#b45309' }}>{item.reason}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertCircle size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Missing Benchmark Skills ({gapData?.missing?.length || 0})
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Required competencies currently absent from your passport.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {gapData?.missing?.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#16a34a' }}>
                    Congratulations! You cover all required benchmark skills for this role.
                  </div>
                ) : (
                  gapData?.missing?.map((item) => (
                    <div
                      key={item.skillName}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#991b1b' }}>{item.skillName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{item.action}</div>
                      </div>
                      <span className="badge badge-support">High Priority</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
