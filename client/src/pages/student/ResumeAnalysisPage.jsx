import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ResumeAnalysisPage = () => {
  const { profile, refreshProfile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(profile?.resumeParsedData || null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setAnalyzing(true);
    setSyncSuccessMessage('');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('resumeFile', selectedFile);

    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setAnalysisResult(res.data.analysis);
        refreshProfile();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to analyze resume PDF.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSyncSkills = async () => {
    if (!analysisResult?.extractedSkills || analysisResult.extractedSkills.length === 0) return;

    setSyncing(true);
    setErrorMessage('');
    try {
      const res = await api.post('/resumes/sync-skills', {
        skills: analysisResult.extractedSkills,
      });

      if (res.data.success) {
        setSyncSuccessMessage(res.data.message);
        refreshProfile();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to sync skills.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <Sparkles size={16} /> Automated ATS Resume Diagnostic
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Resume PDF Extraction & Analysis</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Upload your PDF resume to extract recognized technical skills, evaluate ATS keyword density, and sync findings to your Skill Passport.
        </p>
      </div>

      {/* Upload Box */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem', textAlign: 'center' }}>
        <form onSubmit={handleFileUpload}>
          <div
            style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              backgroundColor: 'var(--bg-card-subtle)',
              marginBottom: '1.5rem',
            }}
          >
            <Upload size={38} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Select Resume PDF Document
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Maximum file size 10MB. Standard PDF formatting recommended.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="resume-pdf-input"
            />
            <label htmlFor="resume-pdf-input" className="btn btn-secondary">
              Browse Local PDF File
            </label>

            {selectedFile && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!selectedFile || analyzing}
            style={{ minWidth: '220px' }}
          >
            {analyzing ? 'Extracting Text & Skills...' : 'Run Resume Analysis'}
          </button>
        </form>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      {syncSuccessMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {/* Completeness & Feedback */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">ATS Completeness Diagnostic</h3>
                <p className="card-subtitle">Readability and keyword indexing rating</p>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>
                {analysisResult.completenessScore || 75}%
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                ATS Readability Feedback & Suggestions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {analysisResult.atsFeedback?.map((fb, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card-subtle)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Projects */}
            {analysisResult.extractedProjects?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Extracted Project Snippets
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {analysisResult.extractedProjects.map((proj, pIdx) => (
                    <li key={pIdx} style={{ marginBottom: '0.35rem' }}>{proj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Extracted Skills */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Normalized Skills Detected</h3>
                <p className="card-subtitle">
                  {analysisResult.extractedSkills?.length || 0} technical skills matched in SkillProof dictionary
                </p>
              </div>
              <button
                onClick={handleSyncSkills}
                className="btn btn-primary btn-sm"
                disabled={syncing}
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                <span>Sync to Passport</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {analysisResult.extractedSkills?.map((skill) => (
                <span key={skill} className="badge badge-assessed" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Clicking <strong>"Sync to Passport"</strong> imports these extracted competencies directly into your
              Skill Passport under Claimed status, allowing you to validate them through practical project links
              or online skill tests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
