import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { generateToken, setAuthCookie } from '@/lib/server/auth';
import { User } from '@/lib/server/models/User';
import dbConnect from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create the user
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Generate token
    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Create response
    const response = NextResponse.json(userWithoutPassword, { status: 201 });

    // Set the auth cookie
    setAuthCookie(token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
} 