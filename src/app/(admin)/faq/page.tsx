'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config'; // Adjust import path

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

    const docRef = doc(firestore, 'siteContent', 'faq');

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFaqs(docSnap.data().items || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async (updatedFaqs: FAQItem[]) => {
        setIsSaving(true);
        try {
            await updateDoc(docRef, { items: updatedFaqs });
            setFaqs(updatedFaqs);
        } catch (error) {
            console.error("Error saving FAQs:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = () => {
        if (!newQuestion || !newAnswer) return;
        const newFaq: FAQItem = {
            id: Date.now().toString(),
            question: newQuestion,
            answer: newAnswer,
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
        if (!editingId) return;
        const updatedFaqs = faqs.map(faq =>
            faq.id === editingId ? { ...faq, question: editingQuestion, answer: editingAnswer } : faq
        );
        handleSave(updatedFaqs);
        setEditingId(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage FAQs</h1>

            {/* Add New FAQ Form */}
            <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Add New FAQ</h2>
                <input
                    type="text"
                    placeholder="Question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                    placeholder="Answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                    rows={3}
                />
                <button onClick={handleAdd} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Add FAQ
                </button>
            </div>

            {/* Existing FAQs List */}
            <div className="space-y-4">
                {faqs.map(faq => (
                    <div key={faq.id} className="p-4 bg-white rounded-lg shadow">
                        {editingId === faq.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingQuestion}
                                    onChange={(e) => setEditingQuestion(e.target.value)}
                                    className="w-full p-2 mb-2 border rounded"
                                />
                                <textarea
                                    value={editingAnswer}
                                    onChange={(e) => setEditingAnswer(e.target.value)}
                                    className="w-full p-2 mb-2 border rounded"
                                    rows={3}
                                />
                                <button onClick={handleUpdate} className="px-3 py-1 bg-green-500 text-white rounded mr-2">Save</button>
                                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-bold text-lg">{faq.question}</h3>
                                <p className="text-gray-700">{faq.answer}</p>
                                <div className="mt-2">
                                    <button onClick={() => startEditing(faq)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
                                    <button onClick={() => handleDelete(faq.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;