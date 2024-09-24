import { NextResponse } from 'next/server';
import { SaveDataDb, SaveData_Table } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper function to upload a file to Firebase and return the download URL
const uploadFileToFirebase = async (
  file: File | null,
  path: string
): Promise<string | null> => {
  if (!file) return null;
  try {
    const storageRef = ref(storage, `scholarship/${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`Failed to upload file at path ${path}:`, error);
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('Received formData:', formData);

    const scholarshipDataJson = formData.get('scholarshipData') as string;
    if (!scholarshipDataJson) throw new Error('scholarshipData is missing');

    const scholarshipDataParsed = JSON.parse(scholarshipDataJson);
    console.log('Parsed scholarshipData:', scholarshipDataParsed);

    const studentEmail =
      scholarshipDataParsed.contactDetails?.studentEmail || null;

    if (!studentEmail) throw new Error('studentEmail is missing');

    // Construct scholarship data
    const scholarshipData = {
      name: scholarshipDataParsed.personalDetails?.name || null,
      dateOfBirth: scholarshipDataParsed.personalDetails?.dob
        ? new Date(scholarshipDataParsed.personalDetails.dob)
        : null,
      gender: scholarshipDataParsed.personalDetails?.gender || null,
      applicationType:
        scholarshipDataParsed.personalDetails?.applicationtype || null,
      category: scholarshipDataParsed.personalDetails?.category || null,
      adharNumber: scholarshipDataParsed.personalDetails?.aadhar || null,
      fatherName: scholarshipDataParsed.personalDetails?.fatherName || null,
      fatherNumber: scholarshipDataParsed.personalDetails?.fatherPhone || null,
      motherName: scholarshipDataParsed.personalDetails?.motherName || null,
      motherNumber: scholarshipDataParsed.personalDetails?.motherPhone || null,
      income: scholarshipDataParsed.personalDetails?.income || null,
      fatherOccupation:
        scholarshipDataParsed.personalDetails?.fatherOccupation || null,
      motherOccupation:
        scholarshipDataParsed.personalDetails?.motherOccupation || null,
      studentNumber:
        scholarshipDataParsed.personalDetails?.studentPhone || null,
      houseApartmentName: scholarshipDataParsed.contactDetails?.house || null,
      placeState: scholarshipDataParsed.contactDetails?.place || null,
      postOffice: scholarshipDataParsed.contactDetails?.postOffice || null,
      country: scholarshipDataParsed.contactDetails?.country || null,
      pinCode: scholarshipDataParsed.contactDetails?.pincode || null,
      state: scholarshipDataParsed.contactDetails?.state || null,
      district: scholarshipDataParsed.contactDetails?.district || null,
      whatsappNumber:
        scholarshipDataParsed.contactDetails?.whatsappNumber || null,
      studentEmail: scholarshipDataParsed.contactDetails?.studentEmail || null,
      alternativeNumber:
        scholarshipDataParsed.contactDetails?.alternativeNumber || null,
      nameOfTheCollege:
        scholarshipDataParsed.educationalDetails?.college || null,
      branch: scholarshipDataParsed.educationalDetails?.branch || null,
      semester: scholarshipDataParsed.educationalDetails?.semester || null,
      hostelResident:
        scholarshipDataParsed.educationalDetails?.hostelResident || null,
      cgpa: scholarshipDataParsed.educationalDetails?.cgpa || null,
      bankName: scholarshipDataParsed.bankDetails?.bankName || null,
      accountNumber: scholarshipDataParsed.bankDetails?.accountNumber || null,
      ifscCode: scholarshipDataParsed.bankDetails?.ifsc || null,
      branchName: scholarshipDataParsed.bankDetails?.branchName || null,
      accountHolder: scholarshipDataParsed.bankDetails?.accountHolder || null,
      lastUpdatedTab: 'all',
      lastUpdatedAt: new Date(),
      photoUrl: null,
      checkUrl: null,
      aadharCardUrl: null,
      collegeIdCardUrl: null,
      incomeUrl: null,
    };

    // Handle file uploads
    const files = {
      photo: formData.get('photo') as File | null,
      cheque: formData.get('cheque') as File | null,
      aadharCard: formData.get('aadharCard') as File | null,
      collegeID: formData.get('collegeID') as File | null,
      incomeCertificate: formData.get('incomeCertificate') as File | null,
    };

    // Upload files to Firebase Storage and get URLs
    const uploadPromises = [
      files.photo
        ? uploadFileToFirebase(files.photo, 'photos')
        : Promise.resolve(null),
      files.cheque
        ? uploadFileToFirebase(files.cheque, 'cheques')
        : Promise.resolve(null),
      files.aadharCard
        ? uploadFileToFirebase(files.aadharCard, 'aadharCards')
        : Promise.resolve(null),
      files.collegeID
        ? uploadFileToFirebase(files.collegeID, 'collegeIDs')
        : Promise.resolve(null),
      files.incomeCertificate
        ? uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates')
        : Promise.resolve(null),
    ];

    const [photoUrl, chequeUrl, aadharCardUrl, collegeIDUrl, incomeUrl] =
      await Promise.all(uploadPromises);

    // Add file URLs to scholarship data
    scholarshipData.photoUrl = photoUrl;
    scholarshipData.checkUrl = chequeUrl;
    scholarshipData.aadharCardUrl = aadharCardUrl;
    scholarshipData.collegeIdCardUrl = collegeIDUrl;
    scholarshipData.incomeUrl = incomeUrl;

    // Log final scholarshipData before DB operation
    console.log('Final scholarshipData:', scholarshipData);

    // Check if a record already exists for the given student email
    const existingRecord = await SaveDataDb.select()
      .from(SaveData_Table)
      .where(eq(SaveData_Table.studentEmail, studentEmail))
      .execute();

    let result;
    if (existingRecord.length > 0) {
      // Update existing record
      console.log('Updating existing record for:', studentEmail);
      result = await SaveDataDb.update(SaveData_Table)
        .set(scholarshipData)
        .where(eq(SaveData_Table.studentEmail, studentEmail))
        .returning();
    } else {
      // Insert new record
      console.log('Inserting new record for:', studentEmail);
      result = await SaveDataDb.insert(SaveData_Table)
        .values(scholarshipData)
        .returning();
    }

    console.log('Database operation result:', result);
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process scholarship data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
