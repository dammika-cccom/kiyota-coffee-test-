import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * DATABASE RESET TOOL
 * Purpose: Wipes conflicting tables to allow for fresh Schema Sync.
 */

async function reset() {
  console.log("🧨 Initializing Database Reset...");
  
  try {
    // We use a raw SQL command to drop tables in the correct order
    await db.execute(sql`
      DROP TABLE IF EXISTS 
        "product", 
        "user", 
        "order", 
        "coffee_shop", 
        "course", 
        "academy_inquiry", 
        "farm", 
        "promotion" 
      CASCADE
    `);

    console.log("✅ SUCCESS: Database wiped. You can now run 'npx drizzle-kit push'.");
    process.exit(0);
  } catch (error) {
    console.error("❌ RESET FAILED:", error);
    process.exit(1);
  }
}

reset();