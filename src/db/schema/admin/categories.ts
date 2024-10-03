// src/db/schema/admin/categories.ts
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

// Defining the categories table schema
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(), // UUID as the primary key
  name: text('name').notNull().unique(), // Name of the category (not null)
  createdAt: timestamp('created_at').defaultNow(), // Timestamp for when the category was created
});
