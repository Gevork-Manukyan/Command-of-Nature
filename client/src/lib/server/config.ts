export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
  },
  socket: {
    url: process.env.NEXT_PUBLIC_SOCKET_URL
  }
}; 