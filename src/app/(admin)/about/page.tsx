'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config'; // Adjust this import path if needed

const AboutPage = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const docRef = doc(firestore, 'siteContent', 'about');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDescription(docSnap.data().description);
                }
            } catch (error) {
                console.error("Error fetching about content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(docRef, { description });
            alert('About content updated successfully!');
        } catch (error) {
            console.error("Error updating document:", error);
            alert('Failed to update content.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Manage About Page</h1>
            <div className="space-y-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    About Description
                </label>
                <textarea
                    id="description"
                    rows={8}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the description for the about page..."
                />
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;