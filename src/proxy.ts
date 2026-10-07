import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic gate: if there's no session cookie at all, send the visitor to
// /sign-in before rendering. This is UX only: the cookie is not validated here.
// The real check is requireUser() in src/lib/session.ts.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except auth pages, the auth API, and static assets.
  matcher: ["/((?!sign-in|sign-up|forgot-password|reset-password|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
