// app/api/ScholarshipApi/GetScholarshipCard/route.ts

import { NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';

export async function GET() {
  try {
    console.log('Fetching scholarships...');
    const scholarships = await ScholarshipDb.select().from(Scholarship_Table);
    console.log('Scholarships fetched successfully:', scholarships.length);
    return NextResponse.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
  }
}