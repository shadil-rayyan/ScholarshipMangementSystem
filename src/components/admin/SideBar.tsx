'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOutWithGoogle } from '@/lib/firebase/auth';
import { removeSession } from '@/server-action/auth_action';
import logo from '@/assets/codecompass.png';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();
    const router = useRouter();
    
    const [showSiteMenu, setShowSiteMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOutWithGoogle();
            await removeSession();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isSiteManagementActive = 
        pathname === '/about' ||
        pathname === '/faq' ||
        pathname === '/eligibility' ||
        pathname === '/contactus' ||
        pathname === '/adminsetting' ||
        pathname === '/apply-settings';

    const isAdminManagementActive =
        pathname === '/addadmin' ||
        pathname === '/listadmin' ||
        pathname === '/removeadmin';

    useEffect(() => {
        setShowSiteMenu(isSiteManagementActive);
        setShowAdminMenu(isAdminManagementActive);
    }, [pathname, isSiteManagementActive, isAdminManagementActive]);

    const baseStyle = "flex items-center w-full p-3 transition rounded-xl border-2 duration-300";
    const activeStyle = "bg-purple-100 text-purple-600 font-semibold";
    const inactiveStyle = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
    const subLinkBase = "block p-2 rounded transition duration-200";
    const subLinkActive = "bg-purple-100 text-purple-600 font-semibold";
    const subLinkInactive = "text-gray-600 hover:bg-gray-100";

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <div 
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static`}
            >
                {/*  3-PART STRUCTURE TO CONTROL SCROLLING */}
                <div className="flex flex-col h-full">

                    {/* Top Section (Not scrollable) */}
                    <div className="p-6  pt-3 pb-3">
                        <div className="flex items-center justify-center h-20 overflow-hidden mb-2">
                            <div className="relative w-full h-full">
                                <Image src={logo} alt="Admin Dashboard" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                        <div className='text-center text-black font-semibold'>
                            Admin Dashboard
                        </div>
                    </div>

                    {/* Middle Section (SCROLLABLE) */}
                    <div className="flex-grow p-6 overflow-y-auto">
                        <div className="space-y-3">
                            <Link href="/Scholarships" passHref>
                                <button className={`${baseStyle} ${pathname === '/Scholarships' ? activeStyle : inactiveStyle}`}>
                                    Scholarships
                                </button>
                            </Link>

                            {/* Site Management Dropdown */}
                            <div>
                                <button
                                    onClick={() => setShowSiteMenu(!showSiteMenu)}
                                    className={`${baseStyle} justify-between ${isSiteManagementActive ? activeStyle : inactiveStyle}`}
                                >
                                    <span>Site Management</span>
                                    <span className={`transform transition-transform duration-200 ${showSiteMenu ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {showSiteMenu && (
                                    <div className="pl-4 mt-2 space-y-1 border-l-2 border-gray-200">
                                        <Link href="/about" className={`${subLinkBase} ${pathname === '/about' ? subLinkActive : subLinkInactive}`}>› About</Link>
                                        <Link href="/faq" className={`${subLinkBase} ${pathname === '/faq' ? subLinkActive : subLinkInactive}`}>› FAQ</Link>
                                        <Link href="/eligibility" className={`${subLinkBase} ${pathname === '/eligibility' ? subLinkActive : subLinkInactive}`}>› Eligibility</Link>
                                        <Link href="/contactus" className={`${subLinkBase} ${pathname === '/contactus' ? subLinkActive : subLinkInactive}`}>› Contact</Link>
                                        <Link href="/adminsetting" className={`${subLinkBase} ${pathname === '/adminsetting' ? subLinkActive : subLinkInactive}`}>› Dropdown Items</Link>
                                        <Link href="/apply-settings" className={`${subLinkBase} ${pathname === '/apply-settings' ? subLinkActive : subLinkInactive}`}>› Apply Button</Link>
                                    </div>
                                )}
                            </div>

                            {/* Admin Management Dropdown */}
                            <div>
                                <button
                                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                                    className={`${baseStyle} justify-between ${isAdminManagementActive ? activeStyle : inactiveStyle}`}
                                >
                                    <span>Admin Management</span>
                                    <span className={`transform transition-transform duration-200 ${showAdminMenu ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {showAdminMenu && (
                                    <div className="pl-4 mt-2 space-y-1 border-l-2 border-gray-200">
                                        <Link href="/addadmin" className={`${subLinkBase} ${pathname === '/addadmin' ? subLinkActive : subLinkInactive}`}>› Add New Admin</Link>
                                        <Link href="/listadmin" className={`${subLinkBase} ${pathname === '/listadmin' ? subLinkActive : subLinkInactive}`}>› List Admins</Link>
                                        <Link href="/removeadmin" className={`${subLinkBase} ${pathname === '/removeadmin' ? subLinkActive : subLinkInactive}`}>› Remove Admin</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section (Not scrollable) */}
                    <div className="p-6 pt-2 pb-3 ">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full p-3 transition rounded-xl border-2 duration-300 text-red-600 bg-red-100 hover:bg-red-300"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;