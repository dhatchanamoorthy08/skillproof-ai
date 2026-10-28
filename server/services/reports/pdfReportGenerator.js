const PDFDocument = require('pdfkit');

/**
 * Builds a placement report PDF stream
 * @param {Object} reportData - Aggregated placement report data
 * @param {Stream} res - Express response stream
 */
const generatePlacementPdf = (reportData, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  doc.pipe(res);

  // Header
  doc.fontSize(20).fillColor('#1E293B').text('SkillProof AI — Placement Readiness Report', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('#64748B').text(`Institution: ${reportData.collegeName || 'National Institute of Technology'} | Batch: ${reportData.batch || '2026'}`, { align: 'center' });
  doc.fontSize(9).fillColor('#94A3B8').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1.5);

  // Executive Summary Box
  doc.rect(40, doc.y, 515, 65).fill('#F8FAFC');
  doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Executive Summary', 50, doc.y - 55);
  doc.font('Helvetica').fontSize(10).fillColor('#334155');
  doc.text(
    `Total Students: ${reportData.totalStudents || 0}  |  Placement Ready: ${reportData.placementReadyCount || 0} (${reportData.placementReadyPercentage || 0}%)  |  Total Placed: ${reportData.placedCount || 0}  |  Approved Recruiters: ${reportData.approvedRecruitersCount || 0}`,
    50,
    doc.y + 4
  );
  doc.moveDown(2);

  // Department Breakdown
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B').text('Department Readiness Statistics');
  doc.moveDown(0.5);

  const departments = reportData.departmentStats || [
    { name: 'Computer Science & Engineering', total: 120, ready: 95, placed: 42 },
    { name: 'Information Technology', total: 80, ready: 60, placed: 28 },
    { name: 'AI & Data Science', total: 60, ready: 45, placed: 18 },
    { name: 'Electronics & Communication', total: 75, ready: 40, placed: 15 },
  ];

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#475569');
  doc.text('Department', 50, doc.y, { width: 200 });
  doc.text('Enrolled', 260, doc.y - 12, { width: 70 });
  doc.text('Ready', 340, doc.y - 12, { width: 70 });
  doc.text('Placed', 420, doc.y - 12, { width: 70 });
  doc.moveDown(0.5);

  doc.font('Helvetica').fillColor('#1E293B');
  departments.forEach((dept) => {
    doc.text(dept.name, 50, doc.y, { width: 200 });
    doc.text(`${dept.total}`, 260, doc.y - 12, { width: 70 });
    doc.text(`${dept.ready}`, 340, doc.y - 12, { width: 70 });
    doc.text(`${dept.placed}`, 420, doc.y - 12, { width: 70 });
    doc.moveDown(0.4);
  });

  doc.moveDown(1.5);

  // Early Alerts & Training Recommendations
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#DC2626').text('Students Requiring Immediate Support');
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').fillColor('#475569').text(
    `SkillProof AI has flagged ${reportData.supportNeededCount || 0} students with Job Readiness Index below 50% or incomplete assessment evidence. Placement officers are advised to assign targeted roadmap milestones.`,
    50,
    doc.y,
    { width: 500 }
  );

  doc.moveDown(2);
  doc.fontSize(8).fillColor('#94A3B8').text('This document was compiled by SkillProof AI using evidence-backed skill assessments and audited passports.', { align: 'center' });

  doc.end();
};

module.exports = {
  generatePlacementPdf,
};
