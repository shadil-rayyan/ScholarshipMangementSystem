'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation } from '@/components/scholarship/client/final';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

interface ScholarshipDetails {
    name: string;
    applicationNumber: string;
    dateOfBirth: string;
    gender: string;
    applicationtype: string;
    category: string;
    adharNumber: string;
    fatherName: string;
    fatherNumber: string;
    motherName: string;
    motherNumber: string;
    income: string;
    fatherOccupation: string;
    studentNumber: string;
    motherOccupation: string;

    state: string;
    pinCode: string;
    houseApartmentName: string;
    placeState: string;
    postOffice: string;
    country: string;

    district: string;
    whatsappNumber: string;
    studentEmail: string;
    alternativeNumber: string;

    nameOfTheCollege: string;
    branch: string;
    semester: string;
    hostelResident: string;
    cgpa: number;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    accountHolder: string;
    status: string;
    remark: string;

    photoUrl: string;
    checkUrl: string;
    aadharCardUrl: string;
    collegeIdCardUrl: string;
    incomeUrl: string;

    selectadmin: string;
    amountadmin: string;
    rejectadmin: string;
    revertedadmin: string;
}

interface FinalSubmitProps {
    initialEmail: string;
}

const FinalSubmit: React.FC<FinalSubmitProps> = ({
    initialEmail,
}) => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<ScholarshipDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>("");
    const Router = useRouter();

    const detailsRef = useRef<HTMLDivElement>(null);

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

    const handleInputChange = (updatedDetails: Partial<ScholarshipDetails>) => {
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
                formData.append(fileType, uploadedFile);
            }

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
        setFileType(field.replace("Url", ""));
    };

    const handleEyeClick = (url: string) => {
        window.open(url, "_blank");
    };

    


    const generatePDF = async () => {
        const doc = new jsPDF();
    
        const columns = [
            { header: "Field", dataKey: "label" },
            { header: "Value", dataKey: "value" }
        ];
    
        const rows = [
            { label: "Name of Candidate", value: scholarshipDetails?.name },
            { label: "Application Number", value: scholarshipDetails?.applicationNumber },
            { label: "Date of Birth", value: scholarshipDetails?.dateOfBirth },
            { label: "Gender", value: scholarshipDetails?.gender },
            { label: "Application Type", value: scholarshipDetails?.applicationtype },
            { label: "Category", value: scholarshipDetails?.category },
            { label: "Aadhar Number", value: scholarshipDetails?.adharNumber },
            { label: "Father's Name", value: scholarshipDetails?.fatherName },
            { label: "Father's Number", value: scholarshipDetails?.fatherNumber },
            { label: "Mother's Name", value: scholarshipDetails?.motherName },
            { label: "Mother's Number", value: scholarshipDetails?.motherNumber },
            { label: "Income", value: scholarshipDetails?.income },
            { label: "Father's Occupation", value: scholarshipDetails?.fatherOccupation },
            { label: "Student's Number", value: scholarshipDetails?.studentNumber },
            { label: "Mother's Occupation", value: scholarshipDetails?.motherOccupation },
            { label: "State", value: scholarshipDetails?.state },
            { label: "Pin Code", value: scholarshipDetails?.pinCode },
            { label: "House/Apartment Name", value: scholarshipDetails?.houseApartmentName },
            { label: "Place/State", value: scholarshipDetails?.placeState },
            { label: "Post Office", value: scholarshipDetails?.postOffice },
            { label: "Country", value: scholarshipDetails?.country },
            { label: "District", value: scholarshipDetails?.district },
            { label: "Whatsapp Number", value: scholarshipDetails?.whatsappNumber },
            { label: "Student Email", value: scholarshipDetails?.studentEmail },
            { label: "Alternative Number", value: scholarshipDetails?.alternativeNumber },
            { label: "Name of the College", value: scholarshipDetails?.nameOfTheCollege },
            { label: "Branch", value: scholarshipDetails?.branch },
            { label: "Semester", value: scholarshipDetails?.semester },
            { label: "Hostel Resident", value: scholarshipDetails?.hostelResident },
            { label: "CGPA", value: scholarshipDetails?.cgpa?.toString() },
            { label: "Bank Name", value: scholarshipDetails?.bankName },
            { label: "Account Number", value: scholarshipDetails?.accountNumber },
            { label: "IFSC Code", value: scholarshipDetails?.ifscCode },
            { label: "Branch Name", value: scholarshipDetails?.branchName },
            { label: "Account Holder", value: scholarshipDetails?.accountHolder },
            // ... add more rows as needed
        ].filter(row => row.value !== undefined);
    
        doc.setFontSize(10);
        doc.text('Scholarship Details', 14, 10);
    
        const tableStartY = 30; // Starting Y position for the table
        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map(row => [row.label, row.value]),
            startY: tableStartY,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 2,
                overflow: 'linebreak',
            },
            margin: { top: 10 },
            didDrawCell: (data) => {
                doc.setDrawColor(200);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            },
        });
    
        // Calculate the position for the timestamp
        // const finalY = doc.lastAutoTable.finalY; // Get the Y position of the last row of the table
        const pageHeight = doc.internal.pageSize.height; // Get the height of the page
        const marginBottom = 20; // Margin from the bottom of the page
        const timestampY = pageHeight - marginBottom; // Position for the timestamp
    
        // Add timestamp at the bottom
        const timestamp = new Date().toLocaleString(); // Customize format if needed
        doc.text(`Generated on: ${timestamp}`, 14, timestampY);
    
        doc.save('scholarship_details.pdf');
    };
    
    // Function to load image remains the same
    const loadImage = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/jpeg'));
                } else {
                    reject('Failed to get canvas context');
                }
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div ref={detailsRef} className="bg-white shadow-md rounded-md p-4">
                <div className="grid grid-cols-1 gap-4">
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
                                handleInputChange={handleInputChange}
                                handleUpload={handleUpload}
                                handleEyeClick={handleEyeClick}
                                fileStatus={fileStatus}
                            />
                        </>
                    )}
                </div>
                <div className="p-4 flex justify-end">
                    <button
                        type="button"
                        onClick={generatePDF}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                    >
                        Generate PDF
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded-md"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FinalSubmit;
