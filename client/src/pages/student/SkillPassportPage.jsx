import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Upload,
  ExternalLink,
  Award,
  CheckCircle2,
  FileCode2,
  FileCheck2,
  Clock,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SkillBadge, ReadinessTierBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const SkillPassportPage = () => {
  const { user, profile } = useAuth();
  const [passport, setPassport] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceType, setEvidenceType] = useState('project');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [evidenceSkills, setEvidenceSkills] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);

  const fetchPassportData = async () => {
    try {
      const [passRes, evRes] = await Promise.all([
        api.get('/students/me/passport'),
        api.get('/students/me/evidence'),
      ]);
      if (passRes.data.success) setPassport(passRes.data.passport);
      if (evRes.data.success) setEvidenceList(evRes.data.evidence);
    } catch (err) {
      console.error('Error fetching passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassportData();
  }, []);

  const handleClaimSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/me/skills', {
        skillName: newSkillName,
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      });
      setNewSkillName('');
      setShowSkillModal(false);
      fetchPassportData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add skill.');
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('type', evidenceType);
      formData.append('title', evidenceTitle);
      formData.append('description', evidenceDescription);
      formData.append('associatedSkills', evidenceSkills);
      formData.append('externalUrl', evidenceUrl);
      if (evidenceFile) {
        formData.append('evidenceFile', evidenceFile);
      }

      await api.post('/students/me/evidence', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowEvidenceModal(false);
      setEvidenceTitle('');
      setEvidenceDescription('');
      setEvidenceSkills('');
      setEvidenceUrl('');
      setEvidenceFile(null);
      fetchPassportData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit evidence.');
    }
  };

  const filteredSkills = passport?.skills?.filter((s) => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  }) || [];

  return (
    <div>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Digital Skill Passport</h2>
            <ReadinessTierBadge tier={passport?.readinessTier} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Verified technical competencies backed by proctored assessments, code repositories, and placement audits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowSkillModal(true)} className="btn btn-secondary">
            <Plus size={16} />
            <span>Claim Skill</span>
          </button>
          <Link
            to="/student/evidence"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <FileCheck2 size={16} />
            <span>Submit Evidence Certificates</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {['all', 'verified', 'demonstrated', 'assessed', 'claimed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'all' ? `All Skills (${passport?.skills?.length || 0})` : `${tab} (${passport?.skills?.filter((s) => s.status === tab).length || 0})`}
          </button>
        ))}
      </div>

      {/* Skills Table / Cards */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Verification State</th>
                <th>Proficiency</th>
                <th>Assessment Score</th>
                <th>Audit Justification</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No skills found under this filter. Claim a skill or submit evidence to get started.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill._id || skill.skillName}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{skill.skillName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{skill.category}</td>
                    <td>
                      <SkillBadge status={skill.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{skill.proficiency}</span>
                    </td>
                    <td>
                      {skill.assessmentScore != null ? (
                        <span style={{ fontWeight: 700, color: skill.assessmentScore >= 70 ? '#16a34a' : '#d97706' }}>
                          {skill.assessmentScore}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontSize: '0.825rem' }}>Not tested</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      {skill.statusReason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Evidence Archive */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Supporting Evidence Archive</h3>
            <p className="card-subtitle">Audited projects, credentials, and internship experience items</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {evidenceList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              No supporting evidence records submitted yet. Click "Submit Evidence" above to link a GitHub project or certificate.
            </div>
          ) : (
            evidenceList.map((ev) => (
              <div
                key={ev._id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCode2 size={18} color="#2563eb" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {ev.title || ev.courseName || ev.companyName}
                      </h4>
                      {(ev.courseProvider || ev.companyName) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ev.courseProvider || ev.companyName}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      ev.verificationStatus === 'verified'
                        ? 'badge-ready'
                        : ev.verificationStatus === 'rejected'
                        ? 'badge-support'
                        : 'badge-developing'
                    }`}
                  >
                    {ev.verificationStatus}
                  </span>
                </div>

                {ev.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{ev.description}</p>}

                {Array.isArray(ev.associatedSkills) && ev.associatedSkills.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {ev.associatedSkills.map((sk) => (
                      <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.7rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {ev.verificationNotes && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '4px',
                      background: ev.verificationStatus === 'verified' ? '#DCFCE7' : '#FEE2E2',
                      color: ev.verificationStatus === 'verified' ? '#166534' : '#991B1B',
                    }}
                  >
                    <strong>Faculty Audit:</strong> {ev.verificationNotes}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {ev.fileUrl && (
                    <a
                      href={ev.fileUrl.startsWith('http') ? ev.fileUrl : `http://localhost:5000${ev.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <ExternalLink size={12} />
                      <span>View Uploaded Certificate</span>
                    </a>
                  )}
                  {ev.externalUrl && (
                    <a
                      href={ev.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} />
                      <span>External Link</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Claim Skill Modal */}
      <Modal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} title="Claim a Technical Skill">
        <form onSubmit={handleClaimSkill}>
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. TypeScript, Docker, PostgreSQL"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control form-select"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Languages">Languages</option>
              <option value="Core Fundamentals">Core Fundamentals</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Self-Assessed Proficiency</label>
            <select
              className="form-control form-select"
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Note: Claimed skills hold a preliminary weight of 0.30 until backed by practical projects or proctored assessments.
          </p>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Add Skill to Passport
          </button>
        </form>
      </Modal>

      {/* Submit Evidence Modal */}
      <Modal isOpen={showEvidenceModal} onClose={() => setShowEvidenceModal(false)} title="Submit Supporting Evidence">
        <form onSubmit={handleAddEvidence}>
          <div className="form-group">
            <label className="form-label">Evidence Type</label>
            <select
              className="form-control form-select"
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
            >
              <option value="project">Hands-On Software Project</option>
              <option value="certification">Professional Certification</option>
              <option value="internship">Industry Internship Experience</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title / Heading</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Distributed Caching Service"
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description of Work & Metrics</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe system design, architecture, throughput, or achievements..."
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Associated Skills (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="React, Node.js, MongoDB"
              value={evidenceSkills}
              onChange={(e) => setEvidenceSkills(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">External Verification Link (GitHub Repo / Live URL)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://github.com/your-username/repo-name"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supporting Document (PDF or Screenshot)</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setEvidenceFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Submit for Placement Audit Review
          </button>
        </form>
      </Modal>
    </div>
  );
};
