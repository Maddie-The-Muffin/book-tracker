"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function AddButton({ title }: { title: string }) {
  // Tracks whether this button's parent <form> submission is in flight, so we
  // can disable it and prevent duplicate submits from rapid repeat clicks.
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending} aria-busy={pending}>
      {pending ? "Adding..." : "Add"}
      {/* Every result has an "Add" button, so include the book title in the
          accessible name (visually hidden) to tell them apart. */}
      <span className="sr-only"> {title} to shelf</span>
    </Button>
  );
}
