import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { config } from './config';

const JWT_SECRET = config.jwt.secret;

export interface TokenPayload {
  userId: string;
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
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