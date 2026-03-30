import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

/**
 * KIYOTA ARCHITECTURE: RESILIENT DB INITIALIZATION
 * Provides a valid URL format to satisfy the Neon constructor during build-time.
 */
const connectionString = process.env.DATABASE_URL || "postgres://localhost/placeholder";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });