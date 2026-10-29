const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const placementRoutes = require('./routes/placementRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./middleware/errorHandler');
const sanitizeInput = require('./middleware/sanitize');

const app = express();

// Trust reverse proxy (Render, Cloudflare) for accurate client IP in express-rate-limit
app.set('trust proxy', 1);

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Enforce standard 100kb payload limit for JSON/urlencoded bodies (blocks payload DoS)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(sanitizeInput);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded documents with strict security headers (prevent XSS / sniffing)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    dotfiles: 'ignore',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
      res.setHeader('X-Frame-Options', 'DENY');
    },
  })
);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SkillProof AI Platform',
    timestamp: new Date().toISOString(),
  });
});

// Root API v1 Information Endpoint (prevents 'Cannot GET /api/v1')
app.get(['/api', '/api/v1', '/api/v1/'], (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHtml) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkillProof AI — Backend API Status</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
    .card { max-width: 640px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: #064e3b; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
    h1 { font-size: 1.6rem; font-weight: 800; margin: 16px 0 8px; }
    p { color: #94a3b8; font-size: 0.925rem; line-height: 1.5; margin: 0 0 24px; }
    .endpoints { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px 18px; margin-bottom: 24px; }
    .endpoint { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-family: monospace; font-size: 0.88rem; }
    .endpoint:last-child { border-bottom: none; }
    .path { color: #38bdf8; font-weight: 700; }
    .desc { color: #94a3b8; font-family: sans-serif; font-size: 0.82rem; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> REST API Online &amp; Operational</div>
    <h1>SkillProof AI &mdash; REST API v1</h1>
    <p>The backend API service is running on port 5000. All authentication, skill passport, proctored assessments, and job matching endpoints are active.</p>
    <div class="endpoints">
      <div class="endpoint"><span class="path">/api/v1/auth</span><span class="desc">Authentication &amp; Profile</span></div>
      <div class="endpoint"><span class="path">/api/v1/students</span><span class="desc">Skill Passports &amp; JRI</span></div>
      <div class="endpoint"><span class="path">/api/v1/recruiters</span><span class="desc">Recruiter Operations</span></div>
      <div class="endpoint"><span class="path">/api/v1/placement</span><span class="desc">Placement Early Alerts</span></div>
      <div class="endpoint"><span class="path">/api/v1/assessments</span><span class="desc">Proctored Code Exams</span></div>
      <div class="endpoint"><span class="path">/api/v1/resumes</span><span class="desc">ATS PDF Parsing Engine</span></div>
      <div class="endpoint"><span class="path">/api/v1/health</span><span class="desc">Health Diagnostics</span></div>
    </div>
    <a href="/" class="btn">&larr; Open SkillProof AI Web Application</a>
  </div>
</body>
</html>`);
  }

  res.json({
    success: true,
    status: 'online',
    name: 'SkillProof AI Platform REST API',
    version: '1.0.0',
    documentation: 'Evidence-Based Skill Passport & Job Readiness Platform',
    endpoints: {
      auth: '/api/v1/auth',
      students: '/api/v1/students',
      recruiters: '/api/v1/recruiters',
      placement: '/api/v1/placement',
      assessments: '/api/v1/assessments',
      jobs: '/api/v1/jobs',
      resumes: '/api/v1/resumes',
      health: '/api/v1/health',
    },
    webAppUrl: '/',
  });
});

// Mount versioned REST API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/recruiters', recruiterRoutes);
app.use('/api/v1/placement', placementRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/resumes', resumeRoutes);

// Fallback 404 for undefined /api routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    apiIndex: '/api/v1',
  });
});

// Serve frontend production build directly from Express
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Central error handler
app.use(errorHandler);

module.exports = app;
