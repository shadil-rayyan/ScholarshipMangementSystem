// src/components/scholarship/client/Tab.tsx
import React from 'react';

export interface TabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    validationErrors: Record<string, boolean>; // A record of validation errors per tab
}

export const Tab: React.FC<TabProps> = ({ activeTab, setActiveTab, validationErrors }) => {
    const tabs = ['personal', 'contact', 'educational', 'documentation', 'finalsubmit'];

    const handleTabClick = (tab: string) => {
        if (validationErrors[tab]) {
            return; // Prevent switching to a tab that has errors
        }
        setActiveTab(tab);
    };

    return (
        <div className="flex border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`flex-grow py-4 px-6 text-center transition duration-300 ease-in-out 
                    ${activeTab === tab ? 'bg-[#0E5B8A] text-white font-bold shadow-[0px_4px_12px_rgba(0,0,0,0.5)]' : 
                    validationErrors[tab] ? 'bg-red-500 text-white font-bold' : 'bg-[#1187C9] text-black font-semibold shadow-md'}
                    hover:bg-[#0E5B8E]`}
                    style={{ height: '80px' }} // Adjust height as needed
                >
                    {tab === 'educational' ? 'Educational and Bank Details' :
                        tab === 'finalsubmit' ? 'Final Submit' :
                            `${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                </button>
            ))}
        </div>
    );
};
