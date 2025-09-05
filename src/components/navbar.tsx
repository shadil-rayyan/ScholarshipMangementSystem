"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Logo from "@/assets/codecompass.png";
import { signOutWithGoogle } from "@/lib/firebase/auth";
import { auth, firestore } from '@/lib/firebase/config';
import { removeSession } from "@/server-action/auth_action";
import { useUserSession } from "@/hook/use_user_session";

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const userSessionId = useUserSession(null);
    const router = useRouter();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Effect to get the current Firebase user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Effect to check for admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user && user.email) {
                try {
                    const docRef = doc(firestore, "adminemail", user.email);
                    const docSnap = await getDoc(docRef);
                    setIsAdmin(docSnap.exists() && docSnap.data().role === 'admin');
                } catch (error) {
                    console.error("Failed to check admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };
        checkAdminStatus();
    }, [user]);

    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOutWithGoogle();
        await removeSession();
        setIsProfileMenuOpen(false);
        router.push('/');
    };

    const handleSignIn = () => {
        router.push("/auth/Login");
    };

    const profileImage = user?.photoURL || '';

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 relative z-50 shadow-md">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                {/* Logo and Site Title */}
                <Link href="/" className="flex items-center space-x-3">
                    <Image src={Logo} height={32} alt="Logo" />
                    {/* TITLE ADDED HERE */}
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white hidden sm:block">
                        Scholarship Management System
                    </span>
                </Link>

                {/* Action Buttons */}
                <div className="relative">
                    {userSessionId ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                                Hi, {user?.displayName?.split(' ')[0] || 'User'}
                            </span>

                            <div ref={profileMenuRef}>
                                {/* Profile Picture Button */}
                                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                                    <span className="sr-only">Open user menu</span>
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                            {user?.email?.[0].toUpperCase()}
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
                                        <div className="px-4 py-3 border-b dark:border-gray-600">
                                            <span className="block text-sm text-gray-900 dark:text-white">{user?.displayName || 'User'}</span>
                                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
                                        </div>
                                        <ul className="py-1">
                                            {isAdmin && (
                                                <li>
                                                    <Link href="/admin" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                        Admin Dashboard
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-white">
                                                    Sign Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleSignIn}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;