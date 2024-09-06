import { pgTable, serial, integer, text, timestamp, boolean, decimal,jsonb } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";

export const ScholarshipDb = drizzle(sql);

export const Scholarship_Table = pgTable('scholarship', {
  id: serial('id').primaryKey(),  // Serial for auto-increment
  applicationNumber: serial('application_number').unique(), // Serial for auto-increment
  name: text('name'),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  nationality: text('nationality'),
  category: text('category'),
  adharNumber: text('adhar_number'),
  fatherName: text('father_name'),
  fatherNumber: text('father_number'),
  motherName: text('mother_name'),
  motherNumber: text('mother_number'),
  income: text('income'),
  fatherOccupation: text('father_occupation'),
  motherOccupation: text('mother_occupation'),
  studentNumber: text('student_number'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pinCode: text('pin_code'),
  houseApartmentName: text('house_apartment_name'),
  placeState: text('place_state'),
  postOffice: text('post_office'),
  country: text('country'),
  pincode: text('pincode'),
  district: text('district'),
  whatsappNumber: text('whatsapp_number'),
  studentEmail: text('student_email'),
  alternativeNumber: text('alternative_number'),
  highSchool: text('high_school'),
  highSchoolPercentage: decimal('high_school_percentage',),
  intermediate: text('intermediate'),
  intermediatePercentage: decimal('intermediate_percentage',),
  nameOfTheCollege: text('name_of_the_college'),
  branch: text('branch'),
  semester: text('semester'),
  hostelResident: boolean('hostel_resident'),
  cgpa: decimal('cgpa'),
  bankName: text('bank_name'),
  accountNumber: text('account_number'),
  ifscCode: text('ifsc_code'),
  branchName: text('branch_name'),
  accountHolder: text('account_holder'),
  status: text('status'),
  remark: text('remark'),
  // Assuming DocumentationData is stored separately and referenced by an ID
  photoUrl: text('photo_url'),
  checkUrl: text('check_url'),
  aadharCardUrl: text('aadhar_card_url'),
  collegeIdCardUrl: text('college_id_card_url'),
  incomeUrl: text('income_url'),
  applicationDate: timestamp('application_date'),
  //adding the admin array for storing verification 
  adminLog: jsonb('admin_log').default('[]') // Array of admin log entries

});

export type InsertScholarship = typeof Scholarship_Table.$inferInsert;
export type SelectScholarship = typeof Scholarship_Table.$inferSelect;