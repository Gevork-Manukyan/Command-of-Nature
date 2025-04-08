import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { compare } from 'bcrypt';
import { generateToken, setAuthCookie } from '@/lib/server/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare passwords
    const isValid = await compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response
    const response = NextResponse.json(userWithoutPassword);

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
