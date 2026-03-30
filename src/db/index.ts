import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

/**
 * KIYOTA ARCHITECTURE: RESILIENT DB INITIALIZATION
 * Prevents build-time crashes by allowing the URL to be empty 
 * during Next.js static analysis.
 */
const databaseUrl = process.env.DATABASE_URL || "";

// Neon HTTP driver initialization
const sql = neon(databaseUrl);

// Export the Drizzle instance
export const db = drizzle(sql, { schema });