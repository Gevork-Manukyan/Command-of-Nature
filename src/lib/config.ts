export const config = {
  mongodb: {
    db: process.env.MONGODB_DB || 'command-of-nature',
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    tokenExpiry: '24h',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const; 