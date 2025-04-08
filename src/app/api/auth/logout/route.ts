import { NextResponse } from 'next/server';
import { removeAuthCookie } from '../../../../lib/auth';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Remove the auth cookie
    removeAuthCookie();

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    );
  }
} 