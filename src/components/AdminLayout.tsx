// components/AdminLayout.tsx

import { useEffect, useState } from 'react';
import { useUserSession } from '@/hook/use_user_session';
import { useRouter } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const userUid = useUserSession(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userUid === null) {
      router.push('/auth/Login'); // Redirect to login if not authenticated
    } else {
      setLoading(false); // Hide loading when user is authenticated
    }
  }, [userUid, router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return (
    <div>
      {/* Admin-specific layout elements can go here */}
      {children}
    </div>
  );
};

export default AdminLayout;
