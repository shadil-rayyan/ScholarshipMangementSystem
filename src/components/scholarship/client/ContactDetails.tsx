import React from 'react';
import { InputField } from './InputField';

export interface ContactDetailsType {
    house: string;
    place: string;
    postOffice: string;
    country: string;
    pincode: string;
    state: string;
    district: string;
    whatsappNumber: string;
    studentEmail: string;
    alternativeNumber: string;
}

interface ContactDetailsProps {
    contactDetails: ContactDetailsType;
    setContactDetails: React.Dispatch<React.SetStateAction<ContactDetailsType>>;
    errors: Partial<Record<keyof ContactDetailsType, string>>;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
    contactDetails,
    setContactDetails,
    errors,
}) => {

    const handleChange = (field: keyof ContactDetailsType, value: string) => {
        setContactDetails(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <InputField
                label="House / Apartment Name"
                required
                value={contactDetails.house}
                onChange={(e) => handleChange('house', e.target.value)}
                error={errors.house}
            />
            <InputField
                label="Place"
                required
                value={contactDetails.place}
                onChange={(e) => handleChange('place', e.target.value)}
                error={errors.place}
            />
            <InputField
                label="Post Office"
                required
                value={contactDetails.postOffice}
                onChange={(e) => handleChange('postOffice', e.target.value)}
                error={errors.postOffice}
            />
            <InputField
                label="Country"
                value={contactDetails.country}
                onChange={(e) => handleChange('country', e.target.value)}
                error={errors.country}
            />
            <InputField
                label="Pincode"
                required
                value={contactDetails.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                error={errors.pincode}
            />
            <InputField
                label="state"
                required
                value={contactDetails.state}
                onChange={(e) => handleChange('state', e.target.value)}
                error={errors.state}
            />
            <InputField
                label="District"
                required
                value={contactDetails.district}
                onChange={(e) => handleChange('district', e.target.value)}
                error={errors.district}
            />
            <InputField
                label="Whatsapp number"
                required
                value={contactDetails.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                error={errors.whatsappNumber}
            />
            <InputField
                label="Student Email"
                value={contactDetails.studentEmail}
                onChange={(e) => handleChange('studentEmail', e.target.value)}
                error={errors.studentEmail}
            />
            <InputField
                label="Alternative number"
                value={contactDetails.alternativeNumber}
                onChange={(e) => handleChange('alternativeNumber', e.target.value)}
                error={errors.alternativeNumber}
            />
        </div>
    );
};
