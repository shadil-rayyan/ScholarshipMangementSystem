// ScholarshipBox.tsx
import React from 'react';

interface ScholarshipBoxProps {
    name: string;
    Number: string;
    collegeName: string;
}

const ScholarshipBox: React.FC<ScholarshipBoxProps> = ({ name, Number, collegeName }) => {
    return (
        <div className="p-4 border rounded shadow-md bg-white max-w-sm">
            <div className="mb-2 ">
                {name}
            </div>
            <div className="mb-2 font-light text-gray-500">
                <span >Number:</span> {Number}
            </div>
            <div className="mb-2 font-light text-gray-500">
                <span >College Name:</span> {collegeName}
            </div>
        </div>
    );
};

export default ScholarshipBox;