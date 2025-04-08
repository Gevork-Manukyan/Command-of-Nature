import { NextResponse } from 'next/server';
import dbConnect from '@/lib/server/db';

export async function GET() {
  try {
    const conn = await dbConnect();
    return NextResponse.json({ 
      status: 'success',
      message: 'MongoDB connected successfully',
      connection: {
        readyState: conn.readyState,
        host: conn.host,
        port: conn.port,
        name: conn.name
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 