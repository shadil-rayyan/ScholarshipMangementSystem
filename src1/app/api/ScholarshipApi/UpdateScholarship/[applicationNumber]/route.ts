// app/api/ScholarshipApi/UpdateScholarship/[applicationNumber]/route.ts

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import {
  ScholarshipDb,
  Scholarship_Table,
} from '@/db/schema/scholarship/scholarshipData';
import {
  VerificationDb,
  Verification_Table,
} from '@/db/schema/scholarship/VerificationLogs'; // Import Verification table
import { sendMail } from '@/util/mailer'; // Adjust import for sendMail function

// Define the type for updateData based on Scholarship_Table
type UpdateScholarshipData = {
  status?: string;
  remark?: string;
  verifyadmin?: string;
  selectadmin?: string;
  amountadmin?: string;
  rejectadmin?: string;
  revertedadmin?: string;
};

export async function POST(
  req: Request,
  { params }: { params: { applicationNumber: string } }
) {
  const { applicationNumber } = params;

  try {
    // Parse request body
    const data = await req.json();
    console.log('Parsed request data:', data); // Debugging: Log parsed data

    // Validate request data
    if (
      !data ||
      typeof data.status !== 'string' ||
      typeof data.remark !== 'string' ||
      typeof data.verifyadmin !== 'string' ||
      typeof data.selectadmin !== 'string' ||
      typeof data.amountadmin !== 'string' ||
      typeof data.rejectadmin !== 'string' ||
      typeof data.revertedadmin !== 'string' ||
      typeof data.adminName !== 'string' // Validate that adminName is included
    ) {
      console.error('Invalid data format', data);
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Fetch the current record from the database
    const existingRecord = await ScholarshipDb.select()
      .from(Scholarship_Table)
      .where(eq(Scholarship_Table.applicationNumber, Number(applicationNumber)))
      .execute();

    console.log('Existing scholarship record:', existingRecord); // Debugging: Log fetched record

    if (existingRecord.length === 0) {
      console.error(
        'Scholarship not found for application number:',
        applicationNumber
      );
      return NextResponse.json(
        { message: 'Scholarship not found' },
        { status: 404 }
      );
    }

    const currentRecord = existingRecord[0];

    // Prepare the update data, excluding adminName since it's only for the Verification log
    const updateData: UpdateScholarshipData = {
      status: data.status,
      remark: data.remark,
      verifyadmin: data.verifyadmin,
      selectadmin: data.selectadmin,
      amountadmin: data.amountadmin,
      rejectadmin: data.rejectadmin,
      revertedadmin: data.revertedadmin,
    };

    console.log('Update data:', updateData); // Debugging: Log the data to be updated

    // Initialize changes flag
    let hasChanges = false;

    // Check if any fields need updating
    for (const key in updateData) {
      if (
        updateData[key as keyof UpdateScholarshipData] !==
        currentRecord[key as keyof typeof currentRecord]
      ) {
        hasChanges = true;
        break;
      }
    }

    // Update the record in the database only if there are changes
    if (hasChanges) {
      const result = await ScholarshipDb.update(Scholarship_Table)
        .set(updateData as any) // Explicitly cast to `any` to avoid type errors
        .where(
          eq(Scholarship_Table.applicationNumber, Number(applicationNumber))
        )
        .execute();

      console.log('Update result:', result); // Debugging: Log result of the update operation

      // Insert the verification log into Verification_Table
      const verificationLog = {
        applicationNumber: Number(applicationNumber), // Assuming applicationNumber is a number
        status: data.status,
        adminName: data.adminName, // Use adminName from the request body for the verification log
        createdAt: new Date(), // Automatically populated if not specified
      };

      const verificationResult = await VerificationDb.insert(Verification_Table)
        .values(verificationLog) // Pass the actual values here
        .execute();

      console.log('Verification log result:', verificationResult); // Debugging: Log result of the verification log insert

      // Check if the status has changed and send an email if it has
      if (currentRecord.status !== data.status) {
        const recipientEmail = currentRecord.studentEmail;
        if (recipientEmail) {
          let subject, body;

          if (data.status === 'Reverted') {
            // Assuming 'Reverted' is a status for reversion
            subject = 'Scholarship Application Reverted';
            body = `Your scholarship application has been reverted. Remarks: ${data.rejectadmin}. 
                        Please review the remarks and send the necessary documents to correct the issues mentioned.`;
          } else {
            subject = 'Scholarship Status Update';
            body = `Your scholarship status has been updated to ${data.status}. Remarks: ${data.verifyadmin}.`;
          }

          await sendMail(recipientEmail, subject, body);
          console.log('Email notification sent to:', recipientEmail);
        }
      }
    } else {
      console.log('No changes detected, no update performed.');
    }

    return NextResponse.json(
      { message: 'Scholarship update processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating scholarship details:', error);
    return NextResponse.json(
      { message: 'Failed to update scholarship details' },
      { status: 500 }
    );
  }
}
