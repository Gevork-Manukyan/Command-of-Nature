export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    db: process.env.MONGODB_DB || 'command-of-nature'
  },
  socket: {
    url: process.env.NEXT_PUBLIC_SOCKET_URL
  }
}; 