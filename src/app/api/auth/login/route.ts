import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { compare } from 'bcrypt';

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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    );
  }
}
