// src/app/(client)/Scholarship/status/page.tsx

"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const StatusPage: React.FC = () => {
    const [statusData, setStatusData] = useState<any>(null); // Adjust the type according to your API response
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('student_email') || ''; // Now retrieving the email from query params

    useEffect(() => {
        const fetchStatusData = async () => {
            if (!email) return; // Exit if no email provided

            try {
                const response = await fetch(`/api/ScholarshipApi/trackApplication/${email}`); // Adjusted to use email
                if (!response.ok) {
                    throw new Error('Application not found');
                }
                const data = await response.json();
                setStatusData(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatusData();
    }, [email]); // Depend on email instead of applicationNumber

    const handleViewProfileClick = () => {
        router.push(`/Scholarship/${email}`);
        // Updated to push the email instead of applicationNumber

    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 border border-gray-300 rounded-lg max-w-3xl mx-auto mt-10">
            {/* Status Table */}
            <div className="mb-4">
                <table className="w-full border-collapse text-left border border-gray-300">
                    <thead>
                        <tr className="bg-blue-800 text-white">
                            <th className="p-2 border-r">Current Status</th>
                            <th className="p-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border-b border-r">Name</td>
                            <td className="p-2 border-b">{statusData?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b border-r">Email</td>
                            <td className="p-2 border-b">{statusData?.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b border-r">Selected for Scholarship</td>
                            <td className="p-2 border-b">{statusData?.selectedForScholarship || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b border-r">Amount Processed from Darsana</td>
                            <td className="p-2 border-b">{statusData?.amountProcessed || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b border-r">Status</td>
                            <td className="p-2 border-b">{statusData?.status || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b border-r">Remarks</td>
                            <td className="p-2 border-b">{statusData?.remarks || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Inbox Section */}
            <div className="mb-4">
                <h3 className="text-xl font-semibold">Inbox</h3>
                <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 min-h-20">
                    <p>{statusData?.inboxMessage || 'N/A'}</p>
                </div>
            </div>

            {/* View Profile Button */}
            <div className="text-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={handleViewProfileClick}
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
};

export default StatusPage;
