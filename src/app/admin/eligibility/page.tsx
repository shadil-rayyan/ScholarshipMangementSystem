// src/app/(admin)/eligibility/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface ListItem {
    id: string;
    text: string;
}

const EligibilityPage = () => {
    const [criteria, setCriteria] = useState<ListItem[]>([]);
    const [documents, setDocuments] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load existing data from the TypeScript file
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const { eligibilityData } = await import('@/data/eligibility');
                setCriteria(eligibilityData.criteria || []);
                setDocuments(eligibilityData.documents || []);
            } catch (error) {
                console.error("Could not load existing eligibility data:", error);
                setCriteria([]);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };
        loadExistingData();
    }, []);

    const handleSave = async (field: 'criteria' | 'documents', data: ListItem[]) => {
        setIsSaving(true);
        try {
            const updatedCriteria = field === 'criteria' ? data : criteria;
            const updatedDocuments = field === 'documents' ? data : documents;

            const response = await fetch('/api/admin/save-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    criteria: updatedCriteria, 
                    documents: updatedDocuments 
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                if (field === 'criteria') setCriteria(data);
                if (field === 'documents') setDocuments(data);
                alert('✅ Eligibility data saved successfully!');
            } else {
                alert('❌ ' + result.message);
            }
        } catch (error) {
            console.error(`Error saving ${field}:`, error);
            alert('❌ Failed to save data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Generic list management component
    const ListManager = ({ 
        title, 
        items, 
        field, 
        placeholder 
    }: { 
        title: string; 
        items: ListItem[]; 
        field: 'criteria' | 'documents';
        placeholder: string;
    }) => {
        const [newItemText, setNewItemText] = useState('');
        const [editingId, setEditingId] = useState<string | null>(null);
        const [editingText, setEditingText] = useState('');

        const handleAdd = () => {
            if (!newItemText.trim()) {
                alert('Please enter some text');
                return;
            }
            const newItem: ListItem = { 
                id: Date.now().toString(), 
                text: newItemText.trim() 
            };
            handleSave(field, [...items, newItem]);
            setNewItemText('');
        };
        
        const handleDelete = (id: string) => {
            if (window.confirm(`Are you sure you want to delete this ${field.slice(0, -1)}?`)) {
                handleSave(field, items.filter(item => item.id !== id));
            }
        };

        const startEditing = (item: ListItem) => {
            setEditingId(item.id);
            setEditingText(item.text);
        };

        const handleUpdate = () => {
            if (!editingText.trim()) {
                alert('Please enter some text');
                return;
            }
            const updatedItems = items.map(item =>
                item.id === editingId ? { ...item, text: editingText.trim() } : item
            );
            handleSave(field, updatedItems);
            setEditingId(null);
            setEditingText('');
        };

        const handleCancelEdit = () => {
            setEditingId(null);
            setEditingText('');
        };

        return (
            <div className="p-6 mb-6 bg-gray-50 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {title} ({items.length} items)
                </h2>
                
                {/* Add new item */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder={placeholder}
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button 
                        onClick={handleAdd} 
                        disabled={isSaving}
                        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        ➕ Add
                    </button>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                    {items.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 bg-white rounded border-2 border-dashed border-gray-200">
                            📝 No {field} added yet. Add your first item above!
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                                {editingId === item.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleUpdate}
                                                disabled={isSaving}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                                            >
                                                ✅ Save
                                            </button>
                                            <button 
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}
                                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            >
                                                ❌ Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-500">#{index + 1}</span>
                                            <p className="text-gray-800 mt-1 leading-relaxed">{item.text}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button 
                                                onClick={() => startEditing(item)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Eligibility Requirements</h1>

            {/* Stats */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">
                    📊 Criteria: <strong>{criteria.length}</strong> | 
                    Documents: <strong>{documents.length}</strong> | 
                    📁 Saved to: <code className="bg-blue-100 px-1 rounded">src/data/eligibility.ts</code>
                </p>
            </div>

            <ListManager 
                title="📋 Eligibility Criteria" 
                items={criteria} 
                field="criteria"
                placeholder="Enter a new eligibility criterion..."
            />
            
            <ListManager 
                title="📄 Required Documents" 
                items={documents} 
                field="documents"
                placeholder="Enter a required document..."
            />
        </div>
    );
};

export default EligibilityPage;
