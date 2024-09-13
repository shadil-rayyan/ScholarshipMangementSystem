import React from 'react';

const TopBar = () => {
    return (
        <div className="flex justify-between items-center p-5 bg-white shadow-md">
            <h1 className="text-xl font-bold">Hi, Tynisha!</h1>
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-full px-4 py-1 mr-5"
                />
                <span className="material-icons text-gray-600 mr-5">mail</span>
                <span className="material-icons text-gray-600 mr-5">notifications</span>
                <div className="flex items-center">
                    <span className="mr-2 text-sm">Tynisha Obey</span>
                    <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
