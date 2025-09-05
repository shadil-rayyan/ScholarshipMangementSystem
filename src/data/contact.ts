// Contact data - Updated 9/5/2025, 10:07:55 AM
export interface ContactDetail {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  value: string;
  label?: string;
}

export const contactData: ContactDetail[] = [
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
  },
  {
    "id": "1757046751996",
    "type": "address",
    "value": "GEC PKD",
    "label": "OFFICE"
  },
  {
    "id": "1757046765740",
    "type": "social",
    "value": "www.instagram.com",
    "label": "INSTAGRAM"
  }
];

export const contactMetadata = {
  lastUpdated: '2025-09-05T04:37:55.018Z',
  totalContacts: 5,
  emails: 2,
  phones: 1
};

export default contactData;
