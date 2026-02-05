import { NextRequest } from 'next/server';
import { verifyToken, AdminUser } from './auth';

export interface AuthResult {
  isAuthenticated: boolean;
  user?: AdminUser;
  error?: string;
}

export function verifyAdminAuth(request: NextRequest): AuthResult {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return {
        isAuthenticated: false,
        error: 'No authentication token found',
      };
    }

    // Verify token
    const user = verifyToken(token);

    if (!user) {
      return {
        isAuthenticated: false,
        error: 'Invalid or expired token',
      };
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      isAuthenticated: false,
      error: 'Authentication failed',
    };
  }
}
