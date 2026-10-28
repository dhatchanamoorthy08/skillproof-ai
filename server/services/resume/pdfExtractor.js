const fs = require('fs');
const pdf = require('pdf-parse');
const { extractSkillsFromText } = require('../matching/skillNormalizer');

/**
 * Parses uploaded resume PDF and extracts structured information
 * @param {String} filePath - Absolute or relative path to PDF file
 */
const extractResumeData = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    const fullText = pdfData.text || '';

    // 1. Extract technical skills
    const detectedSkills = extractSkillsFromText(fullText);

    // 2. Section detection via heuristic line inspection
    const lines = fullText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const sections = {
      skills: detectedSkills,
      education: [],
      projects: [],
      experience: [],
    };

    let currentSection = '';
    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (/education|academic/i.test(lower) && line.length < 30) {
        currentSection = 'education';
      } else if (/project|academic project|personal project/i.test(lower) && line.length < 35) {
        currentSection = 'projects';
      } else if (/experience|internship|work experience/i.test(lower) && line.length < 35) {
        currentSection = 'experience';
      } else if (/certificat/i.test(lower) && line.length < 30) {
        currentSection = 'certifications';
      } else if (currentSection && line.length > 5) {
        if (currentSection === 'education' && sections.education.length < 5) {
          sections.education.push(line);
        } else if (currentSection === 'projects' && sections.projects.length < 6) {
          sections.projects.push(line);
        } else if (currentSection === 'experience' && sections.experience.length < 5) {
          sections.experience.push(line);
        }
      }
    });

    // 3. Completeness score
    let score = 40;
    const atsFeedback = [];

    if (detectedSkills.length >= 6) {
      score += 25;
      atsFeedback.push(`Found ${detectedSkills.length} normalized technical skills.`);
    } else {
      score += detectedSkills.length * 3;
      atsFeedback.push('Consider listing more industry-standard technical skills with version/framework specifics.');
    }

    if (sections.projects.length > 0) {
      score += 15;
      atsFeedback.push('Project section detected. Ensure each project has measurable impact (e.g. latency, user volume).');
    } else {
      atsFeedback.push('No distinct project section detected. Add at least 2 hands-on production or academic projects.');
    }

    if (sections.education.length > 0) {
      score += 10;
    } else {
      atsFeedback.push('Degree or university information should be formatted under a clear Education header.');
    }

    if (/github\.com/i.test(fullText)) {
      score += 5;
      atsFeedback.push('Verified presence of GitHub repository link for code evidence.');
    } else {
      atsFeedback.push('Missing public GitHub or portfolio link. Recruiters heavily prioritize verifiable code links.');
    }

    if (/linkedin\.com/i.test(fullText)) {
      score += 5;
    }

    const completenessScore = Math.min(score, 100);

    return {
      rawTextLength: fullText.length,
      extractedSkills: detectedSkills,
      extractedEducation: sections.education.slice(0, 3),
      extractedProjects: sections.projects.slice(0, 4),
      extractedExperience: sections.experience.slice(0, 3),
      completenessScore,
      atsFeedback,
      parsedAt: new Date(),
    };
  } catch (error) {
    console.error('[Resume Extractor Error]:', error);
    throw new Error(`Failed to parse resume PDF: ${error.message}`);
  }
};

module.exports = {
  extractResumeData,
};
