require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail() {
  const user = process.env.EMAIL_USER;
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  console.log('Testing Gmail connection for:', user);
  if (!user || !pass) {
    console.error('ERROR: EMAIL_USER or EMAIL_PASS not configured in server/.env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    console.log('Verifying credentials with Gmail SMTP server...');
    await transporter.verify();
    console.log('SUCCESS: Gmail credentials verified!');

    console.log(`Sending test email to ${user}...`);
    const info = await transporter.sendMail({
      from: `SkillProof AI <${user}>`,
      to: user,
      subject: 'SkillProof AI - Test Email Verification',
      text: 'Congratulations! Your Gmail App Password is functioning properly and real OTP emails can now be delivered.',
    });
    console.log('SUCCESS: Test email sent! Message ID:', info.messageId);
  } catch (err) {
    console.error('FAILURE: Could not send email via Gmail:', err.message);
  }
}

testGmail();
