import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { categories } from '@/db/schema/admin/categories';

export async function GET() {
  try {
    // Fetch all categories from the database
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
