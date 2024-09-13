import React from 'react';
import { InputField } from './InputField';
import { DropdownField } from '@/components/DropdownField';

export interface PersonalDetailsType {
    name: string;
    dob: string;
    gender: string;
    applicationtype: string;
    category: string;
    aadhar: string;
    fatherName: string;
    fatherPhone: string;
    motherName?: string;
    motherPhone?: string;
    income: string;
    fatherOccupation?: string;
    studentPhone: string;
    motherOccupation?: string;
}

interface PersonalDetailsProps {
    personalDetails: PersonalDetailsType;
    setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetailsType>>;
    errors: Partial<Record<keyof PersonalDetailsType, string>>;
}

const categories = ['OBC', 'OEC', 'SC', 'ST']; // Define the category options

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
    personalDetails,
    setPersonalDetails,
    errors,
}) => {
    // Helper function to update the personal details state
    const handleChange = (field: keyof PersonalDetailsType, value: string) => {
        setPersonalDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <InputField
                label="Name"
                required
                value={personalDetails.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
            />
            <InputField
                label="DOB"
                type="date"
                required
                value={personalDetails.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                error={errors.dob}
            />
            <div className="col-span-1 flex items-center">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Gender:</span>
                    {['Male', 'Female', 'Other'].map((gender) => (
                        <label key={gender} className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value={gender.toLowerCase()}
                                className="form-radio"
                                checked={personalDetails.gender === gender.toLowerCase()}
                                onChange={(e) => handleChange('gender', e.target.value)}
                            />
                            <span className="ml-2">{gender}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="col-span-1 flex items-center">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Application type:</span>
                    {['Fresh', 'Renewal'].map((applicationtype) => (
                        <label key={applicationtype} className="inline-flex items-center">
                            <input
                                type="radio"
                                name="applicationtype"
                                value={applicationtype.toLowerCase()}
                                className="form-radio"
                                checked={personalDetails.applicationtype === applicationtype.toLowerCase()}
                                onChange={(e) => handleChange('applicationtype', e.target.value)}
                            />
                            <span className="ml-2">{applicationtype}</span>
                        </label>
                    ))}
                </div>
            </div>
            <DropdownField
                label="Category"
                value={personalDetails.category}
                options={categories}
                onChange={(value) => handleChange('category', value)}
                error={errors.category}
                allowCustom={true} // Allow custom entry directly in the dropdown
            />

            <InputField
                label="Aadhar Number"
                required
                value={personalDetails.aadhar}
                onChange={(e) => handleChange('aadhar', e.target.value)}
                error={errors.aadhar}
            />
            <InputField
                label="Father Name"
                required
                value={personalDetails.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                error={errors.fatherName}
            />
            <InputField
                label="Father Phone"
                required
                value={personalDetails.fatherPhone}
                onChange={(e) => handleChange('fatherPhone', e.target.value)}
                error={errors.fatherPhone}
            />
            <InputField
                label="Mother Name"
                required
                value={personalDetails.motherName || ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                error={errors.motherName}
            />
            <InputField
                label="Mother Phone"
                value={personalDetails.motherPhone || ''}
                onChange={(e) => handleChange('motherPhone', e.target.value)}
                error={errors.motherPhone}
            />
            <InputField
                label="Income-give number"
                required
                value={personalDetails.income}
                onChange={(e) => handleChange('income', e.target.value)}
                error={errors.income}
            />
            <InputField
                label="Father Occupation"
                required
                value={personalDetails.fatherOccupation || ''}
                onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                error={errors.fatherOccupation}
            />
            <InputField
                label="Student Phone"
                required
                value={personalDetails.studentPhone}
                onChange={(e) => handleChange('studentPhone', e.target.value)}
                error={errors.studentPhone}
            />
            <InputField
                label="Mother Occupation"
                value={personalDetails.motherOccupation || ''}
                required
                onChange={(e) => handleChange('motherOccupation', e.target.value)}
                error={errors.motherOccupation}
            />
        </div>
    );
};