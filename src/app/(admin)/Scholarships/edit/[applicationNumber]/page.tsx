'use client';
import React, { useState, useEffect } from 'react';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipEdit';
import { useParams } from 'next/navigation';

interface ScholarshipDetails {
    personalDetails: any; // Define a more specific type if possible
    contactDetails: any;
    bankDetails: any;
    educationalDetails: any;
}

const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<ScholarshipDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [files, setFiles] = useState<{ field: string; file: File }[]>([]);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetScholarshipDetail/${applicationNumber}`);
            if (!response.ok) throw new Error(`Failed to fetch scholarship details: ${await response.text()}`);
            const data = await response.json();
            setScholarshipDetails(data);
        } catch (err) {
            setError("Error fetching scholarship details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };



const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    
    // Append all scholarship details
    Object.entries(scholarshipDetails).forEach(([key, value]) => {
        if (key !== 'applicationNumber') {
            formData.append(key, JSON.stringify(value));
        }
    });

    // Append files
    files.forEach(file => formData.append(file.field, file.file));

    formData.append('application_number', applicationNumber.toString());

    try {
        const response = await fetch(`/api/ScholarshipApi/EditScholarship/${applicationNumber}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unknown error occurred');
        }

        setSuccessMessage('Scholarship updated successfully!');
        // Optionally, refresh the scholarship details
        // await fetchScholarshipDetail();
    } catch (error) {
        console.error('Error in handleSubmit:', error);
        setError(`Failed to update scholarship: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
};

    const handleEyeClick = (url: string) => {
        window.open(url, '_blank');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const { value, type } = e.target;
        setScholarshipDetails(prev => {
            if (!prev) return null;
            const updatedDetails = { ...prev };
            const fieldParts = field.split('.');
            let temp = updatedDetails;
            for (let i = 0; i < fieldParts.length - 1; i++) {
                temp = temp[fieldParts[i]] = temp[fieldParts[i]] || {};
            }
            temp[fieldParts[fieldParts.length - 1]] = type === 'radio' ? value === 'true' : value;
            return updatedDetails;
        });
    };

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
        setFileStatus(prev => ({ ...prev, [field]: file.name }));
        setFiles(prev => [...prev, { field, file }]);
    }
};

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <PersonalDetails scholarshipDetails={scholarshipDetails} handleInputChange={handleInputChange} />
                    <ContactDetails scholarshipDetails={scholarshipDetails} handleInputChange={handleInputChange} />
                    <EducationalAndBankDetails scholarshipDetails={scholarshipDetails} handleInputChange={handleInputChange} />
                    <Documentation
                        scholarshipDetails={scholarshipDetails}
                        onUpload={handleUpload}
                        onEye={handleEyeClick}
                        fileStatus={fileStatus}
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isSubmitting}>
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ScholarshipDetailPage;
