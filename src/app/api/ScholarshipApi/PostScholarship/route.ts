import { NextRequest, NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table, InsertScholarship } from '@/db/schema/scholarship/scholarshipData';
import { sql } from "@vercel/postgres";
import nodemailer from 'nodemailer';

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

    // Validate and parse numeric fields
    const income = parseInt(personalDetails.income, 10);
    if (isNaN(income)) {
      throw new Error('Invalid income value');
    }

    const cgpa = parseFloat(educationalDetails.cgpa);
    if (isNaN(cgpa)) {
      throw new Error('Invalid CGPA value');
    }

    const scholarshipData: InsertScholarship = {
      applicationNumber: nextApplicationNumber,
      name: personalDetails.name,
      gender: personalDetails.gender,
      category: personalDetails.category,
      fatherName: personalDetails.fatherName,
      motherName: personalDetails.motherName,
      income: income,
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
      cgpa: cgpa,
      status: 'Pending',
      photo: files.photo ? files.photo.name : null,
      cheque: files.cheque ? files.cheque.name : null,
      aadharCard: files.aadharCard ? files.aadharCard.name : null,
      collegeID: files.collegeID ? files.collegeID.name : null,
      incomeCertificate: files.incomeCertificate ? files.incomeCertificate.name : null,
    };

    console.log('Prepared Scholarship Data:', scholarshipData);

    // Insert data into the database
    const insertResult = await ScholarshipDb.insert(Scholarship_Table).values(scholarshipData);

    console.log('Database Insert Result:', insertResult);

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:"darsanapalkkad@gmail.com", // Update with environment variable
        pass: "darsana@786", // Update with environment variable
      },
    });

    // Send email to applicant
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: personalDetails.studentEmail,
      subject: 'Scholarship Application Received',
      text: `Dear ${personalDetails.name},\n\nYour scholarship application has been received successfully. Your application number is ${nextApplicationNumber}.\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Scholarship data added successfully and email sent', 
      result: insertResult,
      applicationNumber: nextApplicationNumber
    });

  } catch (error) {
    console.error('Error posting scholarship data:', error);
    return NextResponse.json({ error: `Failed to post scholarship data: ${error.message}` }, { status: 500 });
  }
}
