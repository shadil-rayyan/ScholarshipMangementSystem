// app/api/ScholarshipApi/PostScholarship/route.ts
import { NextResponse } from 'next/server';
import {
  ScholarshipDb,
  Scholarship_Table,
} from '@/db/schema/scholarship/scholarshipData';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const scholarshipDataJson = formData.get('scholarshipData') as string;
    if (!scholarshipDataJson) throw new Error('scholarshipData is missing');

    const scholarshipDataParsed = JSON.parse(scholarshipDataJson);

    // Directly access fields from the parsed scholarship data, since it's flat
    const {
      name,
      dateOfBirth,
      gender,
      applicationtype,
      category,
      adharNumber,
      fatherName,
      fatherNumber,
      motherName,
      motherNumber,
      income,
      fatherOccupation,
      motherOccupation,
      studentNumber,
      houseApartmentName,
      pinCode,
      postOffice,
      country,
      state,
      district,
      alternativeNumber,
      studentEmail,
      placeState,
      whatsappNumber,
      nameOfTheCollege,
      branch,
      semester,
      cgpa,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      accountHolder,
    } = scholarshipDataParsed;

    // Validate the required fields
    const validationErrors = [];
    if (!name) validationErrors.push('Name is required');
    if (!dateOfBirth) validationErrors.push('Date of Birth is required');
    if (!studentEmail) validationErrors.push('Student Email is required');
    if (!nameOfTheCollege) validationErrors.push('College name is required');
    if (!bankName) validationErrors.push('Bank Name is required');
    if (!accountNumber) validationErrors.push('Account Number is required');
    if (!ifscCode) validationErrors.push('IFSC Code is required');

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    // Construct the scholarship data for database insertion
    // Add the URLs directly from the parsed scholarshipDataParsed
    const scholarshipData = {
      applicationType: 'Scholarship',
      name,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      applicationtype: 'Fresh',
      category,
      adharNumber,
      fatherName,
      fatherNumber,
      income,
      motherName,
      motherNumber,
      fatherOccupation,
      motherOccupation,
      studentNumber,
      houseApartmentName,
      pinCode,
      postOffice,
      country,
      state,
      district,
      alternativeNumber,
      studentEmail,
      placeState,
      whatsappNumber,
      nameOfTheCollege,
      branch,
      semester,
      cgpa,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      accountHolder,
      applicationDate: new Date(),
      status: 'Pending',
      adminLog: [],
      photoUrl: scholarshipDataParsed.photoUrl || null,
      checkUrl: scholarshipDataParsed.checkUrl || null,
      aadharCardUrl: scholarshipDataParsed.aadharCardUrl || null,
      collegeIdCardUrl: scholarshipDataParsed.collegeIdCardUrl || null,
      incomeUrl: scholarshipDataParsed.incomeUrl || null,
    };

    // Insert into the database
    const result = await ScholarshipDb.insert(Scholarship_Table)
      .values(scholarshipData)
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error in scholarship POST request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process scholarship application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
