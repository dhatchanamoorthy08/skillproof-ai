import React, { useState, useEffect } from 'react';
import {
  BellRing,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const EarlyAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mentoring Note Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mentoringText, setMentoringText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/placement/alerts');
      if (res.data.success) {
        setAlerts(res.data.alerts);
      }
    } catch (err) {
      console.error('Failed to load early alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAttachMentoring = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !mentoringText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/placement/students/${selectedStudent.studentId}/mentoring`, {
        note: mentoringText,
      });

      if (res.data.success) {
        alert('Mentoring intervention logged for student.');
        setSelectedStudent(null);
        setMentoringText('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit mentoring note.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <AlertTriangle size={16} /> Proactive Student Intervention
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Placement Early Alerts Engine</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Real-time identification of students who need additional training, have incomplete Skill Passports, or lack verified evidence before recruitment drives begin.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Scanning candidate evidence repositories...
        </div>
      ) : alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#16a34a' }}>
          <CheckCircle2 size={40} style={{ marginBottom: '0.75rem' }} />
          <h3>All Clear! Zero At-Risk Students Detected</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All enrolled candidates have completed assessments and active verified evidence.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {alerts.map((al) => (
            <div
              key={al.studentId}
              className="card"
              style={{
                borderLeft: '5px solid #dc2626',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{al.fullName}</h3>
                  <span className="badge badge-support">{al.severity} Severity</span>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {al.department} &bull; CGPA: <strong>{al.cgpa}</strong> &bull; JRI: <strong style={{ color: '#dc2626' }}>{al.jobReadinessIndex}%</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#991b1b' }}>Trigger Reason:</strong> {al.reason}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <strong>Recommended Placement Action:</strong> {al.recommendedAction}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStudent(al);
                  setMentoringText('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem', border: '1px solid #fca5a5', color: '#b91c1c' }}
              >
                <MessageSquare size={16} />
                <span>Assign Training / Mentoring</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mentoring Note Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `Early Alert Advisory: ${selectedStudent.fullName}` : 'Mentoring Intervention'}
      >
        {selectedStudent && (
          <form onSubmit={handleAttachMentoring}>
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
              <strong>Flag: {selectedStudent.reason}</strong>
              <p style={{ fontSize: '0.825rem', margin: '4px 0 0 0' }}>
                Job Readiness Index: {selectedStudent.jobReadinessIndex}% &bull; Current Status: Needs Support
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Intervention Guidance & Assigned Action Items</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Assign specific learning activities (e.g. Complete Full Stack Assessment by Friday, upload GitHub link)..."
                value={mentoringText}
                onChange={(e) => setMentoringText(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedStudent(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Logging Action...' : 'Confirm Advisory'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
