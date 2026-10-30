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
    terminatedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected attempt for audit modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const formatRemainingTime = (secs) => {
    if (!secs || secs <= 0) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  const handleAllowRestart = async (attemptId) => {
    if (!window.confirm('Are you sure you want to authorize this candidate to retake this assessment?')) {
      return;
    }
    setStatusUpdating(true);
    try {
      const res = await api.post(`/assessments/monitoring/attempts/${attemptId}/allow-restart`);
      if (res.data.success) {
        alert(res.data.message);
        setSelectedAttempt(null);
        fetchAttempts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to authorize candidate retake.');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF', border: '1px solid #DFE8E1' }}>
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
                  color: '#07866A',
                }}
              >
                <ShieldAlert size={22} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#142D2B' }}>
                Online Assessment Proctoring & Security Command
              </h2>
            </div>
            <p style={{ color: '#68756F', fontSize: '0.925rem', margin: 0 }}>
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
            borderTop: '1px solid #FAFAF5',
          }}
        >
          <div style={{ padding: '0.875rem 1rem', background: '#FAFAF5', borderRadius: '8px', border: '1px solid #DFE8E1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase' }}>Total Attempts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#142D2B', marginTop: '0.2rem' }}>{stats.totalAttempts}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#F0F7F4', borderRadius: '8px', border: '1px solid #DFE8E1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#142D2B', textTransform: 'uppercase' }}>In Progress Active</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#07866A', marginTop: '0.2rem' }}>{stats.inProgressCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#FCF0F2', borderRadius: '8px', border: '1px solid #F7D4D7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#822430', textTransform: 'uppercase' }}>Flagged For Review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C83E4D', marginTop: '0.2rem' }}>{stats.flaggedCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#EFF8F2', borderRadius: '8px', border: '1px solid #C8E6D2' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#247A48', textTransform: 'uppercase' }}>Completed & Passed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#247A48', marginTop: '0.2rem' }}>{stats.completedCount}</div>
          </div>
          <div style={{ padding: '0.875rem 1rem', background: '#FCF0F2', borderRadius: '8px', border: '1.5px solid #F7D4D7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#822430', textTransform: 'uppercase' }}>Terminated (Violations)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A32F3D', marginTop: '0.2rem' }}>{stats.terminatedCount || 0}</div>
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
            <Filter size={15} style={{ color: '#68756F' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#68756F' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', height: '40px', fontSize: '0.85rem', padding: '0 0.75rem' }}
            >
              <option value="all">All Attempts ({stats.totalAttempts})</option>
              <option value="in_progress">In Progress ({stats.inProgressCount})</option>
              <option value="flagged">Flagged for Review ({stats.flaggedCount})</option>
              <option value="terminated">Terminated Violations ({stats.terminatedCount || 0})</option>
              <option value="completed">Completed ({stats.completedCount})</option>
              <option value="paused">Paused ({stats.pausedCount || 0})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attempts Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: '#68756F' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#07866A' }} />
          <div>Loading assessment proctoring records...</div>
        </div>
      ) : attempts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#68756F' }}>
          <ShieldCheck size={44} style={{ color: '#8B9892', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#142D2B', marginBottom: '0.4rem' }}>
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
              <tr style={{ background: '#FAFAF5' }}>
                <th>Student Candidate</th>
                <th>Assessment &amp; Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Remaining Time</th>
                <th>Violation Log &amp; Reasons</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((att) => {
                const isFlagged = att.status === 'flagged';
                const isInProgress = att.status === 'in_progress';
                const isCompleted = att.status === 'completed';
                const isPaused = att.status === 'paused';
                const isTerminated = att.status === 'terminated';

                const startTimeFormatted = att.startedAt
                  ? new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : '—';

                const endTimeFormatted = att.submittedAt
                  ? new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : isInProgress
                  ? 'In Progress'
                  : '—';

                const remainingTimeFormatted = isInProgress
                  ? formatRemainingTime(att.remainingSeconds)
                  : '—';

                return (
                  <tr key={att._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#142D2B' }}>{att.candidateName || 'Candidate'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#68756F' }}>{att.candidateEmail || 'student@skillproof.ai'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#142D2B', fontSize: '0.875rem' }}>{att.assessmentTitle}</div>
                      <div style={{ marginTop: '4px' }}>
                        {isTerminated && (
                          <span
                            style={{
                              background: '#FCF0F2',
                              color: '#A32F3D',
                              border: '1px solid #F7D4D7',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <AlertOctagon size={11} /> Terminated
                          </span>
                        )}
                        {isInProgress && (
                          <span
                            style={{
                              background: '#F0F7F4',
                              color: '#07866A',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            In Progress
                          </span>
                        )}
                        {isFlagged && (
                          <span
                            style={{
                              background: '#FCF0F2',
                              color: '#C83E4D',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <AlertTriangle size={11} /> Flagged
                          </span>
                        )}
                        {isCompleted && (
                          <span
                            style={{
                              background: '#EFF8F2',
                              color: '#247A48',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            Completed ({att.scorePercentage}%)
                          </span>
                        )}
                        {isPaused && (
                          <span
                            style={{
                              background: '#FEF7ED',
                              color: '#A0681B',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            Paused
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#142D2B', fontWeight: 600 }}>
                      {startTimeFormatted}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#142D2B', fontWeight: 600 }}>
                      {endTimeFormatted}
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 700, color: isInProgress ? '#07866A' : '#68756F' }}>
                      {remainingTimeFormatted}
                    </td>
                    <td>
                      {isTerminated ? (
                        <div style={{ fontSize: '0.78rem', color: '#C83E4D', fontWeight: 600, maxWidth: '240px' }}>
                          <strong>Violation:</strong> {att.terminationReason || 'Assessment terminated due to a proctoring violation.'}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#4A5651' }}>
                          <span style={{ fontWeight: 700, color: (att.violationCount || 0) > 0 ? '#E8A23A' : '#247A48' }}>
                            {att.violationCount || 0} Events
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#68756F' }}>
                            {' '}• Tabs: {att.tabSwitches || 0} • Focus: {att.focusLossCount || 0}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={13} /> Review Details
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
                background: '#FAFAF5',
                borderRadius: '8px',
                border: '1px solid #DFE8E1',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#142D2B' }}>
                    {selectedAttempt.candidateName}
                  </h4>
                  <div style={{ fontSize: '0.825rem', color: '#68756F', marginTop: '2px' }}>
                    {selectedAttempt.candidateEmail} &bull; {selectedAttempt.assessmentTitle}
                  </div>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: selectedAttempt.status === 'terminated' ? '#FCF0F2' : selectedAttempt.status === 'flagged' ? '#FEF7ED' : '#EFF8F2',
                    color: selectedAttempt.status === 'terminated' ? '#A32F3D' : selectedAttempt.status === 'flagged' ? '#C48227' : '#247A48',
                  }}
                >
                  {selectedAttempt.status?.toUpperCase()}
                </span>
              </div>

              {/* Termination Info Banner if Terminated */}
              {selectedAttempt.status === 'terminated' && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: '#FCF0F2',
                    border: '1px solid #F7D4D7',
                    borderRadius: '6px',
                    color: '#822430',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: '2px' }}>
                    Zero-Tolerance Termination Reason:
                  </div>
                  <div>{selectedAttempt.terminationReason || 'Anti-cheating security violation.'}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', fontSize: '0.78rem', color: '#7F1D1D' }}>
                    <span>Fullscreen Exits: <strong>{selectedAttempt.fullscreenExits || 0}</strong></span>
                    <span>Retake Status: <strong>{selectedAttempt.isRestartAllowed ? 'Authorized' : 'Locked by Policy'}</strong></span>
                  </div>
                </div>
              )}

              {/* Timing Metadata Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #DFE8E1',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <span style={{ color: '#68756F', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>START TIME</span>
                  <strong>{selectedAttempt.startedAt ? new Date(selectedAttempt.startedAt).toLocaleString() : '—'}</strong>
                </div>
                <div>
                  <span style={{ color: '#68756F', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>END TIME</span>
                  <strong>{selectedAttempt.submittedAt ? new Date(selectedAttempt.submittedAt).toLocaleString() : selectedAttempt.status === 'in_progress' ? 'In Progress' : '—'}</strong>
                </div>
                <div>
                  <span style={{ color: '#68756F', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>REMAINING TIME</span>
                  <strong>{selectedAttempt.status === 'in_progress' ? formatRemainingTime(selectedAttempt.remainingSeconds) : '—'}</strong>
                </div>
              </div>

              {/* Counters summary */}
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#4A5651', flexWrap: 'wrap' }}>
                <div>Tab Switches: <strong>{selectedAttempt.tabSwitches || 0}</strong></div>
                <div>Focus Losses: <strong>{selectedAttempt.focusLossCount || 0}</strong></div>
                <div>Fullscreen Exits: <strong>{selectedAttempt.fullscreenExits || 0}</strong></div>
                <div>Camera Drops: <strong>{selectedAttempt.cameraInterruptions || 0}</strong></div>
                <div>Total Flags: <strong>{selectedAttempt.violationCount || 0}</strong></div>
              </div>
            </div>

            {/* Timestamped Events Timeline */}
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#142D2B', marginBottom: '0.6rem' }}>
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
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#68756F', fontSize: '0.85rem' }}>
                  No security violation events recorded for this candidate attempt.
                </div>
              ) : (
                selectedAttempt.violations.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      background: '#FEF7ED',
                      border: '1px solid #FCDCA6',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      fontSize: '0.825rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#C48227', textTransform: 'capitalize' }}>
                        {ev.type?.replace(/_/g, ' ')}:
                      </strong>{' '}
                      <span style={{ color: '#4A5651' }}>{ev.details}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8B9892', whiteSpace: 'nowrap' }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Admin Resolution Actions */}
            <div style={{ borderTop: '1px solid #DFE8E1', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAllowRestart(selectedAttempt._id)}
                  disabled={statusUpdating}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <RefreshCw size={13} /> Authorize Retake
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={statusUpdating}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#247A48', borderColor: '#C8E6D2' }}
                >
                  Clear Flags & Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus('flagged')}
                  disabled={statusUpdating}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#C83E4D', borderColor: '#F7D4D7' }}
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
