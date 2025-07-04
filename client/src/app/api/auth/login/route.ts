import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/server/db';
import { User } from '@/lib/server/models/User';
import { generateToken, setAuthCookie } from '@/lib/server/auth';
import { compare } from 'bcryptjs';
import { userResponseSchema } from '@/lib/zod-schemas';

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
    
    // Remove password from response and replace _id with id
    const { password: _, _id, ...userWithoutPassword } = user.toObject();

    // Validate the user response
    const parsedUser = userResponseSchema.parse({...userWithoutPassword, id: _id.toString()});
    
    // Create response
    const response = NextResponse.json(parsedUser, { status: 200 });
    
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
