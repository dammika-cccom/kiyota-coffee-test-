import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

/**
 * KIYOTA ARCHITECTURE: SYNTACTICALLY VALID DB INITIALIZATION
 * 
 * PROBLEM: Neon's validator crashes the build if the URL doesn't match a specific regex.
 * SOLUTION: Provide a perfectly formatted dummy string for the build phase.
 * Cloudflare's runtime secrets will override this at the moment the site goes live.
 */
const connectionString = process.env.DATABASE_URL || "postgresql://build_user:build_pass@build_host.neon.tech/neondb";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });