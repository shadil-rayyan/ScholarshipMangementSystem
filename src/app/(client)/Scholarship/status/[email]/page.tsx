"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ScholarshipStatusPage: React.FC = () => {
  const { email } = useParams(); // Use useParams to get the email from the URL
  const [data, setData] = useState<any>(null);
  const router = useRouter(); // Initialize the router

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

  // Handler for routing to the full profile page
  const handleViewFullProfile = () => {
    if (data && data.applicationNumber) {
      router.push(`/Scholarship/${data.applicationNumber}`);
    }
  };


  return (
    <div className="container mx-auto  p-6">
      <h1 className="text-3xl font-bold  text-center text-blue-600">Scholarship Application Status</h1>

      <div className="bg-white  rounded-lg p-8 pb-0 mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Application Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr style={{ backgroundColor: '#004b77', color: '#fff', borderRadius: '5px' }}>
                <th style={{ padding: '10px', borderRight: '1px solid #ccc', width: '30%' }}>Current Status</th>
                <th style={{ padding: '10px', width: '70%' }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Name</td>
                <td className="border px-4 py-2">{data?.name || ''}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Email</td>
                <td className="border px-4 py-2">{data?.studentEmail || ''}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Application ID</td>
                <td className="border px-4 py-2">{data?.applicationNumber || ''}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Status</td>
                <td className="border px-4 py-2">{data?.status || ''}</td>
              </tr>

            </tbody>
          </table>

          <div className="bg-white rounded-lg p-4 pb-0 px-0 mb-3">
            <h3 className="text-xl  font mb-4 text-gray-800">Remark</h3>
            <div className="w-full p-4 border border-gray-300 rounded-lg  min-h-[80px]" style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}>
              <p>{data?.remark || 'No remarks'}</p>
            </div>
          </div>

        </div>
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
                <td className="border px-4 py-2">{step.value || ''}</td>
                <td className="border px-4 py-2">{step.value ? 'Yes' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleViewFullProfile}
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipStatusPage;
