import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { occupations } from '@/db/schema/admin/occupation';

// POST method to add a new category
export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name || name.trim() === '') {
    return NextResponse.json(
      { error: 'occupations name is required.' },
      { status: 400 }
    );
  }

  try {
    // Insert the new category into the database
    const newCategory = await db
      .insert(occupations)
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
    const alloccupations = await db.select().from(occupations);
    return NextResponse.json(alloccupations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories.' },
      { status: 500 }
    );
  }
}
