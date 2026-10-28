import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import api from '../../services/api';
import { ReadinessTierBadge, SkillBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const CandidateSearchPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (skillFilter) params.append('skill', skillFilter);
      if (tierFilter) params.append('tier', tierFilter);
      if (departmentFilter) params.append('department', departmentFilter);

      const res = await api.get(`/recruiters/candidates?${params.toString()}`);
      if (res.data.success) {
        setCandidates(res.data.candidates);
      }
    } catch (err) {
      console.error('Failed to search candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [tierFilter, departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleDeleteCandidate = async (candidateId, fullName) => {
    if (!window.confirm(`Are you sure you want to remove the student account for "${fullName}"?`)) return;
    try {
      const res = await api.delete(`/recruiters/candidates/${candidateId}`);
      if (res.data.success) {
        setCandidates((prev) => prev.filter((c) => (c.candidateId || c.passportId) !== candidateId));
      }
    } catch (err) {
      console.error('Failed to remove candidate:', err);
      alert('Failed to remove candidate account.');
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Search Verifiable Skill Passports</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Explore graduating talent filtered by proven code demonstrations, proctored test results, and accredited Job Readiness Indices.
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by skill name (e.g. React, Node.js, AWS)..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>

          <select
            className="form-control form-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="">All Readiness Tiers</option>
            <option value="Placement Ready">Placement Ready (&gt;75%)</option>
            <option value="Developing">Developing (50-74%)</option>
            <option value="Needs Immediate Support">Needs Support (&lt;50%)</option>
          </select>

          <select
            className="form-control form-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science & Eng.</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">AI & Data Science</option>
          </select>

          <button type="submit" className="btn btn-primary" style={{ minWidth: '100px' }}>
            Search
          </button>
        </div>
      </form>

      {/* Candidates Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Searching candidate passports...
        </div>
      ) : candidates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Student Accounts Found</h3>
          <p style={{ maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem' }}>
            All previous student accounts have been removed. When new students register via the student portal, their Skill Passports will appear here automatically.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {candidates.map((cand) => (
            <div
              key={cand.candidateId || cand.passportId}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {cand.avatar ? (
                        <img src={cand.avatar} alt={cand.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        cand.fullName?.charAt(0) || 'S'
                      )}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{cand.fullName}</h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {cand.degree ? `${cand.degree} - ` : ''}{cand.department} &bull; CGPA: <strong>{cand.cgpa}</strong>
                        {cand.rollNumber ? ` (${cand.rollNumber})` : ''}
                      </p>
                    </div>
                  </div>
                  <ReadinessTierBadge tier={cand.readinessTier} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card-subtle)',
                    marginBottom: '1rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <div>
                    JRI: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{cand.jobReadinessIndex}%</strong>
                  </div>
                  <div>&bull;</div>
                  <div>
                    Verified: <strong style={{ color: '#16a34a' }}>{cand.verifiedSkillsCount}</strong>
                  </div>
                  <div>&bull;</div>
                  <div>
                    Projects: <strong style={{ color: '#d97706' }}>{cand.demonstratedSkillsCount}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Key Verified / Demonstrated Skills:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {(cand.skills || []).slice(0, 5).map((sk) => (
                      <span key={sk.skillName} className="badge badge-assessed" style={{ fontSize: '0.75rem' }}>
                        {sk.skillName}
                      </span>
                    ))}
                    {(cand.skills?.length || 0) > 5 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{cand.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} />
                  <span>Inspect Skill Passport Evidence</span>
                </button>
                <button
                  onClick={() => handleDeleteCandidate(cand.candidateId, cand.fullName)}
                  className="btn btn-secondary btn-sm"
                  title="Remove student account"
                  style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.4rem 0.75rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Passport Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate ? `${selectedCandidate.fullName} &bull; Skill Passport` : 'Skill Passport'}
        maxWidth="750px"
      >
        {selectedCandidate && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedCandidate.department}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Batch: {selectedCandidate.batch} &bull; CGPA: {selectedCandidate.cgpa} &bull; Target: {selectedCandidate.targetRole}
                </div>
              </div>
              <ReadinessTierBadge tier={selectedCandidate.readinessTier} />
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Audited Skill Claims ({selectedCandidate.skills?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {selectedCandidate.skills?.map((sk) => (
                <div
                  key={sk.skillName}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>{sk.skillName}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{sk.statusReason}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {sk.assessmentScore != null && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>
                        Score: {sk.assessmentScore}%
                      </span>
                    )}
                    <SkillBadge status={sk.status} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedCandidate(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
