// Comprehensive, Production-Grade Assessment Question Bank for SkillProof AI
// Modular architecture: 6 technical domains with 30 in-depth questions each (180 questions total)

const fullStackAssessment = require('./domains/fullStack');
const dsaAssessment = require('./domains/dsa');
const backendAssessment = require('./domains/backend');
const frontendAssessment = require('./domains/frontend');
const devopsAssessment = require('./domains/devops');
const aiMlAssessment = require('./domains/aiMl');

const expandedAssessments = [
  fullStackAssessment,
  dsaAssessment,
  backendAssessment,
  frontendAssessment,
  devopsAssessment,
  aiMlAssessment,
];

/**
 * Shuffles an array in place (Fisher-Yates)
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Selects a randomized subset of questions for a student attempt
 * and randomizes the order of options within each question so test variations differ
 * between attempts and between student accounts.
 * 
 * @param {Object} assessment - Full assessment object
 * @param {Number} count - Number of questions to serve (default 30)
 * @returns {Array} Selected, randomized questions
 */
function getRandomizedQuestions(assessment, count = 30) {
  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return [];
  }

  // Shuffle question pool
  const shuffledPool = shuffleArray(assessment.questions);
  const selected = shuffledPool.slice(0, Math.min(count, assessment.questions.length));

  // Also randomize the option order for each selected question
  return selected.map((q) => {
    const shuffledOptions = shuffleArray(q.options);
    return {
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      codeSnippet: q.codeSnippet,
      points: q.points || 10,
      skillTag: q.skillTag,
      options: shuffledOptions,
    };
  });
}

module.exports = {
  expandedAssessments,
  getRandomizedQuestions,
  shuffleArray,
};
