'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config'; // Adjust import path

interface ListItem {
    id: string;
    text: string;
}

const EligibilityPage = () => {
    const [criteria, setCriteria] = useState<ListItem[]>([]);
    const [documents, setDocuments] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const docRef = doc(firestore, 'siteContent', 'eligibility');

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCriteria(docSnap.data().criteria || []);
                setDocuments(docSnap.data().documents || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async (field: 'criteria' | 'documents', data: ListItem[]) => {
        try {
            await updateDoc(docRef, { [field]: data });
            if (field === 'criteria') setCriteria(data);
            if (field === 'documents') setDocuments(data);
        } catch (error) {
            console.error(`Error saving ${field}:`, error);
        }
    };
    
    // Generic list management component to avoid repetition
    const ListManager = ({ title, items, field }: { title: string; items: ListItem[]; field: 'criteria' | 'documents' }) => {
        const [newItemText, setNewItemText] = useState('');

        const handleAdd = () => {
            if (!newItemText) return;
            const newItem = { id: Date.now().toString(), text: newItemText };
            handleSave(field, [...items, newItem]);
            setNewItemText('');
        };
        
        const handleDelete = (id: string) => {
            handleSave(field, items.filter(item => item.id !== id));
        };

        return (
            <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        className="w-full p-2 border rounded-l"
                        placeholder="Add new item..."
                    />
                    <button onClick={handleAdd} className="px-4 py-2 bg-purple-600 text-white rounded-r">Add</button>
                </div>
                <ul className="list-disc list-inside space-y-2">
                    {items.map(item => (
                        <li key={item.id} className="flex justify-between items-center">
                            <span>{item.text}</span>
                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold">
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Eligibility</h1>
            <ListManager title="Eligibility Criteria" items={criteria} field="criteria" />
            <ListManager title="Documents Required" items={documents} field="documents" />
        </div>
    );
};

export default EligibilityPage;