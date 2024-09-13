import React from 'react';
import { users } from '@/db/dashboard/dashbordData'; // Adjust the path according to your file structure

const DashboardContent = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-36 rounded-xl mb-10 flex items-center justify-center text-white text-2xl font-semibold">
                Welcome to the Dashboard!
            </div>

            {/* Filters and Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                            <span className="material-icons text-gray-500">filter_list</span>
                            <span className="ml-2 text-gray-600">Filter By</span>
                        </div>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none">
                            14 Feb 2019
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg focus:outline-none">
                            UnRead
                        </button>
                        <button className="hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg focus:outline-none">
                            Starred
                        </button>
                        <button className="text-red-500 flex items-center px-4 py-2 rounded-lg focus:outline-none hover:bg-red-100">
                            <span className="material-icons mr-2">refresh</span> Reset Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-semibold">
                            <tr>
                                <th className="py-3 px-4">Sl. No.</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Phone Number</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Subject</th>
                                <th className="py-3 px-4">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4">{user.id}</td>
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-600 bg-green-100 py-1 px-3 rounded-full text-xs">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{user.phoneNumber}</td>
                                    <td className="py-3 px-4 text-gray-500">{user.email}</td>
                                    <td className="py-3 px-4">{user.subject}</td>
                                    <td className="py-3 px-4 text-gray-500">{user.activity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
