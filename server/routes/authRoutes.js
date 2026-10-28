const express = require('express');
const router = express.Router();
const { register, login, getMe, sendOtp, confirmOtp, getPincodeDetails } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Root /api/v1/auth info & quick links
router.get('/', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHtml) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkillProof AI — Authentication API</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
    .card { max-width: 620px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: #064e3b; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
    h1 { font-size: 1.6rem; font-weight: 800; margin: 16px 0 8px; }
    p { color: #94a3b8; font-size: 0.925rem; line-height: 1.5; margin: 0 0 24px; }
    .endpoints { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px 18px; margin-bottom: 24px; }
    .endpoint { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1e293b; font-family: monospace; font-size: 0.88rem; }
    .endpoint:last-child { border-bottom: none; }
    .method-post { color: #34d399; font-weight: 700; margin-right: 8px; }
    .method-get { color: #38bdf8; font-weight: 700; margin-right: 8px; }
    .desc { color: #94a3b8; font-family: sans-serif; font-size: 0.82rem; }
    .btn-group { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 0.925rem; }
    .btn-secondary { background: #334155; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Auth API Operational</div>
    <h1>Authentication &amp; Session API</h1>
    <p>This is the backend REST API for user accounts. To sign in or create a new account using the user interface, click below:</p>
    <div class="endpoints">
      <div class="endpoint"><span><span class="method-post">POST</span> /api/v1/auth/login</span><span class="desc">Sign In &amp; JWT</span></div>
      <div class="endpoint"><span><span class="method-post">POST</span> /api/v1/auth/register</span><span class="desc">Create Account</span></div>
      <div class="endpoint"><span><span class="method-get">GET</span> /api/v1/auth/me</span><span class="desc">Current Session</span></div>
    </div>
    <div class="btn-group">
      <a href="/login" class="btn">&rarr; Open Sign In Page (/login)</a>
      <a href="/register" class="btn btn-secondary">Create Account (/register)</a>
    </div>
  </div>
</body>
</html>`);
  }

  res.json({
    success: true,
    module: 'SkillProof AI Authentication API',
    endpoints: {
      login: { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate with email & password' },
      register: { method: 'POST', path: '/api/v1/auth/register', desc: 'Create new user account' },
      me: { method: 'GET', path: '/api/v1/auth/me', desc: 'Get current user profile (requires Bearer token)' },
    },
    webUi: {
      login: '/login',
      register: '/register',
    },
  });
});

const rateLimit = require('express-rate-limit');

// Rate Limiter for OTP Requests (10 requests per 15 minutes per IP)
const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many OTP requests from this IP. Please wait 15 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for OTP Verifications (20 attempts per 15 minutes per IP)
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many verification attempts. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const { isDashboardRestricted, RESTRICTION_MESSAGE } = require('../config/restriction');

// Restriction status check (public endpoint for frontend dynamic synchronization)
router.get('/restriction-status', (req, res) => {
  const restricted = isDashboardRestricted();
  res.json({
    success: true,
    restricted,
    message: restricted ? RESTRICTION_MESSAGE : null,
  });
});

// Automatic Indian PIN Code auto-detection endpoint
router.get('/pincode/:pincode', getPincodeDetails);

router.post('/send-otp', otpSendLimiter, sendOtp);
router.post('/verify-otp', otpVerifyLimiter, confirmOtp);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
