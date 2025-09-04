// src/app/(admin)/faq/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQPage = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState('');
    const [editingAnswer, setEditingAnswer] = useState('');

    // Load existing FAQs from the TypeScript file
    useEffect(() => {
        const loadExistingFaqs = async () => {
            try {
                const { faqData } = await import('@/data/faq');
                setFaqs(faqData || []);
            } catch (error) {
                console.error("Could not load existing FAQ data:", error);
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };
        loadExistingFaqs();
    }, []);

    const handleSave = async (updatedFaqs: FAQItem[]) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/save-faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ faqs: updatedFaqs }),
            });

            const result = await response.json();
            
            if (result.success) {
                setFaqs(updatedFaqs);
                alert('✅ FAQ data saved successfully!');
            } else {
                alert('❌ ' + result.message);
            }
        } catch (error) {
            console.error('Error saving FAQs:', error);
            alert('❌ Failed to save FAQs. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = () => {
        if (!newQuestion.trim() || !newAnswer.trim()) {
            alert('Please fill in both question and answer');
            return;
        }
        
        const newFaq: FAQItem = {
            id: Date.now().toString(),
            question: newQuestion.trim(),
            answer: newAnswer.trim(),
        };
        
        handleSave([...faqs, newFaq]);
        setNewQuestion('');
        setNewAnswer('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            const updatedFaqs = faqs.filter(faq => faq.id !== id);
            handleSave(updatedFaqs);
        }
    };

    const startEditing = (faq: FAQItem) => {
        setEditingId(faq.id);
        setEditingQuestion(faq.question);
        setEditingAnswer(faq.answer);
    };

    const handleUpdate = () => {
        if (!editingId || !editingQuestion.trim() || !editingAnswer.trim()) {
            alert('Please fill in both question and answer');
            return;
        }
        
        const updatedFaqs = faqs.map(faq =>
            faq.id === editingId ? { 
                ...faq, 
                question: editingQuestion.trim(), 
                answer: editingAnswer.trim() 
            } : faq
        );
        
        handleSave(updatedFaqs);
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingQuestion('');
        setEditingAnswer('');
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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage FAQs</h1>

            {/* Stats */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">
                    📊 Total FAQs: <strong>{faqs.length}</strong> | 
                    📁 Saved to: <code className="bg-blue-100 px-1 rounded">src/data/faq.ts</code>
                </p>
            </div>

            {/* Add New FAQ Form */}
            <div className="p-6 mb-6 bg-gray-50 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Add New FAQ</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Enter your question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    <textarea
                        placeholder="Enter the answer..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        rows={4}
                    />
                    <button 
                        onClick={handleAdd} 
                        disabled={isSaving}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        {isSaving ? '💾 Saving...' : '➕ Add FAQ'}
                    </button>
                </div>
            </div>

            {/* Existing FAQs List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">📋 Existing FAQs</h2>
                
                {faqs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                        📝 No FAQs yet. Add your first FAQ above!
                    </div>
                ) : (
                    faqs.map((faq, index) => (
                        <div key={faq.id} className="p-6 bg-white rounded-lg shadow border border-gray-200">
                            {editingId === faq.id ? (
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Question:</label>
                                    <input
                                        type="text"
                                        value={editingQuestion}
                                        onChange={(e) => setEditingQuestion(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <label className="block text-sm font-medium text-gray-700">Answer:</label>
                                    <textarea
                                        value={editingAnswer}
                                        onChange={(e) => setEditingAnswer(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                        rows={4}
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
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm text-gray-500">#{index + 1}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3">
                                        ❓ {faq.question}
                                    </h3>
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        💬 {faq.answer}
                                    </p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => startEditing(faq)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(faq.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default FAQPage;
