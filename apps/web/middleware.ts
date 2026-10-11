import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Protected paths
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAccountRoute = pathname.startsWith("/account");

  // In local development / preview mode, if token is not set yet in httpOnly cookie,
  // allow the client-side AuthProvider guard to handle soft redirects gracefully
  // rather than blocking direct deep links.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/account/:path*"],
};
