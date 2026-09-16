"use client";

import { useFormStatus } from "react-dom";

export function AddButton() {
  // Tracks whether this button's parent <form> submission is in flight, so we
  // can disable it and prevent duplicate submits from rapid repeat clicks.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-70"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}
