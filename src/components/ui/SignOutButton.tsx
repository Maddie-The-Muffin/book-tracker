"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

// Header button: ends the session, then sends the user to /sign-in.
export function SignOutButton() {
  const router = useRouter();

  const [isSigningOut, changeSignOutStatus] = useState(false);

  async function handleClick() {
    changeSignOutStatus(true);
    console.log("I've been clicked");
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-11 cursor-pointer items-center text-sm text-ink-muted hover:text-ink"
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
