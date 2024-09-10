'use client'
import React, { useEffect, useState } from 'react';
import { ScholarshipDetails } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';

interface ScholarshipStatusPageProps {
  verificationTable?: {
    label: string;
    value: string;
    admin: string | null;
  }[];
  scholarshipDetails: ScholarshipDetails | null;
}

const ScholarshipStatusPage: React.FC<ScholarshipStatusPageProps> = ({
  verificationTable = [],
  scholarshipDetails,
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/ScholarshipApi/trackApplication/${scholarshipDetails?.studentEmail}`);
      const result = await response.json();
      setData(result);
    };

    if (scholarshipDetails?.studentEmail) {
      fetchData();
    }
  }, [scholarshipDetails?.studentEmail]);

  // Function to get default verification table
  const getDefaultVerificationTable = () => {
    return [
      { label: 'Step 1: Verify', value: '', admin: null },
      { label: 'Step 2: Select', value: '', admin: null },
      { label: 'Step 3: Amount Proceed', value: '', admin: null },
      { label: 'Step 4: Reject', value: '', admin: null },
    ];
  };

  // Use default table if verificationTable is empty or not provided
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
        <div style={{ marginTop: '30px' ,marginBottom: '20px' }}>
        <label>
          <strong>Status:</strong>
          <input
            type="text"
            value={scholarshipDetails?.status || ''}
            style={{ padding: '5px', border: '1px solid #ccc', width: '90%', textTransform: 'uppercase' }}
          />
        </label>

        <label>
          <strong>Remark:</strong>
          <input
            type="text"
            value={scholarshipDetails?.remark || ''}
            style={{ padding: '5px', border: '1px solid #ccc', width: '100%' }}
          />
        </label>
      </div>
      </div>
    </div>
  );
};

export default ScholarshipStatusPage;
