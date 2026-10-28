import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  User,
  Globe,
  Upload,
  Trash2,
  Camera,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Award,
  Hash,
  Phone,
  Mail,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (Mech)',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  'Aerospace Engineering',
];

const DEGREES = [
  'B.Tech - Bachelor of Technology',
  'B.E. - Bachelor of Engineering',
  'M.Tech - Master of Technology',
  'M.E. - Master of Engineering',
  'BCA - Bachelor of Computer Applications',
  'MCA - Master of Computer Applications',
  'B.Sc - Bachelor of Science',
  'M.Sc - Master of Science',
  'Diploma in Engineering',
];

const PASSING_YEARS = ['2023', '2024', '2025', '2026', '2027', '2028', '2029'];

export const StudentSettingsPage = () => {
  const { user, profile, refreshProfile } = useAuth();

  // Basic Identity & Photo
  const [avatar, setAvatar] = useState(profile?.avatar || user?.avatar || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email] = useState(user?.email || '');
  const [rollNumber, setRollNumber] = useState(profile?.rollNumber || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  // Academic Credentials
  const [collegeName, setCollegeName] = useState(profile?.collegeName || 'National Institute of Technology');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech - Bachelor of Technology');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [batch, setBatch] = useState(profile?.batch || '2026');
  const [cgpa, setCgpa] = useState(profile?.cgpa !== undefined ? String(profile?.cgpa) : '8.5');

  // Address & Location
  const [city, setCity] = useState(profile?.city || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [address, setAddress] = useState(profile?.address || '');

  // Career Focus & Evidence Links
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Full Stack Developer');
  const [bio, setBio] = useState(profile?.bio || '');
  const [github, setGithub] = useState(profile?.links?.github || '');
  const [linkedin, setLinkedin] = useState(profile?.links?.linkedin || '');
  const [portfolio, setPortfolio] = useState(profile?.links?.portfolio || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  // Sync state if profile/user loads or changes
  useEffect(() => {
    if (profile) {
      if (profile.rollNumber !== undefined) setRollNumber(profile.rollNumber || '');
      if (profile.dob !== undefined) setDob(profile.dob || '');
      if (profile.collegeName !== undefined) setCollegeName(profile.collegeName || 'National Institute of Technology');
      if (profile.degree !== undefined) setDegree(profile.degree || 'B.Tech - Bachelor of Technology');
      if (profile.department !== undefined) setDepartment(profile.department || 'Computer Science & Engineering');
      if (profile.batch !== undefined) setBatch(profile.batch || '2026');
      if (profile.cgpa !== undefined) setCgpa(String(profile.cgpa));
      if (profile.city !== undefined) setCity(profile.city || '');
      if (profile.pincode !== undefined) setPincode(profile.pincode || '');
      if (profile.address !== undefined) setAddress(profile.address || '');
      if (profile.phone !== undefined) setPhone(profile.phone || '');
      if (profile.targetRole !== undefined) setTargetRole(profile.targetRole || 'Full Stack Developer');
      if (profile.bio !== undefined) setBio(profile.bio || '');
      if (profile.avatar) setAvatar(profile.avatar);
      if (profile.links) {
        setGithub(profile.links.github || '');
        setLinkedin(profile.links.linkedin || '');
        setPortfolio(profile.links.portfolio || '');
      }
    }
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.avatar && !avatar) setAvatar(user.avatar);
    }
  }, [profile, user]);

  // Handle Image File Upload (Base64)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setAvatarError('Image file size must be less than 4 MB.');
      return;
    }

    setAvatarError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAvatar(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.put('/students/me', {
        fullName,
        avatar,
        rollNumber,
        dob,
        collegeName,
        degree,
        department,
        batch,
        yearOfPassing: batch,
        cgpa,
        city,
        pincode,
        address,
        phone,
        bio,
        targetRole,
        links: {
          github,
          linkedin,
          portfolio,
        },
      });

      if (res.data.success) {
        setSavedSuccess(true);
        refreshProfile();
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Candidate Profile & Student Settings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
              Keep your academic credentials, personal details, verified photo, and placement target roles complete and accurate.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            <Award size={16} /> Verified Academic Record
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {savedSuccess && (
        <div
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 600,
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
          }}
        >
          <CheckCircle2 size={22} color="#059669" />
          <div>
            <div style={{ fontWeight: 700 }}>Profile Settings Successfully Saved!</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 400, color: '#047857' }}>
              Your Skill Passport, academic credentials, and photo are live across the recruitment matching index.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Section 1: User Photo Upload & Core Identity */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-main)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '0.75rem',
            }}
          >
            <User size={20} color="var(--primary)" /> Profile Photo & Personal Identity
          </h3>

          {/* Photo Upload Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed #cbd5e1',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Candidate Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  fullName?.charAt(0) || <Camera size={40} />
                )}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                <Camera size={15} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 700 }}>Candidate Profile Photo</h4>
              <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Upload a clear front-facing portrait. Recruiter dashboards and institutional transcripts will feature this photo.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: 'none' }}
                  onChange={handlePhotoSelect}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ gap: '0.5rem', fontSize: '0.875rem' }}
                >
                  <Upload size={16} /> Upload New Photo
                </button>
                {avatar && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleRemovePhoto}
                    style={{ gap: '0.5rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#fca5a5' }}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>

              {avatarError && (
                <div style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.825rem', fontWeight: 600 }}>
                  {avatarError}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields: Name, Email, College Roll Number, DOB */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <User size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> University Email
              </label>
              <input
                type="text"
                className="form-control"
                value={email}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }}
                title="Account email address cannot be changed."
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> College Roll Number
              </label>
              <input
                type="text"
                className="form-control"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 2022CSB1042 / 717822P101"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Date of Birth (DOB)
              </label>
              <input
                type="date"
                className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic & Institutional Credentials */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-main)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '0.75rem',
            }}
          >
            <GraduationCap size={20} color="var(--primary)" /> Academic & Institutional Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <Building2 size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> College / University Name
              </label>
              <input
                type="text"
                className="form-control"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. National Institute of Technology, Trichy"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Degree
              </label>
              <select
                className="form-control"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              >
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Department / Discipline
              </label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Year of Passing / Batch
              </label>
              <select
                className="form-control"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              >
                {PASSING_YEARS.map((y) => (
                  <option key={y} value={y}>
                    Batch of {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> CGPA / Percentage
              </label>
              <input
                type="text"
                className="form-control"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.75 or 87.5%"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Personal & Contact Information */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-main)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '0.75rem',
            }}
          >
            <MapPin size={20} color="var(--primary)" /> Personal & Contact Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Phone size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Contact Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> City
              </label>
              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Chennai / Bengaluru / Coimbatore"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Pincode / Postal Code
              </label>
              <input
                type="text"
                className="form-control"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 600001 / 560001"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <Building2 size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Full Address
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Apartment/Flat number, Area, Landmark, State"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Target Role & Career Portfolio */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-main)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '0.75rem',
            }}
          >
            <Globe size={20} color="var(--primary)" /> Career Target & External Evidence Repositories
          </h3>

          <div className="form-group">
            <label className="form-label">Primary Target Role</label>
            <input
              type="text"
              className="form-control"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, Embedded Systems Engineer, CAD Designer"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary & Bio</label>
            <textarea
              className="form-control"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your domain strengths, solved problems, and technical projects..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="url"
                className="form-control"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/your-username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-control"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Portfolio URL</label>
              <input
                type="url"
                className="form-control"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.dev"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{
              padding: '0.9rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Save size={20} />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
