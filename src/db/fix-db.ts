import { db } from "./index";
import { sql } from "drizzle-orm";

async function runFix() {
  console.log("🧨 Starting Database Reset...");
  try {
    // Drop the problematic table and the role type to reset the enum
    await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS "role"`);
    console.log("✅ Role Enum and User table cleared. Now run: npx drizzle-kit push");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e);
    process.exit(1);
  }
}
runFix();