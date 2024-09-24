'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import scholarship_hero from '@/assets/scholarship/scholarship_hero.jpeg';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'; // Firebase Auth hook
import { auth } from '@/lib/firebase/config';
import ScholarshipStatusPage from '@/components/status';

const DarsanaScholarshipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const [user] = useAuthState(auth); // Firebase Auth hook

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe(); // Return cleanup function to unsubscribe when the component unmounts
  }, []);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleApplicationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setApplicationId(email);

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const faqData = [
    {
      question: 'What is the Biju Cheriyan Endowment?',
      answer: 'The Biju Cheriyan Endowment is a scholarship program established by Darsana to support economically disadvantaged students at NSS College of Engineering. It was initiated in 2008 to honor Biju Cheriyan and his commitment to student rights and social causes.',
    },
    {
      question: 'How much financial support does the Endowment provide?',
      answer: "The Endowment currently offers an annual stipend of Rs. 12,000 to selected students. This amount is linked to the students' academic performance, with graded incentives for higher CGPA.",
    },
    {
      question: 'What additional programs and support are offered through the Endowment?',
      answer: 'Beyond financial support, the Biju Cheriyan Endowment provides various programs such as communication skills workshops, career guidance sessions, and motivational talks.',
    },
    {
      question: 'How is the Endowment funded and managed?',
      answer: 'The Endowment is funded solely through contributions from Darsana members, who donate in units of Rs. 500. The entire scholarship process is managed by Darsana members with assistance from the college authorities.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleTrackApplication = () => {
    if (applicationId && !emailError) {
      router.push(`/Scholarship/status/${encodeURIComponent(applicationId)}`);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 2000);
    } else {
      router.push('/Scholarship/apply');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="prose max-w-none mx-auto p-6 rounded-lg leading-relaxed">
            <p>
              Biju Cheriyan, an Instrumentation and Control Engineering graduate from NSS College of Engineering, was deeply involved in student rights advocacy. The Biju Cheriyan Endowment, a flagship program of Darsana, began in 2008 to support economically disadvantaged students.
            </p>
            <p>
              The Endowment offers financial support, mentoring, and academic programs for students, benefitting 40 students annually.
            </p>
          </div>
        );
      case 'eligibility':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Eligibility Criteria:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be a resident of India.</li>
              <li>Be a school or college student.</li>
              <li>Fall within the age range of 5 to 25 years.</li>
            </ul>
            <h3 className="font-bold text-lg mt-6">Documents Required:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Student ID proof (ID Card) issued by College.</li>
              <li>Bank passbook</li>
              <li>Passport size Photo.</li>
              <li>Aadhaar Card.</li>
              <li>Income certificate</li>
            </ul>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border rounded-md">
                <button
                  className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openFAQ === index && (
                  <div className="p-4 bg-gray-50">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
            <div className="space-y-8">
              <div className="flex justify-around items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <Mail size={30} className="text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@darsana.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone size={30} className="text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+919495806844</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Still have a question?</h3>
                <p className="mb-4 text-gray-600">
                  Visit our contact us page or click the button below to get in touch with us.
                </p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        );
      case 'track':
        return (
          <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Track Your Application</h2>
            <p className="mb-4 text-gray-600 text-center">Enter your Email ID to track the status of your application.</p>
            <div className="flex flex-col items-center">
              <input
                type="email"
                value={applicationId}
                onChange={handleApplicationIdChange}
                placeholder="Enter Email ID"
                className="border border-gray-300 rounded-lg p-2 w-full max-w-sm mb-2"
              />
              {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={emailError !== '' || applicationId === ''}
                onClick={handleTrackApplication}
              >
                Track Application
              </button>
            </div>
          </div>
        );
      default:
        return <div>Please select a tab to view content.</div>;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-96">
        <Image src={scholarship_hero} alt="Scholarship Hero" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold">Darsana Scholarship</h1>
        </div>
      </div>
      <div className="tabs flex justify-around border-b">
        <button onClick={() => setActiveTab('about')} className={`tab ${activeTab === 'about' ? 'active' : ''}`}>
          About
        </button>
        <button onClick={() => setActiveTab('eligibility')} className={`tab ${activeTab === 'eligibility' ? 'active' : ''}`}>
          Eligibility
        </button>
        <button onClick={() => setActiveTab('faq')} className={`tab ${activeTab === 'faq' ? 'active' : ''}`}>
          FAQ
        </button>
        <button onClick={() => setActiveTab('contact')} className={`tab ${activeTab === 'contact' ? 'active' : ''}`}>
          Contact
        </button>
        <button onClick={() => setActiveTab('track')} className={`tab ${activeTab === 'track' ? 'active' : ''}`}>
          Track Application
        </button>
      </div>
      {renderContent()}
      {showLoginMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md">
          Please log in to apply for the scholarship.
        </div>
      )}
      <button onClick={handleApplyClick} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4">
        Apply Now
      </button>
    </div>
  );
};

export default DarsanaScholarshipPage;
