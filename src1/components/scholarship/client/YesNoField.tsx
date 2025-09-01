// src/components/scholarship/client/YesNoField.tsx
import React from 'react';

export interface YesNoFieldProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    required?: boolean;
    error?: string; // Added error prop
}

export const YesNoField: React.FC<YesNoFieldProps> = ({
    label,
    value,
    onChange,
    required = false,
    error, // Destructure error prop
}) => {
    const inputId = label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="relative mb-4">
            <span className="block mb-1 text-gray-700">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        id={`${inputId}-yes`}
                        name={inputId}
                        value="yes"
                        checked={value === true}
                        onChange={() => onChange(true)}
                        className="form-radio"
                        required
                    />
                    <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        id={`${inputId}-no`}
                        name={inputId}
                        value="no"
                        checked={value === false}
                        onChange={() => onChange(false)}
                        className="form-radio"
                        required
                    />
                    <span className="ml-2">No</span>
                </label>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p> // Display error if exists
            )}
        </div>
    );
};
