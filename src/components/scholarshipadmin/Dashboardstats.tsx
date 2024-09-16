import React from 'react';

interface DashboardStatsProps {
    stats: {
        totalApplications: number;
        selected: number;
        amountProcessed: number;
        pending: number;
        rejected: number;
        verify: number; 
        reverted: number; 
    };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <div className="p-5 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-5">
                <StatCard label="Total Applications" value={stats.totalApplications} />
                <StatCard label="Verify" value={stats.verify} />
                <StatCard label="Selected" value={stats.selected} />
                <StatCard label="Amount Processed" value={stats.amountProcessed} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="Reverted" value={stats.reverted} />
                <StatCard label="Rejected" value={stats.rejected} />             
            </div>
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
    return (
        <div className="flex flex-col items-center justify-center p-5 px-2 bg-[#a6c6d8] rounded-xl shadow-inner-xl h-23 w-full">
            <div className="text-gray-800 text-sm mb-2">{label}</div>
            <div className="text-3xl font-bold text-black">{value}</div>
        </div>
    );
};

export default DashboardStats;