import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. AGGRESSIVE BYPASS: Ensure static assets never trigger middleware logic
  // This is the primary cause of "White Pages" in Cloudflare Pages
  if (
    path.includes(".") || // Bypasses all files with extensions (.css, .js, .png, etc)
    path.startsWith("/_next") || 
    path.startsWith("/api") || 
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. SESSION DECRYPTION
  // Ensure your 'decrypt' function in lib/session.ts uses 'jose' or 'Web Crypto API'
  // Node.js 'crypto' module will cause a 500 error here.
  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // 3. ROUTE DEFINITIONS
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/profile");
  const isAuthRoute = path === "/login" || path === "/register";

  // Case A: Unauthenticated user trying to access /admin or /profile
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Case B: Authenticated user trying to access /login or /register
  if (isAuthRoute && session) {
    const isAdmin = session.role?.includes("ADMIN");
    const target = isAdmin ? "/admin/products" : "/profile/orders";
    return NextResponse.redirect(new URL(target, req.nextUrl));
  }

  // Case C: Role-Based Access Control (RBAC)
  if (path.startsWith("/admin") && session?.role === "BUYER") {
    return NextResponse.redirect(new URL("/profile/orders", req.nextUrl));
  }

  return NextResponse.next();
}

// Optimization: Strict matcher reduces Worker invocation costs
export const config = {
  matcher: [
    /*
     * 1. Match all paths except /api/health
     * 2. Exclude files with extensions (static assets)
     * 3. Exclude internal Next.js paths
     */
    '/((?!api/health|_next|favicon.ico|images|.*\\..*).*)',
  ],
};
