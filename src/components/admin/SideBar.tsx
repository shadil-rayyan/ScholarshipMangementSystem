'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { signOutWithGoogle } from '@/lib/firebase/auth'; // Import signOut function
import { removeSession } from '@/server-action/auth_action'; // Import removeSession function
import logo from '@/assets/logo.png';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter(); // Hook to navigate programmatically
    const [showProductMenu, setShowProductMenu] = useState(false);
    const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOutWithGoogle(); // Sign out from Firebase
            await removeSession(); // Remove session from server
            router.push('/'); // Redirect to homepage after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen flex flex-col justify-between">
            {/* Top Section */}
            <div className="p-6">
                {/* Logo with object-fit and specific size */}
                <div className="flex items-center justify-center w-20 h-20 overflow-hidden mb-6">
                    <div className="relative w-full h-full">
                        <Image
                            src={logo} // Path to logo image
                            alt="Admin Dashboard"
                            layout="fill" // Fill the container
                            objectFit="contain" // Ensure the image fits without stretching
                        />
                    </div>
                </div>


                {/* Space for other menu items */}
                <div className="space-y-2 mt-10">
                    {/* Dashboard Button */}
                    <Link href="/Scholarships" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition rounded-xl border-2 duration-300 ${pathname === '/Scholarships'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-300'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Scholarships
                        </button>
                    </Link>
                </div>
                <div className="space-y-2 mt-3">
                    {/* Dashboard Button */}
                    <Link href="/addadmin" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition rounded-xl border-2 duration-300 ${pathname === '/addadmin'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-300'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Add new admin
                        </button>
                    </Link>
                </div>
            </div>

            {/* Bottom Section for Logout */}
            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 transition rounded-xl border-2 duration-300 text-red-600 bg-red-100 hover:bg-red-300 hover:text-red-900"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;