import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/firebaseadmin'; // Ensure this import path is correct
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase/config'; // Ensure correct import
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';

// Initialize Firestore service
const firestore = getFirestore(firebaseApp);

// Define admin-protected routes
const adminProtectedRoutes = [
  '/admin',
  '/admin/:path*', // Protect all paths under '/admin'
  '/Scholarships',  // Protect '/Scholarships' route
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  // Check if the route requires admin privileges
  const isAdminRoute = adminProtectedRoutes.some(route => pathname.startsWith(route));

  // If session is not set and trying to access an admin route
  if (!sessionToken && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
  }

  // If session is present, validate the user role
  if (sessionToken) {
    try {
      // Verify the session token with Firebase Admin SDK
      const user = await adminAuth.verifyIdToken(sessionToken);
      const userEmail = user.email;

      if (userEmail) {
        // Retrieve the user's role from Firestore
        const userDocRef = doc(firestore, 'adminemail', userEmail);
        const userDoc = await getDoc(userDocRef);

        // Check if the user has an admin role
        const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

        if (isAdmin && !isAdminRoute) {
          // If the user is an admin and accessing a non-admin route, redirect to an appropriate page
          return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
        } else if (!isAdmin && isAdminRoute) {
          // If the user is not an admin and tries to access an admin route, redirect to home
          return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }
      } else {
        // If no email is found, redirect to login
        return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
      }
    } catch (error) {
      console.error('Error verifying session token:', error);
      // Redirect to login on token verification failure
      return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
    }
  }

  // Allow non-admin users to proceed to non-admin routes
  return NextResponse.next();
}

// Apply middleware to admin-protected routes
export const config = {
  matcher: ['/admin/:path*', '/Scholarships'], // Protect '/admin/*' and '/Scholarships'
};
