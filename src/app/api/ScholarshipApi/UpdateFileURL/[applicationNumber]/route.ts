// src/app/api/ScholarshipApi/UpdateFileURL/[applicationNumber]/route.ts
import { NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { sql } from 'drizzle-orm';

const fileTypeToColumnMap = {
  photo: 'photo_url',
  cheque: 'check_url',
  aadharCard: 'aadhar_card_url',
  collegeID: 'college_id_card_url',
  incomeCertificate: 'income_url',
  // Add more mappings as needed
};

export async function POST(request: Request, { params }: { params: { applicationNumber: string } }) {
    try {
        const { applicationNumber } = params;
        const { fileUrl, fileType } = await request.json();

        console.log('Received request:', { applicationNumber, fileUrl, fileType });

        if (!applicationNumber || !fileUrl || !fileType) {
            return NextResponse.json({ error: 'Application number, file URL, or file type is missing' }, { status: 400 });
        }

        const applicationNumberNumeric = parseInt(applicationNumber, 10);
        if (isNaN(applicationNumberNumeric)) {
            return NextResponse.json({ error: 'Invalid application number format' }, { status: 400 });
        }

        const columnName = fileTypeToColumnMap[fileType as keyof typeof fileTypeToColumnMap];
        if (!columnName) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        console.log('Updating database with:', { [columnName]: fileUrl });

        // Use a raw SQL query
        const query = sql`
            UPDATE ${Scholarship_Table}
            SET ${sql.identifier(columnName)} = ${fileUrl}
            WHERE application_number = ${applicationNumberNumeric}
            RETURNING *
        `;

        const result = await ScholarshipDb.execute(query);

        console.log('Database update result:', result);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'No matching record found for the given application number' }, { status: 404 });
        }

        return NextResponse.json({ message: 'File URL updated successfully', updatedRecord: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Error in UpdateFileURL:', error);
        return NextResponse.json({
            error: 'Failed to update file URL',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}