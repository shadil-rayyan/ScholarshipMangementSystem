import { NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { testConnection } from '@/db';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper function to upload a file to Firebase and return the download URL
const uploadFileToFirebase = async (file: File | null, path: string): Promise<string | null> => {
    if (!file) return null;
    try {
        console.log(`Uploading file to path: ${path}`);
        const storageRef = ref(storage, `darsana/${path}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log(`Upload completed with metadata: ${JSON.stringify(snapshot.metadata)}`);
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`Download URL: ${downloadURL}`);
        return downloadURL;
    } catch (error) {
        console.error(`Failed to upload file at path ${path}:`, error);
        return null;
    }
};

// Function to validate scholarship data
const validateScholarshipData = (data: any) => {
    const errors: string[] = [];
    const { personalDetails, contactDetails, educationalDetails, bankDetails } = data;

    if (!personalDetails.name) errors.push('Name is required');
    if (!personalDetails.dob) errors.push('Date of Birth is required');
    if (!contactDetails.studentEmail) errors.push('Student Email is required');
    if (!educationalDetails.college) errors.push('College name is required');
    if (!bankDetails.bankName) errors.push('Bank Name is required');
    if (!bankDetails.accountNumber) errors.push('Account Number is required');
    if (!bankDetails.ifsc) errors.push('IFSC Code is required');

    return errors;
};

export async function POST(request: Request) {
    try {
        console.log('API route hit');

        // Test database connection
        const isConnected = await testConnection();
        console.log('Database connection result:', isConnected);

        if (!isConnected) {
            throw new Error('Database connection failed');
        }

        // Parse form data from the request
        const formData = await request.formData();
        console.log('Received form data');

        // Extract the scholarship data from formData
        const scholarshipDataJson = formData.get('scholarshipData') as string;
        if (!scholarshipDataJson) {
            console.error('scholarshipData is missing');
            throw new Error('scholarshipData is missing');
        }

        const scholarshipDataParsed = JSON.parse(scholarshipDataJson);
        const validationErrors = validateScholarshipData(scholarshipDataParsed);
        if (validationErrors.length > 0) {
            console.error('Validation errors:', validationErrors);
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const { personalDetails, contactDetails, educationalDetails, bankDetails } = scholarshipDataParsed;

        // Construct the initial scholarship data object
        const scholarshipData = {
            applicationType: 'Scholarship',
            name: personalDetails.name,
            dateOfBirth: new Date(personalDetails.dob),
            gender: personalDetails.gender,
            applicationtype: personalDetails.applicationtype,
            category: personalDetails.category,
            adharNumber: personalDetails.aadhar,
            fatherName: personalDetails.fatherName,
            fatherNumber: personalDetails.fatherPhone,
            income: personalDetails.income,
            country: contactDetails.country,
            state: contactDetails.state,
            district: contactDetails.district,
            studentEmail: contactDetails.studentEmail,
            nameOfTheCollege: educationalDetails.college,
            branch: educationalDetails.branch,
            semester: educationalDetails.semester,
            cgpa: educationalDetails.cgpa,
            bankName: bankDetails.bankName,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifsc,
            branchName: bankDetails.branchName,
            accountHolder: bankDetails.accountHolder,
            remark: formData.get('remark') as string || null,
            applicationDate: new Date(),
            status: 'Pending',
            adminLog: [],
            photoUrl: null,
            checkUrl: null,
            aadharCardUrl: null,
            collegeIdCardUrl: null,
            incomeUrl: null,
        };

        // Extract files from formData
        const files = {
            photo: formData.get('photo') as File | null,
            cheque: formData.get('cheque') as File | null,
            aadharCard: formData.get('aadharCard') as File | null,
            collegeID: formData.get('collegeID') as File | null,
            incomeCertificate: formData.get('incomeCertificate') as File | null,
        };

        // Upload files to Firebase Storage and get URLs
        console.log('Uploading files to Firebase Storage...');
        const photoUrl = files.photo ? await uploadFileToFirebase(files.photo, 'photos') : null;
        console.log('Photo URL:', photoUrl);

        const chequeUrl = files.cheque ? await uploadFileToFirebase(files.cheque, 'cheques') : null;
        console.log('Cheque URL:', chequeUrl);

        const aadharCardUrl = files.aadharCard ? await uploadFileToFirebase(files.aadharCard, 'aadharCards') : null;
        console.log('Aadhar Card URL:', aadharCardUrl);

        const collegeIDUrl = files.collegeID ? await uploadFileToFirebase(files.collegeID, 'collegeIDs') : null;
        console.log('College ID URL:', collegeIDUrl);

        const incomeCertificateUrl = files.incomeCertificate ? await uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates') : null;
        console.log('Income Certificate URL:', incomeCertificateUrl);

        // Add file URLs to scholarship data
        scholarshipData.photoUrl = photoUrl;
        scholarshipData.checkUrl = chequeUrl;
        scholarshipData.aadharCardUrl = aadharCardUrl;
        scholarshipData.collegeIdCardUrl = collegeIDUrl;
        scholarshipData.incomeUrl = incomeCertificateUrl;

        // Insert the scholarship data into the database
        console.log('Inserting scholarship data into the database');
        const result = await ScholarshipDb.insert(Scholarship_Table).values(scholarshipData).returning();
        console.log('New scholarship application added:', result);

        // Return the inserted scholarship data as the response
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        // Log the error and send a 500 response with error details
        console.error('Error processing scholarship application:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        return NextResponse.json({
            error: 'Failed to process scholarship application',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
