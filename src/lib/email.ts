import { Resend } from "resend";

// Resend client, created lazily so the app still builds/runs without the key
// (only the reset email needs it).
let resend: Resend | null = null;

// Sends the password-reset email containing the one-time link.
export async function sendPasswordResetEmail(to: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev fallback: no key configured, so log the link instead of failing.
    console.warn(`[email] RESEND_API_KEY not set. Reset link for ${to}: ${url}`);
    return;
  }

  resend ??= new Resend(apiKey);
  const { error } = await resend.emails.send({
    // Must be a verified domain in Resend (or onboarding@resend.dev for testing).
    from: process.env.EMAIL_FROM ?? "Book Tracker <onboarding@resend.dev>",
    to,
    subject: "Reset your Book Tracker password",
    text: `Use this link to reset your password (valid for 1 hour):\n\n${url}\n\nIf you didn't request this, you can ignore this email.`,
  });

  // Resend returns errors rather than throwing; surface them in server logs.
  if (error) console.error("[email] Failed to send reset email:", error);
}
