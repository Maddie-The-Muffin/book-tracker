"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className="flex items-center gap-2">
      {pending && (
        // Decorative spinner; the "Searching..." text carries the meaning.
        <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface/40 border-t-surface" />
      )}
      {pending ? "Searching..." : "Search"}
    </Button>
  );
}
