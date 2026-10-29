require('dotenv').config();
const crypto = require('crypto');
const app = require('./app');
const connectDB = require('./config/db');

// Enforce mandatory JWT_SECRET in production; generate secure runtime secret in development
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[SECURITY CRITICAL] JWT_SECRET is not configured in production environment. Server startup aborted.');
    process.exit(1);
  } else {
    console.warn('[SECURITY NOTICE] JWT_SECRET not found in .env; generating a cryptographically secure random session secret.');
    process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
  }
}

let PORT = parseInt(process.env.PORT, 10) || 5000;

// Connect to MongoDB
connectDB();

function startServer(portToTry) {
  const server = app.listen(portToTry, '0.0.0.0', () => {
    console.log(`[SkillProof AI Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${portToTry}`);
    console.log(`[SkillProof AI Server] Local interface: http://localhost:${portToTry}`);
    console.log(`[SkillProof AI Server] Network interface: http://0.0.0.0:${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      console.warn(`[SkillProof AI Server] Port ${portToTry} in use or reserved by Windows. Falling back to port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error(`[Server Error]: ${err.message}`);
    }
  });

  return server;
}

const server = startServer(PORT);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
});
