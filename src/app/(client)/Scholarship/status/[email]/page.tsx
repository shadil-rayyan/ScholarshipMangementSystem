"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScholarshipDetails } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';
import logo from "@/assets/logo.png";

const ScholarshipStatusPage: React.FC = () => {
  const { email } = useParams(); // Use useParams to get the email from the URL
  const router = useRouter(); // Use useRouter for navigation
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state for missing email

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try {
          const response = await fetch(`/api/ScholarshipApi/trackApplication/${email}`);
          const result = await response.json();

          if (response.ok && result) {
            setData(result);
          } else {
            setError("This email is not registered.");
          }
        } catch (error) {
          console.error("Failed to fetch data", error);
          setError("An error occurred while fetching the data.");
        } finally {
          setIsLoading(false); // Stop loading when the request is completed
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={logo.src} alt="Loading..." className="w-min h-max" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">{error}</strong>
        </div>
      </div>
    );
  }

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
              <th className="border px-4 py-2">Admin</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {table.map((step, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{step.label}</td>
                <td className="border px-4 py-2">{step.value || 'N/A'}</td>
                <td className="border px-4 py-2">{step.value ? 'Yes' : 'N/A'}</td>
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
              style={{
                padding: '5px',
                border: '0px solid #ccc',
                width: '100%',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'blue' // Increase the font size here
              }}
              readOnly
            />
          </label>

          <label>
            <strong>Remark:</strong>
            <input
              type="text"
              value={data?.remark || ''}
              style={{
                padding: '5px',
                border: '0px solid #ccc',
                width: '95%',
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'blue' // Increase the font size here
              }}
              readOnly
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              const applicationNumber = data?.applicationNumber; // Make sure applicationNumber is available
              if (applicationNumber) {
                router.push(`/Scholarship/${applicationNumber}`);
              } else {
                alert("Application number not found.");
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipStatusPage;
