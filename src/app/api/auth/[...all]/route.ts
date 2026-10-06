import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Exposes Better Auth's endpoints (sign-in, sign-up, sign-out, session, ...)
// under /api/auth/*. The browser-side auth client talks to these.
export const { GET, POST } = toNextJsHandler(auth);
