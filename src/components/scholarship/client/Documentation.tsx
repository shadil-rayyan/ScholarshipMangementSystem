import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';

// Store file objects, not URLs
export type FilesType = { [key: number]: File | null };

interface DocumentationProps {
    files: FilesType;
    setFiles: React.Dispatch<React.SetStateAction<FilesType>>;
    errors: Partial<Record<number, string>>;
}

export const Documentation: React.FC<DocumentationProps> = ({ files, setFiles, errors }) => {
    const handleViewClick = (file: File | null) => {
        if (!file) {
            alert('No file chosen');
        } else {
            const fileURL = URL.createObjectURL(file);
            console.log(`Opening file URL: ${fileURL}`);
            window.open(fileURL);
        }
    };

    const handleDeleteClick = (index: number) => {
        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles };
            if (newFiles[index]) {
                console.log(`Deleting file: ${newFiles[index]?.name}`);
                delete newFiles[index];
            }
            return newFiles;
        });

        const fileInput: HTMLInputElement | null = document.querySelector(`#file-input-${index}`);
        if (fileInput) {
            fileInput.value = '';
        }
        alert('File removed');
    };

    const handleFileChange = (index: number, file: File | null) => {
        console.log(`File selected for index ${index}: ${file?.name}`);
        setFiles((prevFiles) => ({ ...prevFiles, [index]: file }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Sl.No</th>
                        <th className="border p-2 text-left">Documents Required</th>
                        <th className="border p-2 text-left">Document Specification</th>
                        <th className="border p-2 text-left">File</th>
                        <th className="border p-2 text-left">View</th>
                        <th className="border p-2 text-left">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {['Photo', 'Cheque or bank passbook', 'Aadhar Card', 'College ID Card', 'Income'].map((doc, index) => (
                        <tr key={index}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{doc}</td>
                            <td className="border p-2">Max Size: {index === 0 ? '5MB' : '1MB'}</td>
                            <td className="border p-2">
                                {files[index] ? (
                                    <span>{files[index]?.name}</span>
                                ) : (
                                    <input
                                        type="file"
                                        id={`file-input-${index}`}
                                        className="w-full"
                                        onChange={(e) => handleFileChange(index, e.target.files?.[0] ?? null)}
                                        required
                                    />
                                )}
                            </td>
                            <td className="border p-2">
                                <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                    onClick={() => handleViewClick(files[index])}
                                    disabled={!files[index]}
                                >
                                    <FaEye />
                                </button>
                            </td>
                            <td className="border p-2">
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                    onClick={() => handleDeleteClick(index)}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                            <td className="border p-2 text-red-500">
                                {errors[index] && <span>{errors[index]}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
