import React from 'react';
import { TrendingUp, Sparkles, Award, DollarSign, Globe, Cpu } from 'lucide-react';

export const IndustryTrendsPage = () => {
  const trendingSkills = [
    { skill: 'React 18 & Concurrent Rendering', demand: '+34% YoY', domain: 'Frontend', companies: 'Meta, Airbnb, Vercel' },
    { skill: 'Node.js & Microservices Architecture', demand: '+28% YoY', domain: 'Backend', companies: 'Uber, Netflix, PayPal' },
    { skill: 'PostgreSQL & Query Optimization', demand: '+41% YoY', domain: 'Database', companies: 'Stripe, GitHub, Supabase' },
    { skill: 'Docker Containerization & Kubernetes', demand: '+38% YoY', domain: 'DevOps', companies: 'Amazon, Microsoft, Google' },
    { skill: 'Generative AI & LLM Embeddings', demand: '+75% YoY', domain: 'AI/ML', companies: 'OpenAI, Anthropic, Databricks' },
    { skill: 'TypeScript Enterprise Codebases', demand: '+44% YoY', domain: 'Languages', companies: 'Microsoft, Slack, Discord' },
  ];

  const emergingRoles = [
    { title: 'Full Stack AI Systems Engineer', compensation: '14 - 24 LPA', growth: 'Surging' },
    { title: 'Cloud Infrastructure & SRE Associate', compensation: '12 - 20 LPA', growth: 'High' },
    { title: 'Backend Distributed Systems Engineer', compensation: '12 - 22 LPA', growth: 'Consistent' },
    { title: 'Frontend Platform & Web Performance Engineer', compensation: '10 - 18 LPA', growth: 'High' },
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <TrendingUp size={16} /> Live Tech Hiring Intelligence
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Industry Skill & Hiring Trends</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Aggregated technical demand patterns compiled from active campus hiring drives and enterprise recruiter postings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* In-Demand Technical Skills */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Fastest Growing Engineering Skills</h3>
              <p className="card-subtitle">Technologies most requested in 2026 hiring criteria</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {trendingSkills.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {item.skill}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.domain} &bull; Hiring: {item.companies}
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {item.demand}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Job Profiles */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">High-Demand Campus Profiles</h3>
              <p className="card-subtitle">Tier-1 compensation and vacancy rates</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {emergingRoles.map((role, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{role.title}</h4>
                  <span className="badge badge-assessed">{role.growth}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>
                  <DollarSign size={16} /> Est. Entry Package: {role.compensation}
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                fontSize: '0.825rem',
                color: 'var(--primary)',
                lineHeight: 1.5,
              }}
            >
              <strong>Pro-Tip:</strong> Candidates with at least <strong>2 verified GitHub repositories</strong> and
              a <strong>proctored assessment score &gt;80%</strong> receive an average of 3.4x more interview invitations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
