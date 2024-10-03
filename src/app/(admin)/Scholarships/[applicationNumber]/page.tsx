// app/(admin)/Scholarships/[applicationNumber]/page.tsx

'use client'
import React, { useState, useEffect } from 'react';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation, Verification, ScholarshipDetails } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ScholarshipBox from '@/components/scholarshipadmin/detailbox';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';


const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<ScholarshipDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [showDraftSaved, setShowDraftSaved] = useState(false);

    const router = useRouter();
    // Dummy verificationTable and setVerificationTable state
    const [verificationTable, setVerificationTable] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);


    const adminName = user?.displayName || ' Admin';
    const profileImage = user?.photoURL || '';

    const handleEditClick = () => {
        // Handle the edit action, e.g., navigate to an edit page
        router.push(`/Scholarships/edit/${applicationNumber}`);
    };
    useEffect(() => {
        fetchScholarshipDetail();
    }, [applicationNumber]);

    const fetchScholarshipDetail = async () => {
        try {
            const response = await fetch(`/api/ScholarshipApi/GetScholarshipDetail/${applicationNumber}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch scholarship details: ${await response.text()}`);
            }
            const data: ScholarshipDetails = await response.json();
            setScholarshipDetails(data);
        } catch (err) {
            setError("Error fetching scholarship details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClick = async () => {
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 3000);

        try {
            if (!scholarshipDetails) {
                throw new Error("No scholarship details to update");
            }

            const updatedScholarshipDetails = {
                applicationNumber: scholarshipDetails.applicationNumber,
                status: scholarshipDetails.status,
                remark: scholarshipDetails.remark || '', // Add remark to the update
                verifyadmin: verificationTable[0]?.admin || '', // Adjust these fields
                selectadmin: verificationTable[1]?.admin || '',
                amountadmin: verificationTable[2]?.admin || '',
                rejectadmin: verificationTable[3]?.admin || '',
                revertedadmin: verificationTable[4]?.admin || '',
                adminName: adminName, // Include admin name here
            };

            console.log("Updating with:", updatedScholarshipDetails);

            const response = await fetch(`/api/ScholarshipApi/UpdateScholarship/${applicationNumber}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedScholarshipDetails), // Remove adminName from here
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update scholarship. Error: ${errorData.message}`);
            }

            console.log("Response Body:", await response.text());
            console.log("Scholarship updated successfully.");

            router.push('/Scholarships'); // Adjust this path to your home page route

        } catch (error) {
            console.error("Error updating scholarship or sending email:", error);
        }
    };

    const handleViewLogClick = async () => {

        router.push(`/adminLog/${applicationNumber}`);  // Adjust this path to your home page route


    };


    const handleNextClick = () => {
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 3000);

        const tabs = ["personal", "contact", "educational", "documentation", "verification"];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handlePreviousClick = () => {
        const tabs = ["personal", "contact", "educational", "documentation", "verification"];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const renderTabContent = () => {
        if (!scholarshipDetails) return null;

        switch (activeTab) {
            case "personal":
                return <PersonalDetails scholarshipDetails={scholarshipDetails} />;
            case "contact":
                return <ContactDetails scholarshipDetails={scholarshipDetails} />;
            case "educational":
                return <EducationalAndBankDetails scholarshipDetails={scholarshipDetails} />;
            case "documentation":
                return <Documentation scholarshipDetails={scholarshipDetails} />;
            case "verification":
                return (
                    <Verification
                        status={scholarshipDetails.status || "Verify"}
                        setStatus={(status) =>
                            setScholarshipDetails((prev) => (prev ? { ...prev, status } : null))
                        }
                        verificationTable={verificationTable} // Pass the verificationTable
                        setVerificationTable={setVerificationTable} // Pass the setVerificationTable
                        scholarshipDetails={scholarshipDetails}
                        setScholarshipDetails={setScholarshipDetails}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                
                {scholarshipDetails ? (
                    <ScholarshipBox
                        name={scholarshipDetails.name}
                        applicationNumber={scholarshipDetails.applicationNumber}
                        email={scholarshipDetails.studentEmail}
                        imageUrl={scholarshipDetails.photoUrl}
                    />
                ) : (
                    <p className="text-gray-600">No scholarship details available.</p>
                )}

<div className='gap-4'>
            <button onClick={handleViewLogClick} className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                    Verification Log
                </button>
            <button
                onClick={handleEditClick}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button>
            </div>

            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex border-b">
                    {["personal", "contact", "educational", "documentation", "verification"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-center ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {tab === "educational"
                                ? "Educational and Bank Details"
                                : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                        </button>
                    ))}
                </div>
                <div className="p-6">{renderTabContent()}</div>
            </div>

            <div className={`flex mt-6 ${activeTab === "personal" ? "justify-end" : "justify-between"}`}>
                {activeTab !== "personal" && (
                    <button onClick={handlePreviousClick} className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                        Previous
                    </button>
                )}
                {activeTab !== "verification" ? (
                    <button onClick={handleNextClick} className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                        Next
                    </button>
                ) : (
                    <button onClick={handleSubmitClick} className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                        Submit
                    </button>
                )}
            </div>

            {showDraftSaved && <div className="mt-4 text-green-500">Draft saved!</div>}
        </div>

    );
};

export default ScholarshipDetailPage;
