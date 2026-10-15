import nodemailer, { type Transporter } from "nodemailer";

// Gmail SMTP transport, created lazily so the app still builds/runs without
// credentials (only the reset email needs them).
let transporter: Transporter | null = null;

// Sends the password-reset email containing the one-time link.
export async function sendPasswordResetEmail(to: string, url: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    // Dev fallback: no credentials configured, so log the link instead of failing.
    console.warn(
      `[email] GMAIL_USER / GMAIL_APP_PASSWORD not set. Reset link for ${to}: ${url}`,
    );
    return;
  }

  // Authenticate with a Google App Password (not the account password).
  // Requires 2-Step Verification on the Gmail account.
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      // Display name hides the raw Gmail address in most mail clients.
      // Gmail always sends from the authenticated account's address.
      from: `"Book Tracker" <${user}>`,
      to,
      replyTo: "noreply@example.invalid",
      subject: "Reset your Book Tracker password",
      text: `Use this link to reset your password (valid for 1 hour):\n\n${url}\n\nIf you didn't request this, you can ignore this email.\n\n This is an automated email, do not reply.`,
    });
  } catch (error) {
    // Nodemailer throws on failure; log it rather than letting it surface to
    // the user (which would also reveal whether the address has an account).
    console.error("[email] Failed to send reset email:", error);
  }
}
