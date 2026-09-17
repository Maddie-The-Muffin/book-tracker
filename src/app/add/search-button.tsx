"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex items-center gap-2">
      {pending && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface/40 border-t-surface" />
      )}
      {pending ? "Searching..." : "Search"}
    </Button>
  );
}
