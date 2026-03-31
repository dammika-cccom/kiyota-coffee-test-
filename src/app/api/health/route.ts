import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge"; // Force Edge to test Worker compatibility

export async function GET() {
  try {
    // 1. Test Database Connection
    const result = await db.execute(sql`SELECT 1 as connected`);
    
    // 2. Check Environment Variables
    const envStatus = {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      nodeVersion: process.env.NODE_VERSION || "unknown",
    };

    return NextResponse.json({
      status: "healthy",
      database: result,
      env: envStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}