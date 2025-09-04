// src/app/api/save-eligibility/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { criteria, documents } = await request.json();
    
    // Create the TypeScript content
    const tsContent = `// Eligibility data - Updated ${new Date().toLocaleString()}
export interface ListItem {
  id: string;
  text: string;
}

export const eligibilityData = {
  criteria: ${JSON.stringify(criteria, null, 2)} as ListItem[],
  documents: ${JSON.stringify(documents, null, 2)} as ListItem[]
};

export const eligibilityMetadata = {
  lastUpdated: '${new Date().toISOString()}',
  totalCriteria: ${criteria.length},
  totalDocuments: ${documents.length}
};

export default eligibilityData;
`;

    // Write to the TypeScript file
    const filePath = path.join(process.cwd(), 'src', 'data', 'eligibility.ts');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, tsContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Eligibility data saved successfully!' 
    });
  } catch (error) {
    console.error('Error writing eligibility file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save eligibility data' },
      { status: 500 }
    );
  }
}
