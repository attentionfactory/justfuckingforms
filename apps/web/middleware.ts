import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Auth gate for /dashboard/*. Cheap cookie presence check — no DB round-trip.
// Server components inside /dashboard still call auth.api.getSession() to load
// the user; this middleware just bounces obviously-unauthenticated requests
// before they hit the page handlers.
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(
      request.nextUrl.pathname + request.nextUrl.search,
    )}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
