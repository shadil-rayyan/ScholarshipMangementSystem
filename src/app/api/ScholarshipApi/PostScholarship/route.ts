import { NextRequest, NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table, InsertScholarship } from '@/db/schema/scholarship/scholarshipData';
import { sql } from "@vercel/postgres";
import { uploadFileToFirebase } from '@/lib/firebase/config'; // Import your Firebase upload utility

export async function POST(req: NextRequest) {
  try {
    
    console.log('API route hit');

    // Parse form data
    const formData = await req.formData();
    console.log('Raw form data:', formData);

    const fields: Record<string, string> = {};
    const files: Record<string, File> = {};

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        fields[key] = value;
        console.log(`Field: ${key} -> ${value}`);
      } else if (value instanceof File) {
        files[key] = value;
        console.log(`File: ${key} -> ${value.name}`);
      }
    });

    console.log('Parsed Fields:', fields);
    console.log('Parsed Files:', files);

    // Parse and validate scholarship data
    const {
      personalDetails,
      contactDetails,
      educationalDetails,
      bankDetails,
    } = JSON.parse(fields.scholarshipData);

    const dateOfBirth = new Date(personalDetails.dob);
    if (isNaN(dateOfBirth.getTime())) {
      throw new Error('Invalid date format for dateOfBirth');
    }

    // Generate the next application number
    const result = await sql`
      SELECT COALESCE(MAX(application_number), 999999999) + 1 AS next_application_number
      FROM scholarship
      WHERE application_number >= 100000000
    `;
    const nextApplicationNumber = result.rows[0].next_application_number;

    // Upload files to Firebase Storage and get URLs
    console.log('Uploading files to Firebase Storage...');
    const photoUrl = files.photo ? await uploadFileToFirebase(files.photo, 'photos') : null;
    console.log('Photo uploaded, URL:', photoUrl);

    const chequeUrl = files.cheque ? await uploadFileToFirebase(files.cheque, 'cheques') : null;
    console.log('Cheque uploaded, URL:', chequeUrl);

    const aadharCardUrl = files.aadharCard ? await uploadFileToFirebase(files.aadharCard, 'aadharCards') : null;
    console.log('Aadhar Card uploaded, URL:', aadharCardUrl);

    const collegeIDUrl = files.collegeID ? await uploadFileToFirebase(files.collegeID, 'collegeIDs') : null;
    console.log('College ID uploaded, URL:', collegeIDUrl);

    const incomeCertificateUrl = files.incomeCertificate ? await uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates') : null;
    console.log('Income Certificate uploaded, URL:', incomeCertificateUrl);

    // Prepare the data for insertion
    const scholarshipData: InsertScholarship = {
      applicationNumber: nextApplicationNumber,
      name: personalDetails.name,
      gender: personalDetails.gender,
      category: personalDetails.category,
      fatherName: personalDetails.fatherName,
      motherName: personalDetails.motherName,
      income: parseInt(personalDetails.income),
      phoneNumber: personalDetails.studentPhone,
      dateOfBirth: dateOfBirth,
      nationality: personalDetails.nationality,
      adharNumber: personalDetails.aadhar,
      fatherOccupation: personalDetails.fatherOccupation,
      motherOccupation: personalDetails.motherOccupation,
      houseNumber: contactDetails.house,
      postOffice: contactDetails.postOffice,
      pinCode: contactDetails.pincode,
      bankIfscCode: bankDetails.ifsc,
      bankName: bankDetails.bankName,
      bankBranch: bankDetails.branchName,
      bankAccountNumber: bankDetails.accountNumber,
      bankAccountHolder: bankDetails.accountHolder,
      collegeName: educationalDetails.college,
      branch: educationalDetails.branch,
      semester: educationalDetails.semester,
      hostelResident: educationalDetails.hostelResident === 'Yes',
      cgpa: parseFloat(educationalDetails.cgpa),
      status: 'Pending',
      photo: photoUrl,
      cheque: chequeUrl,
      aadharCard: aadharCardUrl,
      collegeID: collegeIDUrl,
      incomeCertificate: incomeCertificateUrl,
    };

    console.log('Prepared Scholarship Data:', scholarshipData);

    // Insert data into the database
    const insertResult = await ScholarshipDb.insert(Scholarship_Table).values(scholarshipData);

    console.log('Database Insert Result:', insertResult);

    return NextResponse.json({ 
      message: 'Scholarship data added successfully', 
      result: insertResult,
      applicationNumber: nextApplicationNumber
    });

  } catch (error) {
    console.error('Error posting scholarship data:', error.message);
    console.error('Stack Trace:', error.stack);
    return NextResponse.json({ error: `Failed to post scholarship data: ${error.message}` }, { status: 500 });
  }
}
