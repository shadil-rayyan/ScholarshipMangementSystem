import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const occupations = pgTable('occupations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // Name of the occupation
  createdAt: timestamp('created_at').defaultNow(), // Automatically set on record creation
});
