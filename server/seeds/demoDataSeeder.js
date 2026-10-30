require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const PlacementOfficerProfile = require('../models/PlacementOfficerProfile');
const SkillPassport = require('../models/SkillPassport');
const Evidence = require('../models/Evidence');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Job = require('../models/Job');
const Application = require('../models/Application');
const HiringDrive = require('../models/HiringDrive');
const CompanyVerification = require('../models/CompanyVerification');

const seedData = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_PROD_SEED) {
    console.error('[SECURITY BLOCKED] Database seeding is strictly forbidden in production to prevent data loss.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillproof_ai';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seeder] Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await PlacementOfficerProfile.deleteMany({});
    await SkillPassport.deleteMany({});
    await Evidence.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentAttempt.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await HiringDrive.deleteMany({});
    await CompanyVerification.deleteMany({});

    console.log('[Seeder] Cleaned existing collections.');

    // 1. Create Placement Officer
    const officerUser = await User.create({
      email: 'officer@skillproof.ai',
      password: 'Password@123',
      fullName: 'Dr. Aris Thorne',
      role: 'placement_officer',
      isEmailVerified: true,
      status: 'active',
    });

    await PlacementOfficerProfile.create({
      user: officerUser._id,
      collegeName: 'National Institute of Technology',
      designation: 'Director of University Placements & Career Affairs',
      department: 'Central Placement Office',
      phone: '+91 98450 11223',
    });

    // Also support placement@skillproof.ai alias
    const placementAliasUser = await User.create({
      email: 'placement@skillproof.ai',
      password: 'Password@123',
      fullName: 'Dr. Aris Thorne',
      role: 'placement_officer',
      isEmailVerified: true,
      status: 'active',
    });

    await PlacementOfficerProfile.create({
      user: placementAliasUser._id,
      collegeName: 'National Institute of Technology',
      designation: 'Director of University Placements & Career Affairs',
      department: 'Central Placement Office',
      phone: '+91 98450 11223',
    });

    // 2. Create Approved Recruiter
    const recruiterUser = await User.create({
      email: 'recruiter@skillproof.ai',
      password: 'Password@123',
      fullName: 'Elena Rostova',
      role: 'recruiter',
      isEmailVerified: true,
      status: 'active',
    });

    const recruiterProfile = await RecruiterProfile.create({
      user: recruiterUser._id,
      companyName: 'Nexis Cloud & AI Labs',
      website: 'https://nexiscloud.io',
      officialEmail: 'elena@nexiscloud.io',
      registrationNumber: 'CIN-U72200KA2021PTC148892',
      industry: 'Enterprise Cloud Infrastructure & Generative AI',
      companySize: '201-500',
      location: 'Bangalore, India',
      about: 'Nexis builds enterprise-scale distributed systems, low-latency API gateways, and specialized AI reasoning models.',
      verificationStatus: 'approved',
      verificationStep: 2,
      verifiedAt: new Date(),
      verifiedBy: officerUser._id,
      verificationNotes: 'Corporate credentials, GST, and MCA records successfully verified by campus placement cell.',
    });

    await CompanyVerification.create({
      recruiter: recruiterUser._id,
      companyName: 'Nexis Cloud & AI Labs',
      officialEmail: 'elena@nexiscloud.io',
      website: 'https://nexiscloud.io',
      businessRegistrationNumber: 'CIN-U72200KA2021PTC148892',
      contactPersonName: 'Elena Rostova',
      contactPhone: '+91 91234 56789',
      status: 'approved',
      submissionStage: 2,
      reviewedBy: officerUser._id,
      reviewerName: 'Dr. Aris Thorne',
      reviewedAt: new Date(),
      reviewNotes: 'Verified against ministry registry.',
      domainMatchesEmail: true,
      history: [
        {
          status: 'approved',
          reviewer: 'Dr. Aris Thorne',
          comment: 'Corporate accreditation approved for campus recruitment.',
          timestamp: new Date(),
        },
      ],
    });

    // 3. Create Pending Recruiter (for officer to review)
    const pendingRecruiterUser = await User.create({
      email: 'pending@skillproof.ai',
      password: 'Password@123',
      fullName: 'Marcus Vance',
      role: 'recruiter',
      isEmailVerified: true,
      status: 'active',
    });

    await RecruiterProfile.create({
      user: pendingRecruiterUser._id,
      companyName: 'AeroByte Autonomous Systems',
      website: 'https://aerobyte.tech',
      officialEmail: 'marcus@aerobyte.tech',
      registrationNumber: 'CIN-U74999MH2023PTC398112',
      verificationStatus: 'pending',
      verificationStep: 2,
      location: 'Pune, India',
    });

    await CompanyVerification.create({
      recruiter: pendingRecruiterUser._id,
      companyName: 'AeroByte Autonomous Systems',
      officialEmail: 'marcus@aerobyte.tech',
      website: 'https://aerobyte.tech',
      businessRegistrationNumber: 'CIN-U74999MH2023PTC398112',
      contactPersonName: 'Marcus Vance',
      contactPhone: '+91 98111 22334',
      status: 'pending',
      submissionStage: 2,
      domainMatchesEmail: true,
      history: [
        {
          status: 'pending',
          reviewer: 'Marcus Vance',
          comment: 'Submitted business registration documents for on-campus recruitment eligibility.',
          timestamp: new Date(),
        },
      ],
    });

    // 4. Create Assessments
    const fullStackAssessment = await Assessment.create({
      title: 'Full Stack Web Engineering Assessment',
      domain: 'Full Stack Development',
      description: 'Proctored evaluation of React 18 concurrency, Node.js asynchronous architecture, REST API design, and database transactions.',
      durationMinutes: 15,
      passingScorePercentage: 70,
      difficulty: 'Intermediate',
      primarySkills: ['React', 'Node.js', 'Express.js', 'REST API', 'MongoDB'],
      questions: [
        {
          questionText: 'In React 18, what is the primary purpose of the useDeferredValue hook?',
          type: 'multiple_choice',
          points: 10,
          skillTag: 'React',
          explanation: 'useDeferredValue defers re-rendering non-urgent parts of the UI while keeping urgent user inputs responsive.',
          options: [
            { text: 'To debounce user keyboard events by an explicit millisecond delay', isCorrect: false },
            { text: 'To defer updating a part of the UI until higher priority rendering tasks finish', isCorrect: true },
            { text: 'To cancel ongoing network fetch promises during component unmount', isCorrect: false },
            { text: 'To synchronize state values across browser local storage', isCorrect: false },
          ],
        },
        {
          questionText: 'Consider this Express middleware snippet. What potential flaw occurs if next() is called before the promise resolves?',
          type: 'multiple_choice',
          codeSnippet: `app.use((req, res, next) => {\n  validateUserAsync(req.body);\n  next();\n});`,
          points: 10,
          skillTag: 'Express.js',
          explanation: 'Without awaiting the promise, downstream route handlers execute before asynchronous validation completes, causing race conditions.',
          options: [
            { text: 'The route handler will execute before validation concludes, allowing invalid data through', isCorrect: true },
            { text: 'Express will instantly throw a 500 UnhandledPromiseRejectionException', isCorrect: false },
            { text: 'The HTTP response headers will be permanently blocked', isCorrect: false },
            { text: 'Memory leak due to uncollected socket listeners', isCorrect: false },
          ],
        },
        {
          questionText: 'When designing a compound index in MongoDB for fields { status: 1, createdAt: -1 }, which query benefits most?',
          type: 'multiple_choice',
          points: 10,
          skillTag: 'MongoDB',
          explanation: 'Compound indexes follow Equality, Sort, Range (ESR). Equality on status and sort on createdAt is optimal.',
          options: [
            { text: 'db.orders.find({ status: "active" }).sort({ createdAt: -1 })', isCorrect: true },
            { text: 'db.orders.find().sort({ status: -1 })', isCorrect: false },
            { text: 'db.orders.find({ createdAt: { $gt: date } }).sort({ status: 1 })', isCorrect: false },
            { text: 'db.orders.find({ totalAmount: { $gt: 100 } })', isCorrect: false },
          ],
        },
        {
          questionText: 'Which HTTP status code is most appropriate when a JWT token signature is expired or malformed?',
          type: 'multiple_choice',
          points: 10,
          skillTag: 'REST API',
          explanation: '401 Unauthorized denotes missing or invalid authentication credentials.',
          options: [
            { text: '400 Bad Request', isCorrect: false },
            { text: '401 Unauthorized', isCorrect: true },
            { text: '403 Forbidden', isCorrect: false },
            { text: '422 Unprocessable Entity', isCorrect: false },
          ],
        },
      ],
    });

    const dsaAssessment = await Assessment.create({
      title: 'Data Structures & Algorithmic Problem Solving',
      domain: 'Data Structures & Algorithms',
      description: 'Rigorous assessment covering time complexities, hash tables, binary trees, dynamic programming, and amortized bounds.',
      durationMinutes: 20,
      passingScorePercentage: 70,
      difficulty: 'Intermediate',
      primarySkills: ['Data Structures & Algorithms', 'JavaScript'],
      questions: [
        {
          questionText: 'What is the amortized time complexity of inserting n elements into a dynamic array (like JavaScript Array or C++ std::vector)?',
          type: 'multiple_choice',
          points: 10,
          skillTag: 'Data Structures & Algorithms',
          explanation: 'Geometric resizing ensures that n appends cost O(n) total operations, giving an amortized cost of O(1) per insertion.',
          options: [
            { text: 'O(1) amortized', isCorrect: true },
            { text: 'O(n) amortized', isCorrect: false },
            { text: 'O(log n) amortized', isCorrect: false },
            { text: 'O(n^2) worst case', isCorrect: false },
          ],
        },
        {
          questionText: 'In a Min-Heap containing N nodes, what is the worst-case time complexity of the extractMin() operation?',
          type: 'multiple_choice',
          points: 10,
          skillTag: 'Data Structures & Algorithms',
          explanation: 'extractMin replaces the root with the last leaf and sifts down along the height of the tree, taking O(log N).',
          options: [
            { text: 'O(1)', isCorrect: false },
            { text: 'O(log N)', isCorrect: true },
            { text: 'O(N)', isCorrect: false },
            { text: 'O(N log N)', isCorrect: false },
          ],
        },
      ],
    });

    // 5. Create Star Student (Placement Ready)
    const starStudentUser = await User.create({
      email: 'student@skillproof.ai',
      password: 'Password@123',
      fullName: 'Aarav Mehta',
      role: 'student',
      isEmailVerified: true,
      status: 'active',
    });

    const starStudentProfile = await StudentProfile.create({
      user: starStudentUser._id,
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
    });

    // Create Dhatchanamoorthy P Student Account
    const dhatchanaStudentUser = await User.create({
      email: 'palanidhatchana@gmail.com',
      password: 'Password@123',
      fullName: 'Dhatchanamoorthy p',
      role: 'student',
      isEmailVerified: true,
      status: 'active',
    });

    await StudentProfile.create({
      user: dhatchanaStudentUser._id,
      rollNumber: '510123104012',
      collegeName: 'Adhiparasakthi College Of Engineering',
      degree: 'B.E. - Bachelor of Engineering',
      department: 'Computer Science & Engineering',
      batch: '2027',
      cgpa: 7.71,
      phone: '9344193523',
      bio: 'Aspiring Full Stack Developer',
      targetRole: 'Full Stack Developer',
      profileCompletion: 80,
      placementStatus: 'unplaced',
      resumeUrl: '/uploads/1792159012665-340265571-resume_DHATCHANA.pdf',
    });

    // Evidence for Star Student
    const projectEvidence = await Evidence.create({
      student: starStudentUser._id,
      type: 'project',
      title: 'Distributed Real-Time Collaborative Workspace',
      description: 'Engineered a concurrent collaborative markdown document editor using WebSockets, CRDTs, Redis cache, and MongoDB persistence. Handled 5k simultaneous sockets.',
      associatedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'JavaScript'],
      externalUrl: 'https://github.com/aarav-mehta-dev/collab-doc-engine',
      verificationStatus: 'verified',
      verifiedBy: officerUser._id,
      verifiedAt: new Date(),
      verificationNotes: 'Code repository audited by faculty. Architectural pattern and test suite validated.',
      verificationAudit: [
        {
          status: 'verified',
          actionBy: 'Dr. Aris Thorne',
          note: 'Audited Git commit history, tests, and architectural soundness.',
          timestamp: new Date(),
        },
      ],
    });

    const certEvidence = await Evidence.create({
      student: starStudentUser._id,
      type: 'certification',
      title: 'AWS Certified Solutions Architect Associate',
      description: 'Official credential verifying distributed VPC design, IAM policies, and cloud infrastructure resiliency.',
      associatedSkills: ['AWS', 'Docker'],
      externalUrl: 'https://aws.amazon.com/verification/cred-123456',
      issuingOrganization: 'Amazon Web Services',
      verificationStatus: 'verified',
      verifiedBy: officerUser._id,
      verifiedAt: new Date(),
      verificationNotes: 'Digital badge verified via Credly provider.',
    });

    // Assessment Attempt for Star Student
    const starAttempt = await AssessmentAttempt.create({
      student: starStudentUser._id,
      assessment: fullStackAssessment._id,
      startedAt: new Date(Date.now() - 3600000),
      submittedAt: new Date(Date.now() - 3000000),
      expiresAt: new Date(Date.now() - 2500000),
      status: 'completed',
      totalPoints: 40,
      earnedPoints: 40,
      scorePercentage: 100,
      passed: true,
      violationCount: 0,
      proctorFlag: false,
      proctorSummary: 'Zero fullscreen exits or focus deviations logged.',
    });

    // Skill Passport for Star Student
    await SkillPassport.create({
      student: starStudentUser._id,
      skills: [
        {
          skillName: 'React',
          normalizedName: 'react',
          category: 'Frontend',
          status: 'verified',
          proficiency: 'Advanced',
          assessmentScore: 100,
          assessmentAttemptId: starAttempt._id,
          evidenceRefs: [projectEvidence._id],
          statusReason: 'Assessed with 100% score on Full Stack Assessment and verified in live GitHub project.',
        },
        {
          skillName: 'Node.js',
          normalizedName: 'node.js',
          category: 'Backend',
          status: 'verified',
          proficiency: 'Advanced',
          assessmentScore: 100,
          assessmentAttemptId: starAttempt._id,
          evidenceRefs: [projectEvidence._id],
          statusReason: 'Demonstrated in production-ready collaborative backend service and verified by placement cell.',
        },
        {
          skillName: 'MongoDB',
          normalizedName: 'mongodb',
          category: 'Database',
          status: 'demonstrated',
          proficiency: 'Intermediate',
          evidenceRefs: [projectEvidence._id],
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
          evidenceRefs: [projectEvidence._id],
          statusReason: 'Verified across project codebase and assessment rounds.',
        },
        {
          skillName: 'AWS',
          normalizedName: 'aws',
          category: 'DevOps & Cloud',
          status: 'verified',
          proficiency: 'Intermediate',
          evidenceRefs: [certEvidence._id],
          statusReason: 'Verified through official AWS credential.',
        },
      ],
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
    });

    // 6. Create At-Risk Student (Triggers Placement Early Alert)
    const atRiskStudentUser = await User.create({
      email: 'atrisk@skillproof.ai',
      password: 'Password@123',
      fullName: 'Rohan Verma',
      role: 'student',
      isEmailVerified: true,
      status: 'active',
    });

    await StudentProfile.create({
      user: atRiskStudentUser._id,
      rollNumber: '2022CSB1089',
      collegeName: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      batch: '2026',
      cgpa: 7.2,
      bio: '',
      targetRole: 'Backend Developer',
      profileCompletion: 45,
      placementStatus: 'unplaced',
      mentoringNotes: [
        {
          note: 'Initial placement review: Missing portfolio repository and has not yet attempted the backend technical assessment.',
          addedBy: officerUser._id,
          officerName: 'Dr. Aris Thorne',
          date: new Date(),
        },
      ],
    });

    await SkillPassport.create({
      student: atRiskStudentUser._id,
      skills: [
        {
          skillName: 'Java',
          normalizedName: 'java',
          category: 'Languages',
          status: 'claimed',
          proficiency: 'Beginner',
          statusReason: 'Claimed during initial profile setup.',
        },
        {
          skillName: 'SQL',
          normalizedName: 'sql',
          category: 'Database',
          status: 'claimed',
          proficiency: 'Beginner',
          statusReason: 'Claimed during initial profile setup.',
        },
      ],
      jobReadinessIndex: 38,
      readinessTier: 'Needs Immediate Support',
      readinessBreakdown: {
        assessedScore: 0,
        demonstratedScore: 5,
        verifiedScore: 0,
        profileCompletenessScore: 33,
      },
      actionableSuggestions: [
        {
          text: 'Complete your first skill assessment to validate claimed proficiencies.',
          actionType: 'assessment',
          targetSkill: 'Java & Data Structures',
        },
        {
          text: 'Submit code repositories for placement officer review to substantiate skills.',
          actionType: 'evidence',
          targetSkill: 'Practical Evidence',
        },
      ],
    });

    // 7. Create Active Jobs
    const job1 = await Job.create({
      recruiter: recruiterUser._id,
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
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 1,
    });

    const job2 = await Job.create({
      recruiter: recruiterUser._id,
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
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 0,
    });

    // 8. Create Application Record
    await Application.create({
      job: job1._id,
      student: starStudentUser._id,
      recruiter: recruiterUser._id,
      matchScore: 92,
      matchBreakdown: {
        matchedRequiredSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
        missingRequiredSkills: [],
        matchedPreferredSkills: ['AWS', 'REST API'],
        assessedScoreAverage: 100,
        evidenceStrength: 'Strong',
        explanation: 'Exceptional match! Candidate covers all 4 required skills with verified and assessed evidence, plus AWS cloud credentials.',
      },
      status: 'shortlisted',
      interviewSchedule: {
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        mode: 'Google Meet',
        meetingLink: 'https://meet.google.com/xyz-skillproof-demo',
        roundName: 'Technical Architecture & Code Evaluation',
        notes: 'Candidate demonstrated verified collaborative workspace project.',
      },
      recruiterFeedback: 'Strong candidate with verified evidence portfolio. Shortlisted for Round 1.',
      timeline: [
        {
          stage: 'applied',
          updatedBy: 'Aarav Mehta',
          note: 'Application submitted with 92% SkillProof match score.',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          stage: 'shortlisted',
          updatedBy: 'Elena Rostova',
          note: 'Candidate verified passport passed automated recruitment screening.',
          timestamp: new Date(Date.now() - 43200000),
        },
      ],
    });

    // 9. Create Hiring Drive
    await HiringDrive.create({
      title: 'Spring 2026 Premier Tech Campus Drive',
      collegeName: 'National Institute of Technology',
      batch: '2026',
      description: 'Exclusive on-campus recruitment drive featuring enterprise cloud infrastructure and product engineering companies.',
      eligibleDepartments: [
        'Computer Science & Engineering',
        'Information Technology',
        'Artificial Intelligence & Data Science',
      ],
      minCgpa: 7.5,
      minJobReadinessIndex: 70,
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participatingCompanies: [
        {
          companyName: 'Nexis Cloud & AI Labs',
          recruiter: recruiterUser._id,
          jobs: [job1._id, job2._id],
        },
      ],
      registeredStudents: [
        {
          student: starStudentUser._id,
          registeredAt: new Date(),
        },
      ],
      status: 'upcoming',
      createdBy: officerUser._id,
    });

    console.log('[Seeder] ========================================');
    console.log('[Seeder] Demo database successfully seeded!');
    console.log('[Seeder] Credentials:');
    console.log('[Seeder] - Student:           student@skillproof.ai   / Password@123');
    console.log('[Seeder] - At-Risk Student:   atrisk@skillproof.ai    / Password@123');
    console.log('[Seeder] - Recruiter:         recruiter@skillproof.ai / Password@123');
    console.log('[Seeder] - Pending Recruiter: pending@skillproof.ai   / Password@123');
    console.log('[Seeder] - Placement Officer: officer@skillproof.ai   / Password@123');
    console.log('[Seeder] ========================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
