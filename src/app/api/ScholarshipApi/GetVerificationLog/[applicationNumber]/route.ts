//api/ScholarshipApi/GetVerificationLog/[applicationNumber]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
  VerificationDb,
  Verification_Table,
} from '@/db/schema/scholarship/VerificationLogs'; // Adjust the path accordingly
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: { applicationNumber: string } }
) {
  try {
    const { applicationNumber } = params;

    // Ensure the applicationNumber is a valid number
    if (!applicationNumber || isNaN(Number(applicationNumber))) {
      return NextResponse.json(
        { error: 'Invalid application number' },
        { status: 400 }
      );
    }

    // Query the Verification_Table for the given applicationNumber
    const verificationLogs = await VerificationDb.select()
      .from(Verification_Table)
      .where(
        eq(Verification_Table.applicationNumber, Number(applicationNumber))
      ); // Use the `eq` function to filter by application number

    // If no logs are found, return a 404 response
    if (verificationLogs.length === 0) {
      return NextResponse.json(
        { error: 'No verification logs found for this application number' },
        { status: 404 }
      );
    }

    // Return the verification logs in the response
    return NextResponse.json(verificationLogs);
  } catch (error) {
    console.error('Error fetching verification logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification logs' },
      { status: 500 }
    );
  }
}
