import { NextResponse } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';
import { testConnection } from '@/db';

export async function POST(request: Request) {
    try {
        console.log('API route hit');

        // Test the database connection
        const isConnected = await testConnection();
        console.log('Database connection test result:', isConnected);

        if (!isConnected) {
            throw new Error('Database connection failed');
        }

        // Parse the request body
        const body = await request.json();
        console.log('Received scholarship application data:', body);

        // Validate required fields
        const requiredFields = [
            'name', 'dateOfBirth', 'gender', 'nationality', 'category', 
            'adharNumber', 'fatherName', 'fatherNumber', 'income', 
            'country', 'state', 'district', 'studentEmail', 
            'nameOfTheCollege', 'branch', 'semester', 'cgpa', 
            'bankName', 'accountNumber', 'ifscCode', 'branchName', 'accountHolder'
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 });
            }
        }

        // Construct scholarship data as a plain object
        const scholarshipData = {
            name: body.name,
            dateOfBirth: new Date(body.dateOfBirth),
            gender: body.gender,
            nationality: body.nationality,
            category: body.category,
            adharNumber: body.adharNumber,
            fatherName: body.fatherName,
            fatherNumber: body.fatherNumber,
            motherName: body.motherName || null,
            motherNumber: body.motherNumber || null,
            income: body.income,
            fatherOccupation: body.fatherOccupation || null,
            motherOccupation: body.motherOccupation || null,
            studentNumber: body.studentNumber || null,

            // Contact Details
            houseApartmentName: body.houseApartmentName || null,
            placeState: body.placeState || null,
            postOffice: body.postOffice || null,
            country: body.country,
            pinCode: body.pinCode || null,
            state: body.state,
            district: body.district,
            whatsappNumber: body.whatsappNumber || null,
            studentEmail: body.studentEmail,
            alternativeNumber: body.alternativeNumber || null,

            // Educational Details
            nameOfTheCollege: body.nameOfTheCollege,
            branch: body.branch,
            semester: body.semester,
            hostelResident: body.hostelResident || false,
            cgpa: body.cgpa,

            // Bank Details
            bankName: body.bankName,
            accountNumber: body.accountNumber,
            ifscCode: body.ifscCode,
            branchName: body.branchName,
            accountHolder: body.accountHolder,

            // Documentation Details
            photoUrl: body.photoUrl || null,
            checkUrl: body.checkUrl || null,
            aadharCardUrl: body.aadharCardUrl || null,
            collegeIdCardUrl: body.collegeIdCardUrl || null,
            incomeUrl: body.incomeUrl || null,

            // Application Meta Data
            status: 'Pending', // Default status
            remark: body.remark || null,
            applicationDate: new Date(), // Current date
            adminLog: [], // Default empty log
        };

        console.log('Attempting to insert scholarship data into the database');

        // Insert the scholarship data into the database
        const result = await ScholarshipDb.insert(Scholarship_Table).values(scholarshipData).returning();
        console.log('New scholarship application added:', result);

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error in processing scholarship application:', error);
        return NextResponse.json({ 
            error: 'Failed to process scholarship application', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
