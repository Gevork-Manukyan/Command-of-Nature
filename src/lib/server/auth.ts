import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { config } from './config';

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = new TextEncoder().encode(config.jwt.secret);

export interface TokenPayload extends JWTPayload {
  userId: string;
  username: string;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 1, // 1 day
  });
}

export function removeAuthCookie() {
  cookies().delete('auth-token');
}

export function getTokenFromCookie(): string | undefined {
  return cookies().get('auth-token')?.value;
} 