import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";

// Server-side Better Auth instance. Users, sessions and password hashes are
// stored in our own Neon database through the Drizzle adapter.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Email + password sign-in, plus password reset via an emailed link (Resend).
  emailAndPassword: {
    enabled: true,
    // Called when a user requests a reset; `url` is the one-time link
    // (it redirects to /reset-password?token=... after validating the token).
    // Awaited so the email isn't dropped when a serverless function exits early.
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
    // Link is valid for 1 hour.
    resetPasswordTokenExpiresIn: 60 * 60,
    // Log out other devices after a reset in case the old password was leaked.
    revokeSessionsOnPasswordReset: true,
  },
  // Rate limiting (on by default in production only). Stored in Postgres so the
  // counters are shared across Vercel's serverless instances.
  rateLimit: {
    storage: "database",
    customRules: {
      // Tighter than the default (3 per 10s) so one IP can't mass-create
      // accounts: 5 sign-ups per hour. Also protects the Resend email quota.
      "/sign-up/email": { window: 60 * 60, max: 5 },
    },
  },
  advanced: {
    // Vercel sets x-vercel-forwarded-for to the real client IP and it can't be
    // spoofed by the caller. Fall back to x-forwarded-for for other hosts/local.
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"] },
  },
  // Lets Server Actions set the session cookie when signing in/up/out.
  // Must be the last plugin in the list.
  plugins: [nextCookies()],
});
