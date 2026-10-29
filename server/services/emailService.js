const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const EmailVerification = require('../models/EmailVerification');

// Constants
const OTP_EXPIRY_MS = 60 * 1000; // 60 seconds expiration
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown
const MAX_ATTEMPTS = 5;

// In-memory fallback verification cache: email -> record
const memoryStore = new Map();

// Helper to normalize email
const normalize = (email) => (email || '').trim().toLowerCase();

// Hash OTP with email salt for secure storage (never store plain-text OTPs)
const hashOtp = (otp, email) => {
  const secret = process.env.JWT_SECRET || 'ephemeral_dev_salt';
  return crypto.createHash('sha256').update(`${otp.trim()}:${normalize(email)}:${secret}`).digest('hex');
};

/**
 * Configure Nodemailer Transporter supporting Brevo, Resend, Gmail, or Custom SMTP
 */
const createTransporter = () => {
  // 1. Brevo (Sendinblue)
  if (process.env.BREVO_API_KEY) {
    const user = process.env.BREVO_USER || process.env.EMAIL_USER || 'apikey';
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user,
        pass: process.env.BREVO_API_KEY.trim(),
      },
    });
  }

  // 2. Resend
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY.trim(),
      },
    });
  }

  // 3. Gmail App Password
  const gmailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const gmailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.trim(),
        pass: gmailPass.replace(/\s+/g, ''),
      },
    });
  }

  // 4. Custom SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim(),
      },
    });
  }

  return null;
};

/**
 * Retrieve verification record from MongoDB or fallback memory
 */
const getRecord = async (email) => {
  const normalizedEmail = normalize(email);
  if (mongoose.connection.readyState === 1) {
    return await EmailVerification.findOne({ email: normalizedEmail });
  }
  return memoryStore.get(normalizedEmail) || null;
};

/**
 * Save or update verification record
 */
const saveRecord = async (email, data) => {
  const normalizedEmail = normalize(email);
  if (mongoose.connection.readyState === 1) {
    return await EmailVerification.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: data },
      { upsert: true, new: true }
    );
  }
  const existing = memoryStore.get(normalizedEmail) || {};
  const updated = { ...existing, email: normalizedEmail, ...data };
  memoryStore.set(normalizedEmail, updated);
  return updated;
};

/**
 * Delete verification record
 */
const deleteRecord = async (email) => {
  const normalizedEmail = normalize(email);
  if (mongoose.connection.readyState === 1) {
    await EmailVerification.deleteOne({ email: normalizedEmail });
  }
  memoryStore.delete(normalizedEmail);
};

/**
 * Generate a random 6-digit OTP, enforce cooldown, and send via email provider
 */
const generateAndSendOtp = async (email) => {
  const normalizedEmail = normalize(email);
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('A valid email address is required.');
  }

  const now = Date.now();
  const existing = await getRecord(normalizedEmail);

  // Enforce Resend Cooldown (30-60s)
  if (existing && existing.lastSentAt) {
    const timeSinceLastSent = now - new Date(existing.lastSentAt).getTime();
    if (timeSinceLastSent < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLastSent) / 1000);
      const err = new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP.`);
      err.statusCode = 429;
      err.cooldownRemaining = waitSeconds;
      throw err;
    }
  }

  // Generate cryptographically random 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();
  const hashedCode = hashOtp(code, normalizedEmail);
  const expiresAt = new Date(now + OTP_EXPIRY_MS);

  // Invalidate any previous OTP by replacing with the new hashed code and resetting attempts
  await saveRecord(normalizedEmail, {
    hashedOtp: hashedCode,
    expiresAt,
    lastSentAt: new Date(now),
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    isVerified: false,
    verificationToken: '',
  });

  const transporter = createTransporter();
  let emailDispatched = false;

  console.log(`\n======================================================`);
  console.log(`[SECURE EMAIL OTP SERVICE]`);
  console.log(`Recipient : ${normalizedEmail}`);
  console.log(`Status    : Dispathing 6-digit OTP`);
  console.log(`Expires In: 60 seconds (${new Date(expiresAt).toLocaleTimeString()})`);
  console.log(`======================================================\n`);

  if (!transporter) {
    console.warn(`[SECURE EMAIL OTP SERVICE] Email provider credentials not yet configured in server/.env.`);
    console.warn(`To deliver real emails to ${normalizedEmail}, please set EMAIL_USER and EMAIL_PASS (Gmail App Password) in server/.env.`);
  } else {
    const sender =
      process.env.EMAIL_FROM ||
      process.env.BREVO_USER ||
      process.env.EMAIL_USER ||
      'SkillProof AI <no-reply@skillproof.ai>';

    const mailOptions = {
      from: sender,
      to: normalizedEmail,
      subject: `Your SkillProof AI Verification Code: ${code}`,
      text: `Your SkillProof AI verification code is ${code}. It expires in 60 seconds. Do not share this code with anyone.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #6366f1); color: #ffffff; padding: 10px 18px; border-radius: 10px; font-weight: 800; font-size: 1.25rem; letter-spacing: -0.5px;">
              SkillProof AI
            </div>
            <h2 style="color: #0f172a; margin: 18px 0 6px; font-size: 1.5rem; font-weight: 800;">Verify Your Email Address</h2>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">Complete your account registration</p>
          </div>

          <div style="padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; margin-bottom: 24px;">
            <p style="color: #334155; font-size: 0.95rem; margin: 0 0 16px; font-weight: 500;">
              Enter the following 6-digit One-Time Password (OTP) on the verification page:
            </p>
            <div style="font-size: 2.5rem; font-weight: 800; letter-spacing: 10px; color: #1e293b; background: #ffffff; padding: 14px 24px; border-radius: 10px; border: 2px dashed #93c5fd; display: inline-block; margin: 0 auto;">
              ${code}
            </div>
            <p style="color: #dc2626; font-size: 0.85rem; margin: 16px 0 0; font-weight: 600;">
              &#9201; This code expires in 60 seconds.
            </p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 0.825rem; color: #94a3b8; text-align: center; line-height: 1.5;">
            <p style="margin: 0 0 8px;">If you did not initiate this registration request, please disregard this email. Never share your OTP with anyone.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} SkillProof AI Platform. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      emailDispatched = true;
      console.log(`[SECURE EMAIL OTP SERVICE] Real email delivered to ${normalizedEmail}`);
    } catch (sendErr) {
      console.error(`[SECURE EMAIL OTP SERVICE ERROR] Delivery failed: ${sendErr.message}`);
    }
  }

  // Never log raw OTP codes in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG OTP] Code generated for ${normalizedEmail}: [${code}] (Dev mode only)`);
  }

  return {
    success: true,
    email: normalizedEmail,
    expiresInSeconds: 60,
    cooldownSeconds: 30,
    emailDispatched,
  };
};

/**
 * Verify submitted OTP against hashed storage
 */
const verifyOtp = async (email, inputOtp) => {
  const normalizedEmail = normalize(email);
  if (!normalizedEmail || !inputOtp) {
    return {
      success: false,
      statusCode: 400,
      message: 'Please provide both email address and 6-digit OTP code.',
    };
  }

  const record = await getRecord(normalizedEmail);

  if (!record || !record.hashedOtp) {
    return {
      success: false,
      statusCode: 400,
      message: 'No verification code was requested for this email. Please request a new OTP.',
    };
  }

  // Check 5-minute expiration
  const now = Date.now();
  if (now > new Date(record.expiresAt).getTime()) {
    await deleteRecord(normalizedEmail);
    return {
      success: false,
      statusCode: 400,
      message: 'OTP expired. Please request a new verification code.',
    };
  }

  // Check Max Attempts (5 attempts)
  const currentAttempts = record.attempts || 0;
  if (currentAttempts >= MAX_ATTEMPTS) {
    await deleteRecord(normalizedEmail);
    return {
      success: false,
      statusCode: 400,
      message: 'Maximum verification attempts exceeded. Please request a new OTP.',
    };
  }

  // Compare Hashed OTP
  const expectedHash = hashOtp(inputOtp, normalizedEmail);
  if (record.hashedOtp !== expectedHash) {
    const updatedAttempts = currentAttempts + 1;
    const remainingAttempts = MAX_ATTEMPTS - updatedAttempts;

    if (remainingAttempts <= 0) {
      await deleteRecord(normalizedEmail);
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid OTP. Maximum attempts exceeded. Please request a new OTP.',
      };
    }

    await saveRecord(normalizedEmail, { attempts: updatedAttempts });
    return {
      success: false,
      statusCode: 400,
      message: `Invalid OTP. You have ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`,
      remainingAttempts,
    };
  }

  // Successful verification: generate a secure short-lived verificationToken
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await saveRecord(normalizedEmail, {
    isVerified: true,
    verificationToken,
    attempts: 0,
    // Extend expiration for 15 minutes to allow user to complete registration form if needed
    expiresAt: new Date(now + 15 * 60 * 1000),
  });

  return {
    success: true,
    message: 'Email verified successfully.',
    verificationToken,
  };
};

/**
 * Validate that an email has been verified before account creation
 */
const validateVerificationStatus = async (email, verificationToken, otp) => {
  const normalizedEmail = normalize(email);

  // If OTP directly provided, verify it on the spot
  if (otp) {
    const verifyResult = await verifyOtp(normalizedEmail, otp);
    return verifyResult.success;
  }

  const record = await getRecord(normalizedEmail);
  if (!record) return false;

  // Check if verified and not expired
  if (
    record.isVerified === true &&
    Date.now() <= new Date(record.expiresAt).getTime()
  ) {
    if (verificationToken) {
      return record.verificationToken === verificationToken;
    }
    return true;
  }

  return false;
};

/**
 * Consume and delete verification state after successful user account creation
 */
const consumeVerifiedEmail = async (email) => {
  await deleteRecord(email);
};

module.exports = {
  generateAndSendOtp,
  verifyOtp,
  validateVerificationStatus,
  consumeVerifiedEmail,
};
