"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/fields";

// Step 2 of password reset: choose a new password using the token from the email.
// `token` is undefined when the link was invalid or expired.
export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setError(null);

    const data = new FormData(e.currentTarget);
    const newPassword = data.get("password") as string;

    // Catch typos client-side before spending the one-time token.
    if (newPassword !== data.get("confirm")) {
      setError("Passwords don't match.");
      return;
    }

    setIsPending(true);
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setIsPending(false);
      return;
    }

    // Password changed; send them to sign in with it.
    router.push("/sign-in");
  }

  return (
    <Card className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 font-display text-xl font-semibold">Choose a new password</h1>

      {!token ? (
        <p role="alert" className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
          This reset link is invalid or has expired.{" "}
          <Link href="/forgot-password" className="underline">
            Request a new one
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              New password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-sm text-ink-muted">At least 8 characters.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="confirm">
              Confirm new password
            </label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Please wait..." : "Reset password"}
          </Button>
        </form>
      )}
    </Card>
  );
}
