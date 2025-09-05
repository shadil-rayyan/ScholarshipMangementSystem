// Eligibility data - Updated 9/5/2025, 7:40:05 AM
export interface ListItem {
  id: string;
  text: string;
}

export const eligibilityData = {
  criteria: [
  {
    "id": "1",
    "text": "Must be a resident of the state for at least 2 years"
  },
  {
    "id": "2",
    "text": "Annual family income should not exceed $50,000"
  },
  {
    "id": "3",
    "text": "Must have completed high school or equivalent"
  }
] as ListItem[],
  documents: [
  {
    "id": "1",
    "text": "Valid government-issued photo ID"
  },
  {
    "id": "2",
    "text": "Proof of residence (utility bill or lease agreement)"
  },
  {
    "id": "3",
    "text": "Income tax returns for the last 2 years"
  }
] as ListItem[]
};

export const eligibilityMetadata = {
  lastUpdated: '2025-09-05T02:10:05.781Z',
  totalCriteria: 3,
  totalDocuments: 3
};

export default eligibilityData;
