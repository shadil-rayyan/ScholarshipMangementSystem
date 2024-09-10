import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { AdminLogEntry } from '@/util/adminLogEntry';
import { sendMail } from '@/util/mailer'; // Import the sendMail function

export async function POST(req: Request, { params }: { params: { applicationNumber: string } }) {
    const { applicationNumber } = params;
    let data: { status: string; adminLog: AdminLogEntry[] };

    try {
        // Parse and validate request data
        data = await req.json();
        if (!data || typeof data !== 'object' || !Array.isArray(data.adminLog) || typeof data.status !== 'string') {
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
        const existingAdminLog: AdminLogEntry[] = currentRecord.adminLog as AdminLogEntry[] || [];

        // Merge existing adminLog with new entries
        const updatedAdminLog: AdminLogEntry[] = [...existingAdminLog];
        data.adminLog.forEach((newEntry: AdminLogEntry) => {
            const index = updatedAdminLog.findIndex(entry => entry.step === newEntry.step);
            if (index !== -1) {
                updatedAdminLog[index] = newEntry; // Update existing entry
            } else {
                updatedAdminLog.push(newEntry); // Add new entry
            }
        });

        // Create the updated data object
        const updateData = {
            ...currentRecord, // Merge current record data
            status: data.status,
            adminLog: updatedAdminLog,
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
                const remark = `Status updated to ${data.status}`;
                await sendMail(
                    recipientEmail,
                    'Scholarship Status Update',
                    `Your scholarship status has been updated to ${data.status}. Remarks: ${remark}.`
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
