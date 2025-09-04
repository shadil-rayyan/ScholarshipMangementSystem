// src/app/api/save-about/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    
    // Create the TypeScript content
    const tsContent = `// About page content - Updated ${new Date().toLocaleString()}
export const aboutData = {
  description: \`${description.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
  lastUpdated: '${new Date().toISOString()}'
};

export default aboutData;
`;

    // Write to the TypeScript file
    const filePath = path.join(process.cwd(), 'src', 'data', 'about.ts');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, tsContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'About content saved successfully!' 
    });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save content' },
      { status: 500 }
    );
  }
}
