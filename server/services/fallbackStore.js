const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const dataFilePath = path.join(dataDir, 'fallbackStore.json');

// Default initial seeds
const defaultUsers = [
  {
    _id: '660000000000000000000001',
    email: 'student@skillproof.ai',
    fullName: 'Aarav Mehta',
    role: 'student',
    status: 'active',
  },
  {
    _id: '660000000000000000000002',
    email: 'atrisk@skillproof.ai',
    fullName: 'Rohan Verma',
    role: 'student',
    status: 'active',
  },
  {
    _id: '660000000000000000000003',
    email: 'recruiter@skillproof.ai',
    fullName: 'Elena Rostova',
    role: 'recruiter',
    status: 'active',
  },
  {
    _id: '660000000000000000000004',
    email: 'pending@skillproof.ai',
    fullName: 'Marcus Vance',
    role: 'recruiter',
    status: 'active',
  },
  {
    _id: '660000000000000000000005',
    email: 'officer@skillproof.ai',
    fullName: 'Dr. Aris Thorne',
    role: 'placement_officer',
    status: 'active',
  },
];

const defaultStudentProfile = {
  _id: '661000000000000000000001',
  user: '660000000000000000000001',
  rollNumber: '2022CSB1042',
  collegeName: 'National Institute of Technology',
  department: 'Computer Science & Engineering',
  batch: '2026',
  cgpa: 9.1,
  phone: '+91 97711 34567',
  bio: 'Full Stack Engineer with proven production experience building microservices and high-fidelity React interfaces. Solved 350+ DSA problems.',
  targetRole: 'Full Stack Developer',
  links: {
    github: 'https://github.com/aarav-mehta-dev',
    linkedin: 'https://linkedin.com/in/aaravmehta',
    portfolio: 'https://aarav.dev',
  },
  profileCompletion: 95,
  placementStatus: 'unplaced',
  mentoringNotes: [],
};

const defaultRecruiterProfile = {
  _id: '661000000000000000000002',
  user: '660000000000000000000003',
  companyName: 'Nexis Cloud & AI Labs',
  website: 'https://nexiscloud.io',
  officialEmail: 'elena@nexiscloud.io',
  registrationNumber: 'CIN-U72200KA2021PTC148892',
  verificationStatus: 'approved',
  verificationStep: 2,
  location: 'Bangalore, India',
};

const defaultPlacementProfile = {
  _id: '661000000000000000000003',
  user: '660000000000000000000005',
  collegeName: 'National Institute of Technology',
  designation: 'Director of University Placements & Career Affairs',
  department: 'Central Placement Office',
};

const defaultSkills = [
  {
    skillName: 'React',
    normalizedName: 'react',
    category: 'Frontend',
    status: 'verified',
    proficiency: 'Advanced',
    assessmentScore: 100,
    statusReason: 'Assessed with 100% score on Full Stack Assessment and verified in live GitHub project.',
  },
  {
    skillName: 'Node.js',
    normalizedName: 'node.js',
    category: 'Backend',
    status: 'verified',
    proficiency: 'Advanced',
    assessmentScore: 100,
    statusReason: 'Demonstrated in production-ready collaborative backend service and verified by placement cell.',
  },
  {
    skillName: 'MongoDB',
    normalizedName: 'mongodb',
    category: 'Database',
    status: 'demonstrated',
    proficiency: 'Intermediate',
    statusReason: 'Implemented complex compound indexes and aggregation pipelines in project.',
  },
  {
    skillName: 'Data Structures & Algorithms',
    normalizedName: 'data structures & algorithms',
    category: 'Core Fundamentals',
    status: 'assessed',
    proficiency: 'Advanced',
    assessmentScore: 90,
    statusReason: 'Scored 90% in standardized algorithmic evaluation.',
  },
  {
    skillName: 'JavaScript',
    normalizedName: 'javascript',
    category: 'Languages',
    status: 'verified',
    proficiency: 'Expert',
    assessmentScore: 100,
    statusReason: 'Verified across project codebase and assessment rounds.',
  },
  {
    skillName: 'AWS',
    normalizedName: 'aws',
    category: 'DevOps & Cloud',
    status: 'verified',
    proficiency: 'Intermediate',
    statusReason: 'Verified through official AWS credential.',
  },
];

const defaultPassport = {
  _id: '662000000000000000000001',
  student: '660000000000000000000001',
  skills: defaultSkills,
  jobReadinessIndex: 88,
  readinessTier: 'Placement Ready',
  readinessBreakdown: {
    assessedScore: 34,
    demonstratedScore: 23,
    verifiedScore: 22,
    profileCompletenessScore: 9,
  },
  actionableSuggestions: [
    {
      text: 'Maintain strong interview preparation by practicing behavioral STAR questions.',
      actionType: 'interview',
      targetSkill: 'Behavioral Prep',
    },
  ],
};

const defaultEvidence = [
  {
    _id: '663000000000000000000001',
    student: '660000000000000000000001',
    type: 'project',
    title: 'Distributed Real-Time Collaborative Workspace',
    description: 'Engineered a concurrent collaborative markdown document editor using WebSockets, CRDTs, Redis cache, and MongoDB persistence. Handled 5k simultaneous sockets.',
    associatedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'JavaScript'],
    externalUrl: 'https://github.com/aarav-mehta-dev/collab-doc-engine',
    verificationStatus: 'verified',
  },
  {
    _id: '663000000000000000000002',
    student: '660000000000000000000001',
    type: 'certification',
    title: 'AWS Certified Solutions Architect Associate',
    description: 'Official credential verifying distributed VPC design, IAM policies, and cloud infrastructure resiliency.',
    associatedSkills: ['AWS', 'Docker'],
    externalUrl: 'https://aws.amazon.com/verification/cred-123456',
    issuingOrganization: 'Amazon Web Services',
    verificationStatus: 'verified',
  },
];

const defaultJobs = [
  {
    _id: '664000000000000000000001',
    companyName: 'Nexis Cloud & AI Labs',
    title: 'Full Stack Systems Engineer (Fresher / 2026 Batch)',
    domain: 'Full Stack Development',
    description: 'We are seeking high-caliber graduating engineers to join our core platform team. You will build high-throughput microservices in Node.js, craft dynamic user interfaces with React, and architect data models on MongoDB and PostgreSQL.',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
    preferredSkills: ['AWS', 'Docker', 'REST API', 'Redis'],
    minCgpa: 8.0,
    minJobReadinessIndex: 75,
    experienceLevel: 'Fresher (2026 Batch)',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    salaryRange: { min: 1200000, max: 1800000, currency: 'INR' },
    openings: 5,
    status: 'active',
    applicantsCount: 1,
  },
  {
    _id: '664000000000000000000002',
    companyName: 'Nexis Cloud & AI Labs',
    title: 'Distributed Backend & Data Systems Engineer',
    domain: 'Backend Development',
    description: 'Focus on distributed caching, high-frequency REST APIs, data stream ingestion, and database indexing.',
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
    preferredSkills: ['Docker', 'Redis', 'Git'],
    minCgpa: 7.5,
    minJobReadinessIndex: 70,
    experienceLevel: 'Fresher (2026 Batch)',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    salaryRange: { min: 1000000, max: 1500000, currency: 'INR' },
    openings: 3,
    status: 'active',
    applicantsCount: 0,
  },
];

const { expandedAssessments } = require('./assessments/assessmentBank');

const defaultAssessmentAttempts = [
  {
    _id: '668000000000000000000001',
    student: '660000000000000000000001',
    candidateName: 'Aarav Mehta',
    candidateEmail: 'student@skillproof.ai',
    assessment: '665000000000000000000001',
    assessmentTitle: 'Full Stack Web Engineering Assessment',
    assessmentDomain: 'Full Stack Development',
    scorePercentage: 92,
    earnedPoints: 55,
    totalPoints: 60,
    passed: true,
    status: 'completed',
    cameraStatus: 'connected',
    cameraInterruptions: 0,
    tabSwitches: 0,
    focusLossCount: 0,
    violationCount: 0,
    violations: [],
    startedAt: new Date(Date.now() - 3600000),
    submittedAt: new Date(Date.now() - 1800000),
  },
  {
    _id: '668000000000000000000002',
    student: '660000000000000000000002',
    candidateName: 'Rohan Verma',
    candidateEmail: 'atrisk@skillproof.ai',
    assessment: '665000000000000000000001',
    assessmentTitle: 'Full Stack Web Engineering Assessment',
    assessmentDomain: 'Full Stack Development',
    scorePercentage: 45,
    earnedPoints: 27,
    totalPoints: 60,
    passed: false,
    status: 'flagged',
    cameraStatus: 'disconnected',
    cameraInterruptions: 2,
    tabSwitches: 3,
    focusLossCount: 1,
    violationCount: 4,
    violations: [
      {
        type: 'tab_hidden',
        details: 'Candidate navigated away from assessment window.',
        timestamp: new Date(Date.now() - 5000000),
      },
      {
        type: 'camera_disconnected',
        details: 'Webcam video feed lost or stream paused.',
        timestamp: new Date(Date.now() - 4200000),
      },
      {
        type: 'fullscreen_exit',
        details: 'Candidate exited fullscreen mode.',
        timestamp: new Date(Date.now() - 3800000),
      },
      {
        type: 'tab_hidden',
        details: 'Multiple window blur / tab switches detected.',
        timestamp: new Date(Date.now() - 3100000),
      },
    ],
    startedAt: new Date(Date.now() - 5400000),
    submittedAt: new Date(Date.now() - 3000000),
  },
];

const defaultDrives = [
  {
    _id: '666000000000000000000001',
    title: 'Spring 2026 Premier Tech Campus Drive',
    collegeName: 'National Institute of Technology',
    batch: '2026',
    description: 'Exclusive on-campus recruitment drive featuring enterprise cloud infrastructure and product engineering companies.',
    minCgpa: 7.5,
    minJobReadinessIndex: 70,
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    registeredStudents: [{ student: '660000000000000000000001' }],
    participatingCompanies: [{ companyName: 'Nexis Cloud & AI Labs' }],
  },
];

// Load persisted state or initialize with defaults
let store = {
  users: defaultUsers,
  studentProfiles: { '660000000000000000000001': defaultStudentProfile },
  recruiterProfiles: { '660000000000000000000003': defaultRecruiterProfile },
  placementProfiles: { '660000000000000000000005': defaultPlacementProfile },
  passports: { '660000000000000000000001': defaultPassport },
  evidence: defaultEvidence,
  jobs: defaultJobs,
  assessments: expandedAssessments,
  assessmentAttempts: defaultAssessmentAttempts,
  drives: defaultDrives,
  skills: defaultSkills,
};

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function loadStore() {
  try {
    ensureDirExists(dataDir);
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        store = parsed;
        // Ensure default users are present (e.g. student@skillproof.ai)
        defaultUsers.forEach((defU) => {
          if (!store.users.some((u) => u.email.toLowerCase() === defU.email.toLowerCase())) {
            store.users.unshift(defU);
          }
        });
        if (!store.studentProfiles) store.studentProfiles = {};
        if (!store.studentProfiles['660000000000000000000001']) {
          store.studentProfiles['660000000000000000000001'] = defaultStudentProfile;
        }
        if (!store.passports) store.passports = {};
        if (!store.passports['660000000000000000000001']) {
          store.passports['660000000000000000000001'] = defaultPassport;
        }
        // Ensure assessments has all 6 domains and all 30 questions each with 40 mins duration
        const storeTotalQ = (store.assessments || []).reduce((acc, a) => acc + (a.questions?.length || 0), 0);
        const expandedTotalQ = expandedAssessments.reduce((acc, a) => acc + (a.questions?.length || 0), 0);
        const hasMismatchDuration = (store.assessments || []).some((a) => a.durationMinutes !== 40);
        if (!store.assessments || store.assessments.length < expandedAssessments.length || storeTotalQ < expandedTotalQ || hasMismatchDuration) {
          store.assessments = expandedAssessments;
        }
        // Ensure assessmentAttempts array is initialized
        if (!Array.isArray(store.assessmentAttempts)) {
          store.assessmentAttempts = defaultAssessmentAttempts;
        }
        saveStore();
        return;
      }
    }
    // Write defaults
    fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.warn('[FallbackStore] Using memory fallback:', err.message);
  }
}

function saveStore() {
  try {
    ensureDirExists(dataDir);
    fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('[FallbackStore Save Error]:', err.message);
  }
}

// Initialize on module load
loadStore();

// Export reactive references and getters
module.exports = {
  get fallbackUsers() {
    return store.users;
  },
  get fallbackStudentProfiles() {
    return store.studentProfiles;
  },
  get fallbackRecruiterProfiles() {
    return store.recruiterProfiles;
  },
  get fallbackPlacementProfiles() {
    return store.placementProfiles;
  },
  get fallbackPassports() {
    return store.passports;
  },
  get fallbackStudentProfile() {
    return store.studentProfiles['660000000000000000000001'] || defaultStudentProfile;
  },
  get fallbackRecruiterProfile() {
    return store.recruiterProfiles['660000000000000000000003'] || defaultRecruiterProfile;
  },
  get fallbackPlacementProfile() {
    return store.placementProfiles['660000000000000000000005'] || defaultPlacementProfile;
  },
  get fallbackPassport() {
    return store.passports['660000000000000000000001'] || defaultPassport;
  },
  get fallbackEvidence() {
    return store.evidence;
  },
  get fallbackJobs() {
    return store.jobs;
  },
  get fallbackAssessments() {
    return store.assessments;
  },
  get fallbackAssessmentAttempts() {
    if (!Array.isArray(store.assessmentAttempts)) {
      store.assessmentAttempts = defaultAssessmentAttempts;
    }
    return store.assessmentAttempts;
  },
  get fallbackDrives() {
    return store.drives;
  },
  get fallbackSkills() {
    return store.skills;
  },
  saveStore,
};
