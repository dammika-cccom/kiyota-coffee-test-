import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

// We remove 'path', 'dotenv', and 'pg' because they are Node.js only.
// Next.js handles environment variables automatically.

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Check your environment variables.");
}

// Create the Neon HTTP connection (this is Edge compatible)
const sql = neon(process.env.DATABASE_URL);

// Export the Drizzle database object using the neon-http driver
export const db = drizzle(sql, { schema });