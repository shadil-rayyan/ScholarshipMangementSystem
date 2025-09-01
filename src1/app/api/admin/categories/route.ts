import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { categories } from '@/db/schema/admin/categories';

export async function GET() {
  try {
    console.log('Starting the GET request to fetch categories...');

    // Fetch all categories from the database
    console.log('Fetching categories from the database...');
    const allCategories = await db.select().from(categories);

    console.log('Categories fetched successfully:', allCategories);
    return NextResponse.json(allCategories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error?.message },
      { status: 500 }
    );
  } finally {
    console.log('GET request completed.');
  }
}
