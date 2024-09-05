// /api/ScholarshipApi/UpdateScholarship/[applicationNumber]/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';

export async function POST(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;
    const data = await req.json();

    try {
        // Convert dateOfBirth to Date object if needed
        const formattedDateOfBirth = new Date(data.dateOfBirth);

        await ScholarshipDb
            .update(Scholarship_Table)
            .set({
                ...data,
                dateOfBirth: formattedDateOfBirth,
            })
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .execute();

        return NextResponse.json({ message: 'Scholarship updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating scholarship details:', error);
        return NextResponse.json({ message: 'Failed to update scholarship details' }, { status: 500 });
    }
}
