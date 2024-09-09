// src\app\(admin)\Scholarships\page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SelectScholarship } from '@/db/schema/scholarship/scholarshipData';
import Filter from '@/components/filter/filter';

const ScholarshipPage: React.FC = () => {
    const [scholarships, setScholarships] = useState<SelectScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [filters, setFilters] = useState({
        applicationId: '',
        status: '',
        branch: '',
        year: '',
    });


    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            const response = await fetch('/api/ScholarshipApi/GetScholarshipCard');
            if (!response.ok) {
                throw new Error('Failed to fetch scholarships');
            }
            const data = await response.json();
            setScholarships(data);
        } catch (err) {
            setError('Error fetching scholarships. Please try again later.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (applicationNumber: number) => {
        router.push(`/Scholarships/${applicationNumber.toString()}`);
    };
    const handleFilterChange = (newFilters: { applicationId: string; status: string; branch: string; year: string }) => {
        setFilters(newFilters);
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Scholarships</h1>
            <Filter onFilterChange={handleFilterChange} />
            <table className="min-w-full bg-white border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Application No.</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Branch</th>
                        {/* <th className="py-2 px-4 border-b">Year</th> */}
                        <th className="py-2 px-4 border-b">Semester</th>
                        {/* <th className="py-2 px-4 border-b">Type</th> */}
                        <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {scholarships.map((scholarship) => (
                        <tr
                            key={scholarship.id}
                            onClick={() => handleRowClick(scholarship.applicationNumber)}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <td className="py-2 px-4 border-b">{scholarship.applicationNumber}</td>
                            <td className="py-2 px-4 border-b">{scholarship.name}</td>
                            <td className="py-2 px-4 border-b">{scholarship.branch}</td>
                            {/* <td className="py-2 px-4 border-b">{scholarshi.year}</td> */}
                            <td className="py-2 px-4 border-b">{scholarship.semester}</td>
                            {/* <td className="py-2 px-4 border-b">{scholarship.ype}</td> */}
                            <td className="py-2 px-4 border-b">{scholarship.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


    );
};

export default ScholarshipPage;