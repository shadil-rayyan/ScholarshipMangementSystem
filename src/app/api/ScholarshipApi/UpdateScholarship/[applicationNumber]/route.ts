import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { sendMail } from '@/util/mailer'; // Adjust import for sendMail function

export async function POST(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;
    let data: {
        status: string;
        verifyadmin: string;
        selectadmin: string;
        amountadmin: string;
        rejectadmin: string;
        renewaladmin: string;
    };

    try {
        // Parse and validate request data
        data = await req.json();
        if (!data || typeof data !== 'object' || typeof data.status !== 'string' ||
            typeof data.verifyadmin !== 'string' || typeof data.selectadmin !== 'string' ||
            typeof data.amountadmin !== 'string' || typeof data.rejectadmin !== 'string' ||
            typeof data.renewaladmin !== 'string') {
            console.error('Invalid data format');
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        // Fetch the current record from the database
        const existingRecord = await ScholarshipDb
            .select()
            .from(Scholarship_Table)
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .execute();

        if (existingRecord.length === 0) {
            console.error('Scholarship not found');
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        const currentRecord = existingRecord[0];

        // Prepare the update data
        const updateData = {
            ...currentRecord, // Merge current record data
            status: data.status,
            verifyadmin: data.verifyadmin,
            selectadmin: data.selectadmin,
            amountadmin: data.amountadmin,
            rejectadmin: data.rejectadmin,
            renewaladmin: data.renewaladmin,
        };

        // Update the record in the database
        await ScholarshipDb
            .update(Scholarship_Table)
            .set(updateData)
            .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
            .execute();

        console.log('Scholarship updated successfully');

        // Check if the status has changed and send an email if it has
        if (currentRecord.status !== data.status) {
            const recipientEmail = currentRecord.studentEmail;
            if (recipientEmail) {
                let subject, body;

                if (data.status === 'Reverted') { // Change this to whatever status indicates a reversion
                    subject = 'Scholarship Application Reverted';
                    body = `Your scholarship application has been reverted. Remarks: ${data.rejectadmin}. 
                    Please review the remarks and
                    click the reply all button below in gmail 
                     send the necessary documents to correct the issues mentioned to this gmail . If you need assistance or further information, do not hesitate to contact us by clicking reply all .`;
                } else {
                    subject = 'Scholarship Status Update';
                    body = `Your scholarship status has been updated to ${data.status}. Remarks: ${data.verifyadmin}.`;
                }

                await sendMail(
                    recipientEmail,
                    subject,
                    body
                );
                console.log('Email notification sent.');
            }
        }

        return NextResponse.json({ message: 'Scholarship updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating scholarship details:', error);
        return NextResponse.json({ message: 'Failed to update scholarship details' }, { status: 500 });
    }
}
