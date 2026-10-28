const { createObjectCsvStringifier } = require('csv-writer');

/**
 * Generates CSV string for placement reports
 */
const generatePlacementCsv = async (studentList = [], stats = {}) => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'rollNumber', title: 'ROLL NUMBER' },
      { id: 'fullName', title: 'STUDENT NAME' },
      { id: 'department', title: 'DEPARTMENT' },
      { id: 'cgpa', title: 'CGPA' },
      { id: 'jobReadinessIndex', title: 'JOB READINESS INDEX (%)' },
      { id: 'readinessTier', title: 'READINESS TIER' },
      { id: 'skillsCount', title: 'DEMONSTRATED SKILLS' },
      { id: 'placementStatus', title: 'PLACEMENT STATUS' },
      { id: 'placedCompany', title: 'PLACED COMPANY' },
    ],
  });

  const records = studentList.map((item) => ({
    rollNumber: item.rollNumber || 'N/A',
    fullName: item.fullName || 'Student',
    department: item.department || 'Computer Science',
    cgpa: item.cgpa || 8.0,
    jobReadinessIndex: item.jobReadinessIndex || 50,
    readinessTier: item.readinessTier || 'Developing',
    skillsCount: item.skillsCount || 0,
    placementStatus: (item.placementStatus || 'unplaced').toUpperCase(),
    placedCompany: item.placedCompany || 'None',
  }));

  const header = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(records);

  return header + body;
};

module.exports = {
  generatePlacementCsv,
};
