// src/components/scholarship/client/Tab.tsx
import React from 'react';

export interface TabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Tab: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
    const tabs = ['personal', 'contact', 'educational', 'documentation', 'finalsubmit'];

    return (
        <div className="flex border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-grow py-4 px-6 text-center transition duration-300 ease-in-out 
                    ${activeTab === tab ? 'bg-[#0E5B8A] text-white font-bold shadow-[0px_4px_12px_rgba(0,0,0,0.5)]' : 'bg-[#1187C9] text-black font-semibold shadow-md'}
                    hover:bg-[#0E5B8E] `} // Adjust hover color as needed
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