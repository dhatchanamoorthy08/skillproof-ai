import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeView, setActiveView] = useState('discover'); // 'discover' | 'applications'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Job Modal
  const [selectedJobData, setSelectedJobData] = useState(null);
  const [applying, setApplying] = useState(false);

  const fetchJobsAndApplications = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/students/me/applications'),
      ]);
      if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
      if (appsRes.data.success) setApplications(appsRes.data.applications);
    } catch (err) {
      console.error('Failed to fetch jobs or applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApplications();
  }, []);

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      const res = await api.post(`/jobs/${jobId}/apply`);
      if (res.data.success) {
        alert('Application submitted successfully!');
        setSelectedJobData(null);
        fetchJobsAndApplications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMode = !selectedWorkMode || job.workMode === selectedWorkMode;
    return matchesSearch && matchesMode;
  });

  return (
    <div>
      {/* Top Header */}
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
            <Sparkles size={16} /> Explainable Hybrid Matching Engine
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Jobs & Internship Opportunities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Opportunities sorted by your verifiable evidence and assessed skill coverage.
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-card-subtle)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveView('discover')}
            className={`btn btn-sm ${activeView === 'discover' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            Discover Opportunities ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveView('applications')}
            className={`btn btn-sm ${activeView === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {activeView === 'discover' ? (
        <>
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by job title, company, or required skill (e.g. React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>

            <select
              className="form-control form-select"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="">All Work Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Job List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading matching opportunities...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No jobs matching your filter parameters.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{job.title}</h3>
                        <span className="badge badge-claimed" style={{ fontSize: '0.75rem' }}>
                          {job.jobType}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{job.companyName}</strong> &bull; {job.location} ({job.workMode}) &bull; Min CGPA: {job.minCgpa}
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    {job.matchScore != null && (
                      <div
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: job.matchScore >= 75 ? '#ecfdf5' : '#eff6ff',
                          border: `1px solid ${job.matchScore >= 75 ? '#a7f3d0' : '#bfdbfe'}`,
                        }}
                      >
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: job.matchScore >= 75 ? '#047857' : '#1d4ed8' }}>
                          {job.matchScore}% Match
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Explainable Evidence Fit
                        </span>
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {job.description}
                  </p>

                  {/* Explainable Fit Summary */}
                  {job.matchBreakdown && (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-card-subtle)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <strong style={{ color: 'var(--text-main)' }}>SkillProof Match Assessment: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{job.matchBreakdown.explanation}</span>
                    </div>
                  )}

                  {/* Skills tags */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                        Required:
                      </span>
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="badge badge-assessed" style={{ fontSize: '0.75rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => setSelectedJobData(job)}
                        className="btn btn-secondary btn-sm"
                      >
                        View Details
                      </button>

                      {job.hasApplied ? (
                        <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.7, color: '#16a34a' }}>
                          <CheckCircle2 size={16} /> Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          className="btn btn-primary btn-sm"
                        >
                          Apply with Skill Passport
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Applications Tab */
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Interview Details</th>
                  <th>Recruiter Feedback</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      You haven't submitted any job applications yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: 700 }}>{app.job?.title || 'Job Position'}</td>
                      <td>{app.recruiter?.fullName || 'Company'}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: app.matchScore >= 75 ? '#16a34a' : '#2563eb' }}>
                          {app.matchScore}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            app.status === 'selected'
                              ? 'badge-ready'
                              : app.status === 'shortlisted' || app.status === 'interview_scheduled'
                              ? 'badge-assessed'
                              : app.status === 'rejected'
                              ? 'badge-support'
                              : 'badge-developing'
                          }`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        {app.interviewSchedule?.scheduledAt ? (
                          <div style={{ fontSize: '0.8rem' }}>
                            <div style={{ fontWeight: 600 }}>{app.interviewSchedule.roundName}</div>
                            <div style={{ color: 'var(--text-muted)' }}>
                              {new Date(app.interviewSchedule.scheduledAt).toLocaleString()} ({app.interviewSchedule.mode})
                            </div>
                            {app.interviewSchedule.meetingLink && (
                              <a
                                href={app.interviewSchedule.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '2px' }}
                              >
                                Join Meeting <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>Not scheduled</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                        {app.recruiterFeedback || 'Under recruitment review.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={!!selectedJobData}
        onClose={() => setSelectedJobData(null)}
        title={selectedJobData?.title || 'Job Details'}
      >
        {selectedJobData && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {selectedJobData.companyName}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {selectedJobData.location} &bull; {selectedJobData.workMode} &bull; {selectedJobData.jobType}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>Job Description</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {selectedJobData.description}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>Required Skills</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedJobData.requiredSkills.map((sk) => (
                  <span key={sk} className="badge badge-assessed">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Your SkillProof Fit</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{selectedJobData.matchScore}%</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {selectedJobData.matchBreakdown?.explanation}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedJobData(null)} className="btn btn-secondary">
                Close
              </button>
              {!selectedJobData.hasApplied && (
                <button
                  onClick={() => handleApply(selectedJobData._id)}
                  className="btn btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
