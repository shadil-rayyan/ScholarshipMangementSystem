import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { SaveDataDb, SaveData_Table } from '@/db/schema/schema';

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  try {
    console.log(`Fetching scholarship for email: ${email}`);

    // Fetch scholarship data from the database
    const saveData = await SaveDataDb.select()
      .from(SaveData_Table)
      .where(eq(SaveData_Table.studentEmail, email))
      .execute();

    if (saveData.length === 0) {
      console.error('Scholarship not found');
      return NextResponse.json(
        { message: 'Scholarship not found' },
        { status: 404 }
      );
    }

    const scholarshipData = saveData[0];
    console.log('Scholarship fetched:', scholarshipData);

    console.log(
      'Scholarship details with verification table fetched successfully'
    );

    // Return the fetched scholarship data as a response
    return NextResponse.json(scholarshipData, { status: 200 });
  } catch (error) {
    console.error('Error fetching scholarship detail:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
