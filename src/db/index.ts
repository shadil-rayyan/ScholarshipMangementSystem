import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

// Load environment variables from .env.development.local or .env
config({ path: '.env.local' }); // or .env

// Initialize the Drizzle ORM with Vercel Postgres
export const db = drizzle(sql);

// Function to test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
