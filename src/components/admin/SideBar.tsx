'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { signOutWithGoogle } from '@/lib/firebase/auth'; // Import signOut function
import { removeSession } from '@/server-action/auth_action'; // Import removeSession function

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
        <div className="w-64 bg-white shadow-lg min-h-screen">
            <div className="p-6">
                {/* Logo with object-fit */}
                <div className="flex items-center justify-center w-20 h-20 overflow-hidden mb-0">
                    <div className="relative w-full h-full">
                        <Image
                            src="/assets/logo.png" // Path to logo image
                            alt="Admin Dashboard"
                            layout="fill" // Fill the container
                            objectFit="cover" // Ensure the image covers the container
                        />
                    </div>
                </div>

               

                <div className="space-y-2 mt-6">
                    {/* Dashboard Button */}
                    <Link href="/dashboard" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/dashboard'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Dashboard
                        </button>
                    </Link>

                    {/* Product Button */}
                    <button
                        onClick={() => setShowProductMenu(!showProductMenu)}
                        className={`flex items-center w-full p-3 transition duration-300 ${pathname.startsWith('/adminProduct')
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        Products
                    </button>

                    {showProductMenu && (
                        <div className="ml-4 space-y-2">
                            <Link href="/products/list" passHref>
                                <button
                                    className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/products/list'
                                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Product List
                                </button>
                            </Link>

                            <Link href="/products/add" passHref>
                                <button
                                    className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/products/add'
                                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Add Product
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Activities Button */}
                    <button
                        onClick={() => setShowActivitiesMenu(!showActivitiesMenu)}
                        className={`flex items-center w-full p-3 transition duration-300 ${pathname.startsWith('/activities')
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        Activities
                    </button>

                    {showActivitiesMenu && (
                        <div className="ml-4 space-y-2">
                            <Link href="/activities/programs" passHref>
                                <button
                                    className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/activities/programs'
                                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Programs
                                </button>
                            </Link>

                            <Link href="/activities/conversation" passHref>
                                <button
                                    className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/activities/conversation'
                                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Conversation
                                </button>
                            </Link>

                            <Link href="/activities/gallery" passHref>
                                <button
                                    className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/activities/gallery'
                                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    Gallery
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Scholarships Button */}
                    <Link href="/scholarships" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/scholarships'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Scholarships
                        </button>
                    </Link>

                    {/* Upcoming Button */}
                    <Link href="/upcoming-hero-image" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/upcoming-hero-image'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Upcoming
                        </button>
                    </Link>
                    
                    {/* hero image Button */}
                    <Link href="/-hero-image" passHref>
                        <button
                            className={`flex items-center w-full p-3 transition duration-300 ${pathname === '/upcoming-hero-image'
                                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            hero image
                        </button>
                    </Link>
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 mt-10 transition duration-300 text-red-600 hover:bg-red-100 hover:text-red-900"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
