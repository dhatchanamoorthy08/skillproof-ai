import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  GraduationCap,
  Award,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Calendar,
  Sparkles,
  ShieldCheck,
  Eye,
  X,
  Briefcase,
  AlertCircle,
  FileCode2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const COURSE_PROVIDERS = [
  'Coursera',
  'NPTEL / Swayam',
  'Udemy',
  'edX',
  'LinkedIn Learning',
  'Google Career Certificates',
  'AWS Training & Certification',
  'Microsoft Learn',
  'IBM SkillsBuild',
  'Other Academy / Provider',
];

const ADDITIONAL_TYPES = [
  { value: 'project', label: 'Project Completion Certificate' },
  { value: 'certification', label: 'Technical Credential / Certification' },
  { value: 'workshop', label: 'Workshop / BootCamp Certificate' },
  { value: 'other', label: 'Other Verified Skill Proof' },
];

export const EvidenceSubmissionPage = () => {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'course' | 'internship' | 'additional'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'verified' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('course'); // 'course' | 'internship' | 'additional'

  // Course Certificate Form
  const [courseName, setCourseName] = useState('');
  const [courseProvider, setCourseProvider] = useState('Coursera');
  const [customProvider, setCustomProvider] = useState('');
  const [relatedSkill, setRelatedSkill] = useState('');
  const [courseIssueDate, setCourseIssueDate] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  // Internship Certificate Form
  const [companyName, setCompanyName] = useState('');
  const [internshipRole, setInternshipRole] = useState('');
  const [internshipDomain, setInternshipDomain] = useState('Full Stack Web Engineering');
  const [internshipStartDate, setInternshipStartDate] = useState('');
  const [internshipEndDate, setInternshipEndDate] = useState('');
  const [skillsGained, setSkillsGained] = useState('');
  const [internshipDescription, setInternshipDescription] = useState('');

  // Additional Evidence Form
  const [additionalType, setAdditionalType] = useState('project');
  const [additionalTitle, setAdditionalTitle] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [additionalDate, setAdditionalDate] = useState('');
  const [additionalSkills, setAdditionalSkills] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Resubmit / Replace Modal State
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [resubmitFile, setResubmitFile] = useState(null);
  const [resubmitNotes, setResubmitNotes] = useState('');
  const resubmitInputRef = useRef(null);

  // View Document Modal
  const [previewDoc, setPreviewDoc] = useState(null);

  // Feedback Alert
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/me/evidence');
      if (res.data?.success) {
        setEvidenceList(res.data.evidence || []);
      }
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file format. Please upload PDF, JPG, PNG, or WebP files.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit.');
      setSelectedFile(null);
      return;
    }

    setFileError('');
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg({ type: '', text: '' });

    if (!selectedFile) {
      setFileError('Please attach your certificate document (PDF, JPG, or PNG).');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    if (uploadCategory === 'course') {
      const finalProvider = courseProvider === 'Other Academy / Provider' ? customProvider.trim() || 'Online Academy' : courseProvider;
      formData.append('type', 'course');
      formData.append('title', `${courseName.trim()} (${finalProvider})`);
      formData.append('courseName', courseName.trim());
      formData.append('courseProvider', finalProvider);
      formData.append('relatedSkill', relatedSkill.trim());
      formData.append('associatedSkills', relatedSkill.trim());
      formData.append('certificateId', certificateId.trim());
      formData.append('issueDate', courseIssueDate || new Date().toISOString());
      formData.append('issuingOrganization', finalProvider);
      formData.append('description', courseDescription.trim());
    } else if (uploadCategory === 'internship') {
      formData.append('type', 'internship');
      formData.append('title', `${internshipRole.trim()} Internship at ${companyName.trim()}`);
      formData.append('companyName', companyName.trim());
      formData.append('internshipRole', internshipRole.trim());
      formData.append('internshipDomain', internshipDomain.trim());
      formData.append('startDate', internshipStartDate || '');
      formData.append('endDate', internshipEndDate || '');
      formData.append('skillsGained', skillsGained.trim());
      formData.append('associatedSkills', skillsGained.trim());
      formData.append('issuingOrganization', companyName.trim());
      formData.append('description', internshipDescription.trim());
    } else {
      formData.append('type', additionalType);
      formData.append('title', additionalTitle.trim());
      formData.append('issuingOrganization', issuingOrg.trim());
      formData.append('issueDate', additionalDate || new Date().toISOString());
      formData.append('associatedSkills', additionalSkills.trim());
      formData.append('externalUrl', externalUrl.trim());
      formData.append('description', additionalDescription.trim());
    }

    formData.append('evidenceFile', selectedFile);

    try {
      const res = await api.post('/students/me/evidence', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setAlertMsg({
          type: 'success',
          text: 'Certificate submitted successfully! Your submission is now pending faculty/placement audit review.',
        });
        setShowUploadModal(false);
        resetForm();
        fetchEvidence();
      }
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit certificate. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!resubmitTarget) return;

    setSubmitting(true);
    const formData = new FormData();
    if (resubmitFile) {
      formData.append('evidenceFile', resubmitFile);
    }
    if (resubmitNotes) {
      formData.append('description', resubmitNotes);
    }

    try {
      const res = await api.put(`/students/me/evidence/${resubmitTarget._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setAlertMsg({
          type: 'success',
          text: 'Evidence updated and resubmitted for verification review.',
        });
        setResubmitTarget(null);
        setResubmitFile(null);
        setResubmitNotes('');
        fetchEvidence();
      }
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to resubmit evidence.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate submission?')) return;
    try {
      await api.delete(`/students/me/evidence/${id}`);
      setAlertMsg({ type: 'success', text: 'Certificate removed successfully.' });
      fetchEvidence();
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to remove evidence record.' });
    }
  };

  const resetForm = () => {
    setCourseName('');
    setCourseProvider('Coursera');
    setCustomProvider('');
    setRelatedSkill('');
    setCourseIssueDate('');
    setCertificateId('');
    setCourseDescription('');

    setCompanyName('');
    setInternshipRole('');
    setInternshipStartDate('');
    setInternshipEndDate('');
    setSkillsGained('');
    setInternshipDescription('');

    setAdditionalTitle('');
    setIssuingOrg('');
    setAdditionalDate('');
    setAdditionalSkills('');
    setExternalUrl('');
    setAdditionalDescription('');

    setSelectedFile(null);
    setFileError('');
  };

  // Filtered evidence list
  const filteredEvidence = evidenceList.filter((item) => {
    // Tab filter
    if (activeTab === 'course' && item.type !== 'course') return false;
    if (activeTab === 'internship' && item.type !== 'internship') return false;
    if (activeTab === 'additional' && item.type === 'course' && item.type === 'internship') return false;

    // Status filter
    if (statusFilter !== 'all' && item.verificationStatus !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSkill = (item.associatedSkills || []).some((s) => s.toLowerCase().includes(q));
      const matchIssuer = item.issuingOrganization?.toLowerCase().includes(q);
      if (!matchTitle && !matchSkill && !matchIssuer) return false;
    }

    return true;
  });

  const pendingCount = evidenceList.filter((e) => e.verificationStatus === 'pending').length;
  const verifiedCount = evidenceList.filter((e) => e.verificationStatus === 'verified').length;
  const rejectedCount = evidenceList.filter((e) => e.verificationStatus === 'rejected').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#07866A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            <ShieldCheck size={16} /> Skill Proof Verification Module
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            Certificate &amp; Evidence Submission
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Upload verifiable course, internship, and project certificates. Reviewed and validated by campus placement faculty.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowUploadModal(true);
          }}
          className="btn btn-primary"
          style={{
            backgroundColor: '#142D2B',
            color: '#FFFFFF',
            padding: '0.75rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(20, 33, 61, 0.25)',
          }}
        >
          <Plus size={18} /> Submit New Certificate
        </button>
      </div>

      {/* Global Alert Notification */}
      {alertMsg.text && (
        <div
          style={{
            padding: '0.9rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: alertMsg.type === 'success' ? '#EFF8F2' : '#FCF0F2',
            border: `1px solid ${alertMsg.type === 'success' ? '#C8E6D2' : '#F7D4D7'}`,
            color: alertMsg.type === 'success' ? '#247A48' : '#C83E4D',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
          <button
            onClick={() => setAlertMsg({ type: '', text: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metric Cards Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Submitted
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: '#F0F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#07866A' }}>
              <FileCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            {evidenceList.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Across all categories
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Verification
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8A23A' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E8A23A', marginTop: '0.5rem' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Queued for reviewer audit
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Verified &amp; Approved
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: '#EFF8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#247A48' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#247A48', marginTop: '0.5rem' }}>
            {verifiedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Credited to Skill Passport
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Needs Attention
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: '#FCF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C83E4D' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C83E4D', marginTop: '0.5rem' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Actionable / Resubmit allowed
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: activeTab === 'all' ? '1px solid #142D2B' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'all' ? '#142D2B' : '#ffffff',
              color: activeTab === 'all' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            All Submissions ({evidenceList.length})
          </button>

          <button
            onClick={() => setActiveTab('course')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: activeTab === 'course' ? '1px solid #07866A' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'course' ? '#07866A' : '#ffffff',
              color: activeTab === 'course' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <GraduationCap size={15} /> Courses ({evidenceList.filter((e) => e.type === 'course').length})
          </button>

          <button
            onClick={() => setActiveTab('internship')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: activeTab === 'internship' ? '1px solid #07866A' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'internship' ? '#07866A' : '#ffffff',
              color: activeTab === 'internship' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={15} /> Internships ({evidenceList.filter((e) => e.type === 'internship').length})
          </button>

          <button
            onClick={() => setActiveTab('additional')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: activeTab === 'additional' ? '1px solid #142D2B' : '1px solid var(--border-light)',
              backgroundColor: activeTab === 'additional' ? '#142D2B' : '#ffffff',
              color: activeTab === 'additional' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Award size={15} /> Projects &amp; Additional ({evidenceList.filter((e) => e.type !== 'course' && e.type !== 'internship').length})
          </button>
        </div>

        {/* Status Filter & Search */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by skill, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control form-select"
            style={{ fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Audit</option>
            <option value="verified">Verified &amp; Approved</option>
            <option value="rejected">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <div>Loading your submitted certificates &amp; evidence...</div>
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FAFAF5', border: '1px solid var(--border-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <FileText size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
            No Evidence Records Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {evidenceList.length === 0
              ? 'You have not submitted any course certificates, internship letters, or project credentials yet.'
              : 'No submissions matched your selected filters or search terms.'}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowUploadModal(true);
            }}
            className="btn btn-primary"
            style={{ backgroundColor: '#142D2B' }}
          >
            <Plus size={16} /> Submit Your First Certificate
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {filteredEvidence.map((item) => {
            const isVerified = item.verificationStatus === 'verified';
            const isRejected = item.verificationStatus === 'rejected';
            const isPending = item.verificationStatus === 'pending';

            return (
              <div
                key={item._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: `4px solid ${isVerified ? '#247A48' : isRejected ? '#C83E4D' : '#E8A23A'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          item.type === 'course' ? '#F0F7F4' : item.type === 'internship' ? '#F0F7F4' : '#F0F7F4',
                        color:
                          item.type === 'course' ? '#07866A' : item.type === 'internship' ? '#07866A' : '#142D2B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.type === 'course' && <GraduationCap size={22} />}
                      {item.type === 'internship' && <Building2 size={22} />}
                      {item.type !== 'course' && item.type !== 'internship' && <Award size={22} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              item.type === 'course' ? '#F0F7F4' : item.type === 'internship' ? '#F0F7F4' : '#F0F7F4',
                            color:
                              item.type === 'course' ? '#07866A' : item.type === 'internship' ? '#07866A' : '#142D2B',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.type === 'course' ? 'Course Certificate' : item.type === 'internship' ? 'Internship Proof' : (item.type || 'Evidence').toUpperCase()}
                        </span>

                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          • Issued by {item.issuingOrganization || item.courseProvider || item.companyName || 'Institutional Academy'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Verification Status Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {isVerified && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: '#EFF8F2',
                          color: '#247A48',
                          border: '1px solid #C8E6D2',
                        }}
                      >
                        <ShieldCheck size={14} /> Verified &amp; Added to Passport
                      </span>
                    )}

                    {isPending && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: '#FEF7ED',
                          color: '#C48227',
                          border: '1px solid #FCDCA6',
                        }}
                      >
                        <Clock size={14} /> Pending Placement Audit
                      </span>
                    )}

                    {isRejected && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: '#FCF0F2',
                          color: '#C83E4D',
                          border: '1px solid #F7D4D7',
                        }}
                      >
                        <AlertTriangle size={14} /> Needs Attention / Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Associated Skills & Certificate Metadata */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FAFAF5',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Associated Skills:</span>
                    {(item.associatedSkills || []).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--border-medium)',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                    {item.certificateId && (
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{item.certificateId}</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.fileUrl && (
                      <button
                        onClick={() => setPreviewDoc(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '4px' }}
                      >
                        <Eye size={13} /> View Certificate File
                      </button>
                    )}

                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '4px' }}
                      >
                        <ExternalLink size={13} /> Verification Portal
                      </a>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => {
                          setResubmitTarget(item);
                          setResubmitNotes(item.description || '');
                        }}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: '#142D2B',
                          color: '#ffffff',
                          fontWeight: 600,
                          gap: '4px',
                        }}
                      >
                        <RefreshCw size={13} /> Replace / Resubmit
                      </button>
                    )}

                    {!isVerified && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Delete unverified submission"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Reviewer Audit Feedback Note if available */}
                {item.verificationNotes && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isVerified ? '#EFF8F2' : isRejected ? '#FCF0F2' : '#FEF7ED',
                      border: `1px solid ${isVerified ? '#C8E6D2' : isRejected ? '#F7D4D7' : '#FCDCA6'}`,
                      color: isVerified ? '#247A48' : isRejected ? '#822430' : '#A0681B',
                    }}
                  >
                    <strong>Placement Audit Note:</strong> {item.verificationNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          Upload New Certificate Modal
          ========================================================================= */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.25rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--text-main)' }}>
                  Submit Skill Certificate Evidence
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Select certificate type and attach your verified credential
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Selector Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setUploadCategory('course')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: uploadCategory === 'course' ? '2px solid #07866A' : '1px solid var(--border-light)',
                  backgroundColor: uploadCategory === 'course' ? '#F0F7F4' : '#ffffff',
                  color: uploadCategory === 'course' ? '#07866A' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <GraduationCap size={18} />
                Course Certificate
              </button>

              <button
                type="button"
                onClick={() => setUploadCategory('internship')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: uploadCategory === 'internship' ? '2px solid #07866A' : '1px solid var(--border-light)',
                  backgroundColor: uploadCategory === 'internship' ? '#F0F7F4' : '#ffffff',
                  color: uploadCategory === 'internship' ? '#07866A' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Building2 size={18} />
                Internship Proof
              </button>

              <button
                type="button"
                onClick={() => setUploadCategory('additional')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: uploadCategory === 'additional' ? '2px solid #142D2B' : '1px solid var(--border-light)',
                  backgroundColor: uploadCategory === 'additional' ? '#F0F7F4' : '#ffffff',
                  color: uploadCategory === 'additional' ? '#142D2B' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Award size={18} />
                Project / Workshop
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              {/* Category A: Course Certificate Form */}
              {uploadCategory === 'course' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Meta Front-End Developer Specialization"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Course Provider / Academy</label>
                      <select
                        className="form-control form-select"
                        value={courseProvider}
                        onChange={(e) => setCourseProvider(e.target.value)}
                      >
                        {COURSE_PROVIDERS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Related Primary Skill</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. React or Full Stack"
                        value={relatedSkill}
                        onChange={(e) => setRelatedSkill(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {courseProvider === 'Other Academy / Provider' && (
                    <div className="form-group">
                      <label className="form-label">Specify Provider Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. FreeCodeCamp, Stanford Online, etc."
                        value={customProvider}
                        onChange={(e) => setCustomProvider(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Issue Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={courseIssueDate}
                        onChange={(e) => setCourseIssueDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Certificate ID / Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. COURSERA-FE-9281"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Topics Covered (Optional)</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Brief summary of skills, capstone project, or assessments completed in this course..."
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Category B: Internship Certificate Form */}
              {uploadCategory === 'internship' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Company / Organization Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Nexis Cloud &amp; AI Labs"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Internship Role / Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Full Stack Engineering Intern"
                        value={internshipRole}
                        onChange={(e) => setInternshipRole(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Internship Domain</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Cloud Microservices &amp; Web Platforms"
                        value={internshipDomain}
                        onChange={(e) => setInternshipDomain(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Skills Gained (Comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Node.js, Docker, MongoDB, REST API"
                        value={skillsGained}
                        onChange={(e) => setSkillsGained(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={internshipStartDate}
                        onChange={(e) => setInternshipStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={internshipEndDate}
                        onChange={(e) => setInternshipEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Internship Contributions &amp; Scope</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Key projects executed, business impact, and technologies used during the internship..."
                      value={internshipDescription}
                      onChange={(e) => setInternshipDescription(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Category C: Additional Evidence Form */}
              {uploadCategory === 'additional' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Evidence Category</label>
                      <select
                        className="form-control form-select"
                        value={additionalType}
                        onChange={(e) => setAdditionalType(e.target.value)}
                      >
                        {ADDITIONAL_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Title / Project Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. AWS Solutions Architect or National Hackathon 1st Prize"
                        value={additionalTitle}
                        onChange={(e) => setAdditionalTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Issuing Organization / Event</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Amazon Web Services or Smart India Hackathon"
                        value={issuingOrg}
                        onChange={(e) => setIssuingOrg(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Achievement</label>
                      <input
                        type="date"
                        className="form-control"
                        value={additionalDate}
                        onChange={(e) => setAdditionalDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Associated Skills (Comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. AWS, Cloud Architecture, DevOps"
                        value={additionalSkills}
                        onChange={(e) => setAdditionalSkills(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Online Verification URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="e.g. https://aws.amazon.com/verify/..."
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Abstract</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Brief details about this achievement..."
                      value={additionalDescription}
                      onChange={(e) => setAdditionalDescription(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Dedicated Certificate File Upload Area */}
              <div
                style={{
                  border: '2px dashed #DFE8E1',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#FAFAF5',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F0F7F4', color: '#07866A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <Upload size={22} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {selectedFile ? selectedFile.name : 'Upload Official Certificate File'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Accepts PDF, JPG, PNG, or WebP documents (Max file size: 10MB)
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                  >
                    {selectedFile ? 'Replace Selected File' : 'Browse Files on Device'}
                  </button>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Remove File
                    </button>
                  )}
                </div>

                {fileError && (
                  <div style={{ color: '#C83E4D', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
                    {fileError}
                  </div>
                )}
              </div>

              {/* Security & Audit Notice */}
              <div
                style={{
                  fontSize: '0.775rem',
                  color: 'var(--text-muted)',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#FAFAF5',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={16} color="#07866A" style={{ flexShrink: 0 }} />
                <span>
                  All submitted evidence is encrypted, audited by faculty reviewers, and credited to your verified Skill Passport upon approval.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#142D2B' }}
                  disabled={submitting}
                >
                  {submitting ? 'Uploading & Verifying...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          Resubmit / Replace Modal for Rejected Evidence
          ========================================================================= */}
      {resubmitTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                  Replace &amp; Resubmit Certificate
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Resubmit updated proof for: <strong>{resubmitTarget.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setResubmitTarget(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {resubmitTarget.verificationNotes && (
              <div
                style={{
                  fontSize: '0.825rem',
                  padding: '0.75rem',
                  backgroundColor: '#FCF0F2',
                  border: '1px solid #F7D4D7',
                  borderRadius: 'var(--radius-md)',
                  color: '#822430',
                  marginBottom: '1.25rem',
                }}
              >
                <strong>Reviewer Feedback:</strong> {resubmitTarget.verificationNotes}
              </div>
            )}

            <form onSubmit={handleResubmit}>
              <div className="form-group">
                <label className="form-label">Attach Corrected Certificate Document (PDF/JPG/PNG)</label>
                <input
                  type="file"
                  ref={resubmitInputRef}
                  onChange={(e) => setResubmitFile(e.target.files?.[0] || null)}
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student Clarification Note for Reviewer</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Explain the changes made or provide additional verification context..."
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setResubmitTarget(null)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#142D2B' }}
                  disabled={submitting}
                >
                  {submitting ? 'Resubmitting...' : 'Confirm Resubmission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          View Document Modal
          ========================================================================= */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '840px',
              height: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                  {previewDoc.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Official Document Preview • {previewDoc.issuingOrganization || 'SkillProof AI Verified'}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, marginTop: '1rem', overflow: 'hidden', backgroundColor: '#FAFAF5', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewDoc.fileUrl?.endsWith('.pdf') ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title="Certificate PDF Preview"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Status: <strong style={{ textTransform: 'capitalize', color: previewDoc.verificationStatus === 'verified' ? '#247A48' : '#E8A23A' }}>{previewDoc.verificationStatus}</strong>
              </span>
              <a
                href={previewDoc.fileUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={14} /> Open in New Tab / Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
