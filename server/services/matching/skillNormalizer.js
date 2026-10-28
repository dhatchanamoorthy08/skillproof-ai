// Comprehensive skill normalization dictionary and extractor

const SKILL_SYNONYMS = {
  // Frontend
  'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'vanilla js'],
  'typescript': ['ts', 'type-script'],
  'react': ['reactjs', 'react.js', 'react js'],
  'next.js': ['nextjs', 'next js', 'next'],
  'vue': ['vuejs', 'vue.js', 'vue 3'],
  'angular': ['angularjs', 'angular.io', 'angular 2+'],
  'html5': ['html', 'xhtml'],
  'css3': ['css', 'styling'],
  'tailwind css': ['tailwind', 'tailwindcss'],
  'redux': ['redux toolkit', 'rtk'],

  // Backend
  'node.js': ['nodejs', 'node js', 'node'],
  'express.js': ['expressjs', 'express'],
  'python': ['python3', 'py'],
  'django': ['django framework'],
  'fastapi': ['fast api'],
  'flask': ['flask py'],
  'java': ['java 17', 'java 21', 'core java'],
  'spring boot': ['springboot', 'spring-boot', 'spring framework'],
  'c++': ['cpp', 'c plus plus'],
  'c#': ['c-sharp', 'csharp', '.net'],
  'golang': ['go', 'go-lang'],
  'rest api': ['restful apis', 'restful api', 'rest apis', 'rest'],
  'graphql': ['graph-ql', 'apollo graphql'],

  // Databases
  'mongodb': ['mongo', 'nosql mongodb', 'mongoose'],
  'postgresql': ['postgres', 'psql', 'postgres db'],
  'mysql': ['my-sql', 'mariadb'],
  'redis': ['redis cache'],
  'sqlite': ['sqlite3'],

  // DevOps & Cloud
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s', 'kube'],
  'aws': ['amazon web services', 'amazon aws'],
  'azure': ['microsoft azure'],
  'git': ['github', 'gitlab', 'version control'],
  'ci/cd': ['github actions', 'jenkins', 'gitlab ci'],
  'linux': ['ubuntu', 'unix', 'bash scripting', 'shell scripting'],

  // AI & Data Science
  'machine learning': ['ml', 'applied ml'],
  'deep learning': ['dl', 'neural networks'],
  'tensorflow': ['tf'],
  'pytorch': ['torch'],
  'pandas': ['pandas library'],
  'numpy': ['numerical python'],
  'sql': ['relational databases', 'structured query language'],

  // Core CS
  'data structures & algorithms': ['dsa', 'data structures', 'algorithms'],
  'object-oriented programming': ['oops', 'oop', 'object oriented design'],
  'operating systems': ['os fundamentals'],
  'computer networks': ['networking', 'tcp/ip'],
  'system design': ['distributed systems', 'low level design', 'high level design'],
};

// Inverted lookup map
const NORMALIZED_LOOKUP = {};
Object.entries(SKILL_SYNONYMS).forEach(([canonical, aliases]) => {
  NORMALIZED_LOOKUP[canonical.toLowerCase()] = canonical;
  aliases.forEach((alias) => {
    NORMALIZED_LOOKUP[alias.toLowerCase()] = canonical;
  });
});

/**
 * Normalizes a given skill name to canonical form
 */
const normalizeSkill = (rawSkill) => {
  if (!rawSkill || typeof rawSkill !== 'string') return '';
  const clean = rawSkill.trim().toLowerCase();
  return NORMALIZED_LOOKUP[clean] || rawSkill.trim();
};

/**
 * Extracts recognized skills from freeform text
 */
const extractSkillsFromText = (text) => {
  if (!text || typeof text !== 'string') return [];
  const lowerText = text.toLowerCase();
  const matchedCanonical = new Set();

  Object.entries(SKILL_SYNONYMS).forEach(([canonical, aliases]) => {
    // Check canonical
    const regexCanonical = new RegExp(`\\b${escapeRegExp(canonical)}\\b`, 'i');
    if (regexCanonical.test(lowerText)) {
      matchedCanonical.add(canonical);
      return;
    }

    // Check aliases
    for (const alias of aliases) {
      const regexAlias = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'i');
      if (regexAlias.test(lowerText)) {
        matchedCanonical.add(canonical);
        break;
      }
    }
  });

  return Array.from(matchedCanonical);
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  SKILL_SYNONYMS,
  normalizeSkill,
  extractSkillsFromText,
};
