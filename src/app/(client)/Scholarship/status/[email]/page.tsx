"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScholarshipDetails } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';

const ScholarshipStatusPage: React.FC = () => {
  const { email } = useParams(); // Use useParams to get the email from the URL
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try {
          const response = await fetch(`/api/ScholarshipApi/trackApplication/${email}`);
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Failed to fetch data", error);
        }
      }
    };

    fetchData();
  }, [email]);

  const getDefaultVerificationTable = () => {
    return [
      { label: 'Step 1: Verify', value: '', admin: null },
      { label: 'Step 2: Select', value: '', admin: null },
      { label: 'Step 3: Amount Proceed', value: '', admin: null },
      { label: 'Step 4: Reject', value: '', admin: null },
    ];
  };

  const table = data?.verificationTable || getDefaultVerificationTable();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scholarship Application Status</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Application Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {data?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {data?.studentEmail || 'N/A'}</p>
          </div>
        </div>
        {data?.remark && (
          <div className="mt-4">
            <h3 className="font-semibold">Remarks:</h3>
            <p>{data.remark}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Verification Table</h2>
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="border px-4 py-2">Verification Steps</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Admin</th>
            </tr>
          </thead>
          <tbody>
            {table.map((step, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{step.label}</td>
                <td className="border px-4 py-2">{step.value || 'N/A'}</td>
                <td className="border px-4 py-2">{step.admin || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <label>
            <strong>Status:</strong>
            <input
              type="text"
              value={data?.status || ''}
              style={{ padding: '5px', border: '1px solid #ccc', width: '90%', textTransform: 'uppercase' }}
              readOnly
            />
          </label>

          <label>
            <strong>Remark:</strong>
            <input
              type="text"
              value={data?.remark || ''}
              style={{ padding: '5px', border: '1px solid #ccc', width: '100%' }}
              readOnly
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipStatusPage;
