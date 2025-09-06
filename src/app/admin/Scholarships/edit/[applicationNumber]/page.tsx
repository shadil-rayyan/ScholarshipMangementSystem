'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipEdit';
import { useRouter } from 'next/navigation';
import { uploadFileToFirebase } from '@/lib/firebase/config';

const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>('');
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

        Router.push(`/Scholarships/${applicationNumber}`);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileStatus(prevStatus => ({
            ...prevStatus,
            [field]: file.name,
        }));

        setUploadedFile(file);
        setFileUploaded(true);
        setFileType(field.replace('Url', '')); // Remove 'Url' suffix if present
    };

    const handleEyeClick = (url: string) => {
        window.open(url, '_blank');
    };

    const handleFileSubmit = async () => {
        if (!uploadedFile || !fileType) {
            alert("No file selected or file type not specified");
            return;
        }

        try {
            const path = 'uploads';
            const downloadURL = await uploadFileToFirebase(uploadedFile, path);

            if (!downloadURL) {
                alert("File upload failed");
                return;
            }

            const response = await fetch(`/api/ScholarshipApi/UpdateFileURL/${applicationNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileUrl: downloadURL,
                    fileType: fileType
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update the scholarship with the file URL');
            }

            const result = await response.json();
            alert("File uploaded and URL updated successfully!");
            console.log("Server response:", result);

            // Refresh scholarship details
            fetchScholarshipDetail();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ color: '#1976d2', marginBottom: '15px' }}>Editing data Instruction</h2> 
      <ol style={{ paddingLeft: '20px', color: '#424242', lineHeight: '1.6' }}>
        <li style={{ marginBottom: '10px' }}>Click on the <strong style={{ color: '#d32f2f' }}>data</strong> then editing enabled.</li>
        <li style={{ marginBottom: '10px' }}>Click <strong style={{ color: '#1976d2' }}>'Save Changes'</strong> button for successful submission of data.wait for redirecting  to previous page</li> 
       
      </ol>
    </div>
                <div className="p-6">
                    {scholarshipDetails && (
                        <>
                            <div style={{ marginBottom: '20px' }}>
    <PersonalDetails
      scholarshipDetails={scholarshipDetails}
      handleInputChange={handleInputChange}
    />
  </div>
  <div style={{ marginBottom: '20px' }}>
    <ContactDetails
      scholarshipDetails={scholarshipDetails}
      handleInputChange={handleInputChange}
    />
  </div>
  <div style={{ marginBottom: '20px' }}>
    <EducationalAndBankDetails
      scholarshipDetails={scholarshipDetails}
      handleInputChange={handleInputChange}
    />
  </div>

<div style={{ margin: '20px 0', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ color: '#1976d2', marginBottom: '15px' }}>Updating Documents Instruction</h2>
      <ol style={{ paddingLeft: '20px', color: '#424242', lineHeight: '1.6' }}>
        <li style={{ marginBottom: '10px' }}>Click the <strong style={{ color: '#d32f2f' }}>upload file icon</strong>.</li>
        <li style={{ marginBottom: '10px' }}>Select a file from your device.</li>
        <li style={{ marginBottom: '10px' }}>Click the <strong style={{ color: '#d32f2f' }}>upload file </strong>button.(it will shown after selecting file)</li>
        <li style={{ marginBottom: '10px' }}>Wait for the alert message: <em style={{ color: '#388e3c' }}>"File uploaded and URL updated successfully!"</em></li>
        <li style={{ marginBottom: '10px' }}>Click <strong style={{ color: '#1976d2' }}>'Save Changes'</strong> for successful submission of data.wait for redirecting  to previous page</li>
      </ol>
    </div>

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
                    Save Changes
                </button>
                {fileUploaded && (
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={handleFileSubmit}
                    >
                        Upload File
                    </button>
                )}
            </div>
        </form>
    );
};

export default ScholarshipDetailPage;