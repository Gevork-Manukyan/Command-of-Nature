import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { config } from '@/lib/config';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(config.mongodb.db);
    
    // Test the connection by listing all collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      status: 'healthy',
      mongodb: {
        connected: true,
        collections: collections.map(col => col.name),
        database: config.mongodb.db
      }
    });
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        mongodb: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
} 