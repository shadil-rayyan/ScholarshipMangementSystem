'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/firebase/auth'; // Ensure this function is implemented
import Sidebar from "@/components/admin/SideBar";
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase/config'
import TopBar from '@/components/admin/TopBar';
import loading from '@/app/loading';
interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // State to control sidebar visibility on mobile screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const router = useRouter();

  // Check user authentication and admin role on mount
  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = onAuthStateChanged(async (authUser) => {
        if (authUser) {
          // Check if the authenticated user is an admin
          const userDocRef = doc(firestore, 'adminemail', authUser.email as string);
          const userDoc = await getDoc(userDocRef);
          const isAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';

          if (isAdmin) {
            setIsAuthenticated(true); // Set the state to authenticated if user is admin
          } else {
            setIsAuthenticated(false);
            router.push('/auth/Login'); // Redirect to login if not an admin
          }
        } else {
          setIsAuthenticated(false); // If no authenticated user, redirect to login
          router.push('/auth/Login');
        }
        // setLoading(false); // Stop loading after check
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    checkAuth();
  }, [router]);

  // Show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar now receives props to control its state */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* TopBar receives a function to open the sidebar */}
        <TopBar setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;