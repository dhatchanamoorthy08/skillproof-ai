import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Camera,
  Video,
  VideoOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  User,
  Eye,
  Maximize2,
  FileText,
  AlertOctagon,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const AssessmentMonitoringPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    inProgressCount: 0,
    flaggedCount: 0,
    completedCount: 0,
    pausedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected attempt for audit modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/assessments/monitoring/attempts', { params });
      if (res.data.success) {
        setAttempts(res.data.attempts || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load assessment proctoring logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAttempts();
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedAttempt) return;
    setStatusUpdating(true);
    try {
      const res = await api.post(`/assessments/monitoring/attempts/${selectedAttempt._id}/status`, {
        status: newStatus,
        reviewNotes: reviewNote,
      });

      if (res.data.success) {
        alert(res.data.message);
        setSelectedAttempt(null);
        fetchAttempts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update attempt status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <ShieldAlert size={22} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Online Assessment Proctoring & Security Command
              </h2>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.925rem', margin: 0 }}>
              Real-time monitoring of candidate assessments. Inspect webcam connection integrity, tab switches, focus loss, and proctoring violation event histories.
            </p>
          </div>

          <button
            onClick={fetchAttempts}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Feed
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
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <div style={{ padding: '0.875rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Attempts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{stats.totalAttempts}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E40AF', textTransform: 'uppercase' }}>In Progress Active</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>{stats.inProgressCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#FEE2E2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#991B1B', textTransform: 'uppercase' }}>Flagged For Review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626', marginTop: '0.2rem' }}>{stats.flaggedCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#DCFCE7', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', textTransform: 'uppercase' }}>Completed & Passed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A', marginTop: '0.2rem' }}>{stats.completedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                placeholder="Search candidate name, email, or assessment title..."
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

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={15} style={{ color: '#64748B' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', height: '40px', fontSize: '0.85rem', padding: '0 0.75rem' }}
            >
              <option value="all">All Attempts ({stats.totalAttempts})</option>
              <option value="in_progress">In Progress ({stats.inProgressCount})</option>
              <option value="flagged">Flagged for Review ({stats.flaggedCount})</option>
              <option value="completed">Completed ({stats.completedCount})</option>
              <option value="paused">Paused ({stats.pausedCount || 0})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attempts Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#2563EB' }} />
          <div>Loading assessment proctoring records...</div>
        </div>
      ) : attempts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
          <ShieldCheck size={44} style={{ color: '#94A3B8', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
            No assessment attempts found
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            {statusFilter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search keywords.'
              : 'Candidate proctoring sessions will populate here as students take online assessments.'}
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th>Candidate</th>
                <th>Assessment</th>
                <th>Camera Status</th>
                <th>Tab Switches</th>
                <th>Focus Losses</th>
                <th>Interruptions</th>
                <th>Status / Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((att) => {
                const isFlagged = att.status === 'flagged';
                const isInProgress = att.status === 'in_progress';
                const isCompleted = att.status === 'completed';
                const isPaused = att.status === 'paused';

                return (
                  <tr key={att._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{att.candidateName || 'Candidate'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{att.candidateEmail || 'student@skillproof.ai'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{att.assessmentTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {att.startedAt ? new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        {att.submittedAt ? ` • Done ${new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </div>
                    </td>
                    <td>
                      {att.cameraStatus === 'connected' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#DCFCE7',
                            color: '#166534',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <Video size={12} /> Connected
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <VideoOff size={12} /> Disconnected
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: (att.tabSwitches || 0) > 0 ? '#DC2626' : '#16A34A',
                        }}
                      >
                        {att.tabSwitches || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: (att.focusLossCount || 0) > 0 ? '#D97706' : '#16A34A',
                        }}
                      >
                        {att.focusLossCount || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: (att.cameraInterruptions || 0) > 0 ? '#DC2626' : '#64748B',
                        }}
                      >
                        {att.cameraInterruptions || 0}
                      </span>
                    </td>
                    <td>
                      {isInProgress && (
                        <span
                          style={{
                            background: '#EFF6FF',
                            color: '#1E40AF',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          In Progress
                        </span>
                      )}
                      {isFlagged && (
                        <span
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <AlertTriangle size={12} /> Flagged
                        </span>
                      )}
                      {isCompleted && (
                        <span
                          style={{
                            background: '#DCFCE7',
                            color: '#16A34A',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Score: {att.scorePercentage}% {att.passed ? '• Passed' : '• Failed'}
                        </span>
                      )}
                      {isPaused && (
                        <span
                          style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Paused
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={13} /> Security Log
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Security Audit Modal */}
      <Modal
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
        title="Proctoring Security Audit Log"
        maxWidth="650px"
      >
        {selectedAttempt && (
          <div>
            {/* Candidate Header */}
            <div
              style={{
                padding: '1rem',
                background: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    {selectedAttempt.candidateName}
                  </h4>
                  <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px' }}>
                    {selectedAttempt.candidateEmail} &bull; {selectedAttempt.assessmentTitle}
                  </div>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: selectedAttempt.status === 'flagged' ? '#FEE2E2' : '#DCFCE7',
                    color: selectedAttempt.status === 'flagged' ? '#DC2626' : '#16A34A',
                  }}
                >
                  {selectedAttempt.status?.toUpperCase()}
                </span>
              </div>

              {/* Counters summary */}
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#475569' }}>
                <div>Tab Switches: <strong>{selectedAttempt.tabSwitches || 0}</strong></div>
                <div>Focus Losses: <strong>{selectedAttempt.focusLossCount || 0}</strong></div>
                <div>Camera Drops: <strong>{selectedAttempt.cameraInterruptions || 0}</strong></div>
                <div>Total Flags: <strong>{selectedAttempt.violationCount || 0}</strong></div>
              </div>
            </div>

            {/* Timestamped Events Timeline */}
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
              Timestamped Event Chronology ({selectedAttempt.violations?.length || 0} events):
            </h5>

            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              {(!selectedAttempt.violations || selectedAttempt.violations.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B', fontSize: '0.85rem' }}>
                  No security violation events recorded for this candidate attempt.
                </div>
              ) : (
                selectedAttempt.violations.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      fontSize: '0.825rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#B45309', textTransform: 'capitalize' }}>
                        {ev.type?.replace(/_/g, ' ')}:
                      </strong>{' '}
                      <span style={{ color: '#475569' }}>{ev.details}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Admin Resolution Actions */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={statusUpdating}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#16A34A', borderColor: '#BBF7D0' }}
                >
                  Clear Flags & Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus('flagged')}
                  disabled={statusUpdating}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#DC2626', borderColor: '#FECACA' }}
                >
                  Flag for Disqualification
                </button>
              </div>

              <button onClick={() => setSelectedAttempt(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssessmentMonitoringPage;
