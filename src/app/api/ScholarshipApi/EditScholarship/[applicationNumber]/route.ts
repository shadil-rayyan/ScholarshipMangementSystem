import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
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
        const formData = await request.formData();
        const scholarshipDataJson = formData.get('scholarshipData') as string;
        const applicationNumber = formData.get('application_number') as string;

        // Debugging logs
        console.log('Scholarship Data JSON:', scholarshipDataJson);
        console.log('Application Number:', applicationNumber);

        if (!scholarshipDataJson || !applicationNumber) {
            return NextResponse.json({ error: 'Missing scholarship data or application number' }, { status: 400 });
        }

        // Parse JSON
        const scholarshipDataParsed = JSON.parse(scholarshipDataJson);
        const validationErrors = validateScholarshipData(scholarshipDataParsed);
        if (validationErrors.length > 0) {
            return NextResponse.json({ error: `Validation failed: ${validationErrors.join(', ')}` }, { status: 400 });
        }

        const { personalDetails, contactDetails, educationalDetails, bankDetails } = scholarshipDataParsed;

        // Convert applicationNumber to a number
        const applicationNumberAsNumber = Number(applicationNumber);

        // Fetch the existing scholarship record
        const existingScholarship = await ScholarshipDb
            .select()
            .from(Scholarship_Table)
            .where(eq(Scholarship_Table.applicationNumber, applicationNumberAsNumber))
            .limit(1);

        if (!existingScholarship.length) {
            return NextResponse.json({ error: 'Scholarship application not found' }, { status: 404 });
        }

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
        const photoUrl = files.photo ? await uploadFileToFirebase(files.photo, 'photos') : existingScholarship[0].photoUrl;
        const chequeUrl = files.cheque ? await uploadFileToFirebase(files.cheque, 'cheques') : existingScholarship[0].checkUrl;
        const aadharCardUrl = files.aadharCard ? await uploadFileToFirebase(files.aadharCard, 'aadharCards') : existingScholarship[0].aadharCardUrl;
        const collegeIDUrl = files.collegeID ? await uploadFileToFirebase(files.collegeID, 'collegeIDs') : existingScholarship[0].collegeIdCardUrl;
        const incomeCertificateUrl = files.incomeCertificate ? await uploadFileToFirebase(files.incomeCertificate, 'incomeCertificates') : existingScholarship[0].incomeUrl;

        // Update scholarship data
        const updatedScholarshipData = {
            // Personal Details
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

            // Contact Details
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

            // Educational Details
            nameOfTheCollege: educationalDetails.college,
            branch: educationalDetails.branch,
            semester: educationalDetails.semester,
            cgpa: educationalDetails.cgpa,

            // Bank Details
            bankName: bankDetails.bankName,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifsc,
            branchName: bankDetails.branchName,
            accountHolder: bankDetails.accountHolder,

            // Documentation URLs (from file uploads or existing URLs)
            photoUrl: photoUrl,
            checkUrl: chequeUrl,
            aadharCardUrl: aadharCardUrl,
            collegeIdCardUrl: collegeIDUrl,
            incomeUrl: incomeCertificateUrl,

            // Application Meta Data
            status: 'Updated',
            remark: formData.get('remark') as string || existingScholarship[0].remark,
            applicationDate: new Date(),
            verifyadmin: existingScholarship[0].verifyadmin,
            selectadmin: existingScholarship[0].selectadmin,
            amountadmin: existingScholarship[0].amountadmin,
            rejectadmin: existingScholarship[0].rejectadmin,
            revertedadmin: existingScholarship[0].revertedadmin,
        };

        // Update the scholarship data in the database
        const result = await ScholarshipDb
            .update(Scholarship_Table)
            .set(updatedScholarshipData)
            .where(eq(Scholarship_Table.applicationNumber, applicationNumberAsNumber))
            .returning();

        console.log('Scholarship application updated successfully:', result);

        // Return the updated scholarship data as the response
        return NextResponse.json(result[0], { status: 200 });
    } catch (error) {
        console.error('Error updating scholarship application:', error);
        return NextResponse.json({ error: 'Failed to update scholarship application' }, { status: 500 });
    }
}
