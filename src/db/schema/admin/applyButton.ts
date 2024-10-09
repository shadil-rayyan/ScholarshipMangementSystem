import { boolean, pgTable, serial } from 'drizzle-orm/pg-core';

export const apply = pgTable('applyButton', {
  id: serial('id').primaryKey(), // Primary key
  case: boolean('case').default(false).notNull(), // Default value is false
});
