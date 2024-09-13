import React from 'react';
import { FaEye } from 'react-icons/fa';

// Define interfaces for the props
export interface ScholarshipDetails {
    name: string;
    dob: string;
    gender: string;
    nationality: string;
    category: string;
    aadharNumber: string;
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
    income: string;
    fatherOccupation: string;
    studentPhone: string;
    motherOccupation: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    houseApartmentName: string;
    placeState: string;
    postOffice: string;
    country: string;
    pincode: string;
    district: string;
    whatsappNumber: string;
    studentEmail: string;
    alternativeNumber: string;
    highSchool: string;
    highSchoolPercentage: number;
    intermediate: string;
    intermediatePercentage: number;
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
}

export interface PersonalDetailsProps {
    scholarshipDetails: ScholarshipDetails;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ scholarshipDetails }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div><strong>Name:</strong> {scholarshipDetails.name}</div>
            <div><strong>DOB:</strong> {scholarshipDetails.dob}</div>
            <div><strong>Gender:</strong> {scholarshipDetails.gender}</div>
            <div><strong>Nationality:</strong> {scholarshipDetails.nationality}</div>
            <div><strong>Category:</strong> {scholarshipDetails.category}</div>
            <div><strong>Aadhar Number:</strong> {scholarshipDetails.aadharNumber}</div>
            <div><strong>Father Name:</strong> {scholarshipDetails.fatherName}</div>
            <div><strong>Father Phone:</strong> {scholarshipDetails.fatherPhone}</div>
            <div><strong>Mother Name:</strong> {scholarshipDetails.motherName}</div>
            <div><strong>Mother Phone:</strong> {scholarshipDetails.motherPhone}</div>
            <div><strong>Income:</strong> {scholarshipDetails.income}</div>
            <div><strong>Father Occupation:</strong> {scholarshipDetails.fatherOccupation}</div>
            <div><strong>Student Phone:</strong> {scholarshipDetails.studentPhone}</div>
            <div><strong>Mother Occupation:</strong> {scholarshipDetails.motherOccupation}</div>
        </div>
    );
};

export interface ContactDetailsProps {
    scholarshipDetails: ScholarshipDetails;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ scholarshipDetails }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div><strong>Address:</strong> {scholarshipDetails.address}</div>
            <div><strong>City:</strong> {scholarshipDetails.city}</div>
            <div><strong>State:</strong> {scholarshipDetails.state}</div>
            <div><strong>Postal Code:</strong> {scholarshipDetails.postalCode}</div>
            <div><strong>Student Phone:</strong> {scholarshipDetails.studentPhone}</div>
            <div><strong>Father Phone:</strong> {scholarshipDetails.fatherPhone}</div>
            <div><strong>Mother Phone:</strong> {scholarshipDetails.motherPhone}</div>
            <div><strong>House / Apartment Name:</strong> {scholarshipDetails.houseApartmentName}</div>
            <div><strong>Place / State:</strong> {scholarshipDetails.placeState}</div>
            <div><strong>Post Office:</strong> {scholarshipDetails.postOffice}</div>
            <div><strong>Country:</strong> {scholarshipDetails.country}</div>
            <div><strong>Pincode:</strong> {scholarshipDetails.pincode}</div>
            <div><strong>District:</strong> {scholarshipDetails.district}</div>
            <div><strong>Whatsapp Number:</strong> {scholarshipDetails.whatsappNumber}</div>
            <div><strong>Student Email:</strong> {scholarshipDetails.studentEmail}</div>
            <div><strong>Alternative Number:</strong> {scholarshipDetails.alternativeNumber}</div>
        </div>
    );
};

export interface EducationalAndBankDetailsProps {
    scholarshipDetails: ScholarshipDetails;
}

export const EducationalAndBankDetails: React.FC<EducationalAndBankDetailsProps> = ({ scholarshipDetails }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div><strong>High School:</strong> {scholarshipDetails.highSchool}</div>
            <div><strong>High School Percentage:</strong> {scholarshipDetails.highSchoolPercentage}%</div>
            <div><strong>Intermediate:</strong> {scholarshipDetails.intermediate}</div>
            <div><strong>Intermediate Percentage:</strong> {scholarshipDetails.intermediatePercentage}%</div>
            <div><strong>Name of the College:</strong> {scholarshipDetails.nameOfTheCollege}</div>
            <div><strong>Branch:</strong> {scholarshipDetails.branch}</div>
            <div><strong>Semester:</strong> {scholarshipDetails.semester}</div>
            <div><strong>Hostel Resident:</strong> {scholarshipDetails.hostelResident}</div>
            <div><strong>CGPA:</strong> {scholarshipDetails.cgpa}</div>
            <div><strong>Bank Name:</strong> {scholarshipDetails.bankName}</div>
            <div><strong>Account Number:</strong> {scholarshipDetails.accountNumber}</div>
            <div><strong>IFSC Code:</strong> {scholarshipDetails.ifscCode}</div>
            <div><strong>Branch Name:</strong> {scholarshipDetails.branchName}</div>
            <div><strong>Account Holder Name:</strong> {scholarshipDetails.accountHolder}</div>
        </div>
    );
};

export interface DocumentationProps {
    documentationData: { id: number, name: string, size: string, file: string }[];
}

export const Documentation: React.FC<DocumentationProps> = ({ documentationData }) => {
    
    return (
        <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Sl No</th>
                    <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Document</th>
                    <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Size</th>
                    <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>File</th>
                </tr>
            </thead>
            <tbody>
                {documentationData.map((doc) => (
                    <tr key={doc.id}>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{doc.id}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{doc.name}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{doc.size}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                            <a href={doc.file} target="_blank" rel="noopener noreferrer">
                                <FaEye />
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export interface VerificationProps {
    status: string;
    setStatus: (status: string) => void;
    verificationTable: { label: string, value: string, admin: string }[];
    setVerificationTable: (table: { label: string, value: string, admin: string }[]) => void;
    scholarshipDetails: ScholarshipDetails;
    setScholarshipDetails: (details: ScholarshipDetails) => void;
}

export const Verification: React.FC<VerificationProps> = ({
    status,
    setStatus,
    verificationTable,
    setVerificationTable,
    scholarshipDetails,
    setScholarshipDetails,
}) => {
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);

        let updatedTable = [...verificationTable];

        if (selectedStatus === "Verify") {
            updatedTable[0].value = "Yes";
            updatedTable[1].value = " ";
            updatedTable[2].value = "No";
        } else if (selectedStatus === "Select") {
            updatedTable[0].value = "Yes";
            updatedTable[1].value = "Yes";
            updatedTable[2].value = "No";
        } else if (selectedStatus === "Reject") {
            updatedTable[0].value = "No";
            updatedTable[1].value = "NO";
            updatedTable[2].value = "No";
        } else if (selectedStatus === "Amount Proceed") {
            updatedTable[0].value = "Yes";
            updatedTable[1].value = "Yes";
            updatedTable[2].value = "Yes";
        }

        setVerificationTable(updatedTable);
        setScholarshipDetails({ ...scholarshipDetails, status: selectedStatus });
    };

    return (
        <div>
                        <div style={{ marginBottom: '20px' }}>
                            <label>
                                <strong>Verification Status:</strong>
                                <select
                                    value={status}
                                    onChange={handleStatusChange}
                                    style={{ marginLeft: '10px', padding: '5px',border: '1px solid #ccc', width: '200px' }}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Verify">Verify</option>
                                    <option value="Select">Select</option>
                                    <option value="Amount Proceed">Amount Proceed</option>
                                    <option value="Reject">Reject</option>
                                </select>
                            </label>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Verification Steps</th>
                                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
                                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationTable.map((step, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{step.label}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{step.value}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{step.admin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginBottom: '20px' }}>
                            <label>
                                <strong>Remark:</strong>
                                <input
                                    
                                    type="text"
                                    value={scholarshipDetails.remark}
                                    onChange={(e) => setScholarshipDetails({ ...scholarshipDetails, remark: e.target.value })}
                                    style={{  padding: '5px',border: '1px solid #ccc', width: '100%' }}
                                />
                            </label>
                        </div>
                    </div>
    );
};
