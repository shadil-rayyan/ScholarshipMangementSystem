// src/components/scholarshipadmin/scholarshipadmin/ScholarschipEdit.tsx
import React, { useState } from 'react';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';

export interface ScholarshipDetails {
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


export interface PersonalDetailsProps {
    scholarshipDetails: ScholarshipDetails;
    handleInputChange: (updatedDetails: Partial<ScholarshipDetails>) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ scholarshipDetails, handleInputChange }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns the date in 'YYYY-MM-DD' format
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ScholarshipDetails) => {
        const value = e.target.value;
        handleInputChange({ [field]: value }); // Update only the specific field
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Name */}
            <div>
                <strong>Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.name || ''}
                    onChange={(e) => handleFieldChange(e, 'name')}
                    className="input-class"
                />
            </div>

            {/* DOB */}
            <div>
                <strong>DOB:</strong>
                <input
                    type="date"
                    id="dateOfBirth"
                    value={scholarshipDetails?.dateOfBirth ? formatDate(scholarshipDetails.dateOfBirth) : ''}
                    onChange={(e) => handleFieldChange(e, 'dateOfBirth')}
                    className="input-class"
                />
            </div>

            {/* Gender */}
            <div>
                <strong>Gender:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.gender || ''}
                    onChange={(e) => handleFieldChange(e, 'gender')}
                    className="input-class"
                />
            </div>

            {/* Application Type */}


            {/* Category */}
            <div>
                <strong>Category:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.category || ''}
                    onChange={(e) => handleFieldChange(e, 'category')}
                    className="input-class"
                />
            </div>

            {/* Aadhar Number */}
            <div>
                <strong>Aadhar Number:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.adharNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'adharNumber')}
                    className="input-class"
                />
            </div>

            {/* Father Name */}
            <div>
                <strong>Father Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherName || ''}
                    onChange={(e) => handleFieldChange(e, 'fatherName')}
                    className="input-class"
                />
            </div>

            {/* Father Phone */}
            <div>
                <strong>Father Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'fatherNumber')}
                    className="input-class"
                />
            </div>

            {/* Mother Name */}
            <div>
                <strong>Mother Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherName || ''}
                    onChange={(e) => handleFieldChange(e, 'motherName')}
                    className="input-class"
                />
            </div>

            {/* Mother Phone */}
            <div>
                <strong>Mother Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'motherNumber')}
                    className="input-class"
                />
            </div>

            {/* Income */}
            <div>
                <strong>Income:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.income || ''}
                    onChange={(e) => handleFieldChange(e, 'income')}
                    className="input-class"
                />
            </div>

            {/* Father Occupation */}
            <div>
                <strong>Father Occupation:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherOccupation || ''}
                    onChange={(e) => handleFieldChange(e, 'fatherOccupation')}
                    className="input-class"
                />
            </div>

            {/* Student Phone */}
            <div>
                <strong>Student Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.studentNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'studentNumber')}
                    className="input-class"
                />
            </div>

            {/* Mother Occupation */}
            <div>
                <strong>Mother Occupation:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherOccupation || ''}
                    onChange={(e) => handleFieldChange(e, 'motherOccupation')}
                    className="input-class"
                />
            </div>
        </div>
    );
};

// Define the props with stricter typing for `field`
export interface ContactDetailsProps {
    scholarshipDetails: ScholarshipDetails;
    handleInputChange: (updatedDetails: Partial<ScholarshipDetails>) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ scholarshipDetails, handleInputChange }) => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ScholarshipDetails) => {
        const value = e.target.value;
        handleInputChange({ [field]: value });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* House / Apartment Name */}
            <div>
                <label htmlFor="houseApartmentName"><strong>House / Apartment Name:</strong></label>
                <input
                    id="houseApartmentName"
                    type="text"
                    value={scholarshipDetails?.houseApartmentName || ''}
                    onChange={(e) => handleFieldChange(e, 'houseApartmentName')}
                    className="input-class"
                />
            </div>

            {/* Post Office */}
            <div>
                <label htmlFor="postOffice"><strong>Post Office:</strong></label>
                <input
                    id="postOffice"
                    type="text"
                    value={scholarshipDetails?.postOffice || ''}
                    onChange={(e) => handleFieldChange(e, 'postOffice')}
                    className="input-class"
                />
            </div>

            {/* Place / State */}
            <div>
                <label htmlFor="placeState"><strong>Place / State:</strong></label>
                <input
                    id="placeState"
                    type="text"
                    value={scholarshipDetails?.placeState || ''}
                    onChange={(e) => handleFieldChange(e, 'placeState')}
                    className="input-class"
                />
            </div>

            {/* Country */}
            <div>
                <label htmlFor="country"><strong>Country:</strong></label>
                <input
                    id="country"
                    type="text"
                    value={scholarshipDetails?.country || ''}
                    onChange={(e) => handleFieldChange(e, 'country')}
                    className="input-class"
                />
            </div>

            {/* District */}
            <div>
                <label htmlFor="district"><strong>District:</strong></label>
                <input
                    id="district"
                    type="text"
                    value={scholarshipDetails?.district || ''}
                    onChange={(e) => handleFieldChange(e, 'district')}
                    className="input-class"
                    required
                />
            </div>

            {/* Whatsapp Number */}
            <div>
                <label htmlFor="whatsappNumber"><strong>Whatsapp Number:</strong></label>
                <input
                    id="whatsappNumber"
                    type="tel"
                    value={scholarshipDetails?.whatsappNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'whatsappNumber')}
                    className="input-class"
                    pattern="^\d{10}$" // Restrict to 10-digit phone number
                    required
                />
            </div>

            {/* Student Email */}
            <div>
                <label htmlFor="studentEmail"><strong>Student Email:</strong></label>
                <input
                    id="studentEmail"
                    type="email"
                    value={scholarshipDetails?.studentEmail || ''}
                    onChange={(e) => handleFieldChange(e, 'studentEmail')}
                    className="input-class"
                    required
                />
            </div>

            {/* Alternative Number */}
            <div>
                <label htmlFor="alternativeNumber"><strong>Alternative Number:</strong></label>
                <input
                    id="alternativeNumber"
                    type="tel"
                    value={scholarshipDetails?.alternativeNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'alternativeNumber')}
                    className="input-class"
                // Restrict to 10-digit phone number
                />
            </div>
        </div>
    );
};



export interface EducationalAndBankDetailsProps {
    scholarshipDetails: ScholarshipDetails;
    handleInputChange: (updatedDetails: Partial<ScholarshipDetails>) => void;
}

export const EducationalAndBankDetails: React.FC<EducationalAndBankDetailsProps> = ({
    scholarshipDetails,
    handleInputChange
}) => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ScholarshipDetails) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        handleInputChange({ [field]: value });
    };
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* College Name */}
            <div>
                <label htmlFor="collegeName"><strong>Name of the College:</strong></label>
                <input
                    id="collegeName"
                    type="text"
                    value={scholarshipDetails?.nameOfTheCollege || ''}
                    onChange={(e) => handleFieldChange(e, 'nameOfTheCollege')}
                    className="input-class"
                />
            </div>


            {/* Branch */}
            <div>
                <label htmlFor="branch"><strong>Branch:</strong></label>
                <input
                    id="branch"
                    type="text"
                    value={scholarshipDetails?.branch || ''}
                    onChange={(e) => handleFieldChange(e, 'branch')}
                    className="input-class"
                />
            </div>

            {/* Semester */}
            <div>
                <label htmlFor="semester"><strong>Semester:</strong></label>
                <input
                    id="semester"
                    type="text"
                    value={scholarshipDetails?.semester || ''}
                    onChange={(e) => handleFieldChange(e, 'semester')}
                    className="input-class"
                />
            </div>

            {/* Hostel Resident */}
            {/* <div>
                <label htmlFor="hostelResident"><strong>Hostel Resident:</strong></label>
                <input
                    id="hostelResident"
                    type="checkbox"
                    checked={!!scholarshipDetails?.hostelResident}
                    onChange={(e) => handleFieldChange(e, 'hostelResident')}
                />
                <label htmlFor="hostelResident">Yes</label>
            </div> */}

            {/* CGPA */}
            <div>
                <label htmlFor="cgpa"><strong>CGPA:</strong></label>
                <input
                    id="cgpa"
                    type="text"
                    value={scholarshipDetails?.cgpa || ''}
                    onChange={(e) => handleFieldChange(e, 'cgpa')}
                    className="input-class"
                />
            </div>

            {/* Bank Name */}
            <div>
                <label htmlFor="bankName"><strong>Bank Name:</strong></label>
                <input
                    id="bankName"
                    type="text"
                    value={scholarshipDetails?.bankName || ''}
                    onChange={(e) => handleFieldChange(e, 'bankName')}
                    className="input-class"
                />
            </div>

            {/* Account Number */}
            <div>
                <label htmlFor="accountNumber"><strong>Account Number:</strong></label>
                <input
                    id="accountNumber"
                    type="text"
                    value={scholarshipDetails?.accountNumber || ''}
                    onChange={(e) => handleFieldChange(e, 'accountNumber')}
                    className="input-class"
                />
            </div>

            {/* IFSC Code */}
            <div>
                <label htmlFor="ifscCode"><strong>IFSC Code:</strong></label>
                <input
                    id="ifscCode"
                    type="text"
                    value={scholarshipDetails?.ifscCode || ''}
                    onChange={(e) => handleFieldChange(e, 'ifscCode')}
                    className="input-class"
                />
            </div>

            {/* Branch Name */}
            <div>
                <label htmlFor="branchName"><strong>Branch Name:</strong></label>
                <input
                    id="branchName"
                    type="text"
                    value={scholarshipDetails?.branchName || ''}
                    onChange={(e) => handleFieldChange(e, 'branchName')}
                    className="input-class"
                />
            </div>

            {/* Account Holder Name */}
            <div>
                <label htmlFor="accountHolder"><strong>Account Holder Name:</strong></label>
                <input
                    id="accountHolder"
                    type="text"
                    value={scholarshipDetails?.accountHolder || ''}
                    onChange={(e) => handleFieldChange(e, 'accountHolder')}
                    className="input-class"
                />
            </div>
        </div>
    );
};




export interface DocumentationProps {
    scholarshipDetails: ScholarshipDetails;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
    onEye: (url: string) => void;
    fileStatus: { [key: string]: string };  // File status for tracking upload progress or displaying existing files
}

export const Documentation: React.FC<DocumentationProps> = ({ scholarshipDetails, onUpload, onEye, fileStatus }) => {
    const documentFields = [
        { name: 'Photo', url: scholarshipDetails?.photoUrl, field: 'photoUrl' },
        { name: 'Check', url: scholarshipDetails?.checkUrl, field: 'checkUrl' },
        { name: 'Aadhar Card', url: scholarshipDetails?.aadharCardUrl, field: 'aadharCardUrl' },
        { name: 'College ID Card', url: scholarshipDetails?.collegeIdCardUrl, field: 'collegeIdCardUrl' },
        { name: 'Income Certificate', url: scholarshipDetails?.incomeUrl, field: 'incomeUrl' },
    ];

    return (
        <div className="p-4">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Sl No</th>
                        <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Document</th>
                        <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>File</th>
                        <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documentFields.map((doc, index) => (
                        <tr key={index}>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{index + 1}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{doc.name}</td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                {doc.url ? (
                                    <button
                                        type="button"
                                        onClick={() => onEye(doc.url)}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center mr-2"
                                    >
                                        <FaEye />
                                    </button>
                                ) : (
                                    fileStatus[doc.field] || 'Not Available' // Display file name or "Not Available"
                                )}
                            </td>
                            <td style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                {/* Upload Button */}
                                <label className="mr-2">
                                    <input
                                        type="file"
                                        onChange={(e) => onUpload(e, doc.field)}
                                        style={{ display: 'none' }}
                                        data-field={doc.field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const fileInput = document.querySelector(`input[type='file'][data-field='${doc.field}']`) as HTMLInputElement;
                                            fileInput?.click();
                                        }}
                                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
                                    >
                                        <FaUpload />
                                    </button>
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};