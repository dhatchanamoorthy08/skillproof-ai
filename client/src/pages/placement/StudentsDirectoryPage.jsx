import React, { useState, useEffect } from 'react';
import { Users, Search, MessageSquare, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { ReadinessTierBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const StudentsDirectoryPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [loading, setLoading] = useState(true);

  // Mentoring Note Modal
  const [mentoringStudent, setMentoringStudent] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDept) params.append('department', selectedDept);
      if (selectedTier) params.append('tier', selectedTier);
      if (searchTerm) params.append('search', searchTerm);

      const res = await api.get(`/placement/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to load students directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDept, selectedTier]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleSaveMentoringNote = async (e) => {
    e.preventDefault();
    if (!mentoringStudent || !noteContent.trim()) return;

    setSavingNote(true);
    try {
      const res = await api.post(`/placement/students/${mentoringStudent.id}/mentoring`, {
        note: noteContent,
      });

      if (res.data.success) {
        alert('Mentoring guidance attached to student profile.');
        setMentoringStudent(null);
        setNoteContent('');
        fetchStudents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>University Student Readiness Directory</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Comprehensive view of all enrolled candidates, evidence audit statuses, and placement progression.
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name, roll number, or email..."
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
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science & Eng.</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">AI & Data Science</option>
          </select>

          <select
            className="form-control form-select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="">All Readiness Tiers</option>
            <option value="Placement Ready">Placement Ready (&gt;75%)</option>
            <option value="Developing">Developing (50-74%)</option>
            <option value="Needs Immediate Support">Needs Support (&lt;50%)</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </div>
      </form>

      {/* Student Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student / Roll No</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>JRI Score</th>
                <th>Readiness Tier</th>
                <th>Placement Status</th>
                <th>Mentoring</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{student.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {student.rollNumber || 'No Roll No'} &bull; {student.email}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.department}</td>
                    <td>
                      <strong>{student.cgpa}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: student.jobReadinessIndex >= 75 ? '#16a34a' : student.jobReadinessIndex < 50 ? '#dc2626' : '#2563eb' }}>
                        {student.jobReadinessIndex}%
                      </span>
                    </td>
                    <td>
                      <ReadinessTierBadge tier={student.readinessTier} />
                    </td>
                    <td>
                      <span
                        className={`badge ${student.placementStatus === 'placed' ? 'badge-ready' : 'badge-claimed'}`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {student.placementStatus} {student.placedCompany ? `(${student.placedCompany})` : ''}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setMentoringStudent(student);
                          setNoteContent('');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <MessageSquare size={14} />
                        <span>Add Note ({student.mentoringNotesCount})</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mentoring Note Modal */}
      <Modal
        isOpen={!!mentoringStudent}
        onClose={() => setMentoringStudent(null)}
        title={mentoringStudent ? `Placement Mentoring Note: ${mentoringStudent.fullName}` : 'Mentoring Note'}
      >
        {mentoringStudent && (
          <form onSubmit={handleSaveMentoringNote}>
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>{mentoringStudent.department} &bull; Roll: {mentoringStudent.rollNumber}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Current JRI: <strong>{mentoringStudent.jobReadinessIndex}%</strong> ({mentoringStudent.readinessTier})
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Placement Advisory & Training Recommendations</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Recommend specific project milestones, practice assessment retakes, or technical weaknesses to address..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setMentoringStudent(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingNote}>
                {savingNote ? 'Attaching Note...' : 'Save Mentoring Note'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
