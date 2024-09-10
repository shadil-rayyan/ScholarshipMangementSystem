import { pgTable, serial, integer, text, timestamp, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";

export const ScholarshipDb = drizzle(sql);

export const Scholarship_Table = pgTable('scholarship', {
  id: serial('id').primaryKey(),  // Auto-increment primary key
  applicationNumber: serial('application_number').unique(),  // Unique application number
  // Personal Details
  name: text('name').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  applicationtype:text('applicationtype').notNull(),
  category: text('category').notNull(),
  adharNumber: text('adhar_number').unique().notNull(),
  fatherName: text('father_name').notNull(),
  fatherNumber: text('father_number').notNull(),
  motherName: text('mother_name'),
  motherNumber: text('mother_number'),
  income: text('income').notNull(),
  fatherOccupation: text('father_occupation'),
  motherOccupation: text('mother_occupation'),
  studentNumber: text('student_number'),
  
  // Contact Details
  houseApartmentName: text('house_apartment_name'),
  placeState: text('place_state'),
  postOffice: text('post_office'),
  country: text('country').notNull(),
  pinCode: text('pin_code'),
  state: text('state').notNull(),
  district: text('district').notNull(),
  whatsappNumber: text('whatsapp_number'),
  studentEmail: text('student_email').unique().notNull(),
  alternativeNumber: text('alternative_number'),

  // Educational Details
  nameOfTheCollege: text('name_of_the_college').notNull(),
  branch: text('branch').notNull(),
  semester: text('semester').notNull(),
  hostelResident: boolean('hostel_resident').default(false),
  cgpa: decimal('cgpa').notNull(),

  // Bank Details
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
  ifscCode: text('ifsc_code').notNull(),
  branchName: text('branch_name').notNull(),
  accountHolder: text('account_holder').notNull(),
  
  // Documentation Details
  photoUrl: text('photo_url'),
  checkUrl: text('check_url'),
  aadharCardUrl: text('aadhar_card_url'),
  collegeIdCardUrl: text('college_id_card_url'),
  incomeUrl: text('income_url'),

  // Application Meta Data
  status: text('status').default('Pending'),
  remark: text('remark'),
  applicationDate: timestamp('application_date').defaultNow(), // Application submission date
  verifyadmin:text('verifyadmin').default('null'),
  selectadmin:text('selectadmin').default('null'),
  amountadmin:text('amountadmin').default('null'),
  rejectadmin:text('rejectadmin').default('null'),
  renewaladmin:text('renewaladmin').default('null'),


});

export type InsertScholarship = typeof Scholarship_Table.$inferInsert;
export type SelectScholarship = typeof Scholarship_Table.$inferSelect;
