import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';

export async function GET(req: Request, { params }: { params: { email: string } }) {
    const { email } = params;

    try {
        console.log(`Fetching scholarship for email: ${email}`);

        // Fetch scholarship data from the database
        const scholarship = await ScholarshipDb
            .select()
            .from(Scholarship_Table)
            .where(eq(Scholarship_Table.studentEmail, email))
            .execute();

        if (scholarship.length === 0) {
            console.error('Scholarship not found');
            return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
        }

        const scholarshipData = scholarship[0];
        console.log('Scholarship fetched:', scholarshipData);

        // Default verification table structure
        const verificationSteps = [
            { label: 'Step 1: Verify', value: scholarshipData.verifyadmin || '', admin: scholarshipData.verifyadmin ? 'Admin' : null },
            { label: 'Step 2: Select', value: scholarshipData.selectadmin || '', admin: scholarshipData.selectadmin ? 'Admin' : null },
            { label: 'Step 3: Amount Proceed', value: scholarshipData.amountadmin || '', admin: scholarshipData.amountadmin ? 'Admin' : null },
            { label: 'Step 4: Reject', value: scholarshipData.rejectadmin || '', admin: scholarshipData.rejectadmin ? 'Admin' : null },
            { label: 'Step 5: Renewal', value: scholarshipData.renewaladmin || '', admin: scholarshipData.renewaladmin ? 'Admin' : null },
        ];

        console.log('Scholarship details with verification table fetched successfully');
        return NextResponse.json({ ...scholarshipData, verificationTable: verificationSteps }, { status: 200 });
    } catch (error) {
        console.error('Error fetching scholarship detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
