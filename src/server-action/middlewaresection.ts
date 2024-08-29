// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';

// Define admin-protected routes
const adminProtectedRoutes = ['/admin', '/(admin)', '/(admin)/Scholarships']; // Add more specific routes if necessary

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  // Redirect to login if session is not set and user is trying to access an admin route
  if (!session && adminProtectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const loginURL = new URL('/auth/Login', request.nextUrl.origin);
    return NextResponse.redirect(loginURL);
  }

  // Redirect to admin home if session is set and user tries to access the root route
  if (session && request.nextUrl.pathname === '/') {
    const adminHomeURL = new URL('/(admin)/Scholarships', request.nextUrl.origin); // Adjust to the correct admin route
    return NextResponse.redirect(adminHomeURL);
  }

  // Continue to the requested route
  return NextResponse.next();
}
