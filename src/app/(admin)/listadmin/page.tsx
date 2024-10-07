// app/admin/AdminList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { firestore } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of admins from Firestore
  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const adminCollection = collection(firestore, 'adminemail');
      const adminSnapshot = await getDocs(adminCollection);
      const adminList = adminSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminList);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to fetch admins: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Admin List</h2>
      <ul>
        {admins.length > 0 ? (
          admins.map(admin => (
            <li key={admin.id} className="mb-4 p-4 border border-gray-200 rounded">
              <p><strong>Email:</strong> {admin.id}</p>
              <p><strong>Added By:</strong> {admin.addedBy ?? 'N/A'}</p>
              <p>
                <strong>Timestamp:</strong>{' '}
                {admin.timestamp ? new Date(admin.timestamp.toDate()).toLocaleString() : 'N/A'}
              </p>
            </li>
          ))
        ) : (
          <p>No admins found.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminList;
