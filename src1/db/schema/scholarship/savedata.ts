// src\db\schema\scholarship\scholarshipData.ts
import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

export const SaveDataDb = drizzle(sql);

export const SaveData_Table = pgTable('savedata', {
  id: serial('id').primaryKey(), // Auto-increment primary key
  applicationNumber: serial('application_number').unique(), // Unique application number
  // Personal Details
  name: text('name'),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  applicationtype: text('applicationtype'),
  category: text('category'),
  adharNumber: text('adhar_number').unique(),
  fatherName: text('father_name'),
  fatherNumber: text('father_number'),
  motherName: text('mother_name'),
  motherNumber: text('mother_number'),
  income: text('income'),
  fatherOccupation: text('father_occupation'),
  motherOccupation: text('mother_occupation'),
  studentNumber: text('student_number'),

  // Contact Details
  houseApartmentName: text('house_apartment_name'),
  placeState: text('place_state'),
  postOffice: text('post_office'),
  country: text('country'),
  pinCode: text('pin_code'),
  state: text('state'),
  district: text('district'),
  whatsappNumber: text('whatsapp_number'),
  studentEmail: text('student_email').unique(),
  alternativeNumber: text('alternative_number'),

  // Educational Details
  nameOfTheCollege: text('name_of_the_college'),
  branch: text('branch'),
  semester: text('semester'),
  hostelResident: boolean('hostel_resident').default(false),
  cgpa: decimal('cgpa'),

  // Bank Details
  bankName: text('bank_name'),
  accountNumber: text('account_number'),
  ifscCode: text('ifsc_code'),
  branchName: text('branch_name'),
  accountHolder: text('account_holder'),

  // Documentation Details
  photoUrl: text('photo_url'),
  checkUrl: text('check_url'),
  aadharCardUrl: text('aadhar_card_url'),
  collegeIdCardUrl: text('college_id_card_url'),
  incomeUrl: text('income_url'),

  // Application Meta Data
});

export type InsertSaveData = typeof SaveData_Table.$inferInsert;
export type SelectSaveData = typeof SaveData_Table.$inferSelect;
