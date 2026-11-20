import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  BookOpen,
  Code,
  Layers,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Play,
  RotateCcw,
  CheckSquare,
  Square,
  FileCode2,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const RoadmapPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('full-stack-web-developer');
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [expandedModules, setExpandedModules] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Fetch available roadmaps catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/roadmaps');
        if (res.data.success && res.data.roadmaps.length > 0) {
          setRoadmaps(res.data.roadmaps);
          // If current selected slug isn't in catalog, default to first
          if (!res.data.roadmaps.some((r) => r.slug === selectedSlug)) {
            setSelectedSlug(res.data.roadmaps[0].slug);
          }
        }
      } catch (err) {
        console.error('Failed to load roadmaps catalog:', err);
      }
    };
    fetchCatalog();
  }, []);

  // 2. Fetch specific roadmap data & student progress
  const fetchRoadmapAndProgress = async (slug) => {
    setLoading(true);
    try {
      const [rmRes, progRes] = await Promise.all([
        api.get(`/roadmaps/${slug}`),
        api.get(`/roadmaps/${slug}/progress`),
      ]);

      if (rmRes.data.success) {
        setCurrentRoadmap(rmRes.data.roadmap);
        // Expand first module by default
        const firstModId = rmRes.data.roadmap?.levels?.[0]?.modules?.[0]?.moduleId;
        if (firstModId) {
          setExpandedModules({ [firstModId]: true });
        }
      }
      if (progRes.data.success) {
        setProgress(progRes.data.progress);
      }
    } catch (err) {
      console.error('Failed to load roadmap details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSlug) {
      fetchRoadmapAndProgress(selectedSlug);
    }
  }, [selectedSlug]);

  const toggleModuleAccordion = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Toggle topic completion
  const handleToggleTopic = async (topicId, e) => {
    e.stopPropagation();
    setActionLoading(true);
    try {
      const res = await api.post(`/roadmaps/${selectedSlug}/progress/toggle-topic`, { topicId });
      if (res.data.success) {
        // Re-fetch progress
        const progRes = await api.get(`/roadmaps/${selectedSlug}/progress`);
        if (progRes.data.success) {
          setProgress(progRes.data.progress);
        }
      }
    } catch (err) {
      console.error('Failed to toggle topic completion:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return progress?.completedTopics?.includes(topicId);
  };

  const currentLevelObj = currentRoadmap?.levels?.find((lvl) => lvl.level === activeLevel) || currentRoadmap?.levels?.[0];

  return (
    <div>
      {/* Platform Header */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: '#252525',
          color: '#FFFFFF',
          border: '1px solid rgba(232, 225, 215, 0.15)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#B89B6A',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.4rem',
            }}
          >
            <Compass size={16} /> Structured Learning Platform & Career Tracks
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#F5F1E9' }}>
            Career Roadmaps & Interactive Curriculum
          </h2>
          <p style={{ color: '#D9D0C3', fontSize: '0.925rem', maxWidth: '750px', margin: 0, lineHeight: 1.5 }}>
            Industry-aligned learning trajectories with structured modules, dedicated topic study guides, verified free courses, and hands-on code challenges.
          </p>
        </div>

        {/* Career Path Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B89B6A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Career Track:
          </label>
          <select
            className="form-control form-select"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            style={{
              width: '260px',
              backgroundColor: '#FFFFFF',
              color: '#252525',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {roadmaps.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 10 Career Tracks Quick Pill Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {roadmaps.map((r) => {
          const isSelected = r.slug === selectedSlug;
          return (
            <button
              key={r.slug}
              onClick={() => setSelectedSlug(r.slug)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 800 : 600,
                whiteSpace: 'nowrap',
                gap: '0.35rem',
              }}
            >
              <span>{r.title}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading curriculum modules and learning progress...
        </div>
      ) : currentRoadmap ? (
        <>
          {/* Progress Overview & Telemetry Banner */}
          <div
            className="card"
            style={{
              marginBottom: '2rem',
              background: '#FFFFFF',
              border: '1px solid #E8E1D7',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-assessed">{currentRoadmap.category}</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {currentRoadmap.estimatedDuration}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#252525' }}>
                  {currentRoadmap.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                  {currentRoadmap.description}
                </p>

                {/* Required Skills Strip */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(currentRoadmap.requiredSkills || []).map((sk) => (
                    <span key={sk} className="badge badge-claimed" style={{ fontSize: '0.75rem' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Metric Block */}
              <div
                style={{
                  background: '#FAF6EF',
                  border: '1px solid #E8E1D7',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  minWidth: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                    Overall Mastery
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#C46A45' }}>
                    {progress?.progressPercentage || 0}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: '#E8E1D7', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress?.progressPercentage || 0}%`,
                      background: 'linear-gradient(90deg, #C46A45 0%, #B89B6A 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#77736D', marginBottom: '1rem' }}>
                  <span>Completed: <strong>{progress?.completedCount || 0}</strong> topics</span>
                  <span>Total: <strong>{progress?.totalTopics || 0}</strong> topics</span>
                </div>

                {/* Recommended Next Action */}
                {progress?.nextTopic ? (
                  <button
                    onClick={() => navigate(`/student/roadmap/${selectedSlug}/topic/${progress.nextTopic.topicId}`)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', gap: '0.4rem', justifyContent: 'center', fontWeight: 700 }}
                  >
                    <Play size={14} />
                    <span>Resume: {progress.nextTopic.title}</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B89B6A', fontSize: '0.85rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> All topics completed!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Level Tabs: Beginner | Intermediate | Advanced */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #E8E1D7', paddingBottom: '0.75rem' }}>
            {(currentRoadmap.levels || []).map((lvl) => {
              const isActive = activeLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setActiveLevel(lvl.level)}
                  style={{
                    background: isActive ? '#252525' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#77736D',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: lvl.level === 'beginner' ? '#B89B6A' : lvl.level === 'intermediate' ? '#C46A45' : '#252525',
                    }}
                  />
                  {lvl.title}
                </button>
              );
            })}
          </div>

          {/* Modules List Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {currentLevelObj?.modules?.map((mod, modIdx) => {
              const isExpanded = !!expandedModules[mod.moduleId];
              const completedInMod = (mod.topics || []).filter((t) => isTopicCompleted(t.topicId)).length;
              const totalInMod = (mod.topics || []).length;
              const modProgress = totalInMod > 0 ? Math.round((completedInMod / totalInMod) * 100) : 0;

              return (
                <div
                  key={mod.moduleId}
                  className="card"
                  style={{
                    border: '1px solid #E8E1D7',
                    padding: 0,
                    overflow: 'hidden',
                  }}
                >
                  {/* Module Header Bar */}
                  <div
                    onClick={() => toggleModuleAccordion(mod.moduleId)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      background: isExpanded ? '#FAF6EF' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderBottom: isExpanded ? '1px solid #E8E1D7' : 'none',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#F5F1E9',
                          color: '#C46A45',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {modIdx + 1}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#252525' }}>
                            {mod.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#77736D', fontWeight: 600 }}>
                            &bull; {mod.estimatedHours} Hours
                          </span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: '#77736D' }}>
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: modProgress === 100 ? '#B89B6A' : '#77736D' }}>
                          {completedInMod} / {totalInMod} Completed ({modProgress}%)
                        </div>
                        <div style={{ width: '120px', height: '6px', background: '#E8E1D7', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${modProgress}%`,
                              height: '100%',
                              background: modProgress === 100 ? '#B89B6A' : '#C46A45',
                            }}
                          />
                        </div>
                      </div>

                      {isExpanded ? <ChevronDown size={20} color="#77736D" /> : <ChevronRight size={20} color="#77736D" />}
                    </div>
                  </div>

                  {/* Expanded Topics Table */}
                  {isExpanded && (
                    <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(mod.topics || []).map((topic, tIdx) => {
                          const completed = isTopicCompleted(topic.topicId);
                          return (
                            <div
                              key={topic.topicId}
                              style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `1px solid ${completed ? '#E2D3B8' : '#E8E1D7'}`,
                                backgroundColor: completed ? '#FAF6EF' : '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
                                <button
                                  onClick={(e) => handleToggleTopic(topic.topicId, e)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    color: completed ? '#B89B6A' : '#77736D',
                                  }}
                                  title={completed ? 'Mark topic as pending' : 'Mark topic as completed'}
                                >
                                  {completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                </button>

                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#252525' }}>
                                      {tIdx + 1}. {topic.title}
                                    </h5>
                                    <span style={{ fontSize: '0.72rem', color: '#77736D', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                      <Clock size={12} /> {topic.estimatedMinutes} mins
                                    </span>
                                    {completed ? (
                                      <span className="badge badge-ready" style={{ fontSize: '0.65rem' }}>Completed</span>
                                    ) : (
                                      <span className="badge badge-claimed" style={{ fontSize: '0.65rem' }}>Pending</span>
                                    )}
                                  </div>
                                  <p style={{ margin: '3px 0 0 0', fontSize: '0.825rem', color: '#77736D', lineHeight: 1.45 }}>
                                    {topic.summary}
                                  </p>

                                  {/* Free course badge if available */}
                                  {(topic.freeCourses || []).length > 0 && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#C46A45', fontWeight: 600, marginTop: '4px' }}>
                                      <BookOpen size={12} /> {topic.freeCourses.length} verified free learning resource(s) attached
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Link to Dedicated Study Page */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                  onClick={() => navigate(`/student/roadmap/${selectedSlug}/topic/${topic.topicId}`)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ gap: '0.35rem', fontWeight: 700, fontSize: '0.8rem' }}
                                >
                                  <BookOpen size={14} />
                                  <span>Open Study Notes & Code</span>
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Project & Assessment Strip */}
          <div
            className="card"
            style={{
              marginTop: '2.5rem',
              background: '#252525',
              color: '#FFFFFF',
              border: '1px solid rgba(232, 225, 215, 0.15)',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#B89B6A', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                <FolderGit2 size={16} /> Capstone Portfolio Milestone
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#F5F1E9' }}>
                Final Project: {currentRoadmap.finalProject?.title || 'Production Capstone System'}
              </h3>
              <p style={{ color: '#D9D0C3', fontSize: '0.875rem', maxWidth: '650px', margin: '0 0 0.75rem 0' }}>
                {currentRoadmap.finalProject?.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(currentRoadmap.finalProject?.requirements || []).map((req, rIdx) => (
                  <span key={rIdx} className="badge badge-claimed" style={{ fontSize: '0.72rem', color: '#B89B6A', borderColor: 'rgba(184, 155, 106, 0.3)' }}>
                    &bull; {req}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/student/evidence"
                className="btn btn-accent"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <FileCode2 size={16} />
                <span>Submit Capstone Evidence</span>
              </Link>
              <Link
                to="/assessments"
                className="btn btn-primary"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <Award size={16} />
                <span>Take Standardized Assessment</span>
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
