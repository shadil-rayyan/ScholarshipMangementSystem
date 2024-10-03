import React, { useEffect, useState } from 'react';
import { InputField } from './InputField';
import { DropdownField } from '@/components/DropdownField';
import axios from 'axios'; // For API calls

export interface PersonalDetailsType {
    name: string;
    dob: string;
    gender: string;
    applicationtype: string;
    category: string;
    aadhar: string;
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
    income: string;
    fatherOccupation: string;
    studentPhone: string;
    motherOccupation: string;
}

interface PersonalDetailsProps {
    personalDetails: PersonalDetailsType;
    setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetailsType>>;
    errors: Partial<Record<keyof PersonalDetailsType, string>>;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
    personalDetails,
    setPersonalDetails,
    errors,
}) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [incomeOptions, setIncomeOptions] = useState<string[]>([]);
    const [occupationOptions, setOccupationOptions] = useState<string[]>([]);

    // Fetch dropdown options from the API (DB)
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const [categoriesRes, incomeRes, occupationsRes] = await Promise.all([
                    axios.get('/api/categories/GetCategories'),
                    axios.get('/api/incomes'),
                    axios.get('/api/occupations'),
                ]);

                setCategories(categoriesRes.data);
                setIncomeOptions(incomeRes.data);
                setOccupationOptions(occupationsRes.data);
            } catch (error) {
                console.error('Error fetching dropdown options', error);
            }
        };

        fetchDropdownOptions();
    }, []);

    const handleChange = (field: keyof PersonalDetailsType, value: string) => {
        setPersonalDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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

            <div className="flex flex-col">
                <label htmlFor="dob" className=" font-medium text-sm text-gray-700">
                    Date of Birth
                    {errors.dob && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="date"
                    id="dob"
                    name="dob"
                    required
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                    value={formatDateForInput(personalDetails.dob)}
                    onChange={(e) => handleChange('dob', e.target.value)}
                />
                {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
            </div>

            <DropdownField
                label="Category"
                value={personalDetails.category}
                options={categories}
                onChange={(value) => handleChange('category', value)}
                error={errors.category}
                allowCustom={true}
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
                value={personalDetails.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
                error={errors.motherName}
            />
            <InputField
                label="Mother Phone"
                value={personalDetails.motherPhone}
                onChange={(e) => handleChange('motherPhone', e.target.value)}
                error={errors.motherPhone}
            />

            <DropdownField
                label="Income"
                value={personalDetails.income}
                options={incomeOptions}
                onChange={(value) => handleChange('income', value)}
                error={errors.income}
            />

            <DropdownField
                label="Father Occupation"
                value={personalDetails.fatherOccupation}
                options={occupationOptions}
                onChange={(value) => handleChange('fatherOccupation', value)}
                error={errors.fatherOccupation}
            />
            <InputField
                label="Student Phone"
                required
                value={personalDetails.studentPhone}
                onChange={(e) => handleChange('studentPhone', e.target.value)}
                error={errors.studentPhone}
            />
            <DropdownField
                label="Mother Occupation"
                value={personalDetails.motherOccupation}
                options={occupationOptions}
                onChange={(value) => handleChange('motherOccupation', value)}
                error={errors.motherOccupation}
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
                                required
                            />
                            <span className="ml-2">{gender}</span>
                        </label>
                    ))}
                </div>
                {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
            </div>
        </div>
    );
};



{/* <div className="col-span-1 flex items-center">
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
                                required
                            />
                            <span className="ml-2">{applicationtype}</span>
                        </label>
                    ))}
                </div>
                {errors.applicationtype && <p className="text-red-600 text-sm">{errors.applicationtype}</p>}
            </div> */}