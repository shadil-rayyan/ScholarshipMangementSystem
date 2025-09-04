// src/app/(admin)/contact/page.tsx
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
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newType, setNewType] = useState<'email' | 'phone' | 'address' | 'social'>('email');
    const [newValue, setNewValue] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Load existing data from the TypeScript file
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const { contactData } = await import('@/data/contact');
                setDetails(contactData || []);
            } catch (error) {
                console.error("Could not load existing contact data:", error);
                setDetails([]);
            } finally {
                setLoading(false);
            }
        };
        loadExistingData();
    }, []);

    const handleSave = async (updatedDetails: ContactDetail[]) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/save-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ details: updatedDetails }),
            });

            const result = await response.json();
            
            if (result.success) {
                setDetails(updatedDetails);
                alert('✅ Contact data saved successfully!');
            } else {
                alert('❌ ' + result.message);
            }
        } catch (error) {
            console.error('Error saving contact details:', error);
            alert('❌ Failed to save contact data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = () => {
        if (!newValue.trim()) {
            alert('Please enter a contact value');
            return;
        }
        
        const newDetail: ContactDetail = { 
            id: Date.now().toString(), 
            type: newType, 
            value: newValue.trim(),
            label: newLabel.trim() || undefined
        };
        
        handleSave([...details, newDetail]);
        setNewValue('');
        setNewLabel('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            handleSave(details.filter(d => d.id !== id));
        }
    };

    const handleUpdate = (id: string, field: keyof ContactDetail, value: string) => {
        const updatedDetails = details.map(d => 
            d.id === id ? { ...d, [field]: value } : d
        );
        setDetails(updatedDetails); // Optimistic update
    };

    const handleBlurSave = () => {
        handleSave(details);
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
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const emailCount = details.filter(d => d.type === 'email').length;
    const phoneCount = details.filter(d => d.type === 'phone').length;
    const addressCount = details.filter(d => d.type === 'address').length;
    const socialCount = details.filter(d => d.type === 'social').length;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Contact Information</h1>

            {/* Stats */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">
                    📊 Total: <strong>{details.length}</strong> | 
                    📧 Emails: <strong>{emailCount}</strong> | 
                    📞 Phones: <strong>{phoneCount}</strong> | 
                    📍 Addresses: <strong>{addressCount}</strong> | 
                    🌐 Social: <strong>{socialCount}</strong>
                </p>
                <p className="text-blue-700 mt-1">
                    📁 Saved to: <code className="bg-blue-100 px-1 rounded">src/data/contact.ts</code>
                </p>
            </div>

            {/* Add New Contact Form */}
            <div className="p-6 mb-6 bg-gray-50 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Add New Contact</h2>
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select 
                            value={newType} 
                            onChange={e => setNewType(e.target.value as any)} 
                            className="p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="email">📧 Email</option>
                            <option value="phone">📞 Phone</option>
                            <option value="address">📍 Address</option>
                            <option value="social">🌐 Social Media</option>
                        </select>
                        <input
                            type="text"
                            value={newLabel}
                            onChange={e => setNewLabel(e.target.value)}
                            placeholder="Label (optional)"
                            className="p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button 
                            onClick={handleAdd} 
                            disabled={isSaving}
                            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                        >
                            {isSaving ? '💾 Adding...' : '➕ Add'}
                        </button>
                    </div>
                    <input
                        type={getInputType(newType)}
                        value={newValue}
                        onChange={e => setNewValue(e.target.value)}
                        placeholder={getPlaceholder(newType)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                </div>
            </div>

            {/* Existing Contacts List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">📋 Contact Details</h2>
                
                {details.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        📞 No contact information added yet. Add your first contact above!
                    </div>
                ) : (
                    details.map((detail, index) => (
                        <div key={detail.id} className="p-4 bg-white rounded-lg shadow border border-gray-200">
                            <div className="flex items-center gap-4">
                                {/* Type indicator */}
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                                        {detail.type === 'email' && '📧'}
                                        {detail.type === 'phone' && '📞'}
                                        {detail.type === 'address' && '📍'}
                                        {detail.type === 'social' && '🌐'}
                                        {' '}{detail.type}
                                    </span>
                                </div>

                                {/* Label input */}
                                <input
                                    type="text"
                                    value={detail.label || ''}
                                    onChange={(e) => handleUpdate(detail.id, 'label', e.target.value)}
                                    onBlur={handleBlurSave}
                                    placeholder="Label (optional)"
                                    className="w-32 p-2 text-sm border border-gray-200 rounded focus:ring-purple-500 focus:border-purple-500"
                                />

                                {/* Value input */}
                                <input
                                    type={getInputType(detail.type)}
                                    value={detail.value}
                                    onChange={(e) => handleUpdate(detail.id, 'value', e.target.value)}
                                    onBlur={handleBlurSave}
                                    className="flex-grow p-2 border border-gray-200 rounded focus:ring-purple-500 focus:border-purple-500"
                                />

                                {/* Actions */}
                                <button 
                                    onClick={() => handleDelete(detail.id)}
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ContactPage;
