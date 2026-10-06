"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Header button: ends the session, then sends the user to /sign-in.
export function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="ml-auto inline-flex min-h-11 cursor-pointer items-center text-sm text-ink-muted hover:text-ink"
    >
      Sign out
    </button>
  );
}
