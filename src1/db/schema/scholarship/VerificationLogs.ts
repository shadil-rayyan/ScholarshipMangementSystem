//src/db/schema/scholarship/VerificationLogs.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  foreignKey,
  integer,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Scholarship_Table } from './scholarshipData'; // Import Scholarship_Table

export const VerificationDb = drizzle(sql);

export const Verification_Table = pgTable('verification_logs', {
  id: serial('id').primaryKey(),
  applicationNumber: integer('application_number')
    .notNull()
    .references(() => Scholarship_Table.applicationNumber), // Add foreign key reference
  status: text('status').notNull(),
  adminName: text('admin_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type InsertVerification = typeof Verification_Table.$inferInsert;
export type SelectVerification = typeof Verification_Table.$inferSelect;
