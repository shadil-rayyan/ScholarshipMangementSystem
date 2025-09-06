import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { useUserSession } from '@/hook/use_user_session';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock custom hook
jest.mock('@/hook/use_user_session', () => ({
  useUserSession: jest.fn(),
}));

// Mock Firebase auth and firestore
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock firebase sign out function
jest.mock('@/lib/firebase/auth', () => ({
  signOutWithGoogle: jest.fn(),
}));

// Mock removeSession
jest.mock('@/server-action/auth_action', () => ({
  removeSession: jest.fn(),
}));

describe('Navbar Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock router
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Mock user session
    (useUserSession as jest.Mock).mockReturnValue('mock-session');

    // Mock Firebase auth state
    (firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({ 
        email: 'test@example.com', 
        displayName: 'Test User', 
        photoURL: null 
      });
      return jest.fn(); // unsubscribe function
    });

    // Mock Firestore admin check
    (firebaseFirestore.getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    });
  });

  it('renders Navbar and user info', async () => {
    render(<Navbar />);

    // Check greeting
    expect(await screen.findByText('Hi, Test')).toBeInTheDocument();

    // Check sign out button exists when profile menu opens
    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));
    expect(await screen.findByText('Sign Out')).toBeInTheDocument();

    // Admin dashboard link should be visible
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('sign in button appears when no session', () => {
    (useUserSession as jest.Mock).mockReturnValue(null);
    render(<Navbar />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
