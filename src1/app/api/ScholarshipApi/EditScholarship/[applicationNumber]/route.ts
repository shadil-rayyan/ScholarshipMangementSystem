import { NextRequest, NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const applicationNumber = pathname.split('/').pop();

    console.log("Application Number:", applicationNumber);

    const body = await req.json();
    const { scholarshipData } = body;

    console.log("Received scholarshipData:", JSON.stringify(scholarshipData, null, 2));

    if (!scholarshipData || Object.keys(scholarshipData).length === 0) {
      console.log("No data received for update");
      return NextResponse.json({ error: 'No data received for update' }, { status: 400 });
    }

    // Transform data to match DB schema
    const scholarshipDataForDb = {
      applicationType: 'Scholarship',
      name: scholarshipData.name,
      dateOfBirth: scholarshipData.dateOfBirth ? new Date(scholarshipData.dateOfBirth) : undefined,
      gender: scholarshipData.gender,
      applicationtype: scholarshipData.applicationtype,
      category: scholarshipData.category,
      adharNumber: scholarshipData.aadhar,
      fatherName: scholarshipData.fatherName,
      fatherNumber: scholarshipData.fatherNumber,
      income: scholarshipData.income,
      motherName: scholarshipData.motherName,
      motherNumber: scholarshipData.motherNumber,
      fatherOccupation: scholarshipData.fatherOccupation,
      motherOccupation: scholarshipData.motherOccupation,
      studentNumber: scholarshipData.studentNumber,


      houseApartmentName: scholarshipData.house,
      pinCode: scholarshipData.pincode,
      postOffice: scholarshipData.postOffice,
      country: scholarshipData.country,
      state: scholarshipData.state,
      district: scholarshipData.district,
      alternativeNumber: scholarshipData.alternativeNumber,
      studentEmail: scholarshipData.studentEmail,
      placeState: scholarshipData.placeState,
      whatsappNumber: scholarshipData.whatsappNumber,


      nameOfTheCollege: scholarshipData.nameOfTheCollege,
      branch: scholarshipData.branch,
      semester: scholarshipData.semester,
      cgpa: scholarshipData.cgpa ? parseFloat(scholarshipData.cgpa) : undefined,
      bankName: scholarshipData.bankName,
      accountNumber: scholarshipData.accountNumber,
      ifscCode: scholarshipData.ifscCode,
      branchName: scholarshipData.branchName,
      accountHolder: scholarshipData.accountHolder,
      remark: scholarshipData.remark || null,
      applicationDate: new Date(),
    };

    // Filter out null, undefined, or invalid date values
    const filteredScholarshipData = Object.fromEntries(
      Object.entries(scholarshipDataForDb).filter(([_, v]) => v != null && !(v instanceof Date && isNaN(v.getTime())))
    );

    console.log("Filtered scholarshipData:", JSON.stringify(filteredScholarshipData, null, 2));

    if (Object.keys(filteredScholarshipData).length === 0) {
      console.log("No valid data to update");
      return NextResponse.json({ error: 'No valid data to update' }, { status: 400 });
    }

    // Update the database
    const updatedScholarship = await ScholarshipDb.update(Scholarship_Table)
      .set(filteredScholarshipData)
      .where(eq(Scholarship_Table.applicationNumber, parseInt(applicationNumber)))
      .returning();

    console.log("Updated scholarship:", JSON.stringify(updatedScholarship, null, 2));

    if (updatedScholarship.length > 0) {
      return NextResponse.json({ message: 'Scholarship updated successfully!', data: updatedScholarship[0] });
    } else {
      console.log("No scholarship found with application number:", applicationNumber);
      return NextResponse.json({ error: 'No scholarship found with the given application number' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update scholarship:', error);
    return NextResponse.json({ error: 'Failed to update scholarship: ' + error.message }, { status: 500 });
  }
}