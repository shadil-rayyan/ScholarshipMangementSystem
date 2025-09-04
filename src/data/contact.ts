// Contact data - Updated 9/4/2025, 6:08:41 PM
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
    "value": "info@company.com",
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
  }
];

export const contactMetadata = {
  lastUpdated: '2025-09-04T12:38:41.491Z',
  totalContacts: 3,
  emails: 2,
  phones: 1
};

export default contactData;
