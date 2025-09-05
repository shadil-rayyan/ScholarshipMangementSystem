// Contact data - Updated 9/5/2025, 8:35:29 AM
export interface ContactDetail {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  value: string;
  label?: string;
}

export const contactData: ContactDetail[] = [
  {
    "id": "1",
    "type": "email",
    "value": "infooo@company.com",
    "label": "General Inquiries"
  },
  {
    "id": "2",
    "type": "phone",
    "value": "+91 98765 43210",
    "label": "Main Office"
  },
  {
    "id": "3",
    "type": "email",
    "value": "support@company.com",
    "label": "Support"
  },
  {
    "id": "1757041396908",
    "type": "email",
    "value": "123@gmail.com",
    "label": "office"
  }
];

export const contactMetadata = {
  lastUpdated: '2025-09-05T03:05:29.502Z',
  totalContacts: 4,
  emails: 3,
  phones: 1
};

export default contactData;
