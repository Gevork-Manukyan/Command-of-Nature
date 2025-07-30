import mongoose from 'mongoose';
import { getServerEnv } from '../env';

// Get server environment variables
const serverEnv = getServerEnv();

// Global cache to avoid creating multiple connections in serverless environments
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB
async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,        // Disables buffering if disconnected
      dbName: serverEnv.MONGODB_DB, // Database name
    };

    cached.promise = mongoose.connect(serverEnv.MONGODB_URI, opts).then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 