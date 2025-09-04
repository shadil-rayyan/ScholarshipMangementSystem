// src/app/api/save-faq/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { faqs } = await request.json();
    
    // Create the TypeScript content
    const tsContent = `// FAQ data - Updated ${new Date().toLocaleString()}
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = ${JSON.stringify(faqs, null, 2)};

export const faqMetadata = {
  lastUpdated: '${new Date().toISOString()}',
  totalItems: ${faqs.length}
};

export default faqData;
`;

    // Write to the TypeScript file
    const filePath = path.join(process.cwd(), 'src', 'data', 'faq.ts');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, tsContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'FAQ data saved successfully!' 
    });
  } catch (error) {
    console.error('Error writing FAQ file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save FAQ data' },
      { status: 500 }
    );
  }
}
