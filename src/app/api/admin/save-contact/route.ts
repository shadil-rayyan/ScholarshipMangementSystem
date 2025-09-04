// src/app/api/save-contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { details } = await request.json();
    
    // Create the TypeScript content
    const tsContent = `// Contact data - Updated ${new Date().toLocaleString()}
export interface ContactDetail {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  value: string;
  label?: string;
}

export const contactData: ContactDetail[] = ${JSON.stringify(details, null, 2)};

export const contactMetadata = {
  lastUpdated: '${new Date().toISOString()}',
  totalContacts: ${details.length},
  emails: ${details.filter((d: any) => d.type === 'email').length},
  phones: ${details.filter((d: any) => d.type === 'phone').length}
};

export default contactData;
`;

    // Write to the TypeScript file
    const filePath = path.join(process.cwd(), 'src', 'data', 'contact.ts');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, tsContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact data saved successfully!' 
    });
  } catch (error) {
    console.error('Error writing contact file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save contact data' },
      { status: 500 }
    );
  }
}
