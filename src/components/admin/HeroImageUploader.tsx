'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper function to create a cropped image file from a canvas
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Canvas context is not available'));
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}

// The main component, now accepting props for the initial image
export default function HeroImageUploader({ initialImageUrl }: { initialImageUrl: string | null }) {
    // State for the image source to be cropped
    const [imgSrc, setImgSrc] = useState('');
    const imgRef = useRef<HTMLImageElement>(null);
    
    // State for the cropping tool
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    // State for UI feedback
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State for managing the displayed image
    const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);

    // Effect to clear messages after a few seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);


    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Reset crop when new file is selected
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setImgSrc('');
        setOriginalFile(null);
        setCrop(undefined);
        setCompletedCrop(undefined);

        const fileInput = document.getElementById('heroFileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!completedCrop || !imgRef.current) {
            setError('Please select and crop an image before saving.');
            return;
        }

        setIsUploading(true);
        setError('');
        setSuccess('');

        try {
            const croppedImageFile = await getCroppedImg(imgRef.current, completedCrop, 'hero-image.jpg');
            
            const formData = new FormData();
            formData.append('file', croppedImageFile);

            // This is where you send the file to your backend API
            const response = await fetch('/api/admin/save-hero', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (result.success) {
                setSuccess('Hero image updated successfully!');
                const newTimestamp = new Date().getTime();
                setCurrentImageUrl(`/data/hero/hero-image.jpg?t=${newTimestamp}`); // Update current image preview
                setImgSrc(''); // Hide the cropper
                resetForm();
            } else {
                setError(result.message || 'An unknown error occurred.');
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Current Image */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Current Hero Image</h3>
                <div className="w-full h-64 relative rounded-md overflow-hidden bg-gray-200">
                    {currentImageUrl ? (
                        <Image 
                            src={currentImageUrl}
                            alt="Current Hero" 
                            fill 
                            className="object-cover"
                            key={currentImageUrl} // Force re-render on update
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No Image Set
                        </div>
                    )}
                </div>
            </div>

            {/* Column 2: Upload and Crop */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Upload New Image</h3>
                
                <p className="text-sm text-gray-600 mb-4">Select a file and crop it to a 16:9 aspect ratio.</p>
                
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={onSelectFile}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />

                {imgSrc && (
                    <div className="mt-4">
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={16 / 9}
                            className="w-full"
                        >
                            <img ref={imgRef} alt="Crop preview" src={imgSrc} />
                        </ReactCrop>
                    </div>
                )}
                
                <div className="mt-4">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !completedCrop}
                        className="w-full px-6 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUploading ? 'Uploading...' : 'Save Cropped Image'}
                    </button>
                </div>

                {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}