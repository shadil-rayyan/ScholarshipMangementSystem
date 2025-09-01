import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/firebaseadmin';  // Firebase Admin SDK
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config'; // Ensure Firestore is properly imported from your config
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';

const adminProtectedRoutes = [
  '/admin',
  '/admin/:path*',
  '/Scholarships',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  // Check if the current route is admin protected
  const isAdminRoute = adminProtectedRoutes.some((route) => pathname.startsWith(route));

  if (!sessionToken && isAdminRoute) {
    // Redirect to login if trying to access admin route without a session
    return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
  }

  if (sessionToken) {
    try {
      // Verify the session token with Firebase Admin SDK
      const user = await adminAuth.verifyIdToken(sessionToken);
      const userEmail = user.email;

      if (userEmail) {
        // Retrieve the user's role from Firestore
        const userDocRef = doc(firestore, 'adminemail', userEmail);
        const userDoc = await getDoc(userDocRef);

        const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

        if (isAdminRoute && !isAdmin) {
          // Non-admin user trying to access an admin route
          return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }

        if (!isAdminRoute && isAdmin) {
          // Admin trying to access non-admin route, redirect to admin dashboard
          return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
        }
      } else {
        // No user email found, redirect to login
        return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
      }
    } catch (error) {
      console.error('Error verifying session token:', error);
      // On verification failure, redirect to login
      return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
    }
  }

  // If no session token or user is allowed to access the route, continue
  return NextResponse.next();
}

// Apply middleware to admin-protected routes
export const config = {
  matcher: ['/admin/:path*', '/Scholarships'],  // Protect the specified routes
};
