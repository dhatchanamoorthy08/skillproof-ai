import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  Building2,
  Eye,
  RefreshCw,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const EvidenceReviewPage = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Modal
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [decision, setDecision] = useState('verified');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/placement/evidence', { params });
      if (res.data.success) {
        setEvidenceList(res.data.evidence || []);
      }
    } catch (err) {
      console.error('Failed to load evidence submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvidence();
  };

  const openReviewModal = (ev, initialDecision) => {
    setSelectedEvidence(ev);
    setDecision(initialDecision);
    setFeedback(
      ev.verificationNotes ||
        (initialDecision === 'verified'
          ? 'Certificate credential verified against institutional guidelines.'
          : 'Certificate is unreadable or does not match specified skill criteria. Please re-upload with clear credentials.')
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvidence) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/placement/evidence/${selectedEvidence._id}/review`, {
        status: decision,
        feedback,
      });

      if (res.data.success) {
        alert(res.data.message);
        setSelectedEvidence(null);
        fetchEvidence();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats computation
  const totalSubmissions = evidenceList.length;
  const pendingCount = evidenceList.filter((e) => e.verificationStatus === 'pending').length;
  const verifiedCount = evidenceList.filter((e) => e.verificationStatus === 'verified').length;
  const rejectedCount = evidenceList.filter((e) => e.verificationStatus === 'rejected').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF', border: '1px solid #DFE8E1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#07866A',
                }}
              >
                <FileCheck2 size={20} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#142D2B' }}>
                Student Certificate Evidence Verification
              </h2>
            </div>
            <p style={{ color: '#68756F', fontSize: '0.925rem', margin: 0 }}>
              Authorized placement review audit. Approving a certificate automatically elevates the student's Skill Passport competencies to verified status.
            </p>
          </div>
          <button
            onClick={fetchEvidence}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Queue
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #FAFAF5',
          }}
        >
          <div style={{ padding: '0.875rem 1rem', background: '#FAFAF5', borderRadius: '8px', border: '1px solid #DFE8E1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase' }}>Total Submissions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#142D2B', marginTop: '0.2rem' }}>{totalSubmissions}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#FEF7ED', borderRadius: '8px', border: '1px solid #FCDCA6' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A0681B', textTransform: 'uppercase' }}>Pending Review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C48227', marginTop: '0.2rem' }}>{pendingCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#EFF8F2', borderRadius: '8px', border: '1px solid #C8E6D2' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#247A48', textTransform: 'uppercase' }}>Verified & Approved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#247A48', marginTop: '0.2rem' }}>{verifiedCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#FCF0F2', borderRadius: '8px', border: '1px solid #F7D4D7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#822430', textTransform: 'uppercase' }}>Rejected / Incomplete</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C83E4D', marginTop: '0.2rem' }}>{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: '#FFFFFF',
          border: '1px solid #DFE8E1',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B9892' }}
              />
              <input
                type="text"
                placeholder="Search student name, roll number, course, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem', height: '40px', fontSize: '0.85rem' }}>
              Search
            </button>
          </form>

          {/* Status & Type Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={15} style={{ color: '#68756F' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#68756F' }}>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', height: '40px', fontSize: '0.85rem', padding: '0 0.75rem' }}
            >
              <option value="all">All Statuses ({totalSubmissions})</option>
              <option value="pending">Pending Review ({pendingCount})</option>
              <option value="verified">Verified ({verifiedCount})</option>
              <option value="rejected">Rejected ({rejectedCount})</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', height: '40px', fontSize: '0.85rem', padding: '0 0.75rem' }}
            >
              <option value="all">All Evidence Types</option>
              <option value="course">Course Certificates</option>
              <option value="internship">Internship Certificates</option>
              <option value="project">Project / Additional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#68756F' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#07866A' }} />
          <div>Loading student evidence queue...</div>
        </div>
      ) : evidenceList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#68756F' }}>
          <FileCheck2 size={44} style={{ color: '#8B9892', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#142D2B', marginBottom: '0.4rem' }}>
            No evidence submissions found
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            {statusFilter !== 'all' || typeFilter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search keywords.'
              : 'There are currently no uploaded student certificates awaiting review.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {evidenceList.map((ev) => {
            const isPending = ev.verificationStatus === 'pending';
            const isVerified = ev.verificationStatus === 'verified';
            const isRejected = ev.verificationStatus === 'rejected';

            return (
              <div
                key={ev._id}
                className="card"
                style={{
                  background: '#FFFFFF',
                  border: isPending
                    ? '1.5px solid #E8A23A'
                    : isVerified
                    ? '1px solid #C8E6D2'
                    : '1px solid #F7D4D7',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {/* Top Row: Student info & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#142D2B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                      }}
                    >
                      {(ev.studentName || 'S').charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#142D2B', fontSize: '1.05rem' }}>
                          {ev.studentName || 'Student'}
                        </span>
                        {ev.studentRollNumber && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              background: '#FAFAF5',
                              color: '#4A5651',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {ev.studentRollNumber}
                          </span>
                        )}
                        {ev.studentDepartment && (
                          <span style={{ fontSize: '0.8rem', color: '#68756F' }}>• {ev.studentDepartment}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#68756F', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                        <Clock size={13} />
                        Submitted on {new Date(ev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#FEF7ED',
                          color: '#C48227',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid #FCDCA6',
                        }}
                      >
                        <AlertCircle size={14} /> Pending Review
                      </span>
                    )}
                    {isVerified && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#EFF8F2',
                          color: '#247A48',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid #C8E6D2',
                        }}
                      >
                        <CheckCircle2 size={14} /> Verified & Approved
                      </span>
                    )}
                    {isRejected && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#FCF0F2',
                          color: '#C83E4D',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid #F7D4D7',
                        }}
                      >
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence Details Block */}
                <div
                  style={{
                    background: '#FAFAF5',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: '1px solid #DFE8E1',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background:
                          ev.type === 'course'
                            ? 'rgba(37, 99, 235, 0.1)'
                            : ev.type === 'internship'
                            ? 'rgba(20, 184, 166, 0.1)'
                            : 'rgba(99, 102, 241, 0.1)',
                        color:
                          ev.type === 'course'
                            ? '#07866A'
                            : ev.type === 'internship'
                            ? '#0D9488'
                            : '#142D2B',
                      }}
                    >
                      {ev.type === 'course' ? 'Course Certificate' : ev.type === 'internship' ? 'Internship Certificate' : 'Project / Additional'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#142D2B' }}>
                      {ev.title || ev.courseName || ev.companyName}
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                    {ev.type === 'course' && (
                      <>
                        <div>
                          <span style={{ color: '#68756F' }}>Provider: </span>
                          <strong style={{ color: '#142D2B' }}>{ev.courseProvider || 'Independent'}</strong>
                        </div>
                        {ev.relatedSkill && (
                          <div>
                            <span style={{ color: '#68756F' }}>Related Skill: </span>
                            <span
                              style={{
                                background: '#DFE8E1',
                                color: '#142D2B',
                                padding: '1px 8px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                              }}
                            >
                              {ev.relatedSkill}
                            </span>
                          </div>
                        )}
                        {ev.issueDate && (
                          <div>
                            <span style={{ color: '#68756F' }}>Issue Date: </span>
                            <strong style={{ color: '#142D2B' }}>{ev.issueDate}</strong>
                          </div>
                        )}
                        {ev.certificateId && (
                          <div>
                            <span style={{ color: '#68756F' }}>Credential ID: </span>
                            <code style={{ background: '#DFE8E1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              {ev.certificateId}
                            </code>
                          </div>
                        )}
                      </>
                    )}

                    {ev.type === 'internship' && (
                      <>
                        <div>
                          <span style={{ color: '#68756F' }}>Company: </span>
                          <strong style={{ color: '#142D2B' }}>{ev.companyName}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#68756F' }}>Role: </span>
                          <strong style={{ color: '#142D2B' }}>{ev.internshipRole || 'Intern'}</strong>
                        </div>
                        {ev.internshipDomain && (
                          <div>
                            <span style={{ color: '#68756F' }}>Domain: </span>
                            <strong style={{ color: '#142D2B' }}>{ev.internshipDomain}</strong>
                          </div>
                        )}
                        {(ev.startDate || ev.endDate) && (
                          <div>
                            <span style={{ color: '#68756F' }}>Duration: </span>
                            <strong style={{ color: '#142D2B' }}>
                              {ev.startDate || '—'} to {ev.endDate || '—'}
                            </strong>
                          </div>
                        )}
                      </>
                    )}

                    {ev.type === 'project' && (
                      <>
                        {ev.courseProvider && (
                          <div>
                            <span style={{ color: '#68756F' }}>Issuing Authority: </span>
                            <strong style={{ color: '#142D2B' }}>{ev.courseProvider}</strong>
                          </div>
                        )}
                        {ev.relatedSkill && (
                          <div>
                            <span style={{ color: '#68756F' }}>Skill: </span>
                            <strong style={{ color: '#142D2B' }}>{ev.relatedSkill}</strong>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Skills badges */}
                  {Array.isArray(ev.associatedSkills) && ev.associatedSkills.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: '#68756F', fontWeight: 600 }}>Skills Demonstrated:</span>
                      {ev.associatedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            background: '#F0F7F4',
                            color: '#07866A',
                            borderRadius: '4px',
                            fontWeight: 600,
                            border: '1px solid #DFE8E1',
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description / Summary if any */}
                  {ev.description && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#4A5651' }}>
                      {ev.description}
                    </div>
                  )}

                  {/* Audit Feedback / Notes */}
                  {ev.verificationNotes && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '6px',
                        background: isVerified ? '#EFF8F2' : isRejected ? '#FCF0F2' : '#FEF7ED',
                        border: `1px solid ${isVerified ? '#EFF8F2' : isRejected ? '#FCF0F2' : '#FEF7ED'}`,
                        fontSize: '0.825rem',
                        color: isVerified ? '#247A48' : isRejected ? '#822430' : '#A0681B',
                      }}
                    >
                      <strong>Audit Notes:</strong> {ev.verificationNotes}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Document Link & Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Document View Link */}
                  {ev.fileUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button
                        onClick={() => setPreviewDoc(ev)}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', padding: '0.4rem 0.8rem' }}
                      >
                        <Eye size={14} /> Preview Document
                      </button>
                      <a
                        href={ev.fileUrl.startsWith('http') ? ev.fileUrl : `http://localhost:5000${ev.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.8rem',
                          color: '#07866A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textDecoration: 'none',
                        }}
                      >
                        Open Original <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#8B9892' }}>No attached document file</span>
                  )}

                  {/* Audit Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openReviewModal(ev, 'verified')}
                      className="btn"
                      style={{
                        background: '#247A48',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.825rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={15} /> Approve & Verify
                    </button>
                    <button
                      onClick={() => openReviewModal(ev, 'rejected')}
                      className="btn"
                      style={{
                        background: '#C83E4D',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.825rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Audit Decision Modal */}
      <Modal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        title="Audit Certificate Evidence"
        maxWidth="550px"
      >
        {selectedEvidence && (
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#FAFAF5', borderRadius: '6px', border: '1px solid #DFE8E1' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#142D2B' }}>
                {selectedEvidence.title || selectedEvidence.courseName || selectedEvidence.companyName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#68756F', marginTop: '2px' }}>
                Student: <strong>{selectedEvidence.studentName}</strong> ({selectedEvidence.studentRollNumber || 'N/A'})
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#142D2B', marginBottom: '0.4rem' }}>
                Audit Determination:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '6px',
                    border: decision === 'verified' ? '2px solid #247A48' : '1px solid #DFE8E1',
                    background: decision === 'verified' ? '#EFF8F2' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: decision === 'verified' ? '#247A48' : '#142D2B',
                  }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="verified"
                    checked={decision === 'verified'}
                    onChange={() => setDecision('verified')}
                  />
                  <CheckCircle2 size={16} /> Approve & Verify
                </label>
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '6px',
                    border: decision === 'rejected' ? '2px solid #C83E4D' : '1px solid #DFE8E1',
                    background: decision === 'rejected' ? '#FCF0F2' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: decision === 'rejected' ? '#822430' : '#142D2B',
                  }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="rejected"
                    checked={decision === 'rejected'}
                    onChange={() => setDecision('rejected')}
                  />
                  <XCircle size={16} /> Reject Submission
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#142D2B', marginBottom: '0.4rem' }}>
                Review Feedback & Audit Notes (visible to student):
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Explain the approval reasoning or specific instructions if rejected..."
                className="input-field"
                style={{ width: '100%', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                disabled={submitting}
                style={{
                  background: decision === 'verified' ? '#247A48' : '#C83E4D',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {submitting ? 'Submitting Audit...' : decision === 'verified' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={`Credential Preview — ${previewDoc?.title || 'Certificate'}`}
        maxWidth="800px"
      >
        {previewDoc && (
          <div style={{ textAlign: 'center' }}>
            {previewDoc.fileUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
              <img
                src={previewDoc.fileUrl.startsWith('http') ? previewDoc.fileUrl : `http://localhost:5000${previewDoc.fileUrl}`}
                alt="Certificate Document"
                style={{
                  maxWidth: '100%',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  border: '1px solid #DFE8E1',
                }}
              />
            ) : previewDoc.fileUrl?.match(/\.pdf$/i) ? (
              <iframe
                src={previewDoc.fileUrl.startsWith('http') ? previewDoc.fileUrl : `http://localhost:5000${previewDoc.fileUrl}`}
                title="PDF Document"
                style={{ width: '100%', height: '500px', border: '1px solid #DFE8E1', borderRadius: '6px' }}
              />
            ) : (
              <div style={{ padding: '2rem', background: '#FAFAF5', borderRadius: '6px' }}>
                <FileText size={48} style={{ color: '#07866A', margin: '0 auto 1rem' }} />
                <p style={{ color: '#142D2B', fontWeight: 600 }}>{previewDoc.fileName || 'Uploaded Credential Document'}</p>
                <a
                  href={previewDoc.fileUrl.startsWith('http') ? previewDoc.fileUrl : `http://localhost:5000${previewDoc.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  Download / Open File in New Tab <ExternalLink size={14} />
                </a>
              </div>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary">
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvidenceReviewPage;
