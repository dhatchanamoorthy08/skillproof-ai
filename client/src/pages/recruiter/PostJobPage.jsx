import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const PostJobPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Full Stack Development');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [minJri, setMinJri] = useState('65');
  const [location, setLocation] = useState('Bangalore, India');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [jobType, setJobType] = useState('Full-time');
  const [salaryMin, setSalaryMin] = useState('1000000');
  const [salaryMax, setSalaryMax] = useState('1600000');
  const [openings, setOpenings] = useState('3');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isVerified = profile?.verificationStatus === 'approved';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Only approved recruiters can publish jobs. Please complete company verification first.');
      return;
    }

    setSubmitting(true);
    setError('');

    const parsedRequired = requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedPreferred = preferredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await api.post('/recruiters/jobs', {
        title,
        domain,
        description,
        requiredSkills: parsedRequired,
        preferredSkills: parsedPreferred,
        minCgpa: Number(minCgpa),
        minJobReadinessIndex: Number(minJri),
        location,
        workMode,
        jobType,
        salaryRange: {
          min: Number(salaryMin),
          max: Number(salaryMax),
          currency: 'INR',
        },
        openings: Number(openings),
      });

      if (res.data.success) {
        alert('Job posting published successfully!');
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Create Campus Job Opening</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Define role requirements and skill thresholds. SkillProof AI will automatically calculate explainable candidate matches.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
        <div className="form-group">
          <label className="form-label">Position / Job Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Distributed Backend Systems Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Domain Area</label>
            <select
              className="form-control form-select"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data Analytics & Engineering">Data Analytics & Engineering</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Job Classification</label>
            <select
              className="form-control form-select"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Internship + PPO">Internship + PPO</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Work Mode</label>
            <select
              className="form-control form-select"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Job Description & Responsibilities</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Describe team mission, technical stack, key milestones, and day-to-day impact..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mandatory Required Skills (Comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="React, Node.js, JavaScript, MongoDB"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred / Bonus Skills (Comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Docker, Redis, AWS, TypeScript"
            value={preferredSkills}
            onChange={(e) => setPreferredSkills(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Minimum CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="form-control"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Min Job Readiness Index (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control"
              value={minJri}
              onChange={(e) => setMinJri(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Openings</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Min Annual CTC (INR)</label>
            <input
              type="number"
              className="form-control"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Annual CTC (INR)</label>
            <input
              type="number"
              className="form-control"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={submitting}
        >
          {submitting ? 'Publishing Opening...' : 'Publish Opening on SkillProof Network'}
        </button>
      </form>
    </div>
  );
};
