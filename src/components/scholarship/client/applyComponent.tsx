'use client'
import React, { useState } from 'react';
import { Tab } from './Tab';
import { PersonalDetails, PersonalDetailsType } from './PersonalDetails';
import { ContactDetails, ContactDetailsType } from './ContactDetails';
import { EducationalDetails, EducationalDetailsType } from './EducationalDetails';
import { BankDetails, BankDetailsType } from './BankDetails';
import { Documentation, FilesType } from './Documentation';
import { uploadFileToFirebase } from '@/lib/firebase/config';

// Validation functions

const validatePersonalDetails = (details: PersonalDetailsType) => {
    const errors: Partial<Record<keyof PersonalDetailsType, string>> = {};
    if (!details.name.trim()) errors.name = 'Name is required';
    if (!details.dob) errors.dob = 'Date of Birth is required';
    if (!['male', 'female', 'other'].includes(details.gender)) errors.gender = 'Gender is required';
    if (!['fresh', 'renewal'].includes(details.applicationtype)) errors.applicationtype = 'application type is required';
    if (!details.category.trim()) errors.category = 'Category is required';
    if (!details.fatherName?.trim()) errors.fatherName = 'father Name  is required';
    if (!details.motherName?.trim()) errors.motherName = 'mother Name  is required';
    if (!/^[0-9]{12}$/.test(details.aadhar)) errors.aadhar = 'Aadhar must be 12 digits';
    if (!/^[0-9]{10}$/.test(details.fatherPhone)) errors.fatherPhone = 'Father Phone must be 10 digits';
    if (!/^[0-9]{10}$/.test(details.studentPhone)) errors.studentPhone = 'student Phone  must be 10 digits';
    if (details.motherPhone && !/^[0-9]{10}$/.test(details.motherPhone)) errors.motherPhone = 'Mother Phone must be 10 digits';
    if (!details.income.trim() || !/^[0-9]*$/.test(details.income)) errors.income = 'Income must be a number';
    if (details.studentPhone && !/^[0-9]{10}$/.test(details.studentPhone)) errors.studentPhone = 'Student Phone must be 10 digits';
    if (!details.fatherOccupation?.trim()) errors.fatherOccupation = 'Father Occupation is required';
    if (!details.motherOccupation?.trim()) errors.motherOccupation = 'mother Occupation  is required';
    return errors;
};

const validateContactDetails = (details: ContactDetailsType) => {
    const errors: Partial<Record<keyof ContactDetailsType, string>> = {};
    if (!details.house.trim()) errors.house = 'House/Apartment Name is required';
    if (!details.place.trim()) errors.place = 'Place/State is required';
    if (!details.country.trim()) errors.country = 'Country is required';
    if (!details.postOffice.trim()) errors.postOffice = 'Post Office is required';
    if (!details.pincode || !/^[0-9]{6}$/.test(details.pincode)) errors.pincode = 'Pincode must be 6 digits';
    if (!details.state.trim() || !/^[A-Za-z\s]+$/.test(details.state)) errors.state = 'State is required and should contain only letters';
    if (!details.district.trim() || !/^[A-Za-z\s]+$/.test(details.district)) errors.district = 'District is required and should contain only letters';
    if (!details.whatsappNumber || !/^[0-9]{10}$/.test(details.whatsappNumber)) errors.whatsappNumber = 'Whatsapp number must be 10 digits';
    if (!details.studentEmail || !/\S+@\S+\.\S+/.test(details.studentEmail)) errors.studentEmail = 'Valid Student Email is required';
    if (details.alternativeNumber && !/^[0-9]{10}$/.test(details.alternativeNumber)) errors.alternativeNumber = 'Alternative number must be 10 digits';
    return errors;
};

const validateEducationalDetails = (details: EducationalDetailsType) => {
    const errors: Partial<Record<keyof EducationalDetailsType, string>> = {};
    if (!details.college.trim()) errors.college = 'Name of the College is required';
    if (!details.branch.trim()) errors.branch = 'Branch is required';
    if (!details.semester.trim()) errors.semester = 'Semester is required';
    if (!details.cgpa || !/^\d+(\.\d+)?$/.test(details.cgpa)) errors.cgpa = 'CGPA must be a number';
    return errors;
};

const validateBankDetails = (details: BankDetailsType) => {
    const errors: Partial<Record<keyof BankDetailsType, string>> = {};
    if (!details.ifsc.trim() || !/^[A-Z]{4}[0][A-Z0-9]{6}$/.test(details.ifsc)) errors.ifsc = 'IFSC Code is invalid';
    if (!details.bankName.trim()) errors.bankName = 'Bank Name is required';
    if (!details.branchName.trim()) errors.branchName = 'Branch Name is required';
    if (!details.accountNumber || !/^[0-9]{9,18}$/.test(details.accountNumber)) errors.accountNumber = 'Account Number must be between 9 and 18 digits';
    if (!details.accountHolder.trim()) errors.accountHolder = 'Account Holder is required';
    return errors;
};


const validateDocumentation = (files: FilesType) => {
    const errors: Partial<Record<string, string>> = {};

    const fileLimits = {
        0: { maxSize: 1 * 1024 * 1024 },
        1: { maxSize: 1 * 1024 * 1024 }, // 5 MB for Document 1
        2: { maxSize: 1 * 1024 * 1024 }, // 1 MB for Documents 2-5
        3: { maxSize: 1 * 1024 * 1024 },
        4: { maxSize: 1 * 1024 * 1024 },
    };

    for (const key in fileLimits) {
        const file = files[key];
        if (!file) {
            errors[key] = `Document ${key} is required`;
        } else {
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                errors[key] = `Document ${key} must be a PDF or image file`;
            }
            if (file.size > fileLimits[key].maxSize) {
                errors[key] = `Document ${key} must be less than ${fileLimits[key].maxSize / (1024 * 1024)} MB`;
            }
        }
    }

    return errors;
};


const ApplyForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>({
        name: '',
        dob: '',
        gender: '',
        applicationtype: '',
        category: '',
        aadhar: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: '',
        income: '',
        fatherOccupation: '',
        studentPhone: '',
        motherOccupation: '',
    });

    const [contactDetails, setContactDetails] = useState<ContactDetailsType>({
        house: '',
        place: '',
        postOffice: '',
        country: 'indian',
        pincode: '',
        state: 'kerala',
        district: '',
        whatsappNumber: '',
        studentEmail: '',
        alternativeNumber: '',
    });

    const [educationalDetails, setEducationalDetails] = useState<EducationalDetailsType>({
        college: '',
        branch: '',
        semester: '',
        hostelResident: true,
        cgpa: '6.5',
    });

    const [bankDetails, setBankDetails] = useState<BankDetailsType>({
        ifsc: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        accountHolder: '',
    });

    const [files, setFiles] = useState<FilesType>({});
    const [validationErrors, setValidationErrors] = useState<any>({});

    const validateCurrentTab = () => {
        switch (activeTab) {
            case 'personal':
                return validatePersonalDetails(personalDetails);
            case 'contact':
                return validateContactDetails(contactDetails);
            case 'educational':
                return {
                    ...validateEducationalDetails(educationalDetails),
                    ...validateBankDetails(bankDetails),
                };
            case 'documentation':
                return validateDocumentation(files);
            default:
                return {};
        }
    };

    const handleNextClick = () => {
        const errors = validateCurrentTab();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});

        if (activeTab === 'educational') {
            const eduErrors = validateEducationalDetails(educationalDetails);
            const bankErrors = validateBankDetails(bankDetails);

            if (Object.keys(eduErrors).length > 0 || Object.keys(bankErrors).length > 0) {
                setValidationErrors({ educationalDetails: eduErrors, bankDetails: bankErrors });
                return;
            }
        }

        setActiveTab(getNextTab());
    };

    const handlePreviousClick = () => {
        setActiveTab(getPreviousTab());
    };

    const handleSubmitClick = async () => {
        let errors: any = {};
        const personalErrors = validatePersonalDetails(personalDetails);
        const contactErrors = validateContactDetails(contactDetails);
        const educationalErrors = validateEducationalDetails(educationalDetails);
        const bankErrors = validateBankDetails(bankDetails);

        errors = {
            ...personalErrors,
            ...contactErrors,
            ...educationalErrors,
            ...bankErrors,
            ...validateDocumentation(files),
        };

        // if (Object.keys(errors).length > 0) {
        //     setValidationErrors(errors);

        //     if (Object.keys(personalErrors).length > 0) {
        //         setActiveTab('personal');
        //     } else if (Object.keys(contactErrors).length > 0) {
        //         setActiveTab('contact');
        //     } else if (Object.keys(educationalErrors).length > 0 || Object.keys(bankErrors).length > 0) {
        //         setActiveTab('educational');
        //     } else if (Object.keys(validateDocumentation(files)).length > 0) {
        //         setActiveTab('documentation');
        //     }

        //     alert('Please fill out all required fields correctly.');
        //     return;
        // }

        setValidationErrors({});
        // Submit the form data...
        let scholarshipData = { personalDetails, contactDetails, bankDetails, educationalDetails };
        const formData = new FormData();
        console.log(scholarshipData);

        // Append scholarship data as a JSON string
        formData.append('scholarshipData', JSON.stringify(scholarshipData));

        // Append files if they exist
        if (files[0]) formData.append('photo', files[0]);
        if (files[1]) formData.append('cheque', files[1]);
        if (files[2]) formData.append('aadharCard', files[2]);
        if (files[3]) formData.append('collegeID', files[3]);  // corrected index
        if (files[4]) formData.append('incomeCertificate', files[4]);

        try {
            const response = await fetch('/api/ScholarshipApi/PostScholarship', {
                method: 'POST',
                body: formData
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Unknown error occurred');
            }

            const result = await response.json();
            console.log('Scholarship application submitted successfully:', result);
        } catch (error) {
            console.error('Failed to submit scholarship application:', error.message);
        }

    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return <PersonalDetails personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} errors={validationErrors} />;
            case 'contact':
                return <ContactDetails contactDetails={contactDetails} setContactDetails={setContactDetails} errors={validationErrors} />;
            case 'educational':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <EducationalDetails
                                educationalDetails={educationalDetails}
                                setEducationalDetails={setEducationalDetails}
                                errors={validationErrors}
                            />
                        </div>
                        <div className="col-span-1">
                            <BankDetails
                                bankDetails={bankDetails}
                                setBankDetails={setBankDetails}
                                errors={validationErrors}
                            />
                        </div>
                    </div>
                );
            case 'documentation':
                return <Documentation files={files} setFiles={setFiles} errors={validationErrors} />;
            default:
                return null;
        }
    };

    const showPreviousButton = activeTab !== 'personal';
    const showNextButton = activeTab !== 'documentation';

    const getPreviousTab = () => {
        switch (activeTab) {
            case 'contact':
                return 'personal';
            case 'educational':
                return 'contact';
            case 'documentation':
                return 'educational';
            default:
                return 'personal';
        }
    };

    const getNextTab = () => {
        switch (activeTab) {
            case 'personal':
                return 'contact';
            case 'contact':
                return 'educational';
            case 'educational':
                return 'documentation';
            default:
                return 'documentation';
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="p-6">
                    {renderTabContent()}
                </div>
            </div>
            <div className={`mt-6 flex ${activeTab === 'personal' ? 'justify-end' : 'justify-between'}`}>
                {showPreviousButton && (
                    <button
                        onClick={handlePreviousClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Previous
                    </button>
                )}
                {showNextButton ? (
                    <button
                        onClick={handleNextClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApplyForm;