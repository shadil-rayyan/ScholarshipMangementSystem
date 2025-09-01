import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { occupations } from '@/db/schema/admin/occupation';

export async function GET() {
  try {
    // Fetch all categories from the database
    const alloccupations = await db.select().from(occupations);
    return NextResponse.json(alloccupations, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
