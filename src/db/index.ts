import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

/**
 * KIYOTA ARCHITECTURE: RESILIENT DB INITIALIZATION
 */
const connectionString = process.env.DATABASE_URL || "";

// Initialize Neon without throwing error at module level
const client = neon(connectionString);

export const db = drizzle(client, { schema });