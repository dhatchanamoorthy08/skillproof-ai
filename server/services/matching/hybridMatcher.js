const { normalizeSkill } = require('./skillNormalizer');

// Evidence weights for skill states
const STATUS_WEIGHTS = {
  claimed: 0.3,
  demonstrated: 0.85,
  assessed: 0.95,
  verified: 1.0,
};

/**
 * Calculates Job Readiness Index (JRI) for a student
 * @param {Array} skills - List of skill items from SkillPassport
 * @param {Array} evidenceList - List of evidence documents
 * @param {Number} profileCompletion - Percentage 0-100
 */
const calculateJobReadinessIndex = (skills = [], evidenceList = [], profileCompletion = 50) => {
  if (!skills || skills.length === 0) {
    return {
      score: Math.min(Math.round(profileCompletion * 0.3), 30),
      tier: 'Needs Immediate Support',
      breakdown: {
        assessedScore: 0,
        demonstratedScore: 0,
        verifiedScore: 0,
        profileCompletenessScore: Math.round(profileCompletion * 0.15),
      },
      suggestions: [
        {
          text: 'Complete your first skill assessment to prove competency.',
          actionType: 'assessment',
          targetSkill: 'Data Structures & Algorithms',
        },
        {
          text: 'Upload project repository evidence for your core technical skills.',
          actionType: 'evidence',
          targetSkill: 'Full Stack Development',
        },
      ],
    };
  }

  // 1. Assessed component (weight 0.35)
  const assessedSkills = skills.filter((s) => s.status === 'assessed' || s.assessmentScore != null);
  let avgAssessmentScore = 0;
  if (assessedSkills.length > 0) {
    const totalAssess = assessedSkills.reduce((sum, s) => sum + (s.assessmentScore || 70), 0);
    avgAssessmentScore = totalAssess / assessedSkills.length;
  }
  const assessedComponent = Math.min((assessedSkills.length / 4) * 0.5 + (avgAssessmentScore / 100) * 0.5, 1.0) * 35;

  // 2. Demonstrated component (weight 0.25)
  const demonstratedSkills = skills.filter((s) => s.status === 'demonstrated' || s.status === 'verified');
  const projectEvidence = evidenceList.filter((e) => e.type === 'project' || e.type === 'internship');
  const demonstratedComponent = Math.min((demonstratedSkills.length / 5) * 0.5 + (projectEvidence.length / 3) * 0.5, 1.0) * 25;

  // 3. Verified component (weight 0.25)
  const verifiedSkills = skills.filter((s) => s.status === 'verified');
  const verifiedEvidence = evidenceList.filter((e) => e.verificationStatus === 'verified');
  const verifiedComponent = Math.min((verifiedSkills.length / 3) * 0.5 + (verifiedEvidence.length / 2) * 0.5, 1.0) * 25;

  // 4. Profile completeness (weight 0.15)
  const profileComponent = (profileCompletion / 100) * 15;

  const totalScore = Math.min(Math.round(assessedComponent + demonstratedComponent + verifiedComponent + profileComponent), 100);

  let tier = 'Developing';
  if (totalScore >= 75) {
    tier = 'Placement Ready';
  } else if (totalScore < 50) {
    tier = 'Needs Immediate Support';
  }

  // Generate actionable suggestions
  const suggestions = [];
  if (assessedSkills.length < 3) {
    suggestions.push({
      text: 'Take at least 2 more skill assessments to substantiate your claimed competencies.',
      actionType: 'assessment',
      targetSkill: 'Core Technical Assessment',
    });
  }
  if (verifiedSkills.length === 0) {
    suggestions.push({
      text: 'Submit code repositories and internship letters for placement officer verification.',
      actionType: 'evidence',
      targetSkill: 'Evidence Audit',
    });
  }
  if (profileCompletion < 80) {
    suggestions.push({
      text: 'Complete your profile bio, portfolio URL, and upload your latest resume PDF.',
      actionType: 'profile',
      targetSkill: 'Profile Details',
    });
  }

  return {
    score: totalScore,
    tier,
    breakdown: {
      assessedScore: Math.round(assessedComponent),
      demonstratedScore: Math.round(demonstratedComponent),
      verifiedScore: Math.round(verifiedComponent),
      profileCompletenessScore: Math.round(profileComponent),
    },
    suggestions,
  };
};

/**
 * Calculates explainable candidate match for a specific job posting
 * @param {Object} studentSkills - Array of student's passport skill objects
 * @param {Object} job - Job document with requiredSkills, preferredSkills, minCgpa
 * @param {Object} studentProfile - CGPA, batch, etc.
 */
const calculateJobMatch = (studentSkills = [], job, studentProfile = {}) => {
  const reqSkills = (job.requiredSkills || []).map(normalizeSkill);
  const prefSkills = (job.preferredSkills || []).map(normalizeSkill);

  const studentSkillMap = new Map();
  studentSkills.forEach((s) => {
    studentSkillMap.set(normalizeSkill(s.skillName), s);
  });

  const matchedRequired = [];
  const missingRequired = [];
  let requiredPoints = 0;

  reqSkills.forEach((req) => {
    if (studentSkillMap.has(req)) {
      const s = studentSkillMap.get(req);
      const weight = STATUS_WEIGHTS[s.status] || 0.3;
      matchedRequired.push({
        skillName: req,
        status: s.status,
        weight,
        assessmentScore: s.assessmentScore,
      });
      requiredPoints += weight;
    } else {
      missingRequired.push(req);
    }
  });

  const matchedPreferred = [];
  prefSkills.forEach((pref) => {
    if (studentSkillMap.has(pref)) {
      const s = studentSkillMap.get(pref);
      matchedPreferred.push(pref);
    }
  });

  // Calculate required score percentage
  const reqScore = reqSkills.length > 0 ? (requiredPoints / reqSkills.length) * 70 : 50;

  // Preferred bonus (up to 15 points)
  const prefScore = prefSkills.length > 0 ? (matchedPreferred.length / prefSkills.length) * 15 : 10;

  // Assessment score quality bonus (up to 15 points)
  const assessedScores = matchedRequired
    .filter((m) => m.assessmentScore != null)
    .map((m) => m.assessmentScore);
  const avgAssessment = assessedScores.length > 0 ? assessedScores.reduce((a, b) => a + b, 0) / assessedScores.length : 60;
  const assessScore = (avgAssessment / 100) * 15;

  let totalMatchScore = Math.min(Math.round(reqScore + prefScore + assessScore), 100);

  // Check mandatory constraints
  let meetsCgpa = true;
  if (job.minCgpa && studentProfile.cgpa && studentProfile.cgpa < job.minCgpa) {
    meetsCgpa = false;
    totalMatchScore = Math.max(totalMatchScore - 15, 20);
  }

  // Formulate natural language explanation
  let explanation = '';
  if (missingRequired.length === 0) {
    explanation = `High match! Candidate possesses all ${reqSkills.length} required skills with verified or demonstrated evidence.`;
  } else {
    explanation = `Candidate covers ${matchedRequired.length} of ${reqSkills.length} required skills. Missing: ${missingRequired.join(', ')}.`;
  }

  if (!meetsCgpa) {
    explanation += ` Note: Candidate CGPA (${studentProfile.cgpa || 'N/A'}) is below job threshold (${job.minCgpa}).`;
  }

  return {
    matchScore: totalMatchScore,
    matchedRequiredSkills: matchedRequired.map((m) => m.skillName),
    missingRequiredSkills: missingRequired,
    matchedPreferredSkills: matchedPreferred,
    assessedScoreAverage: Math.round(avgAssessment),
    evidenceStrength: matchedRequired.some((m) => m.status === 'verified') ? 'Strong' : matchedRequired.length > 0 ? 'Moderate' : 'Unverified',
    explanation,
    meetsCgpa,
  };
};

module.exports = {
  STATUS_WEIGHTS,
  calculateJobReadinessIndex,
  calculateJobMatch,
};
