"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/fields";

// One form for both /sign-in and /sign-up; `mode` toggles the extra name field,
// the Better Auth call, and the copy.
export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    // Read values from the form itself so inputs stay uncontrolled.
    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name: data.get("name") as string })
      : await authClient.signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setIsPending(false);
      return;
    }

    // Session cookie is set; refresh so server components re-render signed in.
    window.location.assign("/");
  }

  return (
    <Card className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 font-display text-xl font-semibold">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          // role="alert" announces errors as soon as they appear.
          <p role="alert" className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
            {error}
          </p>
        )}

        {isSignUp && (
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input id="name" name="name" type="text" autoComplete="name" required />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            // Better Auth's default minimum is 8 characters.
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
          />
          {isSignUp && <p className="mt-1 text-sm text-ink-muted">At least 8 characters.</p>}
          {/* Sign-in only: entry point to the password reset flow. */}
          {!isSignUp && (
            <Link
              href="/forgot-password"
              className="mt-1 inline-flex min-h-11 items-center text-sm text-ink-muted underline"
            >
              Forgot password?
            </Link>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        {isSignUp ? "Already have an account? " : "New here? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="inline-flex min-h-11 items-center text-ink underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </Card>
  );
}
