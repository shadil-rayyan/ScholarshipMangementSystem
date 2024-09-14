import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/firebaseadmin'; // Update import path
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase/config'; // Ensure correct import
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';

// Initialize Firestore service
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

  // Check if the route requires admin privileges
  const isAdminRoute = adminProtectedRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if session is not set and user is trying to access an admin route
  if (!sessionToken && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
  }

  // If session is present, check the user role
  if (sessionToken) {
    try {
      // Verify the session token with Firebase Admin SDK
      const user = await adminAuth.verifyIdToken(sessionToken);
      const userEmail = user.email;

      if (userEmail) {
        // Get the user's role from Firestore
        const userDocRef = doc(firestore, 'adminemail', userEmail);
        const userDoc = await getDoc(userDocRef);

        const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

        // If the user is admin and accessing non-admin routes, restrict access
        if (isAdmin) {
          if (!isAdminRoute) {
            // Clear session and redirect if user is accessing non-admin route
            const response = NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
            response.cookies.delete(SESSION_COOKIE_NAME);
            return response;
          }
        } else {
          // If user is not admin and trying to access admin route, redirect to home
          if (isAdminRoute) {
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
          }
        }
      } else {
        // If no email is found, redirect to login
        return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
      }
    } catch (error) {
      // Handle errors, such as token verification failure
      console.error('Error verifying session token:', error);
      return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
    }
  }

  // If everything checks out, proceed to the requested page
  return NextResponse.next();
}

// Apply middleware to all routes under `/admin` and `/Scholarships`
export const config = {
  matcher: ['/admin/:path*', '/Scholarships', '/(admin)/:path*'],
};
