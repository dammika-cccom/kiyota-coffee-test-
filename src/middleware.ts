import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. PUBLIC ASSETS & API BYPASS
  if (
    path.startsWith("/_next") || 
    path.startsWith("/api") || 
    path.startsWith("/images") || 
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. SESSION DECRYPTION
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
    // Redirect based on role to their specific landing page
    const isAdmin = session.role?.includes("ADMIN");
    const target = isAdmin ? "/admin/products" : "/profile/orders";
    return NextResponse.redirect(new URL(target, req.nextUrl));
  }

  // Case C: Role-Based Access Control (RBAC)
  // If a BUYER tries to access any /admin path, send them to their dashboard
  if (path.startsWith("/admin") && session?.role === "BUYER") {
    return NextResponse.redirect(new URL("/profile/orders", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};