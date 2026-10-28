const mongoose = require('mongoose');

// Configure Mongoose to prevent buffering queries when disconnected
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 1000);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillproof_ai';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Connection Warning] Could not connect to MongoDB at ${mongoUri}`);
    console.warn('[MongoDB] Running seamlessly with in-memory zero-config fallback storage.');
  }
};

module.exports = connectDB;
