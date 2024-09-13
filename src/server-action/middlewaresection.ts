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

  // Redirect to login if session is not set and user is trying to access an admin route
  if (!sessionToken && adminProtectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
  }

  // Check user role if session is present
  if (sessionToken) {
    try {
      const user = await adminAuth.verifyIdToken(sessionToken);
      const userEmail = user.email;

      if (userEmail) {
        const userDocRef = doc(firestore, 'adminemail', userEmail);
        const userDoc = await getDoc(userDocRef);

        const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

        if (isAdmin) {
          if (!adminProtectedRoutes.some(route => pathname.startsWith(route))) {
            const response = NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
            response.cookies.delete(SESSION_COOKIE_NAME);
            return response;
          }
        } else {
          if (adminProtectedRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
          }
        }
      } else {
        return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
      }
    } catch (error) {
      console.error('Error verifying session token:', error);
      return NextResponse.redirect(new URL('/auth/Login', request.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/:path*'],
};
