import { boolean, pgTable, serial } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
export const ApplyDb = drizzle(sql);
export const apply = pgTable('applyButton', {
  id: serial('id').primaryKey(), // Primary key
  case: boolean('case').default(false).notNull(), // Default value is false
});
