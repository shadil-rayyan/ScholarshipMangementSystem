// src/app/api/ScholarshipApi/trackApplication/[email]/route.ts

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { sendMail } from '@/util/mailer';

export async function GET(req: Request, { params }: { params: { email: string } }) {
    const { email } = params;

    try {
        console.log(`Fetching scholarship for email: ${email}`);
        
        const scholarship = await ScholarshipDb
    .select()
    .from(Scholarship_Table)
    .where(eq(Scholarship_Table.studentEmail, email)) // Use studentEmail
    .execute();


        if (scholarship.length === 0) {
            console.error('Scholarship not found');
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        const scholarshipData = scholarship[0];
        console.log('Scholarship fetched:', scholarshipData);

        // Assuming you want to check for status change
        const previousStatus = scholarshipData.status;

        if (previousStatus !== scholarshipData.status) {
            console.log('Status has changed, sending email...');
            await sendStatusChangeEmail(scholarshipData);
        }

        console.log('Scholarship details fetched successfully');
        return NextResponse.json(scholarshipData, { status: 200 });
    } catch (error) {
        console.error('Error fetching scholarship detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

async function sendStatusChangeEmail(scholarshipData: any) {
    const email = scholarshipData.email;
    const subject = 'Scholarship Status Update';
    const remarks = scholarshipData.remarks || 'No remarks provided';
    const text = `Dear ${scholarshipData.name},

Your scholarship application status has changed to: ${scholarshipData.status}

Remarks: ${remarks}

Thank you,
Scholarship Committee`;

    try {
        console.log(`Attempting to send email to ${email}`);
        const emailResponse = await sendMail(email, subject, text);
        console.log('Status change email sent successfully:', emailResponse);
    } catch (error) {
        console.error('Error sending status change email:', error);
    }
}
