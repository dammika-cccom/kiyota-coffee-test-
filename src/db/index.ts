import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

/**
 * KIYOTA ARCHITECTURE: RESILIENT DB INITIALIZATION
 * 
 * PROBLEM: Neon driver throws an error if DATABASE_URL is empty during build-time static analysis.
 * SOLUTION: We provide a 'Shadow String' (placeholder) for the compiler. 
 * At runtime, Cloudflare's environment variable takes precedence.
 */

const connectionString = process.env.DATABASE_URL || "postgres://shadow_user:shadow_pass@shadow_host/shadow_db";

// The Neon client is initialized with the shadow string during build, 
// and the real string during production runtime.
const client = neon(connectionString);

export const db = drizzle(client, { schema });