import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Award,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const InterviewPrepPage = () => {
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState(profile?.targetRole || 'Full Stack Developer');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const sampleQuestions = [
    {
      role: 'Full Stack Developer',
      type: 'Technical & Architecture',
      question: 'How do you design a robust distributed rate-limiting mechanism for public REST APIs using Node.js and Redis?',
      hint: 'Discuss the Token Bucket / Sliding Window algorithm, atomic Lua scripts, and HTTP 429 response headers.',
    },
    {
      role: 'Full Stack Developer',
      type: 'Project & Experience',
      question: 'Walk me through a challenging production bug you encountered in React or Node.js. How did you diagnose and remediate it?',
      hint: 'Use the STAR technique: Situation, Task, Action (profiling tools, reproduction), and Result (latency reduction, tests added).',
    },
    {
      role: 'Full Stack Developer',
      type: 'Behavioral & Engineering Values',
      question: 'How do you handle a scenario where product requirements conflict with technical scalability and clean code architecture?',
      hint: 'Address communication with product managers, managing technical debt deliberately, and incremental refactoring milestones.',
    },
  ];

  const currentQ = sampleQuestions[selectedQuestionIndex];

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.post('/students/me/interview-practice', {
        question: currentQ.question,
        role: selectedRole,
        studentAnswer,
      });

      if (res.data.success) {
        setFeedback(res.data.evaluation);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit answer for evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <Sparkles size={16} /> Interactive Interview Simulator
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Technical Interview Studio</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Practice role-specific technical and behavioral questions with instant AI feedback on technical completeness, clarity, and trade-off analysis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Question & Answer Box */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-assessed">{currentQ.type}</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedQuestionIndex(idx);
                    setFeedback(null);
                    setStudentAnswer('');
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: selectedQuestionIndex === idx ? 'var(--primary)' : '#ffffff',
                    color: selectedQuestionIndex === idx ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>
            {currentQ.question}
          </h3>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card-subtle)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Lightbulb size={16} color="#d97706" />
            <span>Hint: {currentQ.hint}</span>
          </div>

          <form onSubmit={handleSubmitAnswer}>
            <div className="form-group">
              <label className="form-label">Your Response</label>
              <textarea
                className="form-control"
                rows={7}
                placeholder="Structure your answer with core principles, architectural choices, trade-offs, and metrics..."
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.5rem' }}
              disabled={submitting || !studentAnswer.trim()}
            >
              <Send size={16} />
              <span>{submitting ? 'Analyzing Response...' : 'Submit Response for AI Review'}</span>
            </button>
          </form>
        </div>

        {/* Feedback Display */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">AI Evaluation & Model Breakdown</h3>
              <p className="card-subtitle">Objective guidance on clarity, depth, and systems articulation</p>
            </div>
          </div>

          {!feedback ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <HelpCircle size={40} color="var(--border-medium)" style={{ marginBottom: '0.75rem' }} />
              <p>Type your answer in the response box and click submit to view detailed AI feedback.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: feedback.score >= 75 ? '#ecfdf5' : '#eff6ff',
                  border: `1px solid ${feedback.score >= 75 ? '#a7f3d0' : '#bfdbfe'}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Response Rating</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: feedback.score >= 75 ? '#047857' : '#1d4ed8' }}>
                    {feedback.score} / 100
                  </div>
                </div>
                <Award size={32} color={feedback.score >= 75 ? '#047857' : '#1d4ed8'} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>Evaluation Summary</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {feedback.feedback}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>Demonstrated Strengths</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {feedback.strengths?.map((str, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#16a34a' }}>
                      <CheckCircle2 size={15} /> <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>Areas for Improvement</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {feedback.improvements?.map((imp, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#b45309' }}>
                      <AlertTriangle size={15} /> <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Model Architecture Answer</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {feedback.modelAnswer}
                </p>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                Note: AI feedback is designed as structured practice guidance and does not guarantee specific interviewer decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
