import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileCheck2,
  ShieldCheck,
  Building2,
  Globe,
  Mail,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CompanyVerificationPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [companyName, setCompanyName] = useState(profile?.companyName || '');
  const [officialEmail, setOfficialEmail] = useState(profile?.officialEmail || user?.email || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [registrationNumber, setRegistrationNumber] = useState(profile?.registrationNumber || '');
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState('+91 91234 56789');
  const [docFile, setDocFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchVerificationStatus = async () => {
    try {
      const res = await api.get('/recruiters/profile');
      if (res.data.success) {
        setVerification(res.data.verification);
        if (res.data.profile) {
          setCompanyName(res.data.profile.companyName || '');
          setOfficialEmail(res.data.profile.officialEmail || '');
          setWebsite(res.data.profile.website || '');
          setRegistrationNumber(res.data.profile.registrationNumber || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('officialEmail', officialEmail);
    formData.append('website', website);
    formData.append('businessRegistrationNumber', registrationNumber);
    formData.append('contactPersonName', contactName);
    formData.append('contactPhone', contactPhone);
    if (docFile) {
      formData.append('verificationDoc', docFile);
    }

    try {
      const res = await api.post('/recruiters/company-verification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchVerificationStatus();
        refreshProfile();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit verification request.');
    } finally {
      setSubmitting(false);
    }
  };

  const isApproved = verification?.status === 'approved';
  const isPending = verification?.status === 'pending';

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <ShieldCheck size={16} /> Campus Accreditation Protocol
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Two-Step Company Verification</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          To protect candidate privacy and uphold on-campus hiring standards, placement officers verify official corporate credentials before granting job posting access.
        </p>
      </div>

      {/* Current Status Pill */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: isApproved ? '#ecfdf5' : isPending ? '#fffbeb' : '#ffffff',
          border: `1px solid ${isApproved ? '#a7f3d0' : isPending ? '#fde68a' : 'var(--border-light)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isApproved ? (
            <CheckCircle2 size={32} color="#059669" />
          ) : isPending ? (
            <Clock size={32} color="#d97706" />
          ) : (
            <AlertTriangle size={32} color="#64748b" />
          )}
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Status:{' '}
              <span style={{ textTransform: 'uppercase', color: isApproved ? '#059669' : isPending ? '#d97706' : 'var(--text-main)' }}>
                {verification?.status || 'Unsubmitted'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {isApproved
                ? `Accreditation approved by placement office on ${new Date(verification.reviewedAt).toLocaleDateString()}. Full hiring privileges active.`
                : isPending
                ? 'Your submission is queued for placement officer review. Turnaround is typically within 24 hours.'
                : 'Please complete Step 1 below to submit your corporate credentials for review.'}
            </p>
          </div>
        </div>

        {verification?.reviewedBy && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Reviewer: <strong>{verification.reviewerName || 'Placement Officer'}</strong>
          </div>
        )}
      </div>

      {successMsg && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Two-step Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Step 1: Corporate Information
          </h3>

          <form onSubmit={handleSubmitVerification}>
            <div className="form-group">
              <label className="form-label">Registered Legal Entity Name</label>
              <input
                type="text"
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Corporate Domain Email</label>
              <input
                type="email"
                className="form-control"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
                placeholder="recruitment@yourcompany.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Website URL</label>
              <input
                type="url"
                className="form-control"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
                placeholder="https://company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Registration / CIN / GSTIN Number</label>
              <input
                type="text"
                className="form-control"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
                placeholder="e.g. CIN-U72200KA2021PTC148892"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Authorized Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Incorporation Certificate or Supporting PDF</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.png,.jpg"
                onChange={(e) => setDocFile(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={submitting || isApproved}
            >
              {submitting ? 'Submitting Documents...' : isApproved ? 'Company Verified & Accredited' : 'Submit for Placement Review'}
            </button>
          </form>
        </div>

        {/* Step 2 Review History Box */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Step 2: Verification Audit Trail
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Permanent audit record of institutional verification reviews
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {verification?.history?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No review events logged yet.
              </div>
            ) : (
              verification?.history?.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderLeft: `4px solid ${h.status === 'approved' ? '#10b981' : '#f59e0b'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                      Status: {h.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(h.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Action by: <strong>{h.reviewer}</strong>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
                    {h.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
