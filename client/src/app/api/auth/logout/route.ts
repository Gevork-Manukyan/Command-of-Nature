import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/server/auth';

export async function POST() {
  try {
    // Remove the auth cookie
    removeAuthCookie();
    
    // Create response
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    );
  }
} 