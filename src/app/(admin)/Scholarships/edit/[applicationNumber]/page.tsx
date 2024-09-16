'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails,  } from '@/components/scholarshipadmin/ScholarshipEdit';
import {useRouter } from 'next/navigation';
// import {Documentation} from '@/components/scholarshipadmin/ScholarshipEdit';
const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const Router = useRouter();

    
    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetScholarshipDetail/${applicationNumber}`);
            if (!response.ok) {
                throw new Error('Failed to fetch scholarship details');
            }
            const data = await response.json();
            setScholarshipDetails(data);
        } catch (err) {
            setError("Error fetching scholarship details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };



    const handleInputChange = (updatedDetails: Partial<any>) => {

        setScholarshipDetails(prevDetails => ({
            ...prevDetails,
            ...updatedDetails
        }));

    };


    // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    //     const value = e.target.checked;
    //     setScholarshipDetails(prevDetails => ({
    //         ...prevDetails,
    //         [fieldName]: value,
    //     }));
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/ScholarshipApi/EditScholarship/${applicationNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scholarshipData: scholarshipDetails }),
            });

            if (!response.ok) {
                throw new Error('Failed to update scholarship');
            }

            alert('Scholarship updated successfully');
        } catch (error) {
            alert('Error updating scholarship');
        }

        Router.push (`/Scholarships/${applicationNumber}`);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileStatus(prevStatus => ({
            ...prevStatus,
            [field]: file.name,
        }));
    };

    const handleEyeClick = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    {scholarshipDetails && (
                        <>
                            <PersonalDetails
                                scholarshipDetails={scholarshipDetails}
                                handleInputChange={handleInputChange}
                            />
                            <ContactDetails
                                scholarshipDetails={scholarshipDetails}
                                handleInputChange={handleInputChange}
                            />
                            <EducationalAndBankDetails
                                scholarshipDetails={scholarshipDetails}
                                handleInputChange={handleInputChange}

                            />
                            {/* <Documentation
                                scholarshipDetails={scholarshipDetails}
                                onUpload={handleUpload}
                                onEye={handleEyeClick}
                                fileStatus={fileStatus}
                            /> */}
                        </>
                    )}

                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ScholarshipDetailPage;