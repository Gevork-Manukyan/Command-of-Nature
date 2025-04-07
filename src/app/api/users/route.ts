import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Example: Get all users
    const users = await db.collection('users').find({}).toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const body = await request.json();
    
    // Example: Create a new user
    const result = await db.collection('users').insertOne(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 