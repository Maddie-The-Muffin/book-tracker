"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function AddButton() {
  // Tracks whether this button's parent <form> submission is in flight, so we
  // can disable it and prevent duplicate submits from rapid repeat clicks.
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "Adding..." : "Add"}
    </Button>
  );
}
