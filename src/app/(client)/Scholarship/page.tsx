'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import scholarship_hero from '@/assets/scholarship/scholarship_hero.png';

const DarsanaScholarshipPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('about');
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [applicationId, setApplicationId] = useState<string>('');

    const faqData = [
        { 
            question: "What is the Biju Cheriyan Endowment?", 
            answer: "The Biju Cheriyan Endowment is a scholarship program established by Darsana to support economically disadvantaged students at NSS College of Engineering. It was initiated in 2008 to honor Biju Cheriyan and his commitment to student rights and social causes. The program provides financial assistance and additional support to selected students based on their academic performance and economic status." 
        },
        { 
            question: "How much financial support does the Endowment provide?", 
            answer: "The Endowment currently offers an annual stipend of Rs. 12,000 to selected students. This amount is linked to the students' academic performance, with graded incentives for higher CGPA. Initially, the stipend was Rs. 8,000 when the program started in 2008, but it has increased over the years to benefit more students." 
        },
        { 
            question: "What additional programs and support are offered through the Endowment?", 
            answer: "Beyond financial support, the Biju Cheriyan Endowment provides various programs such as communication skills workshops, career guidance sessions, and motivational talks. Darsana members also mentor beneficiaries, offering academic and personal guidance to help them achieve better prospects and overcome challenges." 
        },
        { 
            question: "How is the Endowment funded and managed?", 
            answer: "The Endowment is funded solely through contributions from Darsana members, who donate in units of Rs. 500. The contributions are pooled into a corpus that is carefully administered by the Executive Committee. The entire scholarship process, including application calls, vetting, home visits for verification, and award ceremonies, is managed by Darsana members with assistance from the college authorities." 
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const handleApplicationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApplicationId(e.target.value);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <div className="prose max-w-none">
                        <p>Biju Cheriyan studied Instrumentation and Control Engineering at the NSS College of Engineering in Palakkad from 1987 to 1991. Biju, who had been active in the progressive left movement since his school days, made a significant contribution to shaping the campus ethos at the NSSCE. An excellent student, he was also a committed supporter of students' rights, an ardent leftist, a practical leader, a tenacious fighter, a devoted friend, and most importantly a stunning human being. In 1997, he passed away far too soon. To preserve the memory of Biju Cheriyan and the principles he upheld, his friends formed Darsana, a group of like-minded former NSSCE students.</p>
                        <p>One of the flagship programs of Darsana, the Biju Cheriyan Endowment started with the modest aim of effectively intervening in the academic lives of some of the less privileged students of NSSCE. Beginning in 2008, an annual stipend of Rs. 8000 was provided to eight students of NSSCE, who were selected based on their economic status, after scrutiny. Over the years, this amount is increased to Rs 12,000, with the number of beneficiaries increasing to 40 students per year. The stipend is linked to their academic performance, with graded incentives for better CGPA. Darsana is proud to have made a difference in the lives of these students. It is heartening to see that quite a few of the beneficiaries, doing well in life, are now enthusiastically contributing to the Endowment in whatever way possible.</p>
                        <p>The Biju Cheriyan Endowment has now grown beyond just a scholarship scheme, with programs to equip the students in terms of better communication skills, career guidance sessions as well as motivational talks. Darsana members have also been mentoring some of the beneficiaries, spending time with them, guiding them over academic and personal difficulties, and enabling them to achieve better prospects. The Endowment is also used to organize regular academic programs to help the under-performers to learn better and progress towards their B.Tech degree. The Biju Cheriyan Endowment and the Scholarship are now well-known in the college and beyond, with the number of applications growing every year. We have had to regretfully reject quite a few suitable applicants, as the numbers are now going beyond our capacity to accommodate them, both financially and logistically.</p>
                        <p>The Endowment is built solely through contributions from Darsana members, in units of Rs.500/-. A corpus has been built up for this purpose and carefully administered by the Executive Committee. The entire Scholarship program, right from the call for applications, through shortlisting, vetting of the applications, visits to applicant's homes for verification, and finalization to the function for awarding the scholarship by the Principal, is run by Darsana members, with help from the college authorities.</p>
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
                                    <div className="p-4 bg-gray-50">
                                        {faq.answer}
                                    </div>
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
                            <div className="flex items-center space-x-4">
                                <Mail size={24} className="text-blue-500" />
                                <div>
                                    <h3 className="text-xl font-semibold">Email</h3>
                                    <p className="text-gray-600">info@darsana.in</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Phone size={24} className="text-blue-500" />
                                <div>
                                    <h3 className="text-xl font-semibold">Phone</h3>
                                    <p className="text-gray-600">+919495806844</p>
                                </div>
                            </div>
                            {/* <div className="bg-gray-100 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Still have a question?</h3>
                                <p className="mb-4 text-gray-600">Visit our contact us page or click the button below to get in touch with us.</p>
                                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                                    Contact Us
                                </button>
                            </div> */}
                        </div>
                    </div>
                );
            case 'track':
                return (
                  <div className="max-w-md mx-auto p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                      Track Your Application
                    </h2>
                    <p className="mb-4 text-gray-600 text-center">
                      Enter your Email ID to track the status of your
                      application.
                    </p>
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        value={applicationId}
                        onChange={handleApplicationIdChange}
                        placeholder="Enter Email ID"
                        className="border border-gray-300 rounded-lg p-2 w-full max-w-sm mb-4"
                      />
                      <Link
                        href={`/Scholarship/status?applicationNumber=${applicationId}`}
                      >
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                          Track Application
                        </button>
                      </Link>
                    </div>
                  </div>
                );
            default:
                return <div>Please select a tab</div>;
        }
    };

    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="container mx-auto px-4">
            {/* Image with responsive width and constrained height */}
            <div className="relative w-full max-w-full mb-4 overflow-hidden">
              <div className="h-40 sm:h-80 md:h-36 lg:h-128">
                <Image
                  src={scholarship_hero}
                  alt="Scholarship Banner"
                  layout="fill"
                  objectFit="cover"
                  className="w-100% h-100%"
                  style={{ objectPosition: ' bottem' }} // Adjust positioning here
                />
              </div>
            </div>

            <nav className="bg-blue-600 text-white mb-4">
              <ul className="flex">
                {['about', 'eligibility', 'faq', 'contact', 'track'].map(
                  (tab) => (
                    <li
                      key={tab}
                      className={`flex-1 text-center py-2 cursor-pointer ${
                        activeTab === tab ? 'bg-blue-700' : ''
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="my-4">{renderContent()}</div>

            {activeTab !== 'track' &&
              activeTab !== 'contact' &&
              activeTab !== 'faq' && (
                <div className="text-center my-8">
                  <p className="mb-2">
                    Click here to apply for the scholarship
                  </p>
                  <Link href="/Scholarship/apply">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      APPLY NOW
                    </button>
                  </Link>
                </div>
              )}
          </div>
        </main>
      </div>
    );
};

export default DarsanaScholarshipPage;
