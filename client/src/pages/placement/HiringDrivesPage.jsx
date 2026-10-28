import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/Modal';

export const HiringDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Drive Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('2026');
  const [description, setDescription] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [minJri, setMinJri] = useState('65');
  const [submitting, setSubmitting] = useState(false);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await api.get('/placement/drives');
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      console.error('Failed to load hiring drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/placement/drives', {
        title,
        batch,
        description,
        driveDate,
        applicationDeadline: deadline,
        minCgpa: Number(minCgpa),
        minJobReadinessIndex: Number(minJri),
      });

      if (res.data.success) {
        alert('Campus hiring drive scheduled successfully.');
        setShowCreateModal(false);
        fetchDrives();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create drive.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>On-Campus Hiring Drives</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Plan, coordinate, and orchestrate institutional placement drives with automated readiness filtering.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={16} />
          <span>Schedule New Drive</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading scheduled campus drives...
        </div>
      ) : drives.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No campus hiring drives scheduled yet. Click "Schedule New Drive" above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {drives.map((d) => (
            <div
              key={d._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-assessed">Batch {d.batch}</span>
                  <span className={`badge ${d.status === 'upcoming' ? 'badge-claimed' : 'badge-ready'}`}>
                    {d.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{d.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {d.description || 'Institutional recruitment drive for accredited corporate partners.'}
                </p>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="#2563eb" />
                    <strong>Drive Date:</strong> {new Date(d.driveDate).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#dc2626" />
                    <strong>Registration Deadline:</strong> {new Date(d.applicationDeadline).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Eligibility:</strong> Min CGPA {d.minCgpa} &bull; Min JRI {d.minJobReadinessIndex}%
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  Registered: <strong>{d.registeredStudents?.length || 0} Students</strong>
                </div>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {d.participatingCompanies?.length || 1} Company Partner(s)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Drive Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Schedule Campus Hiring Drive">
        <form onSubmit={handleCreateDrive}>
          <div className="form-group">
            <label className="form-label">Drive Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Fall 2026 Core Tech Recruitment Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Graduating Batch</label>
              <input
                type="text"
                className="form-control"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Drive Date</label>
              <input
                type="date"
                className="form-control"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Application Deadline</label>
            <input
              type="date"
              className="form-control"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Eligibility Min CGPA</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Eligibility Min JRI (%)</label>
              <input
                type="number"
                className="form-control"
                value={minJri}
                onChange={(e) => setMinJri(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Drive Description & Scope</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Guidelines for students, participating sectors..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Publish Campus Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
