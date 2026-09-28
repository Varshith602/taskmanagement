const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

/**
 * Connect to MongoDB database
 * Uses local/remote MongoDB URI if available.
 * If unavailable, falls back to embedded MongoDB with disk persistence
 * stored in `server/.data/db` so accounts, tasks, and sessions survive
 * server restarts without requiring manual MongoDB installation.
 */
let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow_db';

  try {
    // 1. Attempt connecting to external / local mongod instance with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[TaskFlow DB] MongoDB Connected to external server: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[TaskFlow DB] External MongoDB unavailable (${error.message}). Starting embedded persistent MongoDB...`);

    // 2. Fall back to embedded MongoDB with persistent storage on disk
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.resolve(__dirname, '..', '.data', 'db');

      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbPath,
          dbName: 'taskflow_db',
        },
      });

      const persistentUri = mongodInstance.getUri('taskflow_db');
      const conn = await mongoose.connect(persistentUri);
      console.log(`[TaskFlow DB] Embedded persistent MongoDB started at: ${conn.connection.host}`);
      console.log(`[TaskFlow DB] Data directory: ${dbPath}`);
      return conn;
    } catch (memErr) {
      console.error(`[TaskFlow DB] MongoDB connection failed completely: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

