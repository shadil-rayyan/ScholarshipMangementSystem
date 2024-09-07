'use client';

import React from 'react';

async function getScholarshipData(email: string) {
    const response = await fetch(`http://localhost:3000/api/ScholarshipApi/trackApplication/${email}`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Failed to fetch scholarship data');
    }
    return response.json();
}

export default async function ScholarshipStatusPage({ params }: { params: { email: string } }) {
    const email = decodeURIComponent(params.email);
    let scholarshipData;
    let error;

    try {
        scholarshipData = await getScholarshipData(email);
    } catch (err) {
        error = err.message;
    }

    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>;
    if (!scholarshipData) return <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">No scholarship data found for this email.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Scholarship Application Status</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Name:</strong> {scholarshipData.name}</p>
                        <p><strong>Application Number:</strong> {scholarshipData.applicationNumber}</p>
                        <p><strong>Email:</strong> {scholarshipData.studentEmail}</p>
                        <p><strong>Status:</strong> <span className="font-bold text-blue-600">{scholarshipData.status}</span></p>
                    </div>
                    <div>
                        <p><strong>College:</strong> {scholarshipData.nameOfTheCollege}</p>
                        <p><strong>Branch:</strong> {scholarshipData.branch}</p>
                        <p><strong>Semester:</strong> {scholarshipData.semester}</p>
                        <p><strong>CGPA:</strong> {scholarshipData.cgpa}</p>
                    </div>
                </div>
                {scholarshipData.remark && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Remarks:</h3>
                        <p>{scholarshipData.remark}</p>
                    </div>
                )}
            </div>
        </div>
    );
}