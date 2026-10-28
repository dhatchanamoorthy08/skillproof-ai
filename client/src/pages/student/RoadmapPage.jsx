import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle, Clock, Sparkles, Target, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const RoadmapPage = () => {
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState(profile?.targetRole || 'Full Stack Developer');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async (role) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/me/roadmap?role=${encodeURIComponent(role)}`);
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.error('Failed to fetch career roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedRole);
  }, [selectedRole]);

  return (
    <div>
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Compass size={16} /> AI-Generated Career Trajectory
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Personalized Career Roadmap</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Milestones tailored to your current verified competencies and chosen career path.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Target Role:</label>
          <select
            className="form-control form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ width: '240px' }}
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="AI & Machine Learning Specialist">AI & Machine Learning Specialist</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Generating personalized learning trajectory...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {roadmap?.milestones?.map((milestone, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                borderLeft: `6px solid ${idx === 0 ? '#2563eb' : idx === 1 ? '#6366f1' : '#10b981'}`,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{milestone.stage}</h3>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-card-subtle)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <Clock size={13} /> {milestone.estimatedDuration}
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {milestone.description}
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Target Competencies to Demonstrate
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {milestone.targetSkills?.map((skill) => (
                    <span key={skill} className="badge badge-assessed">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Actionable Steps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {milestone.recommendedActions?.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                      }}
                    >
                      <CheckCircle size={16} color="#16a34a" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
