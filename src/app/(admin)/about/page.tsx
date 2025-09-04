// src/app/(admin)/about/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

const AboutPage = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load existing content from about.ts on component mount
    useEffect(() => {
        const loadExistingContent = async () => {
            try {
                const { aboutData } = await import('@/data/about');
                setDescription(aboutData.description || '');
            } catch (error) {
                console.error("Could not load existing about content:", error);
                // If file doesn't exist, start with empty content
                setDescription('');
            } finally {
                setLoading(false);
            }
        };
        loadExistingContent();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/save-about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });

            const result = await response.json();
            
            if (result.success) {
                alert('✅ About content saved successfully to about.ts!');
                // Optionally reload the page to reflect changes
                // window.location.reload();
            } else {
                alert('❌ ' + result.message);
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('❌ Failed to save content. Please try again.');
        } finally {
            setIsSaving(false);
        }
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
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Manage About Page Content</h1>
            
            <div className="space-y-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    About Description
                </label>
                <textarea
                    id="description"
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the description for the about page..."
                />
                
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                >
                    {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">📁 File Location</h3>
                <p className="text-sm text-blue-700">
                    Content will be saved to: <code className="bg-blue-100 px-1 rounded">src/data/about.ts</code>
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
