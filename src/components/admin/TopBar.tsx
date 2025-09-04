'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Define the props interface for the component
interface TopBarProps {
  setIsOpen: (isOpen: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ setIsOpen }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const adminName = user?.displayName || 'Admin';
    const profileImage = user?.photoURL || '';

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-md w-full">
            {/* Left side of the TopBar */}
            <div className="flex items-center">
                {/* Hamburger Menu Button - visible only on small screens */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-gray-500 focus:outline-none lg:hidden"
                >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Welcome Message */}
                <h1 className="text-xl font-bold text-gray-800 ml-4">Hi, {adminName}</h1>
            </div>

            {/* Right side of the TopBar (Profile Image) */}
            <div className="flex items-center">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                )}
            </div>
        </div>
    );
};

export default TopBar;