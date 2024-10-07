'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipEdit';
import { useRouter } from 'next/navigation';
import { uploadFileToFirebase } from '@/lib/firebase/config';
interface FinalSubmitProps {

    initialEmail: string; // Corrected type here
}
const FinalSubmit: React.FC<FinalSubmitProps> = ({

    initialEmail,
}) => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>("");
    const Router = useRouter();

    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/trackInSave/${initialEmail}`);

            if (!response.ok) {
                throw new Error("Failed to fetch scholarship details");
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
        setScholarshipDetails((prevDetails) => ({
            ...prevDetails,
            ...updatedDetails,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Add scholarship data to FormData
            formData.append('scholarshipData', JSON.stringify(scholarshipDetails));

            // Add the uploaded files to the FormData
            if (uploadedFile) {
                // The field name should match the expected file keys in your backend
                formData.append(fileType, uploadedFile);
            }

            // Make the POST request with the form data
            const response = await fetch(`/api/ScholarshipApi/PostScholarship/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit scholarship');
            }

            alert('Scholarship submitted successfully');
        } catch (error) {
            console.error('Error submitting scholarship:', error);
            alert('Error submitting scholarship');
        }

        // Redirect after submission if needed
        // Router.push(`/Scholarships/${applicationNumber}`);
    };


    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileStatus((prevStatus) => ({
            ...prevStatus,
            [field]: file.name,
        }));

        setUploadedFile(file);
        setFileUploaded(true);
        setFileType(field.replace("Url", "")); // Remove 'Url' suffix if present
    };

    const handleEyeClick = (url: string) => {
        window.open(url, "_blank");
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
                            <Documentation
                                scholarshipDetails={scholarshipDetails}
                                onUpload={handleUpload}
                                onEye={handleEyeClick}
                                fileStatus={fileStatus}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Final Submit
                </button>
                {/* {fileUploaded && (
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={handleFileSubmit}
                    >
                        Upload File
                    </button>
                )} */}
            </div>
        </form>
    );
};

export default FinalSubmit;