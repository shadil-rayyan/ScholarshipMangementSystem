// app/admin/RemoveAdmin.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, getDoc, deleteDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const RemoveAdmin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showRemovedAdmins, setShowRemovedAdmins] = useState<boolean>(false);
  const router = useRouter();

  // Function to check if the user is an admin
  const checkIfUserIsAdmin = async (userEmail: string): Promise<boolean> => {
    const adminDoc = doc(firestore, 'adminemail', userEmail);
    const docSnap = await getDoc(adminDoc);
    return docSnap.exists();
  };

  // Function to handle removing an admin
  const handleRemoveAdmin = async () => {
    if (!email) {
      setError('Email cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;

      if (user) {
        const isAdmin = await checkIfUserIsAdmin(user.email!);

        if (isAdmin) {
          // Remove the admin
          await deleteDoc(doc(firestore, 'adminemail', email));

          // Log the removal
          const removedAdminData = {
            email: email,
            removedBy: user.email ?? 'N/A', // Use 'N/A' if removedBy is null
            timestamp: new Date() // Always set a timestamp, but you can check for missing data elsewhere
          };
          await setDoc(doc(firestore, 'removedadmin', email), removedAdminData);

          setSuccess('Admin removed successfully!');
          setEmail('');
        } else {
          setError('You are not authorized to remove admins.');
        }
      } else {
        setError('You must be logged in to remove an admin.');
      }
    } catch (err: any) {
      console.error('Error removing admin:', err);
      setError('Failed to remove admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle the display of removed admins
  const handleToggleRemovedAdmins = () => {
    setShowRemovedAdmins(!showRemovedAdmins);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Remove Admin</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      {loading && <p className="text-blue-500">Loading...</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter admin email"
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />
      <button
        onClick={handleRemoveAdmin}
        className="bg-red-600 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        Remove Admin
      </button>
      <button
        onClick={handleToggleRemovedAdmins}
        className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
      >
        {showRemovedAdmins ? 'Hide Removed Admins' : 'Show Removed Admins'}
      </button>
      {showRemovedAdmins && <RemovedAdminsList />}
    </div>
  );
};

// Component to display the list of removed admins
const RemovedAdminsList: React.FC = () => {
  const [removedAdmins, setRemovedAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRemovedAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const removedAdminCollection = collection(firestore, 'removedadmin');
        const removedAdminSnapshot = await getDocs(removedAdminCollection);
        const removedAdminList = removedAdminSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRemovedAdmins(removedAdminList);
      } catch (err) {
        console.error('Error fetching removed admins:', err);
        setError('Failed to fetch removed admins: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemovedAdmins();
  }, []);

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Removed Admins</h3>
      <ul>
        {removedAdmins.length > 0 ? (
          removedAdmins.map(admin => (
            <li key={admin.id} className="mb-4 p-4 border border-gray-200 rounded">
              <p><strong>Email:</strong> {admin.email ?? 'N/A'}</p>
              <p><strong>Removed By:</strong> {admin.removedBy ?? 'N/A'}</p>
              <p>
                <strong>Timestamp:</strong> 
                {admin.timestamp ? new Date(admin.timestamp.toDate()).toLocaleString() : 'N/A'}
              </p>
            </li>
          ))
        ) : (
          <p>No removed admins found.</p>
        )}
      </ul>
    </div>
  );
};

export default RemoveAdmin;
