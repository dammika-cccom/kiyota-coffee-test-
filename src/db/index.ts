import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// Low-latency HTTP connection for Edge and Local Dev
const connection = neon(process.env.DATABASE_URL);

export const db = drizzle(connection, { schema });