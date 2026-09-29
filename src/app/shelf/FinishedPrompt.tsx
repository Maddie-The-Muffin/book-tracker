"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Shown once, right after a book is first marked "finished" (see the
// `justFinished` redirect in updateBook). Offers to take the reader straight
// to the reflection form that's already rendered on the book's detail page.
export function FinishedPrompt({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [showReminder, toggleShowReminder] = useState(false);

  const toggleReminder = () => toggleShowReminder(true);
  // Dismiss and strip the query params so a refresh doesn't re-show this.
  const dismiss = () => router.replace("/shelf");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={dismiss}
    >
      {/* Card doesn't accept arbitrary props, so the dialog/aria attributes and
          click-guard live on this wrapper rather than on Card itself. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="finished-prompt-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="max-w-sm space-y-4 text-center">
          {showReminder ? 
          <div>
            <p className="text-sm text-ink-muted mb-5">
              No worries - you can view the reflection questions anytime by navigating to the book's page via the shelf tab.
            </p>
            <Button type="button" variant="primary" onClick={dismiss}>
              Got it
            </Button>
          </div> : 
          <div>
          <h2 id="finished-prompt-heading" className="font-display text-lg font-semibold">
            🎉 Congrats on finishing this book!
          </h2>
          <p className="text-sm text-ink-muted mb-5">
            Want to answer a few quick reflection questions about it?
          </p>
          <div className="flex justify-center gap-2">
            <Button type="button" variant="secondary" onClick={toggleReminder}>
              Later
            </Button>
            <Button type="button" variant="primary" onClick={() => router.push(`/shelf/${bookId}`)}>
              Yes, let&apos;s go
            </Button>
          </div>
          </div>
          }
        </Card>
      </div>
    </div>
  );
}
