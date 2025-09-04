// src/app/(admin)/hero-image/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroImagePage = () => {
    const [heroData, setHeroData] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Load hero data
    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const { heroImageData } = await import('@/data/hero');
                setHeroData(heroImageData);
            } catch (error) {
                console.error('Error loading hero data:', error);
            }
        };
        loadHeroData();
    }, []);

    // Reload hero data after upload
    const reloadHeroData = async () => {
        try {
            // Force reload the module
            delete require.cache[require.resolve('@/data/hero')];
            const { heroImageData } = await import('@/data/hero');
            setHeroData(heroImageData);
        } catch (error) {
            console.error('Error reloading hero data:', error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/admin/save-hero', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (result.success) {
                setMessage('✅ Hero image updated successfully!');
                setSelectedFile(null);
                
                // Clear file input
                const fileInput = document.getElementById('heroFile') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                
                // Reload hero data to get new timestamp
                await reloadHeroData();
                
            } else {
                setMessage('❌ ' + result.message);
            }
        } catch (error) {
            setMessage('❌ Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    if (!heroData) return <div>Loading...</div>;

    // Create cache-busting URL
    const imageUrl = `${heroData.imagePath}?t=${new Date(heroData.lastUpdated).getTime()}`;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Hero Image</h1>
            
            <div className="space-y-6">
                {/* Current Image with Cache Busting */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Current Hero Image:</h3>
                    <div className="w-full h-64 relative rounded-md overflow-hidden">
                        <Image 
                            src={imageUrl}
                            alt="Hero" 
                            fill 
                            className="object-cover"
                            key={heroData.lastUpdated} // Force re-render when timestamp changes
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(heroData.lastUpdated).toLocaleString()}
                    </p>
                </div>

                {/* Upload New Image */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Upload New Hero Image:</h3>
                    <div className="space-y-4">
                        <input
                            id="heroFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-50 file:text-purple-700"
                        />
                        
                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !selectedFile}
                            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300"
                        >
                            {isUploading ? 'Uploading...' : 'Save Hero Image'}
                        </button>

                        {message && (
                            <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-3 bg-blue-50 rounded text-sm text-blue-800">
                    💡 Image will be saved to: <code>public/data/hero/hero-image.jpg</code>
                </div>
            </div>
        </div>
    );
};

export default HeroImagePage;
