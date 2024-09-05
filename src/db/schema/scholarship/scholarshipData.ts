import { pgTable, serial, integer, text, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";

export const ScholarshipDb = drizzle(sql);

export const Scholarship_Table = pgTable('scholarship', {
  id: serial('id').primaryKey(),  // Serial for auto-increment
  applicationNumber: serial('application_number').notNull().unique(), // Serial for auto-increment
  name: text('name').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  nationality: text('nationality').notNull(),
  category: text('category').notNull(),
  adharNumber: text('adhar_number').notNull(),
  fatherName: text('father_name').notNull(),
  fatherNumber: text('father_number').notNull(),
  motherName: text('mother_name').notNull(),
  motherNumber: text('mother_number').notNull(),
  income: text('income').notNull(),
  fatherOccupation: text('father_occupation').notNull(),
  motherOccupation: text('mother_occupation').notNull(),
  studentNumber: text('student_number').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  houseApartmentName: text('house_apartment_name').notNull(),
  placeState: text('place_state').notNull(),
  postOffice: text('post_office').notNull(),
  country: text('country').notNull(),
  pincode: text('pincode').notNull(),
  district: text('district').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  studentEmail: text('student_email').notNull(),
  alternativeNumber: text('alternative_number').notNull(),
  highSchool: text('high_school').notNull(),
  highSchoolPercentage: decimal('high_school_percentage', { precision: 5, scale: 2 }).notNull(),
  intermediate: text('intermediate').notNull(),
  intermediatePercentage: decimal('intermediate_percentage', { precision: 5, scale: 2 }).notNull(),
  nameOfTheCollege: text('name_of_the_college').notNull(),
  branch: text('branch').notNull(),
  semester: text('semester').notNull(),
  hostelResident: boolean('hostel_resident').notNull(),
  cgpa: decimal('cgpa', { precision: 4, scale: 2 }).notNull(),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
  ifscCode: text('ifsc_code').notNull(),
  branchName: text('branch_name').notNull(),
  accountHolder: text('account_holder').notNull(),
  status: text('status').notNull(),
  remark: text('remark'),
  // Assuming DocumentationData is stored separately and referenced by an ID
});

export type InsertScholarship = typeof Scholarship_Table.$inferInsert;
export type SelectScholarship = typeof Scholarship_Table.$inferSelect;
