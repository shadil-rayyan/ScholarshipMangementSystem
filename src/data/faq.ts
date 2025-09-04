// FAQ data - Updated 9/4/2025, 5:54:39 PM
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    "id": "1",
    "question": "What is your return policy?",
    "answer": "We offer a 30-day return policy for all unused items in their original packaging."
  },
  {
    "id": "2",
    "question": "How long does shipping take?",
    "answer": "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days."
  }
];

export const faqMetadata = {
  lastUpdated: '2025-09-04T12:24:39.141Z',
  totalItems: 2
};

export default faqData;
