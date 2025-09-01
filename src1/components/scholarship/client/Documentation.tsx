


import React, { useState } from 'react';
import { FaEye, FaUpload } from 'react-icons/fa';

// Define the ScholarshipDetailFile interface
export interface ScholarshipDetailFile {
    photoUrl: string;
    checkUrl: string;
    aadharCardUrl: string;
    collegeIdCardUrl: string;
    incomeUrl: string;
}

// Define the DocumentationProps interface
export interface DocumentationProps {
    scholarshipDetails: ScholarshipDetailFile;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
    onEye: (url: string) => void;
    fileStatus: { [key: string]: string }; // File status for tracking upload progress or displaying existing files
}

// Documentation component
export const Documentation: React.FC<DocumentationProps> = ({
    scholarshipDetails,
    onUpload,
    onEye,
    fileStatus,
}) => {
    // Define document fields with their respective URLs, fields, and specifications
    const documentFields = [
        {
            name: 'Photo',
            url: scholarshipDetails?.photoUrl || '',
            field: 'photo',
            spec: 'Image must be in JPEG or PNG format',
            allowedTypes: ['image/jpeg', 'image/png'],
        },
        {
            name: 'Check',
            url: scholarshipDetails?.checkUrl || '',
            field: 'cheque',
            spec: 'Must be in PDF format',
            allowedTypes: ['application/pdf'],
        },
        {
            name: 'Aadhar Card',
            url: scholarshipDetails?.aadharCardUrl || '',
            field: 'aadharCard',
            spec: 'Must be in PDF format',
            allowedTypes: ['application/pdf'],
        },
        {
            name: 'College ID Card',
            url: scholarshipDetails?.collegeIdCardUrl || '',
            field: 'collegeID',
            spec: 'Must be in PDF format',
            allowedTypes: ['application/pdf'],
        },
        {
            name: 'Income Certificate',
            url: scholarshipDetails?.incomeUrl || '',
            field: 'incomeCertificate',
            spec: 'Must be in PDF format',
            allowedTypes: ['application/pdf'],
        },
    ];

    // Local state to store file names
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size
            if (file.size > 1 * 1024 * 1024) { // 1 MB limit
                alert(`${field} must be less than 1 MB.`);
                return;
            }
            // Validate file type
            const allowedTypes = documentFields.find(doc => doc.field === field)?.allowedTypes || [];
            if (!allowedTypes.includes(file.type)) {
                alert(`${field} must be one of the following types: ${allowedTypes.join(', ')}`);
                return;
            }
            setFileNames((prev) => ({ ...prev, [field]: file.name }));
            onUpload(e, field);
        }
    };

    return (
        <div className="p-4 overflow-x-auto">
            <p className="mb-4 text-red-500 font-semibold">
                Note: Every document must be less than 1 MB. You must upload all documents before clicking the Next button. The 'View' button only appears if a file exists.
            </p>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left bg-blue-500 text-white">Sl. No</th>
                        <th className="border p-2 text-left bg-blue-500 text-white">Documents Required</th>
                        <th className="border p-2 text-left bg-blue-500 text-white">Document Specification</th>
                        <th className="border p-2 text-left bg-blue-500 text-white">Upload</th>
                        <th className="border p-2 text-left bg-blue-500 text-white">View</th>
                    </tr>
                </thead>
                <tbody>
                    {documentFields.map((doc, index) => (
                        <tr key={index}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{doc.name}</td>
                            <td className="border p-2">{doc.spec}</td>
                            <td className="border p-2 text-center">
                                <label className="flex items-center justify-center">
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileSelect(e, doc.field)}
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
                                        <FaUpload className="mr-2" /> Choose File
                                    </button>
                                    {fileNames[doc.field] && (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const fileInput = document.querySelector(`input[type='file'][data-field='${doc.field}']`) as HTMLInputElement;
                                                if (fileInput && fileInput.files?.[0]) {
                                                    const url = URL.createObjectURL(fileInput.files[0]);
                                                    window.open(url, '_blank');
                                                }
                                            }}
                                            className="ml-2 text-blue-500 underline"
                                        >
                                            {fileNames[doc.field]}
                                        </a>
                                    )}
                                </label>
                            </td>
                            <td className="border p-2 text-center">
                                {doc.url ? (
                                    <button
                                        type="button"
                                        onClick={() => onEye(doc.url)}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                    >
                                        <FaEye size={20} /> {/* Ensure the icon is properly rendered */}
                                    </button>
                                ) : (
                                    fileStatus[doc.field] || 'Not Available'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
