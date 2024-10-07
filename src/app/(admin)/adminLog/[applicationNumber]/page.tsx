'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface VerificationLog {
    id: number;
    applicationNumber: number;
    status: string;
    adminName: string;
    createdAt: string;
}

const AdminLog: React.FC = () => {
    const { applicationNumber } = useParams();
    const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (applicationNumber) {
            fetchVerificationLogs();
        }
    }, [applicationNumber]);

    const fetchVerificationLogs = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetVerificationLog/${applicationNumber}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch verification logs: ${await response.text()}`);
            }

            const data: VerificationLog[] = await response.json();
            setVerificationLogs(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Error fetching verification logs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Verification Logs for Application {applicationNumber}</h1>
            {verificationLogs.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Admin Name</th>
                            <th className="py-2 px-4 border-b">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {verificationLogs.map((log) => (
                            <tr key={log.id}>
                                <td className="py-2 px-4 border-b">{log.id}</td>
                                <td className="py-2 px-4 border-b">{log.status}</td>
                                <td className="py-2 px-4 border-b">{log.adminName}</td>
                                <td className="py-2 px-4 border-b">{new Date(log.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No verification logs available for this application number.</p>
            )}
        </div>
    );
};

export default AdminLog;
