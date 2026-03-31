import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. EXTENSION BYPASS (The Layout Fix)
  // If the path contains a dot (e.g., .css, .js, .png, .webp), 
  // bypass middleware immediately.
  if (path.includes('.')) {
    return NextResponse.next();
  }

  // 2. INTERNAL NEXT.JS BYPASS
  if (path.startsWith("/_next") || path.startsWith("/api/health")) {
    return NextResponse.next();
  }

  // ... rest of your session logic ...
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/health|_next|favicon.ico|images|.*\\..*).*)'],
};