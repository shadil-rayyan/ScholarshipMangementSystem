import React, { useState, useEffect } from 'react';

export interface DropdownFieldProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    error?: string;
    allowCustom?: boolean; // Option to allow custom entries
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    value,
    options,
    onChange,
    error,
    allowCustom = false
}) => {
    const [customValue, setCustomValue] = useState(value);

    useEffect(() => {
        if (value !== 'Others') {
            setCustomValue(value);
        }
    }, [value]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'Others') {
            setCustomValue(''); // Reset custom value when "Others" is selected
        } else {
            setCustomValue(selectedValue);
        }
        onChange(selectedValue);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setCustomValue(newValue);
        onChange(newValue);
    };

    return (
        <div className="relative mb-4">
            <label className="block mb-1 text-gray-700">
                {label}
                {error && <span className="text-red-500 ml-1">{error}</span>}
            </label>
            <select
                value={value}
                onChange={handleSelectChange}
                className="w-full border rounded px-3 py-2"
            >
                <option value="" disabled>Select an option</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
                {allowCustom && <option value="Others">Others</option>}
            </select>
            {allowCustom && value === 'Others' && (
                <input
                    type="text"
                    placeholder="Or add custom..."
                    value={customValue}
                    onChange={handleCustomChange}
                    className="mt-2 w-full border rounded px-3 py-2"
                />
            )}
        </div>
    );
};
