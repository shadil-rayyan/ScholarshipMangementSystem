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
  const [user] = useAuthState(auth);

  const router = useRouter();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplyCondition = async () => {
      try {
        const response = await fetch('/api/admin/applyButton'); // Your API endpoint
        const data = await response.json();

        if (data.case === true) {
          setIsButtonVisible(true); // Show button if case is true
        }
      } catch (error) {
        console.error('Error fetching apply condition:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchApplyCondition();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
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
      answer:
        'The Biju Cheriyan Endowment is a scholarship program established by Darsana to support economically disadvantaged students at NSS College of Engineering. It was initiated in 2008 to honor Biju Cheriyan and his commitment to student rights and social causes.',
    },
    {
      question: 'How much financial support does the Endowment provide?',
      answer:
        "The Endowment currently offers an annual stipend of Rs. 12,000 to selected students. This amount is linked to the students' academic performance, with graded incentives for higher CGPA.",
    },
    {
      question: 'What additional programs and support are offered through the Endowment?',
      answer:
        'Beyond financial support, the Biju Cheriyan Endowment provides various programs such as communication skills workshops, career guidance sessions, and motivational talks.',
    },
    {
      question: 'How is the Endowment funded and managed?',
      answer:
        'The Endowment is funded solely through contributions from Darsana members, who donate in units of Rs. 500. The entire scholarship process is managed by Darsana members with assistance from the college authorities.',
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
              Biju Cheriyan, an Instrumentation and Control Engineering graduate
              from NSS College of Engineering, was deeply involved in student
              rights advocacy. The Biju Cheriyan Endowment, a flagship program
              of Darsana, began in 2008 to support economically disadvantaged
              students.
            </p>
            <p>
              The Endowment offers financial support, mentoring, and academic
              programs for students, benefitting 40 students annually.
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
                    <h3 className="text-xl font-semibold text-gray-800">
                      Email
                    </h3>
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
                <h3 className="text-xl font-semibold mb-3">
                  Still have a question?
                </h3>
                <p className="mb-4 text-gray-600">
                  Visit our contact us page or click the button below to get in
                  touch with us.
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
          <div className="max-w-7xl mx-auto p-4">
            {!user ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  You need to log in to track your application
                </h2>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Login
                </button>
              </div>
            ) : (
              <ScholarshipStatusPage email={user.email} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <div className="relative h-auto w-full max-w-full mb-4 flex justify-center">
            <div className="w-[85%] h-[350px]">
              <Image
                src={scholarship_hero}
                alt="Scholarship Banner"
                className="w-full h-full"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                priority
              />
            </div>
          </div>

          <nav className="bg-blue-600 text-white mb-4">
            <ul className="flex">
              {['about', 'eligibility', 'faq', 'contact', 'track'].map((tab) => (
                <li
                  key={tab}
                  className={`flex-1 text-center py-2 cursor-pointer ${activeTab === tab ? 'bg-blue-700' : ''
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </li>
              ))}
            </ul>
          </nav>

          <div className="my-4">{renderContent()}</div>

          {activeTab !== 'track' && (
            <div className="text-center my-8">
              {isButtonVisible ? (
                <>
                  <p className="mb-2">Click here to apply for the scholarship</p>
                  {showLoginMessage && (
                    <p className="text-red-500 text-center">
                      You need to sign in to apply
                    </p>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleApplyClick}
                  >
                    APPLY NOW
                  </button>
                </>
              ) : (
                <p className="text-red-500">Application is currently closed</p>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default DarsanaScholarshipPage;
