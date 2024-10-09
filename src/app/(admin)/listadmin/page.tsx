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
      {admins.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Added By</th>
              <th className="py-2 px-4 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="py-2 px-4 border-b">{admin.id}</td>
                <td className="py-2 px-4 border-b">{admin.addedBy ?? 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  {admin.timestamp ? new Date(admin.timestamp.toDate()).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No admins found.</p>
      )}
    </div>
  );
};

export default AdminList;
