"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Logo from "@/assets/codecompass.png";
import { useUserSession } from "@/hook/use_user_session";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/firebase/auth";
import { removeSession } from "@/server-action/auth_action";
import { useRouter } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavLink = ({
  href,
  children,
  className,
  isActive,
  onClick,
}: NavLinkProps) => (
  <Link
    href={href}
    className={`navbar__link ${className} ${isActive ? "text-blue-700 dark:text-blue-500" : "text-gray-900 dark:text-white"
      }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

interface DropdownProps {
  items: string[];
  handleLinkClick: (href: string) => void;
}

const Dropdown = ({ items, handleLinkClick }: DropdownProps) => (
  <ul className="absolute left-0 mt-2 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600">
    {items.map((item, index) => (
      <li key={index}>
        <NavLink
          href={`/${item.replace(/\s+/g, "").toLowerCase()}`}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() =>
            handleLinkClick(`/${item.replace(/\s+/g, "").toLowerCase()}`)
          }
        >
          {item}
        </NavLink>
      </li>
    ))}
  </ul>
);

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const keyInitiativesRef = useRef<HTMLLIElement>(null);
  const initiativesRef = useRef<HTMLLIElement>(null);

  const userSessionId = useUserSession(null);
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (keyInitiativesRef.current &&
          !keyInitiativesRef.current.contains(event.target as Node)) &&
        (initiativesRef.current &&
          !initiativesRef.current.contains(event.target as Node))
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



const handleSignOut = async () => {
  try {
    await signOutWithGoogle(); // First, sign out of Google.
    await removeSession(); // Then, remove the session cookie.
    router.push('/'); // Finally, redirect to the home page after sign-out is complete.
  } catch (err) {
    console.error('Failed to sign out:', err);
  }
};


  const handleSignIn = () => {
    router.push("/auth/Login");
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={() => handleLinkClick("/")}
        >
          <Image src={Logo} height={32} alt=" Logo" />
        </NavLink>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {userSessionId ? (
            <button
              onClick={handleSignOut}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
