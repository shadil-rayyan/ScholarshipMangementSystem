import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';

export async function GET(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;

    try {
        console.log(`Fetching scholarship for application number: ${applicationNumber}`);
        
        const scholarship = await ScholarshipDb
            .select()
            .from(Scholarship_Table)
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .execute();

        if (scholarship.length === 0) {
            console.error('Scholarship not found');
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        const scholarshipData = scholarship[0];
        console.log('Scholarship fetched:', scholarshipData);

        // Send email if status has changed
        // Here you would compare the fetched status with the previous status stored somewhere
        // For example, you might have a `previous_status` field to compare with

        console.log('Scholarship details fetched successfully');
        return NextResponse.json(scholarshipData, { status: 200 });
    } catch (error) {
        console.error('Error fetching scholarship detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
