import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase/config'; // Adjust path as needed
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Define admin-protected routes
const adminProtectedRoutes = [
  '/admin',
  '/(admin)',
  '/(admin)/Scholarships',
  // Add more specific admin routes if necessary
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';
  const url = request.nextUrl.clone();

  // Redirect to login if session is not set and user is trying to access an admin route
  if (!sessionToken && adminProtectedRoutes.some(route => pathname.startsWith(route))) {
    const loginURL = new URL('/auth/Login', request.nextUrl.origin);
    return NextResponse.redirect(loginURL);
  }

  // Check user role if session is present
  if (sessionToken) {
    try {
      // Verify the session token
      const user = await auth.verifyIdToken(sessionToken);
      const userEmail = user.email;
      
      if (userEmail) {
        const userDocRef = doc(firestore, 'adminemail', userEmail);
        const userDoc = await getDoc(userDocRef);

        const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

        // Handle admin users
        if (isAdmin) {
          if (!adminProtectedRoutes.some(route => pathname.startsWith(route))) {
            // Admin is navigating to a non-admin route, log them out
            const logoutURL = new URL('/auth/Login', request.nextUrl.origin);
            const response = NextResponse.redirect(logoutURL);

            // Clear session cookie to log out the admin
            response.cookies.delete(SESSION_COOKIE_NAME);

            return response;
          }
        } else {
          // Handle non-admin users
          if (adminProtectedRoutes.some(route => pathname.startsWith(route))) {
            // Non-admin user is trying to access admin route, redirect to home
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
          }
        }
      } else {
        // Redirect to login if email is not available (invalid token)
        const loginURL = new URL('/auth/Login', request.nextUrl.origin);
        return NextResponse.redirect(loginURL);
      }
    } catch (error) {
      console.error('Error verifying session token:', error);
      // Redirect to login on token verification error
      const loginURL = new URL('/auth/Login', request.nextUrl.origin);
      return NextResponse.redirect(loginURL);
    }
  }

  // Continue to the requested route
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ['/admin/:path*', '/:path*'], // Apply middleware to admin and all other paths
};
