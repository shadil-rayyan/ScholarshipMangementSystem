import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';

// Update the type to handle both File objects and URLs
export type FilesType = { [key: number]: File | string | null };

interface DocumentationProps {
    files: FilesType;
    setFiles: React.Dispatch<React.SetStateAction<FilesType>>;
    errors: Partial<Record<number, string>>;
    readOnly?: boolean; // Add this prop to determine if the component is in read-only mode
}

export const Documentation: React.FC<DocumentationProps> = ({ files, setFiles, errors, readOnly = false }) => {
    const handleViewClick = (file: File | string | null) => {
        if (!file) {
            alert('No file chosen');
            return;
        }

        // Check if the file is a URL (string)
        if (typeof file === 'string') {
            window.open(file, '_blank');
        } else if (file instanceof File) {
            // Create a blob URL for the file object and open it
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            // Revoke the object URL after use to prevent memory leaks
            URL.revokeObjectURL(fileURL);
        } else {
            alert('Invalid file');
        }
    };



    const handleDeleteClick = (index: number) => {
        if (readOnly) return; // Don't allow deletion in read-only mode

        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles };
            if (newFiles[index]) {
                console.log(`Deleting file: ${typeof newFiles[index] === 'string' ? newFiles[index] : (newFiles[index] as File).name}`);
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
        if (readOnly) return; // Don't allow changes in read-only mode

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
                        {!readOnly && <th className="border p-2 text-left">Delete</th>}
                    </tr>
                </thead>
                <tbody>
                    {['Photo', 'Cheque or bank passbook', 'Aadhar Card', 'College ID Card', 'Income'].map((doc, index) => (
                        <tr key={index}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{doc}</td>

                            <td className="border p-2">
                                {index === 0 ? 'image must be in jpeg or png' : 'must be pdf format'}
                                <p className='text-red-500'>{errors[index] && <span>{errors[index]}</span>}</p>
                            </td>
                            <td className="border p-2">
                                {files[index] ? (
                                    <span
                                        className="cursor-pointer text-blue-600 hover:underline"
                                        onClick={() => handleViewClick(files[index])}
                                    >
                                        {typeof files[index] === 'string' ? files[index] : (files[index] as File).name}
                                    </span>
                                ) : (
                                    !readOnly && (
                                        <input
                                            type="file"
                                            id={`file-input-${index}`}
                                            className="w-full"
                                            onChange={(e) => handleFileChange(index, e.target.files?.[0] ?? null)}
                                            required
                                        />
                                    )
                                )}
                            </td>
                            <td className="border p-2">
                                <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                    onClick={() => handleViewClick(files[index])}
                                    disabled={!files[index] || (typeof files[index] === 'string' && !files[index])}
                                >
                                    <FaEye />
                                </button>
                            </td>
                            {!readOnly && (
                                <td className="border p-2">
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                        onClick={() => handleDeleteClick(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
