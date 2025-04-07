import jwt from 'jsonwebtoken';
import { config } from '@/config';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.auth.jwtSecret, { expiresIn: config.auth.tokenExpiry });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, config.auth.jwtSecret) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function setTokenCookie(token: string) {
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function getTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

export function removeTokenCookie() {
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
} 