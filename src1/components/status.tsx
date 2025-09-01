import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ScholarshipStatusPage: React.FC<{ email: string }> = ({ email }) => {
  const [data, setData] = useState<any>(null);
  const [notApplicant, setNotApplicant] = useState<boolean>(false); // New state to handle no applicant scenario
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try {
          const response = await fetch(`/api/ScholarshipApi/trackApplication/${email}`);
          const result = await response.json();

          if (result.error || !result.applicationNumber) {
            // If no valid application is found, set the "notApplicant" flag
            setNotApplicant(true);
          } else {
            setData(result);
          }
        } catch (error) {
          console.error("Failed to fetch data", error);
          setNotApplicant(true);
        }
      }
    };

    fetchData();
  }, [email]);

  if (notApplicant) {
    return (
      <div className="text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">You are not a scholarship applicant.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Scholarship Application Status</h1>

      {data && (
        <>
          {/* Application Details Section */}
          <div className="bg-white rounded-lg p-8 pb-0 mb-6 shadow-lg mx-auto max-w-4xl lg:max-w-5xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Application Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr style={{ backgroundColor: '#004b77', color: '#fff', borderRadius: '5px' }}>
                    <th className="p-4 border-r border-gray-300 w-1/3">Current Status</th>
                    <th className="p-4 w-2/3"></th>
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

              <div className="bg-white rounded-lg p-4 mb-3">
                <h3 className="text-xl mb-4 text-gray-800">Remark</h3>
                <div
                  className="w-full p-4 border border-gray-300 rounded-lg min-h-[80px] bg-gray-50"
                >
                  <p>{data?.remark || 'No remarks'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Table Section */}
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl lg:max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Verification Table</h2>
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Verification Steps</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.verificationTable?.map((step, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{step.label}</td>
                    <td className="border px-4 py-2">{step.value ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ScholarshipStatusPage;
