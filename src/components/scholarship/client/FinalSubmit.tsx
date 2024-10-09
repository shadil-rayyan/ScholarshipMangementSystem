'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipEdit';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface FinalSubmitProps {
    initialEmail: string;
}

const FinalSubmit: React.FC<FinalSubmitProps> = ({ initialEmail }) => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const Router = useRouter();

    useEffect(() => {
        fetchScholarshipDetail();
    }, [initialEmail]); // Added initialEmail to dependency array

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
        // Logic to handle input changes (if needed)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement submission logic here...
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileStatus((prevStatus) => ({
            ...prevStatus,
            [field]: file.name,
        }));

        setUploadedFile(file);
    };

    const handleEyeClick = (url: string) => {
        window.open(url, "_blank");
    };

    // const handleDownloadPDF = () => {
    //     // Ensure the path correctly generates a PDF based on the application number and email
    //     Router.push(`/Scholarship/${initialEmail}`); // Adjust the route as necessary
    // };

    const handleDownloadPDF = () => {
        if (!scholarshipDetails) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text('Darsana Scholarship ', 105, 20, { align: 'center' });

        // Add download date and time below the title
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString(); // Format as needed (e.g., 'MM/DD/YYYY, HH:mm')

        doc.setFontSize(12); // Set font size for the date
        doc.setTextColor(0, 0, 0); // Black color for text
        doc.text(`Downloaded on: ${formattedDate}`, 105, 30, { align: 'center' }); // Position below the title

        // Define colors and styles
        const titleFontSize = 16;
        const sectionFontSize = 14;
        const contentFontSize = 10; // Reduced font size to fit everything on one page
        const lineHeight = 8; // Reduced line height
        const marginX = 20;
        const marginY = 40; // Start for Personal Details
        const sectionMargin = 5; // Reduced section margin

        // Personal Details
        doc.setFontSize(titleFontSize);
        doc.setTextColor(0, 102, 204); // Blue color for section headers
        doc.text('Personal Details', marginX, marginY);

        doc.setFontSize(contentFontSize);
        doc.setTextColor(0, 0, 0); // Black color for text
        doc.text(`Application Number: ${scholarshipDetails.applicationNumber}`, marginX, marginY + lineHeight);
        doc.text(`Name: ${scholarshipDetails.name}`, marginX, marginY + 2 * lineHeight);
        doc.text(`Father's Name: ${scholarshipDetails.fatherName}`, marginX, marginY + 3 * lineHeight);
        doc.text(`Mother's Name: ${scholarshipDetails.motherName || 'N/A'}`, marginX, marginY + 4 * lineHeight);
        doc.text(`Gender: ${scholarshipDetails.gender}`, marginX, marginY + 5 * lineHeight);
        doc.text(`Date of Birth: ${new Date(scholarshipDetails.dateOfBirth).toLocaleDateString()}`, marginX, marginY + 6 * lineHeight);
        doc.text(`Aadhar Number: ${scholarshipDetails.adharNumber}`, marginX, marginY + 7 * lineHeight);

        // Contact Details
        doc.setFontSize(sectionFontSize);
        doc.setTextColor(0, 102, 204);
        doc.text('Contact Details', marginX, marginY + 8 * lineHeight + sectionMargin);

        doc.setFontSize(contentFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`House/Apartment: ${scholarshipDetails.houseApartmentName || 'N/A'}`, marginX, marginY + 9 * lineHeight + sectionMargin);
        doc.text(`Place/State: ${scholarshipDetails.placeState || 'N/A'}`, marginX, marginY + 10 * lineHeight + sectionMargin);
        doc.text(`District: ${scholarshipDetails.district}`, marginX, marginY + 11 * lineHeight + sectionMargin);
        doc.text(`State: ${scholarshipDetails.state}`, marginX, marginY + 12 * lineHeight + sectionMargin);
        doc.text(`Country: ${scholarshipDetails.country}`, marginX, marginY + 13 * lineHeight + sectionMargin);
        doc.text(`PIN Code: ${scholarshipDetails.pinCode || 'N/A'}`, marginX, marginY + 14 * lineHeight + sectionMargin);
        doc.text(`Student Email: ${scholarshipDetails.studentEmail}`, marginX, marginY + 15 * lineHeight + sectionMargin);
        doc.text(`Father's Number: ${scholarshipDetails.fatherNumber}`, marginX, marginY + 16 * lineHeight + sectionMargin);

        // Educational and Bank Details
        doc.setFontSize(sectionFontSize);
        doc.setTextColor(0, 102, 204);
        doc.text('Educational and Bank Details', marginX, marginY + 17 * lineHeight + 2 * sectionMargin);

        doc.setFontSize(contentFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`College Name: ${scholarshipDetails.nameOfTheCollege}`, marginX, marginY + 18 * lineHeight + 2 * sectionMargin);
        doc.text(`Branch: ${scholarshipDetails.branch}`, marginX, marginY + 19 * lineHeight + 2 * sectionMargin);
        doc.text(`Semester: ${scholarshipDetails.semester}`, marginX, marginY + 20 * lineHeight + 2 * sectionMargin);
        doc.text(`CGPA: ${scholarshipDetails.cgpa}`, marginX, marginY + 21 * lineHeight + 2 * sectionMargin);
        doc.text(`Hostel Resident: ${scholarshipDetails.hostelResident ? 'Yes' : 'No'}`, marginX, marginY + 22 * lineHeight + 2 * sectionMargin);
        doc.text(`Bank Name: ${scholarshipDetails.bankName}`, marginX, marginY + 23 * lineHeight + 2 * sectionMargin);
        doc.text(`Account Number: ${scholarshipDetails.accountNumber}`, marginX, marginY + 24 * lineHeight + 2 * sectionMargin);

        // doc.text(`Remark: ${scholarshipDetails.remark || 'N/A'}`, marginX, marginY + 29 * lineHeight + 4 * sectionMargin);

        // Footer
        doc.setFontSize(10);
        doc.text('Generated for darsana Scholarship System', 105, 290, { align: 'center' }); // Centered footer

        // Save the PDF
        doc.save(`scholarship-details-${scholarshipDetails.applicationNumber}.pdf`);
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

            <div className="mt-6 flex justify-between space-x-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Final Submit
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </button>
            </div>
        </form>
    );
};

export default FinalSubmit;
