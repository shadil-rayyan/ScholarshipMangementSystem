import React from 'react';

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    error?: string;
    className?: string; // Add this line

}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    error,
}) => {
    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {error && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12h.01M12 15h.01M12 9h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                        />
                    </svg>
                </div>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
