"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/fields";

// Step 1 of password reset: collect the email and ask Better Auth to send a link.
export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const email = new FormData(e.currentTarget).get("email") as string;

    // redirectTo is where the emailed link lands after the token is validated.
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setIsPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    // Same message whether or not the account exists, so emails can't be probed.
    setSent(true);
  }

  return (
    <Card className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 font-display text-xl font-semibold">Reset your password</h1>

      {sent ? (
        // role="status" announces the confirmation to screen readers.
        <p role="status" className="text-sm">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
          It expires in 1 hour.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Please wait..." : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-ink-muted">
        <Link href="/sign-in" className="inline-flex min-h-11 items-center text-ink underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
