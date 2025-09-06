'use client';

import React from 'react';
import ApplyButtonToggle from '@/components/admin/ApplyButtonToggle';

const ApplySettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Application Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Application Button</h2>
        <p className="text-gray-600 mb-4">
          Use the toggle below to enable or disable the "Apply Now" button for all users on the website.
        </p>
        <ApplyButtonToggle />
      </div>
    </div>
  );
};

export default ApplySettingsPage;