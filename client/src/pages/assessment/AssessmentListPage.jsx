import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lock,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const AssessmentListPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await api.get('/assessments');
        if (res.data.success) {
          setAssessments(res.data.assessments);
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleStartExam = (assessmentId) => {
    setSelectedAssessment(null);
    navigate(`/assessments/${assessmentId}/run`);
  };

  const domains = ['All', ...Array.from(new Set(assessments.map((a) => a.domain)))];
  const filteredAssessments = selectedDomain === 'All'
    ? assessments
    : assessments.filter((a) => a.domain === selectedDomain);

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <ShieldCheck size={16} /> Standardized Examination Engine
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Proctored Technical Assessments</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Validate your claimed competencies. Dynamic assessment pools randomly select varied question sets and shuffled choices for each account and session.
        </p>
      </div>

      {/* Domain Filters */}
      {!loading && domains.length > 2 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`btn ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                borderRadius: '999px',
                padding: '0.35rem 0.95rem',
                fontSize: '0.825rem',
                fontWeight: selectedDomain === dom ? 700 : 500,
              }}
            >
              {dom}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading available assessments...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-assessed">{assessment.domain}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <Clock size={14} /> {assessment.durationMinutes} Mins
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {assessment.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {assessment.description}
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Evaluated Competencies:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {assessment.primarySkills.map((sk) => (
                      <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.75rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {assessment.userAttempt ? (
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: assessment.userAttempt.passed ? '#ecfdf5' : '#fef2f2',
                      border: `1px solid ${assessment.userAttempt.passed ? '#a7f3d0' : '#fecaca'}`,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <strong>Latest Score: {assessment.userAttempt.scorePercentage}%</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Passing threshold: {assessment.passingScorePercentage}% &bull; {assessment.questionCount} Questions ({assessment.durationMinutes} Mins)
                      </div>
                    </div>
                    {assessment.userAttempt.passed ? (
                      <span className="badge badge-ready">PASSED</span>
                    ) : (
                      <span className="badge badge-support">NOT PASSED</span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Passing threshold: <strong>{assessment.passingScorePercentage}%</strong> &bull; {assessment.questionCount} Questions ({assessment.durationMinutes} Mins)
                  </div>
                )}

                <button
                  onClick={() => setSelectedAssessment(assessment)}
                  className="btn btn-primary"
                  style={{ width: '100%', gap: '0.5rem' }}
                >
                  <Play size={16} />
                  <span>{assessment.userAttempt ? 'Retake Proctored Exam' : 'Start Assessment'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proctoring Policy Confirmation Modal */}
      <Modal
        isOpen={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        title="Proctoring & Exam Security Agreement"
      >
        {selectedAssessment && (
          <div>
            <div className="proctor-alert-banner">
              <Lock size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Active Integrity Monitoring Enforced</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                  This assessment monitors window focus, fullscreen state, and suppresses clipboard events.
                </p>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Examination Rules for {selectedAssessment.title}
            </h4>

            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <li>The exam will request Fullscreen mode immediately upon launch.</li>
              <li>Exiting fullscreen or switching browser tabs is recorded as a compliance violation.</li>
              <li>Three (3) integrity violations flag your attempt for administrative review.</li>
              <li>Right-click context menus and copy-paste shortcuts (Ctrl+C, Ctrl+V) are disabled.</li>
              <li>Timer auto-submits your answers once the {selectedAssessment.durationMinutes}-minute countdown concludes.</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedAssessment(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleStartExam(selectedAssessment._id)}
                className="btn btn-primary"
              >
                I Agree &bull; Launch Exam
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
