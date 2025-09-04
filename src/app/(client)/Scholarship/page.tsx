'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/codecompass.png'; // Fallback logo
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import ScholarshipStatusPage from '@/components/status';

// Import your local data
import { aboutData } from '@/data/about';
import { faqData as faqDataImport } from '@/data/faq';
import { eligibilityData } from '@/data/eligibility';
import { contactData } from '@/data/contact';
import { heroImageData } from '@/data/hero'; // Import hero image data

const DarsanaScholarshipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const [user] = useAuthState(auth);

  // Hero image states
  const [heroData, setHeroData] = useState(heroImageData);
  const [heroImageError, setHeroImageError] = useState(false);

  const router = useRouter();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplyCondition = async () => {
      try {
        const response = await fetch('/api/admin/applyButton');
        const data = await response.json();

        if (data.case === true) {
          setIsButtonVisible(true);
        }
      } catch (error) {
        console.error('Error fetching apply condition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplyCondition();
  }, []);

  // Load hero image data
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const { heroImageData } = await import('@/data/hero');
        setHeroData(heroImageData);
      } catch (error) {
        console.error('Error loading hero data:', error);
        setHeroImageError(true);
      }
    };
    loadHeroData();
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

  // Create cache-busting URL for hero image
  const getHeroImageUrl = () => {
    return `${heroData.imagePath}?t=${new Date(heroData.lastUpdated).getTime()}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="prose max-w-none mx-auto p-6 rounded-lg leading-relaxed">
            {aboutData.description.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        );

      case 'eligibility':
        return (
          <div className="space-y-6">
            {/* Eligibility Criteria */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-800">📋 Eligibility Criteria:</h3>
              {eligibilityData.criteria.length === 0 ? (
                <p className="text-gray-600">No criteria specified yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2">
                  {eligibilityData.criteria.map((criterion) => (
                    <li key={criterion.id} className="text-gray-700">
                      {criterion.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Required Documents */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-green-800">📄 Documents Required:</h3>
              {eligibilityData.documents.length === 0 ? (
                <p className="text-gray-600">No documents specified yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2">
                  {eligibilityData.documents.map((document) => (
                    <li key={document.id} className="text-gray-700">
                      {document.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-lg font-semibold">
                How to apply for Darsana Scholarship{' '}
                <a
                  href="https://drive.google.com/uc?export=download&id=1ZoDwGBCxYyyyiCveL7q-DEkldZnJ5vIO"
                  download
                  className="text-blue-600 hover:text-blue-800 font-bold ml-2"
                >
                  Download PDF
                </a>
              </p>
            </div>

            {faqDataImport.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No FAQs available yet.
              </div>
            ) : (
              faqDataImport.map((faq, index) => (
                <div key={faq.id} className="border rounded-md shadow-sm">
                  <button
                    className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-gray-50"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {openFAQ === index && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
            
            {contactData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contact information available yet.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Email contacts */}
                {contactData.filter(contact => contact.type === 'email').length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                      <Mail size={24} className="mr-2" />
                      Email Addresses
                    </h3>
                    <div className="space-y-2">
                      {contactData
                        .filter(contact => contact.type === 'email')
                        .map((contact) => (
                          <div key={contact.id}>
                            {contact.label && (
                              <p className="text-sm text-blue-700 font-medium">{contact.label}:</p>
                            )}
                            <a 
                              href={`mailto:${contact.value}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {contact.value}
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Phone contacts */}
                {contactData.filter(contact => contact.type === 'phone').length > 0 && (
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                      <Phone size={24} className="mr-2" />
                      Phone Numbers
                    </h3>
                    <div className="space-y-2">
                      {contactData
                        .filter(contact => contact.type === 'phone')
                        .map((contact) => (
                          <div key={contact.id}>
                            {contact.label && (
                              <p className="text-sm text-green-700 font-medium">{contact.label}:</p>
                            )}
                            <a 
                              href={`tel:${contact.value}`}
                              className="text-green-600 hover:text-green-800 hover:underline"
                            >
                              {contact.value}
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Address contacts */}
                {contactData.filter(contact => contact.type === 'address').length > 0 && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-900 mb-4">📍 Addresses</h3>
                    <div className="space-y-2">
                      {contactData
                        .filter(contact => contact.type === 'address')
                        .map((contact) => (
                          <div key={contact.id}>
                            {contact.label && (
                              <p className="text-sm text-purple-700 font-medium">{contact.label}:</p>
                            )}
                            <p className="text-purple-800">{contact.value}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Social media contacts */}
                {contactData.filter(contact => contact.type === 'social').length > 0 && (
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-4">🌐 Social Media</h3>
                    <div className="space-y-2">
                      {contactData
                        .filter(contact => contact.type === 'social')
                        .map((contact) => (
                          <div key={contact.id}>
                            {contact.label && (
                              <p className="text-sm text-indigo-700 font-medium">{contact.label}:</p>
                            )}
                            <a 
                              href={contact.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              {contact.value}
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  onClick={() => router.push('/auth/Login')}
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
          {/* Dynamic Hero Image Section */}
          <div className="relative h-auto w-full max-w-full mb-4 flex justify-center">
            <div className="w-[85%] h-[350px] relative rounded-lg overflow-hidden shadow-lg">
              {!heroImageError ? (
                <Image
                  src={getHeroImageUrl()}
                  alt="Scholarship Hero Banner"
                  className="w-full h-full object-cover"
                  fill
                  priority
                  key={heroData.lastUpdated} // Force re-render when image updates
                  onError={() => setHeroImageError(true)} // Fallback to logo on error
                />
              ) : (
                // Fallback to original logo if hero image fails
                <Image
                  src={Logo}
                  alt="Scholarship Banner"
                  className="w-full h-full"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  priority
                />
              )}
              
              

              {/* Last updated indicator */}
              <div className="absolute bottom-2 right-2">
                <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  Updated: {new Date(heroData.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <nav className="bg-blue-600 text-white mb-4 rounded-lg">
            <ul className="flex">
              {['about', 'eligibility', 'faq', 'contact', 'track'].map((tab) => (
                <li
                  key={tab}
                  className={`flex-1 text-center py-3 cursor-pointer transition-all duration-200 ${
                    activeTab === tab ? 'bg-blue-700' : 'hover:bg-blue-500'
                  } ${tab === 'about' ? 'rounded-l-lg' : ''} ${tab === 'track' ? 'rounded-r-lg' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </li>
              ))}
            </ul>
          </nav>

          <div className="my-4 bg-white rounded-lg shadow-sm p-4">
            {renderContent()}
          </div>

          {activeTab !== 'track' && (
            <div className="text-center my-8 bg-white rounded-lg p-6 shadow-sm">
              {isButtonVisible ? (
                <>
                  <p className="mb-4 text-lg text-gray-700">Ready to start your educational journey?</p>
                  {showLoginMessage && (
                    <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-md">
                      You need to sign in to apply for the scholarship
                    </p>
                  )}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-md"
                    onClick={handleApplyClick}
                  >
                    🎓 APPLY NOW
                  </button>
                </>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-600 font-semibold">⚠️ Application is currently closed</p>
                  <p className="text-red-500 text-sm mt-1">Please check back later for the next application period</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DarsanaScholarshipPage;
