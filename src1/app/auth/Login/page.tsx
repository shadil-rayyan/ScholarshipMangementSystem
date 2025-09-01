"use client";

import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import darsanalogin from '@/assets/darsanalogin.jpg';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

const handleLoginWithGoogle = async () => {
  try {
    const result = await signInWithGoogle();
    
    if (result.isAdmin) {
      // If the user is an admin, redirect to the admin route
      router.push('/Scholarships');
    } else {
      // Non-admin users are redirected to the home page
      router.push('/');
    }
  } catch (err) {
    console.error('Failed to log in with Google:', err);
    setError('Failed to log in with Google');
  }
};


  return (
    <>
      <Head>
        <title>Login to Darsana | Enjoy Your Scrolling Experience</title>
        <meta name="description" content="Log in to Darsana and enjoy a unique scrolling experience." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Darsana, login, social media" />
        <meta property="og:title" content="Login to Darsana" />
        <meta property="og:description" content="Log in to Darsana for a unique scrolling experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.darsana.com/login" />
        <meta property="og:image" content="https://www.darsana.com/og-image.jpg" />
        <link rel="canonical" href="https://www.darsana.com/login" />
      </Head>
      <div className="w-full min-h-screen bg-white p-4 sm:p-8 lg:p-16 font-sans flex items-center justify-center">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-gray-900">Welcome to Darsana</h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8">We hope you will enjoy your scrolling with us</p>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <button
                onClick={handleLoginWithGoogle}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center lg:text-left">
              By signing up, you agree to the <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
          <div className="hidden lg:block lg:w-1/2 lg:pl-8">
            <Image
              src={darsanalogin}
              alt="Loginimage"
              width={900}
              height={100}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
