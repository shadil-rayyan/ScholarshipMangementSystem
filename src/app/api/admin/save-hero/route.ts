// src/app/api/admin/save-hero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Create public/data/hero directory (accessible via URL)
    const heroDir = path.join(process.cwd(), 'public', 'data', 'hero');
    if (!fs.existsSync(heroDir)) {
      fs.mkdirSync(heroDir, { recursive: true });
    }

    // Save image as hero-image.jpg
    const filePath = path.join(heroDir, 'hero-image.jpg');
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    fs.writeFileSync(filePath, buffer);

    // Create/update hero.ts file
    const tsContent = `// Hero image data - Updated ${new Date().toLocaleString()}
export const heroImageData = {
  imagePath: '/data/hero/hero-image.jpg',
  lastUpdated: '${new Date().toISOString()}'
};

export default heroImageData;
`;

    const tsFilePath = path.join(process.cwd(), 'src', 'data', 'hero.ts');
    const tsDir = path.dirname(tsFilePath);
    if (!fs.existsSync(tsDir)) {
      fs.mkdirSync(tsDir, { recursive: true });
    }
    fs.writeFileSync(tsFilePath, tsContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Hero image saved successfully!' 
    });
  } catch (error) {
    console.error('Error saving hero image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save hero image' },
      { status: 500 }
    );
  }
}
