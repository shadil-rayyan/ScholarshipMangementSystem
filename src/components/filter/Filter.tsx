import React, { useState } from 'react';
import { FaFilter, FaRedo } from 'react-icons/fa';
import './Filter.css';

interface FilterProps {
  onFilterChange: (filters: { applicationId: string; status: string; branch: string; year: string }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [applicationId, setApplicationId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Reset all filter criteria
  const handleReset = () => {
    setApplicationId('');
    setStatus('');
    setBranch('');
    setYear('');
    onFilterChange({ applicationId: '', status: '', branch: '', year: '' });
  };

  // Update filter criteria
  const handleChange = () => {
    onFilterChange({ applicationId, status, branch, year });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 overflow-x-auto">
        {/* Filter Icon and Text */}
        <div className="flex items-center">
          <FaFilter className="text-gray-600 mr-2" />
          <span className="text-lg font-semibold text-gray-800">Filter by</span>
        </div>

        {/* Application ID Input */}
        <div className="flex-1">
          <input
            id="applicationId"
            type="text"
            value={applicationId}
            onChange={(e) => {
              setApplicationId(e.target.value);
              handleChange();
            }}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Application ID"
          />
        </div>

        {/* Status Selection Dropdown */}
        <div className="flex-1">
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleChange();
            }}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Status</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="Verify">Verify</option>
            <option value="amount_proceed">Amount Proceed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Branch Selection Dropdown */}
        <div className="flex-1">
          <select
            id="branch"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              handleChange();
            }}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>

        {/* Year Selection Dropdown */}
        <div className="flex-1">
          <select
            id="year"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              handleChange();
            }}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 text-red-500 rounded-lg hover:text-red-700 focus:outline-none"
        >
          <FaRedo className="mr-2" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;