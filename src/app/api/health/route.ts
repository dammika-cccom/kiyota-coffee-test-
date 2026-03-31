import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// REMOVED: export const runtime = "edge"; 

export async function GET() {
  try {
    // Test Database Connection
    const result = await db.execute(sql`SELECT 1 as connected`);
    
    return NextResponse.json({
      status: "healthy",
      database: result,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasSessionSecret: !!process.env.SESSION_SECRET,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
    }, { status: 500 });
  }
}