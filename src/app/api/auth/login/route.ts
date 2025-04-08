import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/server/db';
import { User } from '@/lib/server/models/User';
import { generateToken, setAuthCookie } from '@/lib/server/auth';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    // Create response
    const response = NextResponse.json(userWithoutPassword, { status: 200 });
    
    // Set the auth cookie
    setAuthCookie(token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
