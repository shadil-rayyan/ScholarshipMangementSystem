// src\app\(client)\Scholarship\[applicationNumber]\page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetScholarshipDetail/${applicationNumber}`);
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
    doc.text('Darsana Scholarship', 105, 20, { align: 'center' });

    // Define colors and styles
    const titleFontSize = 16;
    const sectionFontSize = 14;
    const contentFontSize = 12;
    const lineHeight = 10;
    const marginX = 20;
    const marginY = 30;
    const sectionMargin = 10;
    const pageHeight = doc.internal.pageSize.height;

    const addTextWithPageBreak = (text: string, x: number, y: number) => {
        const lines = doc.splitTextToSize(text, 160);
        lines.forEach((line, index) => {
            if (y + lineHeight > pageHeight - 20) {
                doc.addPage();
                y = marginY;
            }
            doc.text(line, x, y);
            y += lineHeight;
        });
        return y;
    };

    let currentY = marginY;

    // Personal Details
    doc.setFontSize(titleFontSize);
    doc.setTextColor(0, 102, 204);
    currentY = addTextWithPageBreak('Personal Details', marginX, currentY);

    doc.setFontSize(contentFontSize);
    doc.setTextColor(0, 0, 0);
    currentY = addTextWithPageBreak(`Application Number: ${scholarshipDetails.applicationNumber}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Name: ${scholarshipDetails.name}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Father's Name: ${scholarshipDetails.fatherName}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Mother's Name: ${scholarshipDetails.motherName || 'N/A'}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Gender: ${scholarshipDetails.gender}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Date of Birth: ${new Date(scholarshipDetails.dateOfBirth).toLocaleDateString()}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Aadhar Number: ${scholarshipDetails.adharNumber}`, marginX, currentY);

    // Contact Details
    doc.setFontSize(sectionFontSize);
    doc.setTextColor(0, 102, 204);
    currentY = addTextWithPageBreak('Contact Details', marginX, currentY + sectionMargin);

    doc.setFontSize(contentFontSize);
    doc.setTextColor(0, 0, 0);
    currentY = addTextWithPageBreak(`House/Apartment: ${scholarshipDetails.houseApartmentName || 'N/A'}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Place/State: ${scholarshipDetails.placeState || 'N/A'}`, marginX, currentY);
    currentY = addTextWithPageBreak(`District: ${scholarshipDetails.district}`, marginX, currentY);
    currentY = addTextWithPageBreak(`State: ${scholarshipDetails.state}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Country: ${scholarshipDetails.country}`, marginX, currentY);
    currentY = addTextWithPageBreak(`PIN Code: ${scholarshipDetails.pinCode || 'N/A'}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Student Email: ${scholarshipDetails.studentEmail}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Father's Number: ${scholarshipDetails.fatherNumber}`, marginX, currentY);

    // Educational and Bank Details
    doc.setFontSize(sectionFontSize);
    doc.setTextColor(0, 102, 204);
    currentY = addTextWithPageBreak('Educational and Bank Details', marginX, currentY + 2 * sectionMargin);

    doc.setFontSize(contentFontSize);
    doc.setTextColor(0, 0, 0);
    currentY = addTextWithPageBreak(`College Name: ${scholarshipDetails.nameOfTheCollege}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Branch: ${scholarshipDetails.branch}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Semester: ${scholarshipDetails.semester}`, marginX, currentY);
    currentY = addTextWithPageBreak(`CGPA: ${scholarshipDetails.cgpa}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Hostel Resident: ${scholarshipDetails.hostelResident ? 'Yes' : 'No'}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Bank Name: ${scholarshipDetails.bankName}`, marginX, currentY);
    currentY = addTextWithPageBreak(`Account Number: ${scholarshipDetails.accountNumber}`, marginX, currentY);

    // // Documentation Details
    // doc.setFontSize(sectionFontSize);
    // doc.setTextColor(0, 102, 204);
    // currentY = addTextWithPageBreak('Documentation Details', marginX, currentY + 3 * sectionMargin);

    // doc.setFontSize(contentFontSize);
    // doc.setTextColor(0, 0, 0);
    // currentY = addTextWithPageBreak(`Aadhar Card URL: ${scholarshipDetails.aadharCardUrl || 'N/A'}`, marginX, currentY);

    // // Application Metadata
    // doc.setFontSize(sectionFontSize);
    // doc.setTextColor(0, 102, 204);
    // currentY = addTextWithPageBreak('Application Metadata', marginX, currentY + 4 * sectionMargin);

    // doc.setFontSize(contentFontSize);
    // doc.setTextColor(0, 0, 0);
    // currentY = addTextWithPageBreak(`Status: ${scholarshipDetails.status}`, marginX, currentY);
    // currentY = addTextWithPageBreak(`Remark: ${scholarshipDetails.remark || 'N/A'}`, marginX, currentY);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const footerText = 'Produced by Darsana Scholarship Management System';
    const footerY = pageHeight - 10;
    doc.text(footerText, 105, footerY, { align: 'center' });

    // Save the PDF
    doc.save(`scholarship-details-${scholarshipDetails.applicationNumber}.pdf`);
};



    // if (loading) return <div>Loading...</div>;
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

export default ScholarshipDetailPage;
