import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { sendMail } from '@/util/mailer'; // Adjust import for sendMail function
import { InferModel } from 'drizzle-orm';

// Define the type based on the actual schema of Scholarship_Table
type UpdateScholarshipData = Partial<InferModel<typeof Scholarship_Table>>;

export async function POST(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;

    try {
        // Parse request body
        const data = await req.json();

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

        // Prepare the update data based on the incoming request
        const updateData: UpdateScholarshipData = {
            status: data.status,
            verifyadmin: data.verifyadmin,
            selectadmin: data.selectadmin,
            amountadmin: data.amountadmin,
            rejectadmin: data.rejectadmin,
            renewaladmin: data.renewaladmin,
            remark: data.remark, // Include remark in the update data
        };

        // Filter out undefined values from updateData to avoid updating with null or undefined
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, v]) => v !== undefined)
        ) as UpdateScholarshipData;

        // Perform the update
        const result = await ScholarshipDb
            .update(Scholarship_Table)
            .set(filteredUpdateData)
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
                    body = `Your scholarship application has been reverted. Remarks: ${data.remark}. 
                    Please review the remarks and send the necessary documents to correct the issues mentioned.`;
                } else {
                    subject = 'Scholarship Status Update';
                    body = `Your scholarship status has been updated to ${data.status}. Remarks: ${data.remark}.`;
                }

                await sendMail(
                    recipientEmail,
                    subject,
                    body
                );
                console.log('Email notification sent to:', recipientEmail);
            }
        }

        return NextResponse.json({ message: 'Scholarship update processed' }, { status: 200 });
    } catch (error) {
        console.error('Error updating scholarship details:', error);
        return NextResponse.json({ message: 'Failed to update scholarship details' }, { status: 500 });
    }
}
