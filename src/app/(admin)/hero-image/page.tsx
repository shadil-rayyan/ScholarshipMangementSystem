'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { storage, firestore } from '@/lib/firebase/config'; // Your Firebase config
import Image from 'next/image';

const HeroImagePage = () => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const heroDocRef = doc(firestore, 'siteContent', 'hero');

    // Fetch the current hero image URL on page load
    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const docSnap = await getDoc(heroDocRef);
                if (docSnap.exists() && docSnap.data().imageUrl) {
                    setCurrentImageUrl(docSnap.data().imageUrl);
                }
            } catch (err) {
                setError('Failed to load current hero image.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCurrentImage();
    }, []);

    // Handle file selection and create a preview
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setSuccessMessage(null);
            setError(null);
        }
    };

    // Handle the upload process
    const handleUpload = async () => {
        if (!newImageFile) {
            setError('Please select an image file first.');
            return;
        }

        setIsUploading(true);
        setError(null);
        setSuccessMessage(null);

        // Use a consistent name for the hero image to overwrite it
        const storageRef = ref(storage, 'hero/hero-image.jpg');

        try {
            // 1. Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, newImageFile);
            
            // 2. Get the public URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 3. Save the new URL to Firestore
            await setDoc(heroDocRef, { imageUrl: downloadURL });
            
            // 4. Update the UI
            setCurrentImageUrl(downloadURL);
            setSuccessMessage('Hero image updated successfully!');
            setNewImageFile(null);
            setPreviewUrl(null);

        } catch (err) {
            console.error("Upload failed:", err);
            setError('Failed to upload image. Please check the console for details.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Hero Image</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Image Display */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Hero Image</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : currentImageUrl ? (
                        <Image src={currentImageUrl} alt="Current Hero" width={500} height={300} className="rounded-md object-cover" />
                    ) : (
                        <p className="text-gray-500">No hero image is currently set.</p>
                    )}
                </div>

                {/* Upload New Image */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload New Image</h2>
                    
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />

                    {previewUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-600 mb-2">New Image Preview:</h3>
                            <Image src={previewUrl} alt="New hero preview" width={500} height={300} className="rounded-md object-cover" />
                        </div>
                    )}
                    
                    <button 
                        onClick={handleUpload} 
                        disabled={isUploading || !newImageFile}
                        className="mt-6 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition"
                    >
                        {isUploading ? 'Uploading...' : 'Upload and Set as Hero'}
                    </button>
                    
                    {error && <p className="mt-4 text-red-600">{error}</p>}
                    {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default HeroImagePage;