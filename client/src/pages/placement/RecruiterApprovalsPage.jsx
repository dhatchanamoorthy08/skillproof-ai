import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Globe,
  Mail,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const RecruiterApprovalsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedVerif, setSelectedVerif] = useState(null);
  const [decision, setDecision] = useState('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/placement/verifications');
      if (res.data.success) {
        setVerifications(res.data.verifications);
      }
    } catch (err) {
      console.error('Failed to load recruiter verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const openReviewModal = (verif, defaultDecision) => {
    setSelectedVerif(verif);
    setDecision(defaultDecision);
    setReviewNotes('');
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVerif) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/placement/verifications/${selectedVerif._id}/review`, {
        status: decision,
        reviewNotes,
      });

      if (res.data.success) {
        alert(res.data.message);
        setSelectedVerif(null);
        fetchVerifications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Recruiter Corporate Accreditation</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Audit corporate credentials and registration documents before granting recruiters access to campus candidates and job publishing.
        </p>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Official Domain Email</th>
                <th>Registration Number</th>
                <th>Website</th>
                <th>Accreditation Status</th>
                <th>Decision Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading pending corporate verifications...
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No recruiter verification requests pending review.
                  </td>
                </tr>
              ) : (
                verifications.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{v.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Contact: {v.contactPersonName} ({v.contactPhone})
                      </div>
                    </td>
                    <td>
                      <div>{v.officialEmail}</div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: v.domainMatchesEmail ? '#16a34a' : '#d97706',
                        }}
                      >
                        {v.domainMatchesEmail ? 'Domain Matches Website' : 'Domain Unverified'}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.825rem' }}>{v.businessRegistrationNumber}</code>
                    </td>
                    <td>
                      {v.website ? (
                        <a
                          href={v.website.startsWith('http') ? v.website : `https://${v.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.825rem' }}
                        >
                          Visit <ExternalLink size={12} />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          v.status === 'approved'
                            ? 'badge-ready'
                            : v.status === 'rejected'
                            ? 'badge-support'
                            : 'badge-developing'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {v.status !== 'approved' && (
                          <button
                            onClick={() => openReviewModal(v, 'approved')}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: '#10b981' }}
                          >
                            Approve
                          </button>
                        )}
                        {v.status !== 'rejected' && (
                          <button
                            onClick={() => openReviewModal(v, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626' }}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => openReviewModal(v, 'needs_info')}
                          className="btn btn-secondary btn-sm"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedVerif}
        onClose={() => setSelectedVerif(null)}
        title={selectedVerif ? `Corporate Review: ${selectedVerif.companyName}` : 'Accreditation Review'}
      >
        {selectedVerif && (
          <form onSubmit={handleDecisionSubmit}>
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div><strong>Registration No:</strong> {selectedVerif.businessRegistrationNumber}</div>
              <div><strong>Email:</strong> {selectedVerif.officialEmail}</div>
              <div><strong>Contact:</strong> {selectedVerif.contactPersonName} &bull; {selectedVerif.contactPhone}</div>
              {selectedVerif.documentUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={selectedVerif.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <span>View Submitted Incorporation Document</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Review Decision</label>
              <select
                className="form-control form-select"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              >
                <option value="approved">Approve & Grant Job Posting Privileges</option>
                <option value="needs_info">Request Additional Incorporation Proof</option>
                <option value="rejected">Reject Accreditation Application</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Officer Audit Remarks</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Audit notes or instructions recorded in permanent verification history..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedVerif(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Recording Audit...' : 'Confirm Decision'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
