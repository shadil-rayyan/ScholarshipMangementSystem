'use client'
import React, { useState, useEffect } from 'react';
import { PersonalDetails, ContactDetails, EducationalAndBankDetails, Documentation, Verification, ScholarshipDetails } from '@/components/scholarshipadmin/ScholarshipDetailsComponent';
import { useParams } from 'next/navigation';
import { AdminLogEntry } from '@/util/adminLogEntry'; // Adjust the import path as needed

const ScholarshipDetailPage: React.FC = () => {
    const { applicationNumber } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState<ScholarshipDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const [verificationTable, setVerificationTable] = useState<AdminLogEntry[]>([
        { step: 0, label: "Verified by Darsana", value: "", admin: "Admin 1" },
        { step: 1, label: "Selected for Scholarship", value: "", admin: "" },
        { step: 2, label: "Amount processed from Darsana", value: "", admin: "Admin 2" },
        { step: 3, label: 'Rejected from Darsana', value: '', admin: 'Admin 3' }
    ]);

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

        const adminLog: AdminLogEntry[] = verificationTable.map((item) => ({
            step: item.step,
            label: item.label,
            value: item.value,
            admin: item.admin,
        }));

        const updatedScholarshipDetails = {
            status: scholarshipDetails.status,
            adminLog: adminLog,
        };

        console.log("Updating with:", updatedScholarshipDetails);

        const response = await fetch(`/api/ScholarshipApi/UpdateScholarship/${applicationNumber}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedScholarshipDetails),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update scholarship. Error: ${errorData.message}`);
        }

        console.log("Response Body:", await response.text());
        console.log("Scholarship updated successfully.");

        // Check if status has changed and send email if it has
        const previousStatus = scholarshipDetails.status;
        const newStatus = updatedScholarshipDetails.status;

        if (previousStatus !== newStatus) {
            const remark = `Status updated to ${newStatus}`; // Fetch remarks if needed

            const emailResponse = await fetch(`/api/SendMail/sendEmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationNumber,
                    status: newStatus,
                    remark,
                }),
            });

            if (!emailResponse.ok) {
                const errorData = await emailResponse.json();
                throw new Error(`Failed to send email. Error: ${errorData.message}`);
            }

            console.log("Email notification sent.");
        }
    } catch (error) {
        console.error("Error updating scholarship or sending email:", error);
    }
};


    // Move to the next tab
    const handleNextClick = () => {
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 3000);

        const tabs = ["personal", "contact", "educational", "documentation", "verification"];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    // Move to the previous tab
    const handlePreviousClick = () => {
        const tabs = ["personal", "contact", "educational", "documentation", "verification"];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    // Render content based on the active tab
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
                        verificationTable={verificationTable}
                        setVerificationTable={setVerificationTable}
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
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex border-b">
                    {["personal", "contact", "educational", "documentation", "verification"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-center ${
                                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
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
                    <button onClick={handlePreviousClick} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Previous
                    </button>
                )}
                {activeTab !== "verification" ? (
                    <button onClick={handleNextClick} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Next
                    </button>
                ) : (
                    <button onClick={handleSubmitClick} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Submit
                    </button>
                )}
            </div>

            {showDraftSaved && <div className="mt-4 text-green-500">Draft saved!</div>}
        </div>
    );
};

export default ScholarshipDetailPage;
