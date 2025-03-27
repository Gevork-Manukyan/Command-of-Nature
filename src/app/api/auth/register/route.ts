import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { guestName } = await request.json();
    
    if (!guestName) {
      return NextResponse.json(
        { error: 'Guest name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ guestName });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const result = await users.insertOne({
      guestName,
      createdAt: new Date(),
      currentGame: null,
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      guestName,
      createdAt: new Date(),
      currentGame: null,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 