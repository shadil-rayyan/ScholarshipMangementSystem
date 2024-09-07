// src/app/(admin)/layout.tsx
'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/firebase/auth'; // Ensure this function is implemented

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  //   const [loading, setLoading] = useState(true);
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);
  //   const router = useRouter();

  //   useEffect(() => {
  //     // Function to check user authentication status
  //     const checkAuth = async () => {
  //       const unsubscribe = onAuthStateChanged(async (authUser) => {
  //         if (authUser) {
  //           setIsAuthenticated(true);
  //         } else {
  //           setIsAuthenticated(false);
  //           router.push('/auth/Login'); // Redirect to login if not authenticated
  //         }
  //         setLoading(false);
  //       });

  //       // Cleanup subscription on unmount
  //       return () => unsubscribe();
  //     };

  //     checkAuth();
  //   }, [router]);


  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
