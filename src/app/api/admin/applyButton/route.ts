// api/admin/applyButton/route.ts

import { NextResponse } from 'next/server';
import { apply } from '@/db/schema/schema'; // Adjust the path based on your project structure
import { db } from '@/db/index'; // Adjust this import to match your database setup
import { eq } from 'drizzle-orm';

// API route to get the condition of the applyButton table
export async function GET() {
  try {
    // Query to get the case value from the applyButton table
    const result = await db
      .select()
      .from(apply)
      .where(eq(apply.case, true)) // Adjust this if you want a different condition
      .execute();

    if (result.length === 0) {
      return NextResponse.json({ case: false }, { status: 200 }); // Return false if no records found
    }

    const caseValue = result[0].case; // Assuming case is the only column you want
    return NextResponse.json({ case: caseValue }, { status: 200 });
  } catch (error) {
    console.error('Error fetching applyButton condition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applyButton condition' },
      { status: 500 }
    );
  }
}
