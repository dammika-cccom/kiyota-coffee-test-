import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import path from "path";

// --- CRITICAL FIX FOR LOCAL SCRIPTS ---
// This tells the script to look specifically for .env.local in your root folder
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Check your .env.local file.");
}

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the database object
export const db = drizzle(pool, { schema });