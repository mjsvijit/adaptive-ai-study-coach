import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const PUBLIC_PATHS = [
  "/signin",
  "/signup",
];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const authToken = request.cookies.get("auth_token")?.value;

  // 🔄 PROXY API REQUESTS (Resolve CORS)
  if (pathname.startsWith("/api/v1/")) {
    const url = new URL(request.url);
    const destination = "http://65.0.2.34:8131" + pathname + url.search;
    return NextResponse.rewrite(new URL(destination));
  }

  // Ignore Next.js internals, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next(); ``
  }

  // Check if the current path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 🚫 NOT LOGGED IN
  if (!authToken) {
    if (!isPublicPath) {
      // Redirect to signin if trying to access a protected route
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // ✅ LOGGED IN
  if (isPublicPath) {
    // Redirect to dashboard if trying to access a public route (like signin)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
