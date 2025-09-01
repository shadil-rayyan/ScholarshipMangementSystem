import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { categories } from '@/db/schema/admin/categories';

// POST method to add a new category
export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name || name.trim() === '') {
    return NextResponse.json(
      { error: 'Category name is required.' },
      { status: 400 }
    );
  }

  try {
    // Insert the new category into the database
    const newCategory = await db
      .insert(categories)
      .values({
        name,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { error: 'Failed to add category.' },
      { status: 500 }
    );
  }
}

// GET method to fetch all categories
export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories.' },
      { status: 500 }
    );
  }
}
