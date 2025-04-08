import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { generateToken, setAuthCookie } from '@/lib/server/auth';
import { User } from '@/lib/server/models/User';
import dbConnect from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Compare passwords
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Update user's online status
    user.isOnline = true;
    await user.save();
    
    // Generate token
    const token = generateToken({
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
      { error: 'Error during login' },
      { status: 500 }
    );
  }
}
