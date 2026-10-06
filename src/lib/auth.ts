import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Server-side Better Auth instance. Users, sessions and password hashes are
// stored in our own Neon database through the Drizzle adapter.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Email + password only for now (no email verification / reset: both need an
  // email provider, see the plan's "out of scope" list).
  emailAndPassword: { enabled: true },
  // Lets Server Actions set the session cookie when signing in/up/out.
  // Must be the last plugin in the list.
  plugins: [nextCookies()],
});
