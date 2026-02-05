import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  
  console.log('Middleware - Path:', request.nextUrl.pathname);
  console.log('Middleware - Token exists:', !!token);

  // Protect admin dashboard routes
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      console.log('No token, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    const user = await verifyTokenEdge(token);
    console.log('Token verification result:', !!user);
    
    if (!user) {
      console.log('Invalid token, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    console.log('Token valid, allowing access to dashboard');
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (request.nextUrl.pathname === '/admin' && token) {
    const user = await verifyTokenEdge(token);
    if (user) {
      console.log('Already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
