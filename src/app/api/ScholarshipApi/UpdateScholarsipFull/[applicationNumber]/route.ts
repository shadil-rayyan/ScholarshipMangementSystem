// src/app/api/ScholarshipApi/UpdateScholarshipFull/[applicationNumber]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { applicationNumber: string } }) {
    console.log('API route hit for:', params.applicationNumber);
    
    const applicationNumber = params.applicationNumber;

    try {
        const formData = await request.json();
        console.log('FormData received for update:', formData);

        const updatedRows = await ScholarshipDb
            .update(Scholarship_Table)
            .set(formData)
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .returning();

        if (updatedRows.length === 0) {
            console.log('No rows were updated.');
            return NextResponse.json({ error: 'Scholarship not found or no updates were made.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Scholarship updated successfully', updatedData: updatedRows[0] });
    } catch (error) {
        console.error('Error updating scholarship:', error);
        return NextResponse.json({ error: 'Failed to update scholarship.' }, { status: 500 });
    }
}
