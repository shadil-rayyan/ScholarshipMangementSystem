import { NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { testConnection } from '@/db';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper function to upload a file to Firebase and return the download URL
const uploadFileToFirebase = async (file: File | null, path: string): Promise<string | null> => {
    if (!file) return null;
    try {
        const storageRef = ref(storage, `darsana/${path}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
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
        // Parse form data from the request
        const formData = await request.formData();
        const scholarshipDataJson = formData.get('scholarshipData') as string;
        if (!scholarshipDataJson) throw new Error('scholarshipData is missing');

        const scholarshipDataParsed = JSON.parse(scholarshipDataJson);
        const validationErrors = validateScholarshipData(scholarshipDataParsed);
        if (validationErrors.length > 0) {
            return NextResponse.json({ error: `Validation failed: ${validationErrors.join(', ')}` }, { status: 400 });
        }

        // Construct the initial scholarship data object
        const { personalDetails, contactDetails, educationalDetails, bankDetails } = scholarshipDataParsed;
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
            motherName: personalDetails.motherName,
            motherNumber: personalDetails.motherPhone,
            fatherOccupation: personalDetails.fatherOccupation,
            motherOccupation: personalDetails.motherOccupation,
            studentNumber: personalDetails.studentPhone,
            houseApartmentName: contactDetails.house,
            pinCode: contactDetails.pincode,
            postOffice: contactDetails.postOffice,
            country: contactDetails.country,
            state: contactDetails.state,
            district: contactDetails.district,
            alternativeNumber: contactDetails.alternativeNumber,
            studentEmail: contactDetails.studentEmail,
            placeState: contactDetails.place,
            whatsappNumber: contactDetails.whatsappNumber,
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

        // Upload files to Firebase Storage in parallel and get URLs
        const uploadPromises = [
            files.photo ? uploadFileToFirebase(files.photo, 'photos') : Promise.resolve(null),
            files.cheque ? uploadFileToFirebase(files.cheque, 'cheques') : Promise.resolve(null),
            files.aadharCard ? uploadFileToFirebase(files.aadharCard, 'aadharCards') : Promise.resolve(null),
            files.collegeID ? uploadFileToFirebase(files.collegeID, 'collegeIDs') : Promise.resolve(null),
            files.incomeCertificate ? uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates') : Promise.resolve(null),
        ];

        const [photoUrl, chequeUrl, aadharCardUrl, collegeIDUrl, incomeCertificateUrl] = await Promise.all(uploadPromises);

        // Add file URLs to scholarship data
        scholarshipData.photoUrl = photoUrl;
        scholarshipData.checkUrl = chequeUrl;
        scholarshipData.aadharCardUrl = aadharCardUrl;
        scholarshipData.collegeIdCardUrl = collegeIDUrl;
        scholarshipData.incomeUrl = incomeCertificateUrl;

        // Insert the scholarship data into the database
        const result = await ScholarshipDb.insert(Scholarship_Table).values(scholarshipData).returning();

        // Return the inserted scholarship data as the response
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to process scholarship application',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
