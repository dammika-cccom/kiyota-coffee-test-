export const config = {
  matcher: [
    /*
     * Exclude all paths that look like a file (contain a dot)
     * Exclude the health/inspect diagnostic routes
     * Exclude internal Next.js assets
     */
    '/((?!api/health|api/inspect|_next|favicon.ico|images|.*\\..*).*)',
  ],
};