import React, { useState, useEffect } from 'react';

export interface DropdownFieldProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    error?: string;
    allowCustom?: boolean;
    className?: string;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    value,
    options,
    onChange,
    error,
    allowCustom = false,
    className = ''
}) => {
    const [customValue, setCustomValue] = useState('');

    useEffect(() => {
        if (value.startsWith('Others: ')) {
            setCustomValue(value.replace('Others: ', '')); // Extract the custom value
        } else {
            setCustomValue(''); // Clear custom value if not a custom entry
        }
    }, [value]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'Others') {
            onChange('Others');
        } else {
            onChange(selectedValue);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const capitalizedValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
        setCustomValue(capitalizedValue);
        onChange(`Others: ${capitalizedValue}`); // Send custom value prefixed with 'Others:'
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex items-center mt-1">
                <select
                    value={value === 'Others' || value.startsWith('Others:') ? 'Others' : value}
                    onChange={handleSelectChange}
                    className={`block w-full ${allowCustom && (value === 'Others' || value.startsWith('Others:'))
                        ? 'rounded-l-md'
                        : 'rounded-md'
                        } px-3 py-2 border shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                    {allowCustom && <option value="Others">Others</option>}
                </select>

                {allowCustom && (value === 'Others' || value.startsWith('Others:')) && (
                    <input
                        type="text"
                        placeholder="Custom value"
                        value={customValue}
                        onChange={handleCustomChange}
                        className="block w-full ml-2 rounded-md px-3 py-2 border shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
