import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { sendMail } from '@/util/mailer'; // Adjust import for sendMail function

// Define the type for updateData based on Scholarship_Table
type UpdateScholarshipData = {
    status?: string;
    verifyadmin?: string;
    selectadmin?: string;
    amountadmin?: string;
    rejectadmin?: string;
    revertedadmin?: string;
};

export async function POST(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;

    try {
        // Parse request body
        const data = await req.json();

        // Validate request data
        if (
            !data ||
            typeof data.status !== 'string' ||
            typeof data.verifyadmin !== 'string' ||
            typeof data.selectadmin !== 'string' ||
            typeof data.amountadmin !== 'string' ||
            typeof data.rejectadmin !== 'string' ||
            typeof data.revertedadmin !== 'string'
        ) {
            console.error('Invalid data format', data);
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        // Fetch the current record from the database
        const existingRecord = await ScholarshipDb
            .select()
            .from(Scholarship_Table)
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .execute();

        if (existingRecord.length === 0) {
            console.error('Scholarship not found for application number:', applicationNumber);
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        const currentRecord = existingRecord[0];

        // Prepare the update data
        const updateData: UpdateScholarshipData = {
            status: data.status,
            verifyadmin: data.verifyadmin,
            selectadmin: data.selectadmin,
            amountadmin: data.amountadmin,
            rejectadmin: data.rejectadmin,
            revertedadmin: data.revertedadmin,
        };

        // Initialize changes flag
        let hasChanges = false;

        // Check if any fields need updating
        for (const key in updateData) {
            if (updateData[key as keyof UpdateScholarshipData] !== currentRecord[key as keyof typeof currentRecord]) {
                hasChanges = true;
                break;
            }
        }

        // Update the record in the database only if there are changes
        if (hasChanges) {
            const result = await ScholarshipDb
                .update(Scholarship_Table)
                .set(updateData as any) // Explicitly cast to `any` to avoid type errors
                .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
                .execute();

            console.log('Scholarship updated successfully for application number:', applicationNumber);
            console.log('Update result:', result); // Log result of the update operation

            // Check if the status has changed and send an email if it has
            if (currentRecord.status !== data.status) {
                const recipientEmail = currentRecord.studentEmail;
                if (recipientEmail) {
                    let subject, body;

                    if (data.status === 'Reverted') { // Assuming 'Reverted' is a status for reversion
                        subject = 'Scholarship Application Reverted';
                        body = `Your scholarship application has been reverted. Remarks: ${data.rejectadmin}. 
                        Please review the remarks and send the necessary documents to correct the issues mentioned.`;
                    } else {
                        subject = 'Scholarship Status Update';
                        body = `Your scholarship status has been updated to ${data.status}. Remarks: ${data.verifyadmin}.`;
                    }

                    await sendMail(
                        recipientEmail,
                        subject,
                        body
                    );
                    console.log('Email notification sent to:', recipientEmail);
                }
            }
        } else {
            console.log('No changes detected, no update performed.');
        }

        return NextResponse.json({ message: 'Scholarship update processed' }, { status: 200 });
    } catch (error) {
        console.error('Error updating scholarship details:', error);
        return NextResponse.json({ message: 'Failed to update scholarship details' }, { status: 500 });
    }
}
