import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import necessary functions and types
import { auth } from '@/lib/firebase/config'; // Import the auth module from Firebase

const TopBar = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const adminName = user?.displayName || ' Admin';
    const profileImage = user?.photoURL || '';

    return (
        <div className="flex justify-between items-center p-5 bg-white shadow-md w-full">
            <h1 className="text-xl font-bold">Hi, {adminName}</h1>
            <div className="flex items-center">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                )}
            </div>
        </div>
    );
};

export default TopBar;