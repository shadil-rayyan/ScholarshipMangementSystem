import { signInWithPopup, GoogleAuthProvider, User, UserCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './config'; // Adjust import path as needed

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}

export async function signInWithGoogle(): Promise<{ isAdmin: boolean }> {
  const provider = new GoogleAuthProvider();

  try {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user || !user.email) {
      throw new Error('Google sign in failed');
    }

    // Check if the user is an admin
    const userDocRef = doc(firestore, 'adminemail', user.email);
    const userDoc = await getDoc(userDocRef);

    const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';
    
    return { isAdmin };
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
}

export async function signOutWithGoogle(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
    throw error;
  }
}
