import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  XCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const RecruiterApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Update & Interview Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-demo-skill');
  const [roundName, setRoundName] = useState('Technical Architecture Evaluation');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recruiters/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openActionModal = (app, status) => {
    setSelectedApp(app);
    setNewStatus(status);
    setFeedbackNotes(app.recruiterFeedback || '');
    if (status === 'interview_scheduled') {
      const defaultTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
      setInterviewDate(defaultTime);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const payload = {
        status: newStatus,
        recruiterFeedback: feedbackNotes,
      };

      if (newStatus === 'interview_scheduled') {
        payload.interviewSchedule = {
          scheduledAt: new Date(interviewDate),
          mode: 'Google Meet',
          meetingLink,
          roundName,
          notes: feedbackNotes,
        };
      }

      const res = await api.put(`/recruiters/applications/${selectedApp._id}/status`, payload);
      if (res.data.success) {
        alert(res.data.message);
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Candidate Applications & Pipeline</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Review candidate match breakdowns, schedule technical rounds, and advance students through hiring stages.
        </p>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Position</th>
                <th>SkillProof Fit</th>
                <th>Stage Status</th>
                <th>Interview Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading candidate applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No applications submitted yet for your active openings.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.student?.fullName || 'Candidate'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                    </td>
                    <td>{app.job?.title || 'Job Opening'}</td>
                    <td>
                      <div style={{ fontWeight: 800, color: app.matchScore >= 75 ? '#16a34a' : '#2563eb', fontSize: '1.05rem' }}>
                        {app.matchScore}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.matchBreakdown?.evidenceStrength || 'Assessed'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === 'selected'
                            ? 'badge-ready'
                            : app.status === 'shortlisted' || app.status === 'interview_scheduled'
                            ? 'badge-assessed'
                            : app.status === 'rejected'
                            ? 'badge-support'
                            : 'badge-developing'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {app.interviewSchedule?.scheduledAt ? (
                        <div style={{ fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 600 }}>{app.interviewSchedule.roundName}</div>
                          <div style={{ color: 'var(--text-muted)' }}>
                            {new Date(app.interviewSchedule.scheduledAt).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>None scheduled</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {app.status === 'applied' && (
                          <button
                            onClick={() => openActionModal(app, 'shortlisted')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#2563eb' }}
                          >
                            Shortlist
                          </button>
                        )}

                        <button
                          onClick={() => openActionModal(app, 'interview_scheduled')}
                          className="btn btn-primary btn-sm"
                        >
                          Schedule
                        </button>

                        {app.status !== 'selected' && (
                          <button
                            onClick={() => openActionModal(app, 'selected')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#16a34a' }}
                          >
                            Select & Offer
                          </button>
                        )}

                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => openActionModal(app, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626' }}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action & Interview Schedule Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={newStatus === 'interview_scheduled' ? 'Schedule Candidate Interview' : `Update Application Stage: ${newStatus}`}
      >
        {selectedApp && (
          <form onSubmit={handleUpdateStatus}>
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700 }}>{selectedApp.student?.fullName}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Position: {selectedApp.job?.title} &bull; Fit Score: <strong>{selectedApp.matchScore}%</strong>
              </p>
            </div>

            {newStatus === 'interview_scheduled' && (
              <>
                <div className="form-group">
                  <label className="form-label">Interview Round Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Virtual Meeting Link (Google Meet / Teams)</label>
                  <input
                    type="url"
                    className="form-control"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Recruiter Feedback / Notes</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Candidate feedback, discussion focus, or evaluation remarks..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Confirm Stage Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
