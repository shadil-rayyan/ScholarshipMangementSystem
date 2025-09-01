// src\app\(client)\Scholarship\[applicationNumber]\page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FinalSubmit: React.FC = () => {
    const { email } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchScholarshipDetail();
    }, [email]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/trackApplication/${email}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch scholarship details: ${await response.text()}`);
            }
            const data = await response.json();
            setScholarshipDetails(data);
        } catch (err) {
            setError("Error fetching scholarship details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!scholarshipDetails) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text('Scholarship Details', 105, 20, { align: 'center' });

        // Define colors and styles
        const titleFontSize = 16;
        const sectionFontSize = 14;
        const contentFontSize = 12;
        const lineHeight = 10;
        const marginX = 20;
        const marginY = 30;
        const sectionMargin = 10;

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

        // Documentation Details
        doc.setFontSize(sectionFontSize);
        doc.setTextColor(0, 102, 204);
        doc.text('Documentation Details', marginX, marginY + 25 * lineHeight + 3 * sectionMargin);

        doc.setFontSize(contentFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aadhar Card URL: ${scholarshipDetails.aadharCardUrl || 'N/A'}`, marginX, marginY + 26 * lineHeight + 3 * sectionMargin);

        // Application Metadata
        doc.setFontSize(sectionFontSize);
        doc.setTextColor(0, 102, 204);
        doc.text('Application Metadata', marginX, marginY + 27 * lineHeight + 4 * sectionMargin);

        doc.setFontSize(contentFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`Status: ${scholarshipDetails.status}`, marginX, marginY + 28 * lineHeight + 4 * sectionMargin);
        doc.text(`Remark: ${scholarshipDetails.remark || 'N/A'}`, marginX, marginY + 29 * lineHeight + 4 * sectionMargin);

        // Footer
        doc.setFontSize(10);
        doc.text('Generated by Scholarship System', 105, 290, { align: 'left' });

        // Save the PDF
        doc.save(`scholarship-details-${scholarshipDetails.applicationNumber}.pdf`);
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <PersonalDetails scholarshipDetails={scholarshipDetails} />
                    <ContactDetails scholarshipDetails={scholarshipDetails} />
                    <EducationalAndBankDetails scholarshipDetails={scholarshipDetails} />
                    <Documentation scholarshipDetails={scholarshipDetails} />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default FinalSubmit;
