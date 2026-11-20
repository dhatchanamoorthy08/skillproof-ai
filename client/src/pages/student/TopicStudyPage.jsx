import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  HelpCircle,
  ExternalLink,
  Award,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  FileCode2,
  Lightbulb,
  CheckSquare,
  Square,
} from 'lucide-react';
import api from '../../services/api';

export const TopicStudyPage = () => {
  const { slug, topicId } = useParams();
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'code' | 'exercises' | 'interview' | 'courses'
  const [copiedCode, setCopiedCode] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState({});
  const [revealedHints, setRevealedHints] = useState({});
  const [exerciseCodes, setExerciseCodes] = useState({});
  const [exerciseSuccess, setExerciseSuccess] = useState({});
  const [submittingEx, setSubmittingEx] = useState(false);

  useEffect(() => {
    const fetchTopicAndProgress = async () => {
      setLoading(true);
      try {
        const [topRes, progRes] = await Promise.all([
          api.get(`/roadmaps/${slug}/topics/${topicId}`),
          api.get(`/roadmaps/${slug}/progress`),
        ]);

        if (topRes.data.success) {
          setTopicData(topRes.data);
          // Initialize exercise code states
          const initialExCodes = {};
          (topRes.data.topic?.studyMaterial?.practiceExercises || []).forEach((ex) => {
            initialExCodes[ex.id] = ex.initialCode || '';
          });
          setExerciseCodes(initialExCodes);
        }

        if (progRes.data.success) {
          const isDone = (progRes.data.progress?.completedTopics || []).includes(topicId);
          setCompleted(isDone);
        }
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndProgress();
  }, [slug, topicId]);

  const handleToggleCompletion = async () => {
    try {
      const res = await api.post(`/roadmaps/${slug}/progress/toggle-topic`, { topicId });
      if (res.data.success) {
        setCompleted(!completed);
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  const copySnippet = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleSolution = (exId) => {
    setRevealedSolutions((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const toggleHint = (exId) => {
    setRevealedHints((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const handleExerciseSubmit = async (exId) => {
    setSubmittingEx(true);
    try {
      const code = exerciseCodes[exId];
      const res = await api.post(`/roadmaps/${slug}/progress/save-exercise`, {
        topicId,
        exerciseId: exId,
        code,
      });
      if (res.data.success) {
        setExerciseSuccess((prev) => ({ ...prev, [exId]: true }));
        setCompleted(true);
      }
    } catch (err) {
      console.error('Failed to submit exercise:', err);
    } finally {
      setSubmittingEx(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading comprehensive study notes and resources for {topicId}...
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Topic not found</h3>
        <p style={{ color: 'var(--text-muted)' }}>The requested learning topic could not be located in this roadmap.</p>
        <Link to="/student/roadmap" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          &larr; Return to Roadmaps
        </Link>
      </div>
    );
  }

  const { roadmapTitle, levelTitle, module, topic } = topicData;
  const sm = topic.studyMaterial || {};

  return (
    <div>
      {/* Breadcrumb Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#77736D', flexWrap: 'wrap' }}>
          <Link to="/student/roadmap" style={{ color: '#C46A45', fontWeight: 600, textDecoration: 'none' }}>
            Career Roadmaps
          </Link>
          <ChevronRight size={14} />
          <span>{roadmapTitle}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#252525', fontWeight: 600 }}>{module?.title}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#252525', fontWeight: 700 }}>{topic.title}</span>
        </div>

        <button
          onClick={() => navigate('/student/roadmap')}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontWeight: 600 }}
        >
          <ArrowLeft size={14} /> Back to Track
        </button>
      </div>

      {/* Hero Header Card */}
      <div
        className="card"
        style={{
          background: '#252525',
          color: '#FFFFFF',
          marginBottom: '1.75rem',
          padding: '2rem',
          border: '1px solid rgba(232, 225, 215, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-assessed">{levelTitle}</span>
              <span style={{ fontSize: '0.8rem', color: '#D9D0C3', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} /> {topic.estimatedMinutes} Mins Estimated Study Time
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#F5F1E9' }}>
              {topic.title}
            </h1>
            <p style={{ color: '#D9D0C3', fontSize: '0.95rem', maxWidth: '750px', margin: 0, lineHeight: 1.5 }}>
              {sm.introduction || topic.summary}
            </p>
          </div>

          {/* Mark Complete Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={handleToggleCompletion}
              className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                gap: '0.5rem',
                fontWeight: 700,
                backgroundColor: completed ? '#FAF6EF' : '#C46A45',
                color: completed ? '#252525' : '#FFFFFF',
                border: completed ? '1px solid #B89B6A' : 'none',
              }}
            >
              {completed ? <CheckCircle2 size={18} color="#B89B6A" /> : <Square size={18} />}
              <span>{completed ? 'Topic Completed' : 'Mark as Completed'}</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: '#B89B6A' }}>
              {completed ? 'Synchronized with your Skill Passport' : 'Click when you finish studying'}
            </span>
          </div>
        </div>

        {/* Key Concepts Chips */}
        {(sm.keyConcepts || []).length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(232, 225, 215, 0.15)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B89B6A', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.5rem' }}>
              Key Concepts:
            </span>
            <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '4px' }}>
              {sm.keyConcepts.map((kc, kIdx) => (
                <span
                  key={kIdx}
                  style={{
                    backgroundColor: 'rgba(245, 241, 233, 0.1)',
                    border: '1px solid rgba(232, 225, 215, 0.2)',
                    color: '#F5F1E9',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {kc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nav Tabs for Content Sections */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid #E8E1D7', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('notes')}
          className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: '8px', gap: '0.4rem', fontWeight: 700 }}
        >
          <BookOpen size={15} />
          <span>Detailed Study Notes</span>
        </button>

        {sm.codeSnippet?.code && (
          <button
            onClick={() => setActiveTab('code')}
            className={`btn ${activeTab === 'code' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '8px', gap: '0.4rem', fontWeight: 700 }}
          >
            <Code2 size={15} />
            <span>Syntax & Code Examples</span>
          </button>
        )}

        {(sm.practiceExercises || []).length > 0 && (
          <button
            onClick={() => setActiveTab('exercises')}
            className={`btn ${activeTab === 'exercises' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '8px', gap: '0.4rem', fontWeight: 700 }}
          >
            <FileCode2 size={15} />
            <span>Hands-on Exercises ({sm.practiceExercises.length})</span>
          </button>
        )}

        {(sm.interviewQuestions || []).length > 0 && (
          <button
            onClick={() => setActiveTab('interview')}
            className={`btn ${activeTab === 'interview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '8px', gap: '0.4rem', fontWeight: 700 }}
          >
            <HelpCircle size={15} />
            <span>Interview Questions ({sm.interviewQuestions.length})</span>
          </button>
        )}

        {(topic.freeCourses || []).length > 0 && (
          <button
            onClick={() => setActiveTab('courses')}
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '8px', gap: '0.4rem', fontWeight: 700 }}
          >
            <ExternalLink size={15} />
            <span>Verified Free Courses ({topic.freeCourses.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: DETAILED STUDY NOTES */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#252525', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="#C46A45" /> Core Educational Content & Theoretical Breakdown
            </h3>

            <div
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: '#252525',
                whiteSpace: 'pre-line',
                marginBottom: '1.75rem',
              }}
            >
              {sm.detailedNotes || 'Detailed conceptual notes are provided below for this topic.'}
            </div>

            {/* Step-by-Step Implementation */}
            {(sm.stepByStep || []).length > 0 && (
              <div style={{ marginTop: '1.5rem', background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '10px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#252525', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="#B89B6A" /> Step-by-Step Architectural Implementation Guide
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {sm.stepByStep.map((step, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#252525' }}>
                      <CheckCircle2 size={16} color="#C46A45" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Examples */}
            {(sm.practicalExamples || []).length > 0 && (
              <div style={{ marginTop: '1.25rem', background: '#FFFFFF', border: '1px solid #E8E1D7', borderRadius: '10px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#252525', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={16} color="#C46A45" /> Real-World Production Patterns
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#77736D', lineHeight: 1.6 }}>
                  {sm.practicalExamples.map((pe, pIdx) => (
                    <li key={pIdx}>{pe}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topic Summary */}
            {sm.summaryNotes && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#F5F1E9', borderRadius: '8px', borderLeft: '4px solid #C46A45' }}>
                <strong style={{ fontSize: '0.85rem', color: '#252525', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Topic Summary:
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#77736D', lineHeight: 1.5 }}>
                  {sm.summaryNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SYNTAX & CODE EXAMPLES */}
      {activeTab === 'code' && sm.codeSnippet?.code && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#252525' }}>
                Verified Production Code Example
              </h3>
              <p style={{ color: '#77736D', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                Language: <strong style={{ color: '#C46A45', textTransform: 'uppercase' }}>{sm.codeSnippet.language}</strong>
              </p>
            </div>

            <button
              onClick={() => copySnippet(sm.codeSnippet.code)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem', fontWeight: 700 }}
            >
              {copiedCode ? <Check size={14} color="#B89B6A" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          <pre
            style={{
              padding: '1.5rem',
              backgroundColor: '#252525',
              color: '#F5F1E9',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              overflowX: 'auto',
              lineHeight: 1.6,
              border: '1px solid rgba(232, 225, 215, 0.15)',
              marginBottom: '1.25rem',
            }}
          >
            <code>{sm.codeSnippet.code}</code>
          </pre>

          {sm.codeSnippet.explanation && (
            <div style={{ background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '8px', padding: '1rem 1.25rem' }}>
              <strong style={{ fontSize: '0.85rem', color: '#C46A45', textTransform: 'uppercase' }}>
                Code Walkthrough & Explanation:
              </strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#252525', lineHeight: 1.5 }}>
                {sm.codeSnippet.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRACTICAL EXERCISES */}
      {activeTab === 'exercises' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(sm.practiceExercises || []).map((ex, exIdx) => {
            const isRevealed = !!revealedSolutions[ex.id];
            const isHintRevealed = !!revealedHints[ex.id];
            const isPassed = !!exerciseSuccess[ex.id];

            return (
              <div key={ex.id || exIdx} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-assessed">Challenge {exIdx + 1}</span>
                  {isPassed && <span className="badge badge-ready">Solution Verified & Recorded</span>}
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#252525', marginBottom: '0.75rem' }}>
                  {ex.question}
                </h4>

                {/* Interactive Code Editor Box */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Your Solution:
                  </label>
                  <textarea
                    className="form-control"
                    rows={6}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      backgroundColor: '#252525',
                      color: '#F5F1E9',
                      lineHeight: 1.5,
                      padding: '1rem',
                      borderRadius: '8px',
                    }}
                    value={exerciseCodes[ex.id] || ''}
                    onChange={(e) => setExerciseCodes((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                  />
                </div>

                {/* Control Actions Strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(ex.hints || []).length > 0 && (
                      <button
                        onClick={() => toggleHint(ex.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <Lightbulb size={14} color="#B89B6A" />
                        <span>{isHintRevealed ? 'Hide Hints' : 'Need a Hint?'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isRevealed ? 'Hide Model Solution' : 'Reveal Solution'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleExerciseSubmit(ex.id)}
                    disabled={submittingEx}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.4rem', fontWeight: 700 }}
                  >
                    <Send size={14} />
                    <span>{submittingEx ? 'Verifying...' : 'Submit & Save Progress'}</span>
                  </button>
                </div>

                {/* Hints Banner */}
                {isHintRevealed && (ex.hints || []).length > 0 && (
                  <div style={{ marginTop: '1rem', background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '8px', padding: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#B89B6A' }}>Hints:</strong>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#77736D' }}>
                      {ex.hints.map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Solution Reveal */}
                {isRevealed && ex.solution && (
                  <div style={{ marginTop: '1rem', background: '#F5F1E9', border: '1px solid #E8E1D7', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#C46A45', textTransform: 'uppercase' }}>
                        Model Reference Solution:
                      </strong>
                      <button
                        onClick={() => copySnippet(ex.solution)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      >
                        Copy
                      </button>
                    </div>
                    <pre
                      style={{
                        padding: '1rem',
                        background: '#252525',
                        color: '#F5F1E9',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        overflowX: 'auto',
                      }}
                    >
                      <code>{ex.solution}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: INTERVIEW QUESTIONS */}
      {activeTab === 'interview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(sm.interviewQuestions || []).map((iq, qIdx) => (
            <div key={qIdx} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-claimed" style={{ fontSize: '0.72rem' }}>
                  {iq.difficulty || 'Intermediate'} Question
                </span>
                <span style={{ fontSize: '0.75rem', color: '#77736D', fontWeight: 600 }}>
                  Question #{qIdx + 1}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#252525', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                {iq.question}
              </h4>

              <div style={{ background: '#FAF6EF', border: '1px solid #E8E1D7', borderRadius: '8px', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C46A45', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Candidate Model Answer:
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#252525', lineHeight: 1.6 }}>
                  {iq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: VERIFIED FREE COURSES */}
      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {(topic.freeCourses || []).map((course, cIdx) => (
            <div
              key={cIdx}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
                border: '1px solid #E8E1D7',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-ready">100% Free Resource</span>
                  <span style={{ fontSize: '0.78rem', color: '#77736D', fontWeight: 600 }}>
                    {course.duration}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#252525', marginBottom: '0.4rem' }}>
                  {course.title}
                </h4>

                <div style={{ fontSize: '0.85rem', color: '#C46A45', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Provider: {course.provider}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#77736D', marginBottom: '1.25rem' }}>
                  Skill Level: <strong>{course.level}</strong> &bull; Covers: <strong>{course.skillCovered}</strong>
                  {course.hasCertificate && <div>&bull; Verified Free Certificate Available upon completion</div>}
                </div>
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.4rem', justifyContent: 'center', fontWeight: 700 }}
              >
                <span>Access Free Course</span>
                <ExternalLink size={15} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
