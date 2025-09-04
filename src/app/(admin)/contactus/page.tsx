'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config'; // Adjust import path

interface ContactDetail {
    id: string;
    type: 'email' | 'phone';
    value: string;
}

const ContactPage = () => {
    const [details, setDetails] = useState<ContactDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [newType, setNewType] = useState<'email' | 'phone'>('email');
    const [newValue, setNewValue] = useState('');

    const docRef = doc(firestore, 'siteContent', 'contact');

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDetails(docSnap.data().details || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async (updatedDetails: ContactDetail[]) => {
        try {
            await updateDoc(docRef, { details: updatedDetails });
            setDetails(updatedDetails);
        } catch (error) {
            console.error("Error saving contact details:", error);
        }
    };

    const handleAdd = () => {
        if (!newValue) return;
        const newDetail = { id: Date.now().toString(), type: newType, value: newValue };
        handleSave([...details, newDetail]);
        setNewValue('');
    };

    const handleDelete = (id: string) => {
        handleSave(details.filter(d => d.id !== id));
    };

    const handleUpdate = (id: string, value: string) => {
        const updatedDetails = details.map(d => (d.id === id ? { ...d, value } : d));
        setDetails(updatedDetails); // Optimistic update
    };

    const handleBlurSave = (id: string) => {
        const detailToSave = details.find(d => d.id === id);
        if (detailToSave) {
            handleSave(details);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Contact Information</h1>

            {/* Add New Contact Form */}
            <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow flex items-center gap-4">
                <select value={newType} onChange={e => setNewType(e.target.value as any)} className="p-2 border rounded">
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
                <input
                    type={newType === 'email' ? 'email' : 'tel'}
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder={newType === 'email' ? 'example@email.com' : '+91 12345 67890'}
                    className="flex-grow p-2 border rounded"
                />
                <button onClick={handleAdd} className="px-4 py-2 bg-purple-600 text-white rounded">
                    Add
                </button>
            </div>

            {/* Existing Contacts List */}
            <div className="space-y-3">
                {details.map(detail => (
                    <div key={detail.id} className="p-3 bg-white rounded-lg shadow flex items-center gap-4">
                        <span className="font-semibold capitalize w-20">{detail.type}:</span>
                        <input
                            type="text"
                            value={detail.value}
                            onChange={(e) => handleUpdate(detail.id, e.target.value)}
                            onBlur={() => handleBlurSave(detail.id)}
                            className="flex-grow p-2 border border-transparent focus:border-gray-300 rounded"
                        />
                        <button onClick={() => handleDelete(detail.id)} className="text-red-500 hover:text-red-700 font-bold text-2xl">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactPage;