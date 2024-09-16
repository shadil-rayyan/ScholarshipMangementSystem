import React from 'react';
import { useRouter } from 'next/navigation'; // Make sure you're using the right router

interface ScholarshipBoxProps {
    name: string;
    applicationNumber: string;
    email: string;
    imageUrl?: string; // Optional prop for image URL
}

const ScholarshipBox: React.FC<ScholarshipBoxProps> = ({ name, applicationNumber, email, imageUrl }) => {
    const router = useRouter(); // Call useRouter inside the component

    const handleEditClick = () => {
        // Handle the edit action, e.g., navigate to an edit page
        router.push(`/Scholarships/edit/${applicationNumber}`);
    };

    return (
        <div className="flex items-center p-4 border rounded bg-white w-full max-w-2xl">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border border-gray-300 rounded overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt="Scholarship" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                )}
            </div>
            <div className="ml-4 flex-grow">
                <div className="text-lg font-semibold">
                    {name}
                </div>
                <div className="font-light text-gray-500">
                    <span>Application ID:</span> {applicationNumber}
                </div>
                <div className="font-light text-gray-500">
                    <span>Email:</span> {email}
                </div>
            </div>
            {/* <button
                onClick={handleEditClick}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button> */}
        </div>
    );
};

export default ScholarshipBox;
