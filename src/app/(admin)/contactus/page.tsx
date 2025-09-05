'use client';

import React, { useState, useEffect } from 'react';

interface ContactDetail {
    id: string;
    type: 'email' | 'phone' | 'address' | 'social';
    value: string;
    label?: string;
}

const ContactPage = () => {
    const [details, setDetails] = useState<ContactDetail[]>([]);
    const [originalDetails, setOriginalDetails] = useState<ContactDetail[]>([]); // For cancellation
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // State to track which item is being edited
    const [editingId, setEditingId] = useState<string | null>(null);

    // State for the "Add New" form
    const [newType, setNewType] = useState<'email' | 'phone' | 'address' | 'social'>('email');
    const [newValue, setNewValue] = useState('');
    const [newLabel, setNewLabel] = useState('');

    useEffect(() => {
        const loadExistingData = async () => {
            try {
                // In a real app, this would be a fetch call to your API/database
                const { contactData } = await import('@/data/contact');
                setDetails(contactData || []);
                setOriginalDetails(contactData || []); // Keep a backup for the cancel feature
            } catch (error) {
                console.error("Could not load contact data:", error);
                setDetails([]);
            } finally {
                setLoading(false);
            }
        };
        loadExistingData();
    }, []);

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/save-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ details }),
            });
            const result = await response.json();
            if (result.success) {
                setOriginalDetails(details); // Update the backup with the new saved state
                setHasUnsavedChanges(false);
                alert('Contact data saved successfully!');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Failed to save contact data.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleAdd = () => {
        if (!newValue.trim()) {
            alert('Please enter a contact value.');
            return;
        }
        const newDetail: ContactDetail = { 
            id: Date.now().toString(), 
            type: newType, 
            value: newValue.trim(),
            label: newLabel.trim() || undefined
        };
        setDetails([...details, newDetail]);
        setHasUnsavedChanges(true);
        setNewValue('');
        setNewLabel('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            setDetails(details.filter(d => d.id !== id));
            setHasUnsavedChanges(true);
        }
    };
    
    const handleUpdate = (id: string, field: keyof ContactDetail, value: string) => {
        setDetails(details.map(d => d.id === id ? { ...d, [field]: value } : d));
        setHasUnsavedChanges(true);
    };

    const handleCancelEdit = (id: string) => {
        const originalItem = originalDetails.find(d => d.id === id);
        if (originalItem) {
            setDetails(details.map(d => d.id === id ? originalItem : d));
        } else {
             setDetails(details.filter(d => d.id !== id));
        }
        setEditingId(null);
    };

    const getPlaceholder = (type: string) => {
        switch(type) {
            case 'email': return 'example@company.com';
            case 'phone': return '+91 98765 43210';
            case 'address': return '123 Main St, City, State 12345';
            case 'social': return 'https://twitter.com/company';
            default: return 'Enter value...';
        }
    };

    const getInputType = (type: string) => {
        switch(type) {
            case 'email': return 'email';
            case 'phone': return 'tel';
            case 'social': return 'url';
            default: return 'text';
        }
    };

    if (loading) {
        return <div className="text-center p-12">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Contact Information</h1>
                <button 
                    onClick={handleSaveAll}
                    disabled={isSaving || !hasUnsavedChanges || editingId !== null}
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                    {hasUnsavedChanges && !isSaving && <span className="ml-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>}
                </button>
            </div>

            <div className="p-6 mb-8 bg-white rounded-lg shadow-md border">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                        value={newType} 
                        onChange={e => setNewType(e.target.value as any)} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="address">Address</option>
                        <option value="social">Social Media</option>
                    </select>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        placeholder="Label (e.g., 'Main Office')"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mt-4">
                     <input
                        type={getInputType(newType)}
                        value={newValue}
                        onChange={e => setNewValue(e.target.value)}
                        placeholder={getPlaceholder(newType)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mt-4 text-right">
                    <button onClick={handleAdd} className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black font-semibold">
                        Add to List
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {details.map((detail) => (
                    <div key={detail.id} className="p-4 bg-white rounded-lg shadow-md border">
                        {editingId === detail.id ? (
                            // --- EDIT VIEW ---
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                     <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">{detail.type}</span>
                                     <input
                                        type="text"
                                        value={detail.label || ''}
                                        onChange={(e) => handleUpdate(detail.id, 'label', e.target.value)}
                                        placeholder="Label"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={detail.value}
                                    onChange={(e) => handleUpdate(detail.id, 'value', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <div className="flex justify-end gap-3 mt-2">
                                    <button onClick={() => handleCancelEdit(detail.id)} className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">Cancel</button>
                                    <button onClick={() => setEditingId(null)} className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold">Save</button>
                                </div>
                            </div>
                        ) : (
                            // --- DISPLAY VIEW ---
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">{detail.type}</span>
                                <div className="flex-grow min-w-0">
                                    {detail.label && <p className="font-bold text-gray-800">{detail.label}</p>}
                                    <p className="text-gray-600 truncate">{detail.value}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto">
                                    <button onClick={() => setEditingId(detail.id)} className="w-1/2 md:w-auto px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 font-semibold text-sm">Edit</button>
                                    <button onClick={() => handleDelete(detail.id)} className="w-1/2 md:w-auto px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-semibold text-sm">Remove</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactPage;