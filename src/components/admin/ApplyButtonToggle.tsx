import { useState, useEffect } from 'react';

const ApplyButtonToggle = () => {
    const [isToggled, setIsToggled] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch the initial state from the API (optional)
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                const response = await fetch('/api/admin/applyButton');
                const data = await response.json();
                setIsToggled(data.case); // Assuming the API returns { case: true/false }
            } catch (error) {
                console.error('Error fetching initial apply button status:', error);
            }
        };

        fetchInitialState();
    }, []);

    // Handle the toggle change
    const handleToggle = async () => {
        setLoading(true);
        const newState = !isToggled;
        try {
            const response = await fetch('/api/admin/setApplyButton', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ condition: newState }),
            });

            // If status is 204, skip JSON parsing
            if (response.status === 204) {
                setIsToggled(newState); // Update the toggle state directly
            } else {
                const data = await response.json(); // Parse JSON for other status codes
                if (data.success) {
                    setIsToggled(newState); // Update the local state after successful backend update
                } else {
                    console.error('Failed to update apply button status:', data.error);
                }
            }
        } catch (error) {
            console.error('Error setting apply button status:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center">
            <span className="mr-4 text-lg font-medium text-gray-700">Toggle Apply Button</span>
            <button
                className={`w-16 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${isToggled ? 'bg-green-400' : 'bg-gray-400'}`}
                onClick={handleToggle}
                disabled={loading}
            >
                <div
                    className={`h-6 w-6 bg-white rounded-full shadow-md transform ${isToggled ? 'translate-x-8' : 'translate-x-0'}`}
                ></div>
            </button>
            {loading && <p className="ml-2 text-blue-500">Updating...</p>}
        </div>
    );
};

export default ApplyButtonToggle;
