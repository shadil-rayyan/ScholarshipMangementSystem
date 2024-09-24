// app/admin/AddAdmin.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AddAdmin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Function to check if the user is an admin
  const checkIfUserIsAdmin = async (userEmail: string): Promise<boolean> => {
    const adminDoc = doc(firestore, 'adminemail', userEmail);
    const docSnap = await getDoc(adminDoc);
    return docSnap.exists();
  };

  // Function to handle adding a new admin
  const handleAddAdmin = async () => {
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
          const adminData = {
            role: 'admin',
            addedBy: user.email,
            timestamp: new Date()
          };
          await setDoc(doc(firestore, 'adminemail', email), adminData);
          setSuccess('Admin added successfully!');
          setEmail('');
        } else {
          setError('You are not authorized to add admins.');
        }
      } else {
        setError('You must be logged in to add an admin.');
      }
    } catch (err: any) {
      console.error('Error adding admin:', err);
      setError('Failed to add admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
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
        onClick={handleAddAdmin}
        className="bg-blue-600 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        Add Admin
      </button>
    </div>
  );
};

export default AddAdmin;
