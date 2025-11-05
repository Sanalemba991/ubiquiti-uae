import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_CREDENTIALS } from '@/lib/auth';
import { generateTokenEdge } from '@/lib/auth-edge';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', { username, hasPassword: !!password });
    console.log('Expected credentials:', { 
      username: ADMIN_CREDENTIALS.username, 
      password: ADMIN_CREDENTIALS.password 
    });

    // Validate input
    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (username !== ADMIN_CREDENTIALS.username) {
      console.log('Username mismatch');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, compare with hashed password from database
    // For now, comparing plain text
    if (password !== ADMIN_CREDENTIALS.password) {
      console.log('Password mismatch');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Login successful!');

    // Generate JWT token
    const token = await generateTokenEdge({
      username: ADMIN_CREDENTIALS.username,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    });

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      user: {
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
