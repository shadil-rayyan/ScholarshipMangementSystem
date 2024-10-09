import { eq } from 'drizzle-orm/expressions';
import { NextResponse } from 'next/server';
import { apply } from '@/db/schema/schema';
import { db } from '@/db/index';

export async function POST(request: Request) {
  try {
    const { condition } = await request.json();

    if (typeof condition !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid condition value' },
        { status: 400 }
      );
    }

    // Fetch the existing `applyButton` record using the correct comparison function `eq`
    const existingRecord = await db.select().from(apply).where(eq(apply.id, 1)); // Assuming `1` is the id of the record you want to update

    console.log('Before update:', existingRecord);

    if (existingRecord.length === 0) {
      const insertResult = await db
        .insert(apply)
        .values({ case: condition })
        .returning();
      console.log('Insert result:', insertResult);

      return NextResponse.json({
        success: true,
        message: `Apply button condition set to ${condition} (new record inserted)`,
      });
    } else {
      const updateResult = await db
        .update(apply)
        .set({ case: condition })
        .where(eq(apply.id, existingRecord[0].id)) // Use `eq` here too
        .returning();
      console.log('Update result:', updateResult);

      return NextResponse.json({
        success: true,
        message: `Apply button condition updated to ${condition}`,
      });
    }
  } catch (error) {
    console.error('Error updating apply button condition:', error);
    return NextResponse.json(
      {
        error: 'Failed to update apply button condition',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
