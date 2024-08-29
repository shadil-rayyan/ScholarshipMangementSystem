'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-500">404</h1>
      <p className="text-2xl font-medium text-gray-700">Oops! Something went wrong...</p>
      <div className="flex space-x-4 mt-8">
        <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go Back
        </button>
        <Link href="/" className="text-blue-500 hover:underline">
          Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;