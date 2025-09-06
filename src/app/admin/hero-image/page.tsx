import HeroImageUploader from '@/components/admin/HeroImageUploader';
import { promises as fs } from 'fs';
import path from 'path';

// This function now runs ONLY on the server
async function getHeroData() {
    try {
        // This is a placeholder for your actual data source (e.g., Firestore)
        // For now, we read the file system to get the last updated time
        const filePath = path.join(process.cwd(), 'public/data/hero/hero-image.jpg');
        const stats = await fs.stat(filePath);
        
        return {
            imageUrl: `/data/hero/hero-image.jpg?t=${stats.mtime.getTime()}`,
            lastUpdated: stats.mtime.toISOString(),
        };
    } catch (error) {
        console.error("Could not load hero image data:", error);
        // Return null if the image doesn't exist yet
        return { imageUrl: null, lastUpdated: new Date().toISOString() };
    }
}

// This is now a Server Component
export default async function HeroImagePage() {
    // Fetch the data on the server before rendering
    const heroData = await getHeroData();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Hero Image</h1>
            <HeroImageUploader 
                initialImageUrl={heroData.imageUrl}
                initialLastUpdated={heroData.lastUpdated}
            />
        </div>
    );
};