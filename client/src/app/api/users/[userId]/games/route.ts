import { NextResponse } from 'next/server';
import { User } from '@/lib/server/models/User';
import dbConnect from '@/lib/server/db';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const user = await User.findById(params.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ activeGameIds: user.activeGameIds });
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json(
      { error: 'Error fetching user games' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { gameId, action } = await request.json();
    
    const user = await User.findById(params.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (action === 'join') {
      if (!user.activeGameIds.includes(gameId)) {
        user.activeGameIds.push(gameId);
        await user.save();
      }
    } else if (action === 'leave') {
      user.activeGameIds = user.activeGameIds.filter((id: string) => id !== gameId);
      await user.save();
    }
    
    return NextResponse.json({ activeGameIds: user.activeGameIds });
  } catch (error) {
    console.error('Error updating user games:', error);
    return NextResponse.json(
      { error: 'Error updating user games' },
      { status: 500 }
    );
  }
} 