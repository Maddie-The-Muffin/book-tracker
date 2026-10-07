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
  // Lets Server Actions set the session cookie when signing in/up/out.
  // Must be the last plugin in the list.
  plugins: [nextCookies()],
});
