"use client";

import React, { useState, useEffect } from 'react';
import {
    PersonalDetails,
    ContactDetails,
    EducationalAndBankDetails,
    Documentation,
    Verification
} from '@/components/scholarshipadmin/ScholarshipDetailsComponent'; // Adjust the import path if needed
import { useParams } from 'next/navigation';
import { SelectScholarship } from '@/db/schema/scholarship/scholarshipData';

const [scholarshipDetails, setScholarshipDetails] = useState<ScholarshipDetails>({ ...initialData });

const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<SelectScholarship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const [verificationTable, setVerificationTable] = useState([
        { label: 'Verified by Darsana', value: '', admin: 'Admin 1' },
        { label: 'Selected for Scholarship', value: '', admin: '' },
        { label: 'Amount processed from Darsana', value: '', admin: 'Admin 2' }
    ]);

    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetScholarshipDetail/${applicationNumber}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch scholarship details: ${errorText}`);
            }
            const data: ScholarshipDetails = await response.json();  // Ensure this type matches the expected structure
            setScholarshipDetails(data);
        } catch (err) {
            setError('Error fetching scholarship details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    const handleNextClick = () => {
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 3000);

        const tabs = ['personal', 'contact', 'educational', 'documentation', 'verification'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handlePreviousClick = () => {
        const tabs = ['personal', 'contact', 'educational', 'documentation', 'verification'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const handleSubmitClick = () => {
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 3000);

        // if (activeTab === 'verification') {
        //     generatePDF();  // Implement PDF generation logic here
        // } else {
        //     handleNextClick();
        // }
    };



    const updateScholarshipDetails = (details: ScholarshipDetails) => {
        setScholarshipDetails(details);
    };

    const renderTabContent = () => {
        if (!scholarshipDetails) return null;

        switch (activeTab) {
            case 'personal':
                return <PersonalDetails scholarshipDetails={scholarshipDetails} />;
            case 'contact':
                return <ContactDetails scholarshipDetails={scholarshipDetails} />;
            case 'educational':
                return <EducationalAndBankDetails scholarshipDetails={scholarshipDetails} />;
            case 'documentation':
                return <Documentation documentationData={scholarshipDetails.documentationData} />;
            case 'verification':
                return (


                    // Pass this function to props
                    <Verification
                        status={status}
                        setStatus={setStatus}
                        verificationTable={verificationTable}
                        setVerificationTable={setVerificationTable}
                        scholarshipDetails={scholarshipDetails}
                        setScholarshipDetails={updateScholarshipDetails}
                    />

                );
            default:
                return null;
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex border-b">
                    {['personal', 'contact', 'educational', 'documentation', 'verification'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-center ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {tab === 'educational' ? 'Educational and Bank Details' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                        </button>
                    ))}
                </div>
                <div className="p-6">{renderTabContent()}</div>
            </div>
            <div className={`flex mt-6 ${activeTab === 'personal' ? 'justify-end' : 'justify-between'}`}>
                {activeTab !== 'personal' && (
                    <button
                        onClick={handlePreviousClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Previous
                    </button>
                )}
                {activeTab !== 'verification' ? (
                    <button
                        onClick={handleNextClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Submit
                    </button>
                )}
            </div>
            {showDraftSaved && <div className="mt-4 text-green-500">Draft saved!</div>}
        </div>
    );
};

export default ScholarshipDetailPage;
