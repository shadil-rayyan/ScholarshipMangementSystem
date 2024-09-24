// src/components/scholarship/client/EducationalDetails.tsx

import React from 'react';
import { YesNoField } from './YesNoField';
import { DropdownField } from '@/components/DropdownField';
import { InputField } from './InputField';

export interface EducationalDetailsType {
    college: string;
    branch: string;
    semester: string;
    hostelResident: boolean;
    cgpa: string;
}

const branches = [
    'Computer Science and Engineering (CSE)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering (MECH)',
    'Civil Engineering (CE)',
    'Chemical Engineering (CHE)',
    'Information Technology (IT)',
    'Aeronautical Engineering',
    'Others' // Include Others for custom entry
];

const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

export const EducationalDetails: React.FC<{
    educationalDetails: EducationalDetailsType;
    setEducationalDetails: React.Dispatch<React.SetStateAction<EducationalDetailsType>>;
    errors: Partial<Record<keyof EducationalDetailsType, string>>;
}> = ({ educationalDetails, setEducationalDetails, errors }) => {

    const handleChange = (field: keyof EducationalDetailsType, value: any) => {
        setEducationalDetails(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <InputField
                label="Name Of The College"
                required
                value={educationalDetails.college}
                onChange={() => { }}
                readOnly
                error={errors.college}
            />
            <DropdownField
                label="Branch"
                value={educationalDetails.branch}
                options={branches}
                onChange={(value) => handleChange('branch', value)}
                error={errors.branch}
                allowCustom={true} // Allow custom entry for branches
            />
            <DropdownField
                label="Semester"
                value={educationalDetails.semester}
                options={semesters}
                onChange={(value) => handleChange('semester', value)}
                error={errors.semester}
                allowCustom={false}
            />
            <YesNoField
                label="Hostel Resident Or Not (Yes/No)"
                required
                value={educationalDetails.hostelResident}
                onChange={(value) => handleChange('hostelResident', value)}
                error={errors.hostelResident}
            />
            <InputField
                label="CGPA"
                required
                value={educationalDetails.cgpa}
                onChange={(e) => handleChange('cgpa', e.target.value)}
                error={errors.cgpa}
            />
        </div>
    );
};
