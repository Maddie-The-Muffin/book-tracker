"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/fields";

// "Danger zone" on /account. Two steps so a stray click can't delete anything:
// click "Delete account", then confirm with the current password.
export function DeleteAccountForm() {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const password = new FormData(e.currentTarget).get("password") as string;

    // The server verifies the password, deletes the user, and clears the session.
    const { error } = await authClient.deleteUser({ password });
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setIsPending(false);
      return;
    }

    // Account is gone: go to sign-up and refresh so the nav shows signed out.
    router.push("/sign-up");
    router.refresh();
  }

  return (
    <Card className="border-brick/30">
      <h2 className="mb-2 font-display text-lg font-semibold text-brick">Delete account</h2>
      <p className="mb-4 text-sm text-ink-muted">
        This permanently deletes your account, your shelf, and all your notes and reflections.
        This can&apos;t be undone.
      </p>

      {!isConfirming ? (
        <Button type="button" variant="secondary" onClick={() => setIsConfirming(true)}>
          Delete my account
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            // role="alert" announces errors as soon as they appear.
            <p role="alert" className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Enter your password to confirm
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              // Move focus to the field when the confirmation step opens.
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brick hover:bg-brick/90 disabled:bg-brick/50"
            >
              {isPending ? "Deleting..." : "Permanently delete"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setIsConfirming(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
