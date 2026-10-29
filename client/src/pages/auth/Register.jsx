import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertCircle,
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  UserPlus,
  Upload,
  Trash2,
  Camera,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Hash,
  Briefcase,
  Globe,
  Phone,
  Landmark,
  BadgeCheck,
  FileText,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Department-specific preferred job roles
export const DEPARTMENT_ROLES = {
  'Computer Science & Engineering': [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Software Development Engineer (SDE)',
    'Cloud & DevOps Engineer',
    'Systems & Cybersecurity Engineer',
    'Mobile Application Developer',
  ],
  'Information Technology': [
    'Full Stack Web Developer',
    'Cloud Solutions Architect',
    'Database Administrator (DBA)',
    'DevOps & Infrastructure Engineer',
    'IT Systems & Network Engineer',
    'Enterprise Solutions Consultant',
  ],
  'Artificial Intelligence & Data Science': [
    'AI / Machine Learning Engineer',
    'Data Scientist',
    'MLOps & Pipeline Engineer',
    'Data Analyst & BI Specialist',
    'Computer Vision Engineer',
    'NLP & Large Language Model Specialist',
  ],
  'Electronics & Communication Engineering (ECE)': [
    'Embedded Systems Engineer',
    'VLSI Design & Verification Engineer',
    'IoT & Smart Hardware Developer',
    'Firmware & Microcontroller Developer',
    'Wireless & Telecom Systems Engineer',
    'Robotics & Automation Engineer',
  ],
  'Electrical & Electronics Engineering (EEE)': [
    'Electric Vehicle (EV) Powertrain Engineer',
    'Power Systems & Smart Grid Engineer',
    'PLC & Industrial Automation Engineer',
    'Electrical Control & Instrumentation Engineer',
    'Renewable Energy & Solar Systems Engineer',
    'Battery Management Systems (BMS) Engineer',
  ],
  'Mechanical Engineering (Mech)': [
    'CAD / CAM Design & Modeling Engineer',
    'Automotive & Powertrain Design Engineer',
    'Robotics, Mechatronics & Automation Engineer',
    'Thermal & CFD Simulation Engineer',
    'Manufacturing & Production Engineer',
    'HVAC, Piping & Systems Engineer',
  ],
  'Civil Engineering': [
    'Structural Analysis & Design Engineer',
    'BIM (Building Information Modeling) Specialist',
    'Construction Site & Project Engineer',
    'Geotechnical & Foundation Engineer',
    'Transportation & Highway Design Engineer',
    'Environmental & Water Resources Engineer',
  ],
};

const DEGREES = [
  'B.Tech',
  'B.E.',
  'M.Tech',
  'MCA',
  'B.Sc (Computer Science / IT)',
  'BCA',
  'Diploma in Engineering',
];

const PASSING_YEARS = ['2023', '2024', '2025', '2026', '2027', '2028', '2029'];

export const RECRUITER_INDUSTRIES = [
  'Information Technology & Software Services',
  'Product & SaaS',
  'Artificial Intelligence & Data Solutions',
  'Financial Services & Fintech',
  'Consulting & Professional Services',
  'E-Commerce & Retail Tech',
  'Manufacturing & Automotive',
  'Telecommunications & Networking',
  'Healthcare & Biotech',
  'Other Industry',
];

export const COMPANY_SIZES = [
  '1-10 Employees (Startup / Boutique)',
  '11-50 Employees (Early Stage)',
  '51-200 Employees (Growth Scaleup)',
  '201-500 Employees (Mid-Market)',
  '500+ Employees (Enterprise / MNC)',
];

export const RECRUITER_DESIGNATIONS = [
  'Senior HR Manager',
  'Head of Campus Recruitment',
  'Technical Talent Acquisition Lead',
  'HR Business Partner (HRBP)',
  'Talent Acquisition Specialist',
  'Director of Human Resources',
  'Engineering Hiring Manager',
];

export const PLACEMENT_DESIGNATIONS = [
  'Head of Training & Placement',
  'Director of Placement & Corporate Relations',
  'Placement Officer',
  'Dean of Career Services & Internships',
  'Training & Placement Officer (TPO)',
  'Industry Relations Coordinator',
  'Department Placement Coordinator',
];

export const INSTITUTION_TYPES = [
  'Autonomous Engineering Institute',
  'Central / State Government University',
  'Institute of National Importance (NIT / IIT / IIIT)',
  'Deemed-to-be University',
  'Affiliated Engineering College',
  'Polytechnic / Technical Institute',
];

export const Register = () => {
  // Role Selection
  const [role, setRole] = useState('student');

  // Basic Account Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extended Student Profile Fields
  const [dob, setDob] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('2026');
  const [collegeName, setCollegeName] = useState('National Institute of Technology');
  const [rollNumber, setRollNumber] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState('8.5');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  // Target Career Role
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Recruiter Profile Fields
  const [companyName, setCompanyName] = useState('');
  const [recruiterDesignation, setRecruiterDesignation] = useState('Senior HR Manager');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('Information Technology & Software Services');
  const [companySize, setCompanySize] = useState('51-200 Employees (Growth Scaleup)');
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
  const [recruiterHiringDomains, setRecruiterHiringDomains] = useState('Full Stack, AI/ML, Cloud & DevOps');
  const [recruiterCountry, setRecruiterCountry] = useState('India');
  const [recruiterState, setRecruiterState] = useState('');
  const [recruiterDistrict, setRecruiterDistrict] = useState('');
  const [recruiterCity, setRecruiterCity] = useState('');
  const [recruiterPincode, setRecruiterPincode] = useState('');
  const [recruiterAddress, setRecruiterAddress] = useState('');

  // Placement Officer Profile Fields
  const [placementCollegeName, setPlacementCollegeName] = useState('National Institute of Technology');
  const [placementDesignation, setPlacementDesignation] = useState('Head of Training & Placement');
  const [placementDepartment, setPlacementDepartment] = useState('Central Training & Placement Cell');
  const [placementEmployeeId, setPlacementEmployeeId] = useState('');
  const [placementPhone, setPlacementPhone] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [institutionType, setInstitutionType] = useState('Autonomous Engineering Institute');
  const [collegeWebsite, setCollegeWebsite] = useState('');
  const [placementCountry, setPlacementCountry] = useState('India');
  const [placementState, setPlacementState] = useState('');
  const [placementDistrict, setPlacementDistrict] = useState('');
  const [placementCity, setPlacementCity] = useState('');
  const [placementPincode, setPlacementPincode] = useState('');
  const [placementAddress, setPlacementAddress] = useState('');

  // Automatic Indian PIN Code Detection State
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeSuccess, setPincodeSuccess] = useState('');

  // Handle Automatic Indian PIN Code Location Lookup
  const handlePincodeLookup = async (inputPin, roleTarget) => {
    const cleanPin = inputPin.replace(/\D/g, '').slice(0, 6);

    // Update state based on role
    if (roleTarget === 'student') setPincode(cleanPin);
    else if (roleTarget === 'recruiter') setRecruiterPincode(cleanPin);
    else if (roleTarget === 'placement_officer') setPlacementPincode(cleanPin);

    setPincodeError('');
    setPincodeSuccess('');

    if (cleanPin.length < 6) return;

    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setPincodeError('Invalid Indian PIN code. Must be 6 digits starting with 1-9.');
      return;
    }

    setPincodeLoading(true);
    try {
      let result = null;
      // 1. Try our backend proxy endpoint
      try {
        const res = await api.get(`/auth/pincode/${cleanPin}`);
        if (res.data?.success) {
          result = res.data;
        }
      } catch (err) {
        // Fallback directly to India Post API
        const fallbackRes = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData) && fallbackData[0]?.Status === 'Success' && fallbackData[0]?.PostOffice?.length) {
          const po = fallbackData[0].PostOffice[0];
          result = {
            city: po.District || po.Block || po.Name,
            district: po.District || '',
            state: po.State || '',
            country: 'India',
          };
        }
      }

      if (result && (result.city || result.district)) {
        const detectedCity = result.city || result.district;
        const detectedDistrict = result.district || detectedCity;
        const detectedState = result.state || '';
        const detectedCountry = result.country || 'India';

        if (roleTarget === 'student') {
          setCity(detectedCity);
          setDistrict(detectedDistrict);
          setState(detectedState);
          setCountry(detectedCountry);
        } else if (roleTarget === 'recruiter') {
          setRecruiterCity(detectedCity);
          setRecruiterDistrict(detectedDistrict);
          setRecruiterState(detectedState);
          setRecruiterCountry(detectedCountry);
        } else if (roleTarget === 'placement_officer') {
          setPlacementCity(detectedCity);
          setPlacementDistrict(detectedDistrict);
          setPlacementState(detectedState);
          setPlacementCountry(detectedCountry);
        }
        setPincodeSuccess(`Location detected: ${detectedCity}, ${detectedState} (${detectedCountry})`);
      } else {
        setPincodeError(`No location found for PIN code ${cleanPin}. You can enter city & state manually.`);
      }
    } catch (err) {
      setPincodeError('Could not auto-fetch location. Please enter city & state manually.');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const { register, isRestricted } = useAuth();
  const navigate = useNavigate();

  // Handle department change & update role recommendations
  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    const availableRoles = DEPARTMENT_ROLES[newDept] || [];
    if (availableRoles.length > 0) {
      setTargetRole(availableRoles[0]);
      setIsCustomRole(false);
      setCustomRole('');
    }
  };

  const handleTargetRoleSelect = (val) => {
    if (val === '__custom__') {
      setIsCustomRole(true);
      setTargetRole(customRole || '');
    } else {
      setIsCustomRole(false);
      setTargetRole(val);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUserPhoto(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // Handle direct account creation
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const activePin =
      role === 'student' ? pincode : role === 'recruiter' ? recruiterPincode : placementPincode;
    if (!/^[1-9][0-9]{5}$/.test(activePin)) {
      setError('Please provide a valid 6-digit Indian PIN code (e.g. 600001).');
      return;
    }

    setLoading(true);
    const finalTargetRole = isCustomRole ? customRole.trim() || 'Software Engineer' : targetRole;

    try {
      await register({
        role,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatar: userPhoto,
        // Student fields
        collegeName: role === 'placement_officer' ? placementCollegeName.trim() : collegeName.trim(),
        department: role === 'placement_officer' ? placementDepartment.trim() : department,
        companyName: companyName.trim(),
        targetRole: finalTargetRole,
        dob,
        yearOfPassing,
        degree,
        cgpa: cgpa.trim(),
        country:
          role === 'recruiter'
            ? recruiterCountry
            : role === 'placement_officer'
            ? placementCountry
            : country,
        state:
          role === 'recruiter'
            ? recruiterState.trim()
            : role === 'placement_officer'
            ? placementState.trim()
            : state.trim(),
        district:
          role === 'recruiter'
            ? recruiterDistrict.trim()
            : role === 'placement_officer'
            ? placementDistrict.trim()
            : district.trim(),
        city:
          role === 'recruiter'
            ? recruiterCity.trim()
            : role === 'placement_officer'
            ? placementCity.trim()
            : city.trim(),
        pincode:
          role === 'recruiter'
            ? recruiterPincode.trim()
            : role === 'placement_officer'
            ? placementPincode.trim()
            : pincode.trim(),
        address:
          role === 'recruiter'
            ? recruiterAddress.trim()
            : role === 'placement_officer'
            ? placementAddress.trim()
            : address.trim(),
        rollNumber: rollNumber.trim(),
        // Recruiter specific fields
        designation:
          role === 'recruiter'
            ? recruiterDesignation
            : role === 'placement_officer'
            ? placementDesignation
            : '',
        phone:
          role === 'recruiter'
            ? recruiterPhone.trim()
            : role === 'placement_officer'
            ? placementPhone.trim()
            : '',
        website:
          role === 'recruiter'
            ? companyWebsite.trim()
            : role === 'placement_officer'
            ? collegeWebsite.trim()
            : '',
        officialEmail: email.trim().toLowerCase(),
        registrationNumber: companyRegistrationNumber.trim(),
        industry: companyIndustry,
        companySize: companySize,
        hiringDomains: recruiterHiringDomains.trim(),
        // Placement Officer specific fields
        collegeCode: collegeCode.trim(),
        institutionType: institutionType,
        employeeId: placementEmployeeId.trim(),
      });

      if (isRestricted) {
        setSuccessMsg('Account created successfully! Note: Dashboard access is currently restricted.');
        setTimeout(() => {
          navigate('/login?restricted=true', {
            state: {
              message:
                'Login access is temporarily unavailable. We are working on improvements. Please try again later.',
            },
          });
        }, 1200);
        return;
      }

      setSuccessMsg('Account created successfully! Welcome to SkillProof AI.');

      setTimeout(() => {
        if (role === 'student') {
          navigate('/student/home');
        } else if (role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else if (role === 'placement_officer') {
          navigate('/placement/dashboard');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (!err.response) {
        setError('Cannot reach server API. Please ensure the backend is running at http://localhost:5000.');
      } else {
        setError('Failed to create account. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentDepartmentRoles = DEPARTMENT_ROLES[department] || [];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2.5rem 1rem',
        background: '#FAFAF5',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '780px',
          padding: '2.75rem 2.5rem',
          boxShadow: '0 4px 20px -2px rgba(20, 45, 43, 0.06)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.75rem',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Join the evidence-based skill verification and campus placement platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'student' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              background: role === 'student' ? 'var(--primary-light)' : '#ffffff',
              color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <GraduationCap size={20} />
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole('recruiter')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'recruiter' ? '2px solid var(--accent)' : '1px solid var(--border-light)',
              background: role === 'recruiter' ? 'var(--accent-light)' : '#ffffff',
              color: role === 'recruiter' ? '#B27315' : 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Building2 size={20} />
            HR Recruiter
          </button>

          <button
            type="button"
            onClick={() => setRole('placement_officer')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: role === 'placement_officer' ? '2px solid var(--secondary)' : '1px solid var(--border-light)',
              background: role === 'placement_officer' ? '#EDF3F1' : '#ffffff',
              color: role === 'placement_officer' ? 'var(--secondary)' : 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Users size={20} />
            Placement
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--error-light)',
              border: '1px solid var(--error-border)',
              color: 'var(--error)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={16} color="#059669" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          {/* User Photo / Avatar Upload */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed #cbd5e1',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid #ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Profile Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Camera size={26} color="#94a3b8" />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                {role === 'student' && 'Student Passport Photo Upload (Optional)'}
                {role === 'recruiter' && 'Corporate Headshot / Company Logo (Optional)'}
                {role === 'placement_officer' && 'Placement Officer / College Photo (Optional)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {role === 'student' && 'Upload a clean passport-size photo (PNG, JPG, max 5MB)'}
                {role === 'recruiter' && 'Upload an HR headshot or official corporate logo (PNG, JPG, max 5MB)'}
                {role === 'placement_officer' && 'Upload an officer headshot or institutional emblem (PNG, JPG, max 5MB)'}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Upload size={13} />
                  {userPhoto ? 'Change Photo' : 'Upload Photo'}
                </button>

                {userPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserPhoto('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Core Credentials Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder={
                  role === 'student'
                    ? 'e.g. Dhatchanamoorthy P'
                    : role === 'recruiter'
                    ? 'e.g. Elena Rostova'
                    : 'e.g. Dr. Aris Thorne'
                }
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {role === 'recruiter' ? 'Official Work Email' : role === 'placement_officer' ? 'Institutional Email' : 'Email Address'}
              </label>
              <input
                type="email"
                className="form-control"
                placeholder={
                  role === 'student'
                    ? 'e.g. name@gmail.com'
                    : role === 'recruiter'
                    ? 'e.g. elena@nexiscloud.io'
                    : 'e.g. placement@nit.edu'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <>
              {/* Academic Details Section */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <BookOpen size={16} /> Academic Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">College / Institution Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. National Institute of Technology"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">College Roll / Reg Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 2026CS108"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Degree Program</label>
                  <select
                    className="form-control form-select"
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
                  <label className="form-label">Year of Passing (Batch)</label>
                  <select
                    className="form-control form-select"
                    value={yearOfPassing}
                    onChange={(e) => setYearOfPassing(e.target.value)}
                  >
                    {PASSING_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department / Discipline</label>
                  <select
                    className="form-control form-select"
                    value={department}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication (ECE)</option>
                    <option value="Electrical & Electronics Engineering (EEE)">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering (Mech)">Mechanical Engineering (Mech)</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">CGPA / Percentage</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 8.5 or 85%"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Target Career Role Section */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Award size={16} /> Preferred Target Career Role
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Target Job Role
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Curated for {department.split(' ')[0]}
                  </span>
                </div>

                <select
                  className="form-control form-select"
                  value={isCustomRole ? '__custom__' : targetRole}
                  onChange={(e) => handleTargetRoleSelect(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                >
                  {currentDepartmentRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="__custom__">+ Enter Custom Job Role...</option>
                </select>

                {isCustomRole && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter custom role title (e.g. Game Engine Developer)..."
                    value={customRole}
                    onChange={(e) => {
                      setCustomRole(e.target.value);
                      setTargetRole(e.target.value);
                    }}
                    required
                    style={{ marginBottom: '0.5rem' }}
                  />
                )}

                {!isCustomRole && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Suggested Roles for your domain:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {currentDepartmentRoles.map((r) => {
                        const isSelected = targetRole === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setIsCustomRole(false);
                              setTargetRole(r);
                            }}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '9999px',
                              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                              backgroundColor: isSelected ? 'var(--primary-light)' : '#f8fafc',
                              color: isSelected ? 'var(--primary)' : '#475569',
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isSelected && <CheckCircle2 size={12} />}
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Location & Address Section with Auto PIN Code Detection */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <MapPin size={16} /> Location Details (Auto PIN Code Detection)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Country</span>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Default: India</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={country}
                    readOnly
                    style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>PIN Code (Indian Postal)</span>
                    {pincodeLoading && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                        <Loader2 size={12} className="animate-spin" /> Detecting...
                      </span>
                    )}
                    {pincodeSuccess && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Detected
                      </span>
                    )}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      maxLength={6}
                      className="form-control"
                      placeholder="e.g. 600001"
                      value={pincode}
                      onChange={(e) => handlePincodeLookup(e.target.value, 'student')}
                      required
                    />
                    {pincodeLoading && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <Loader2 size={16} className="animate-spin" color="var(--secondary)" />
                      </div>
                    )}
                  </div>
                  {pincodeError && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {pincodeError}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tamil Nadu"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / District</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Chennai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Flat 4B, Green Valley Apartments, Anna Nagar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Recruiter Specific Fields */}
          {role === 'recruiter' && (
            <>
              {/* Recruiter Professional Profile */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Briefcase size={16} /> Recruiter Professional Profile
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Title / Designation</label>
                  <select
                    className="form-control form-select"
                    value={recruiterDesignation}
                    onChange={(e) => setRecruiterDesignation(e.target.value)}
                  >
                    {RECRUITER_DESIGNATIONS.map((desig) => (
                      <option key={desig} value={desig}>
                        {desig}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact / Mobile Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +91 98765 43210"
                    value={recruiterPhone}
                    onChange={(e) => setRecruiterPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Company Information */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Building2 size={16} /> Company &amp; Organization Details
              </div>

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
                  <label className="form-label">Official Corporate Website</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="e.g. https://nexiscloud.io"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Industry Sector</label>
                  <select
                    className="form-control form-select"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                  >
                    {RECRUITER_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Size / Scale</label>
                  <select
                    className="form-control form-select"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  >
                    {COMPANY_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Corporate Registration / CIN / GSTIN</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CIN-U72200KA2021PTC148892"
                    value={companyRegistrationNumber}
                    onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Hiring Domains</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Full Stack, AI/ML, Cloud &amp; DevOps"
                    value={recruiterHiringDomains}
                    onChange={(e) => setRecruiterHiringDomains(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Office Location & Address with Auto PIN Code Detection */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <MapPin size={16} /> Office Location Details (Auto PIN Code Detection)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Country</span>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Default: India</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={recruiterCountry}
                    readOnly
                    style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>PIN Code (Indian Postal)</span>
                    {pincodeLoading && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                        <Loader2 size={12} className="animate-spin" /> Detecting...
                      </span>
                    )}
                    {pincodeSuccess && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Detected
                      </span>
                    )}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      maxLength={6}
                      className="form-control"
                      placeholder="e.g. 560100"
                      value={recruiterPincode}
                      onChange={(e) => handlePincodeLookup(e.target.value, 'recruiter')}
                      required
                    />
                    {pincodeLoading && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <Loader2 size={16} className="animate-spin" color="var(--secondary)" />
                      </div>
                    )}
                  </div>
                  {pincodeError && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {pincodeError}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Karnataka"
                    value={recruiterState}
                    onChange={(e) => setRecruiterState(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / Headquarters</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Bangalore"
                    value={recruiterCity}
                    onChange={(e) => setRecruiterCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Office Address</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Level 5, Cyber Park, Electronic City Phase 1"
                  value={recruiterAddress}
                  onChange={(e) => setRecruiterAddress(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Placement Officer Specific Fields */}
          {role === 'placement_officer' && (
            <>
              {/* Officer Credentials */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#3730a3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Users size={16} /> Officer Credentials &amp; Role
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Official Designation</label>
                  <select
                    className="form-control form-select"
                    value={placementDesignation}
                    onChange={(e) => setPlacementDesignation(e.target.value)}
                  >
                    {PLACEMENT_DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Office Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +91 98765 12340"
                    value={placementPhone}
                    onChange={(e) => setPlacementPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Placement Cell / Department</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Central Training &amp; Placement Cell"
                    value={placementDepartment}
                    onChange={(e) => setPlacementDepartment(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee / Faculty ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TPO-FAC-2024"
                    value={placementEmployeeId}
                    onChange={(e) => setPlacementEmployeeId(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* College & Institution Details */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#3730a3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Landmark size={16} /> Institution &amp; College Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">College / University Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. National Institute of Technology"
                    value={placementCollegeName}
                    onChange={(e) => setPlacementCollegeName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Institution Code (AICTE / NIRF / Affiliation)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. NIT-C-3419 or AICTE-1-49201"
                    value={collegeCode}
                    onChange={(e) => setCollegeCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Institution Category</label>
                  <select
                    className="form-control form-select"
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                  >
                    {INSTITUTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official College Website</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="e.g. https://nit.edu"
                    value={collegeWebsite}
                    onChange={(e) => setCollegeWebsite(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campus Location & Address with Auto PIN Code Detection */}
              <div
                style={{
                  margin: '1.25rem 0 0.75rem',
                  paddingBottom: '0.35rem',
                  borderBottom: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#3730a3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <MapPin size={16} /> Campus Location Details (Auto PIN Code Detection)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Country</span>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Default: India</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={placementCountry}
                    readOnly
                    style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>PIN Code (Indian Postal)</span>
                    {pincodeLoading && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                        <Loader2 size={12} className="animate-spin" /> Detecting...
                      </span>
                    )}
                    {pincodeSuccess && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Detected
                      </span>
                    )}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      maxLength={6}
                      className="form-control"
                      placeholder="e.g. 620015"
                      value={placementPincode}
                      onChange={(e) => handlePincodeLookup(e.target.value, 'placement_officer')}
                      required
                    />
                    {pincodeLoading && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <Loader2 size={16} className="animate-spin" color="var(--secondary)" />
                      </div>
                    )}
                  </div>
                  {pincodeError && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {pincodeError}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tamil Nadu"
                    value={placementState}
                    onChange={(e) => setPlacementState(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / District</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tiruchirappalli"
                    value={placementCity}
                    onChange={(e) => setPlacementCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Campus Full Address</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Tanjore Main Road, National Highway 67, Near BHEL, Thuvakudi"
                  value={placementAddress}
                  onChange={(e) => setPlacementAddress(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 700,
              gap: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>
              {loading
                ? 'Creating Account...'
                : role === 'student'
                ? 'Create Student Account'
                : role === 'recruiter'
                ? 'Create HR Recruiter Account'
                : 'Create Placement Officer Account'}
            </span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
