// src/components/scholarshipadmin/ScholarshipDetailsComponent.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { User } from 'firebase/auth'; // Import User and auth from Firebase
import { auth } from '@/lib/firebase/config'; // Import the auth module from Firebase
// import Values from '@/components/homepage/values';

// Define interfaces for the props and data
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
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ scholarshipDetails }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns the date in 'YYYY-MM-DD' format
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div><strong>Name:</strong> {scholarshipDetails.name}</div>
      <div><strong>DOB:</strong> {formatDate(scholarshipDetails.dateOfBirth)}</div>
      <div><strong>Gender:</strong> {scholarshipDetails.gender}</div>
      <div><strong>applicationtype:</strong> {scholarshipDetails.applicationtype}</div>
      <div><strong>Category:</strong> {scholarshipDetails.category}</div>
      <div><strong>Aadhar Number:</strong> {scholarshipDetails.adharNumber}</div>
      <div><strong>Father Name:</strong> {scholarshipDetails.fatherName}</div>
      <div><strong>Father Phone:</strong> {scholarshipDetails.fatherNumber}</div>
      <div><strong>Mother Name:</strong> {scholarshipDetails.motherName}</div>
      <div><strong>Mother Phone:</strong> {scholarshipDetails.motherNumber}</div>
      <div><strong>Income:</strong> {scholarshipDetails.income}</div>
      <div><strong>Father Occupation:</strong> {scholarshipDetails.fatherOccupation}</div>
      <div><strong>Student Phone:</strong> {scholarshipDetails.studentNumber}</div>
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

      <div><strong>State:</strong> {scholarshipDetails.state}</div>
      <div><strong> Pin Code </strong> {scholarshipDetails.pinCode}</div>

      <div><strong>House / Apartment Name:</strong> {scholarshipDetails.houseApartmentName}</div>
      <div><strong>Place / State:</strong> {scholarshipDetails.placeState}</div>
      <div><strong>Post Office:</strong> {scholarshipDetails.postOffice}</div>
      <div><strong>Country:</strong> {scholarshipDetails.country}</div>

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

      <div><strong>Name of the College:</strong> {scholarshipDetails.nameOfTheCollege}</div>
      <div><strong>Branch:</strong> {scholarshipDetails.branch}</div>
      <div><strong>Semester:</strong> {scholarshipDetails.semester}</div>
      <div><strong>Hostel Resident:</strong> {scholarshipDetails.hostelResident.toString()}</div>
      <div><strong>CGPA:</strong> {scholarshipDetails.cgpa}</div>
      <div><strong>Bank Name:</strong> {scholarshipDetails.bankName}</div>
      <div><strong>Account Number:</strong> {scholarshipDetails.accountNumber}</div>
      <div><strong>IFSC Code:</strong> {scholarshipDetails.ifscCode}</div>
      <div><strong>Branch Name:</strong> {scholarshipDetails.branchName}</div>
      <div><strong>Account Holder Name:</strong> {scholarshipDetails.accountHolder}</div>
    </div>
  );
};

// Documentation


export interface DocumentationProps {
  scholarshipDetails: ScholarshipDetails;
}

export const Documentation: React.FC<DocumentationProps> = ({ scholarshipDetails }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const documentFields = [
    { name: 'Photo', url: scholarshipDetails.photoUrl },
    { name: 'cheque or bank passbook', url: scholarshipDetails.checkUrl },
    { name: 'Aadhar Card', url: scholarshipDetails.aadharCardUrl },
    { name: 'College ID Card', url: scholarshipDetails.collegeIdCardUrl },
    { name: 'Income Certificate', url: scholarshipDetails.incomeUrl },
  ];

  const renderDocument = (url: string) => {
    if (url.toLowerCase().endsWith('.pdf')) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
        />
      );
    } else {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt="Document" style={{ maxWidth: '100%', maxHeight: '500px' }} />
        </a>
      );
    }
  };

  return (
    <div className="p-4">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Sl No</th>
            <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>Document</th>
            <th style={{ borderBottom: '2px solid #1976d2', padding: '10px', textAlign: 'left', backgroundColor: '#1976d2', color: '#fff' }}>File</th>
          </tr>
        </thead>
        <tbody>
          {documentFields.map((doc, index) => (
            <tr key={doc.url}>
              <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{index + 1}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{doc.name}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
                      <FaEye />
                    </button>
                  </a>
                ) : (
                  'Not Available'
                )}
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
  verificationTable: any[];
  setVerificationTable: React.Dispatch<React.SetStateAction<any[]>>;
  scholarshipDetails: ScholarshipDetails | null;
  setScholarshipDetails: React.Dispatch<React.SetStateAction<ScholarshipDetails | null>>;
}

export const Verification: React.FC<VerificationProps> = ({
  status,
  setStatus,
  verificationTable,
  setVerificationTable,
  scholarshipDetails,
  setScholarshipDetails,
}) => {
  // Hook to get the current user from Firebase Auth
  const user: User | null = auth.currentUser;

  const updateTableBasedOnStatus = (currentStatus: string) => {
    const updatedTable = [...verificationTable];
    const adminName = user?.displayName || 'Unknown Admin';

    // Ensure the table has the required number of steps
    if (updatedTable.length < 5) {
      // If not enough elements, initialize them with defaults
      while (updatedTable.length < 5) {
        updatedTable.push({ label: '', value: '', admin: '' });
      }
    }

    // Update labels based on the current status
    updatedTable[0].label = 'Verified by Admin';
    updatedTable[1].label = 'Selected for Scholarship';
    updatedTable[2].label = 'Amount Processed';
    updatedTable[3].label = 'Rejected';
    updatedTable[4].label = 'Reverted';

    // Update the verification table based on the status
    if (currentStatus === 'Verify') {
      updatedTable[0].value = 'Yes';
      updatedTable[0].admin = adminName;
      updatedTable[1].value = '';
      updatedTable[2].value = '';
      updatedTable[3].value = '';
      updatedTable[4].value = '';
    } else if (currentStatus === 'Select') {
      updatedTable[1].value = 'Yes';
      updatedTable[1].admin = adminName;
    } else if (currentStatus === 'Amount Proceed') {
      updatedTable[2].value = 'Yes';
      updatedTable[2].admin = adminName;
    } else if (currentStatus === 'Reject') {
      updatedTable[0].value = 'No';
      updatedTable[1].value = 'No';
      updatedTable[2].value = 'No';
      updatedTable[3].value = 'Yes';
      updatedTable[3].admin = adminName;
      updatedTable[4].value = '';
    } else if (currentStatus === 'Reverted') {
      updatedTable[4].value = 'Yes';
      updatedTable[4].admin = adminName;
    }

    setVerificationTable(updatedTable);
    // Save the updated table to localStorage
    localStorage.setItem('verificationTable', JSON.stringify(updatedTable));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    // Update the verification table and sync the status with scholarship details
    updateTableBasedOnStatus(selectedStatus);
    setScholarshipDetails((prev) => ({ ...prev, status: selectedStatus }));
    // Save status to localStorage
    localStorage.setItem('status', selectedStatus);
  };

  // Load initial values from localStorage on first load
  useEffect(() => {
    const savedStatus = localStorage.getItem('status');
    const savedTable = localStorage.getItem('verificationTable');

    if (savedStatus) {
      setStatus(savedStatus);
      setScholarshipDetails((prev) => ({ ...prev, status: savedStatus }));
    }

    if (savedTable) {
      setVerificationTable(JSON.parse(savedTable));
    }

    if (scholarshipDetails?.status) {
      setStatus(scholarshipDetails.status); // Sync the dropdown with initial status
      updateTableBasedOnStatus(scholarshipDetails.status);
    }
  }, [scholarshipDetails?.status]);

  // Check the conditions to disable certain statuses
  const isVerifySelected = status === 'Verify' || (verificationTable[0]?.value === 'Yes');
  const isSelectSelected = status === 'Select' || (verificationTable[1]?.value === 'Yes');
  const isAmountProceedSelected = status === 'Amount Proceed' || (verificationTable[2]?.value === 'Yes');

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Verification Status:</strong>
          <select
            value={status}
            onChange={handleStatusChange}
            style={{ marginLeft: '10px', padding: '5px', border: '1px solid #ccc', width: '200px' }}
          >
            <option value="">Select Status</option>
            <option value="Verify">Verify</option>
            <option value="Reject">Reject</option>
            <option value="Reverted">Reverted</option>
            <option value="Select" disabled={!isVerifySelected}>Select</option>
            <option value="Amount Proceed" disabled={!isVerifySelected || !isSelectSelected}>Amount Proceed</option>
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

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
  <label style={{ display: 'block' }}>
    <strong>Status:</strong>
    <div
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        width: '100%',
        textTransform: 'uppercase',
        backgroundColor: '#f5f5f5',
        color: '#333',
        borderRadius: '4px',
        marginTop: '5px',
      }}
    >
      {scholarshipDetails?.status || ''}
    </div>
  </label>

  <label style={{ display: 'block' }}>
    <strong>Remark:</strong>
    <input
      type="text"
      value={scholarshipDetails?.remark || ''}
      onChange={(e) => setScholarshipDetails((prev) => ({ ...prev, remark: e.target.value }))}
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        marginTop: '5px',
      }}
    />
  </label>
</div>

    </div>
  );
};
