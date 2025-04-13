import { NextResponse } from 'next/server';

export async function GET() {
  // If middleware allows this route to be called, the token is valid
  console.log('Token validation route called');
  return NextResponse.json({ valid: true });
} 