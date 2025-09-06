// FAQ data - Updated 9/6/2025, 12:19:18 PM
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    "id": "1757141042919",
    "question": "What is the CodeCompass Student Scholarship?",
    "answer": "The CodeCompass Student Scholarship is a financial support program for students pursuing computer science, software engineering, and related fields. It recognizes students with strong academic potential, innovative thinking, and a passion for technology."
  },
  {
    "id": "1757141061207",
    "question": "Who can apply?",
    "answer": "Any undergraduate student enrolled in a recognized college/university can apply. Preference is given to:\n\nFirst-generation learners\n\nWomen in technology\n\nStudents from underrepresented or economically disadvantaged backgrounds"
  },
  {
    "id": "1757141318523",
    "question": "What are the eligibility criteria?",
    "answer": "Applicants should demonstrate:\n\nA strong academic record\n\nInterest in technology, coding, or innovation (through projects, competitions, or coursework)\n\nFinancial need (if applicable)"
  },
  {
    "id": "1757141339169",
    "question": "How many scholarships are awarded?",
    "answer": "The number of scholarships awarded each year depends on available funding. Typically, 10–20 students are selected per cycle."
  },
  {
    "id": "1757141358108",
    "question": "Do I need to repay the scholarship?",
    "answer": "No. This is a grant, not a loan. The only expectation is that recipients maintain good academic standing and continue to actively pursue their studies in technology."
  }
];

export const faqMetadata = {
  lastUpdated: '2025-09-06T06:49:18.124Z',
  totalItems: 5
};

export default faqData;
