import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(config.mongodb.db);
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ guestName: username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        guestName: user.guestName,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
