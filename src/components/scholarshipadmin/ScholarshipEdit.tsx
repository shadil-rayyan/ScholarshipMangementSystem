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
    scholarshipDetails: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ scholarshipDetails, handleInputChange }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns the date in 'YYYY-MM-DD' format
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Name */}
            <div>
                <strong>Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.name || ''}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="input-class"
                    required
                />
            </div>

            {/* DOB */}
            <div>
                <strong>DOB:</strong>
                <input
                    type="date"
                    value={scholarshipDetails?.dateOfBirth ? formatDate(scholarshipDetails.dateOfBirth) : ''}
                    onChange={(e) => handleInputChange(e, 'dateOfBirth')}
                    className="input-class"
                />
            </div>

            {/* Gender */}
            <div>
                <strong>Gender:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.gender || ''}
                    onChange={(e) => handleInputChange(e, 'gender')}
                    className="input-class"
                />
            </div>

            {/* Application Type */}
            <div>
                <strong>Application Type:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.applicationtype || ''}
                    onChange={(e) => handleInputChange(e, 'applicationtype')}
                    className="input-class"
                />
            </div>

            {/* Category */}
            <div>
                <strong>Category:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.category || ''}
                    onChange={(e) => handleInputChange(e, 'category')}
                    className="input-class"
                />
            </div>

            {/* Aadhar Number */}
            <div>
                <strong>Aadhar Number:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.adharNumber || ''}
                    onChange={(e) => handleInputChange(e, 'adharNumber')}
                    className="input-class"
                />
            </div>

            {/* Father Name */}
            <div>
                <strong>Father Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherName || ''}
                    onChange={(e) => handleInputChange(e, 'fatherName')}
                    className="input-class"
                />
            </div>

            {/* Father Phone */}
            <div>
                <strong>Father Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherNumber || ''}
                    onChange={(e) => handleInputChange(e, 'fatherNumber')}
                    className="input-class"
                />
            </div>

            {/* Mother Name */}
            <div>
                <strong>Mother Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherName || ''}
                    onChange={(e) => handleInputChange(e, 'motherName')}
                    className="input-class"
                />
            </div>

            {/* Mother Phone */}
            <div>
                <strong>Mother Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherNumber || ''}
                    onChange={(e) => handleInputChange(e, 'motherNumber')}
                    className="input-class"
                />
            </div>

            {/* Income */}
            <div>
                <strong>Income:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.income || ''}
                    onChange={(e) => handleInputChange(e, 'income')}
                    className="input-class"
                />
            </div>

            {/* Father Occupation */}
            <div>
                <strong>Father Occupation:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.fatherOccupation || ''}
                    onChange={(e) => handleInputChange(e, 'fatherOccupation')}
                    className="input-class"
                />
            </div>

            {/* Student Phone */}
            <div>
                <strong>Student Phone:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.studentNumber || ''}
                    onChange={(e) => handleInputChange(e, 'studentNumber')}
                    className="input-class"
                />
            </div>

            {/* Mother Occupation */}
            <div>
                <strong>Mother Occupation:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.motherOccupation || ''}
                    onChange={(e) => handleInputChange(e, 'motherOccupation')}
                    className="input-class"
                />
            </div>
        </div>
    );
};


export interface ContactDetailsProps {
    scholarshipDetails: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ scholarshipDetails, handleInputChange }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* State */}
            <div>
                <strong>State:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.state || ''}
                    onChange={(e) => handleInputChange(e, 'state')}
                    className="input-class"
                />
            </div>

            {/* Postal Code */}
            <div>
                <strong>Postal Code:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.pinCode || ''}
                    onChange={(e) => handleInputChange(e, 'pinCode')}
                    className="input-class"
                />
            </div>

            {/* House / Apartment Name */}
            <div>
                <strong>House / Apartment Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.houseApartmentName || ''}
                    onChange={(e) => handleInputChange(e, 'houseApartmentName')}
                    className="input-class"
                />
            </div>

            {/* Place / State */}
            <div>
                <strong>Place / State:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.placeState || ''}
                    onChange={(e) => handleInputChange(e, 'placeState')}
                    className="input-class"
                />
            </div>

            {/* Post Office */}
            <div>
                <strong>Post Office:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.postOffice || ''}
                    onChange={(e) => handleInputChange(e, 'postOffice')}
                    className="input-class"
                />
            </div>

            {/* Country */}
            <div>
                <strong>Country:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.country || ''}
                    onChange={(e) => handleInputChange(e, 'country')}
                    className="input-class"
                />
            </div>

            {/* District */}
            <div>
                <strong>District:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.district || ''}
                    onChange={(e) => handleInputChange(e, 'district')}
                    className="input-class"
                />
            </div>

            {/* Whatsapp Number */}
            <div>
                <strong>Whatsapp Number:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.whatsappNumber || ''}
                    onChange={(e) => handleInputChange(e, 'whatsappNumber')}
                    className="input-class"
                />
            </div>

            {/* Student Email */}
            <div>
                <strong>Student Email:</strong>
                <input
                    type="email"
                    value={scholarshipDetails?.studentEmail || ''}
                    onChange={(e) => handleInputChange(e, 'studentEmail')}
                    className="input-class"
                />
            </div>

            {/* Alternative Number */}
            <div>
                <strong>Alternative Number:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.alternativeNumber || ''}
                    onChange={(e) => handleInputChange(e, 'alternativeNumber')}
                    className="input-class"
                />
            </div>
        </div>
    );
};


export interface EducationalAndBankDetailsProps {
    scholarshipDetails: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

export const EducationalAndBankDetails: React.FC<EducationalAndBankDetailsProps> = ({ scholarshipDetails, handleInputChange }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* College Name */}
            <div>
                <strong>Name of the College:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.nameOfTheCollege || ''}
                    onChange={(e) => handleInputChange(e, 'nameOfTheCollege')}
                    className="input-class"
                />
            </div>

            {/* Branch */}
            <div>
                <strong>Branch:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.branch || ''}
                    onChange={(e) => handleInputChange(e, 'branch')}
                    className="input-class"
                />
            </div>

            {/* Semester */}
            <div>
                <strong>Semester:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.semester || ''}
                    onChange={(e) => handleInputChange(e, 'semester')}
                    className="input-class"
                />
            </div>

            {/* Hostel Resident */}
            <div>
                <strong>Hostel Resident:</strong>

                <input
                    type="radio"
                    id="hostelResidentYes"
                    name="hostelResident"
                    value="true"
                    checked={scholarshipDetails?.hostelResident === true}
                    onChange={(e) => handleInputChange(e, 'hostelResident')}
                />
                <label htmlFor="hostelResidentYes" style={{ marginRight: '20px' }}>Yes</label>

                <input
                    type="radio"
                    id="hostelResidentNo"
                    name="hostelResident"
                    value="false"
                    checked={scholarshipDetails?.hostelResident === false}
                    onChange={(e) => handleInputChange(e, 'hostelResident')}
                />
                <label htmlFor="hostelResidentNo">No</label>
            </div>




            {/* CGPA */}
            <div>
                <strong>CGPA:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.cgpa || ''}
                    onChange={(e) => handleInputChange(e, 'cgpa')}
                    className="input-class"
                />
            </div>

            {/* Bank Name */}
            <div>
                <strong>Bank Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.bankName || ''}
                    onChange={(e) => handleInputChange(e, 'bankName')}
                    className="input-class"
                />
            </div>

            {/* Account Number */}
            <div>
                <strong>Account Number:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.accountNumber || ''}
                    onChange={(e) => handleInputChange(e, 'accountNumber')}
                    className="input-class"
                />
            </div>

            {/* IFSC Code */}
            <div>
                <strong>IFSC Code:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.ifscCode || ''}
                    onChange={(e) => handleInputChange(e, 'ifscCode')}
                    className="input-class"
                />
            </div>

            {/* Branch Name */}
            <div>
                <strong>Branch Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.branchName || ''}
                    onChange={(e) => handleInputChange(e, 'branchName')}
                    className="input-class"
                />
            </div>

            {/* Account Holder Name */}
            <div>
                <strong>Account Holder Name:</strong>
                <input
                    type="text"
                    value={scholarshipDetails?.accountHolder || ''}
                    onChange={(e) => handleInputChange(e, 'accountHolder')}
                    className="input-class"
                />
            </div>
        </div>
    );
};



export interface DocumentationProps {
    scholarshipDetails: any;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
    onEye: (url: string) => void;
    fileStatus: { [key: string]: string };  // Add fileStatus prop
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
