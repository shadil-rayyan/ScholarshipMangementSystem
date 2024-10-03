import React, { useState, useEffect } from 'react';
import { FaFilter, FaRedo } from 'react-icons/fa';
import './Filter.css';

interface FilterProps {
  filters: { applicationId: string; status: string; year: string; priority: string; name: string };
  onFilterChange: (filters: { applicationId: string; status: string; year: string; priority: string; name: string }) => void;
  onResetFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (name: string, value: string) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    onResetFilters();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-2xl border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 overflow-x-auto">
        <div className="flex items-center">
          <FaFilter className="text-gray-600 mr-2" />
          <span className="text-lg font-semibold text-gray-800">Filter by</span>
        </div>

        <div className="flex-1">
          <input
            id="applicationId"
            type="text"
            value={localFilters.applicationId}
            onChange={(e) => handleChange('applicationId', e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Application ID"
          />
        </div>

        <div className="flex-1">
          <input
            id="name"
            type="text"
            value={localFilters.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Name"
          />
        </div>

        <div className="flex-1">
          <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Verify">Verify</option>
            <option value="Reject">Reject</option>
            <option value="Reverted">Reverted</option>
            <option value="Select">Select</option>
            <option value="Amount Proceed">Amount Proceed</option>
          </select>
        </div>

        <div className="flex-1">
          <select
            id="year"
            value={localFilters.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
        </div>

        <div className="flex-1">
          <select
            id="priority"
            value={localFilters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
          >
            <option value="">Priority</option>
            <option value="income">Income</option>
            <option value="cgpa">CGPA</option>
          </select>
        </div>

        <button onClick={handleReset} className="flex items-center px-4 py-2 text-red-500 rounded-lg hover:text-red-700 focus:outline-none">
          <FaRedo className="mr-2" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;