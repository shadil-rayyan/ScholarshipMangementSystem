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
        const storageRef = ref(storage, `darsana/${path}/${file.name}`); // Ensure files are uploaded to the correct folder in Firebase
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error(`Failed to upload file at path ${path}:`, error);
        return null;
    }
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
            throw new Error('scholarshipData is missing');
        }

        const scholarshipDataParsed = JSON.parse(scholarshipDataJson);
        const { personalDetails, contactDetails, educationalDetails, bankDetails } = scholarshipDataParsed;

        // Validate required fields
        if (!personalDetails.name || !personalDetails.dob || !contactDetails.studentEmail) {
            throw new Error('Missing required fields');
        }

        // Construct the initial scholarship data object
        const scholarshipData = {
            name: personalDetails.name,
            dateOfBirth: new Date(personalDetails.dob),
            gender: personalDetails.gender,
            nationality: personalDetails.nationality,
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
            applicationDate: new Date(), // Set the current date
            status: 'Pending', // Default status
            adminLog: [], // Default empty log
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
        console.log('Photo uploaded, URL:', photoUrl);

        const chequeUrl = files.cheque ? await uploadFileToFirebase(files.cheque, 'cheques') : null;
        console.log('Cheque uploaded, URL:', chequeUrl);

        const aadharCardUrl = files.aadharCard ? await uploadFileToFirebase(files.aadharCard, 'aadharCards') : null;
        console.log('Aadhar Card uploaded, URL:', aadharCardUrl);

        const collegeIDUrl = files.collegeID ? await uploadFileToFirebase(files.collegeID, 'collegeIDs') : null;
        console.log('College ID uploaded, URL:', collegeIDUrl);

        const incomeCertificateUrl = files.incomeCertificate ? await uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates') : null;
        console.log('Income Certificate uploaded, URL:', incomeCertificateUrl);

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
        console.error('Error processing scholarship application:', error);
        return NextResponse.json({
            error: 'Failed to process scholarship application',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
