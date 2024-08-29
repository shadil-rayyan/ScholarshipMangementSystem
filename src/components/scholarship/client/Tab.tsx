// src/components/scholarship/client/Tab.tsx
import React from 'react';

export interface TabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Tab: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
    const tabs = ['personal', 'contact', 'educational', 'documentation'];

    return (
        <div className="flex border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 text-center ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    {tab === 'educational' ? 'Educational and Bank Details' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                </button>
            ))}
        </div>
    );
};
