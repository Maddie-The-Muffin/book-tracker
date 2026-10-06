"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Shown once, right after a book is first marked "finished" (see the
// `justFinished` redirect in updateBook). Offers to take the reader straight
// to the reflection form that's already rendered on the book's detail page.
export function FinishedPrompt({ bookId }: { bookId: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showReminder, toggleShowReminder] = useState(false);

  const toggleReminder = () => toggleShowReminder(true);
  // Dismiss and strip the query params so a refresh doesn't re-show this.
  const dismiss = () => router.replace("/shelf");

  // A native <dialog> opened with showModal() gives us a real modal: focus moves
  // into it, Tab is trapped inside, the page behind becomes inert, and focus
  // returns to the previously focused element when it closes.
  useEffect(() => {
    const dialog = dialogRef.current;
    // The `open` guard keeps React Strict Mode's double-invoked effect from throwing.
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      // aria-labelledby points at whichever heading is currently rendered.
      aria-labelledby={showReminder ? "finished-reminder-heading" : "finished-prompt-heading"}
      // Escape fires `cancel`; handle it ourselves so the URL params get cleared too.
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      // A click on the dialog element itself (not its children) is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      // Reset the browser's default dialog chrome; Card supplies the visuals.
      className="m-auto w-full max-w-sm bg-transparent p-0 backdrop:bg-ink/40"
    >
      <Card className="space-y-4 text-center">
        {showReminder ? (
          <div>
            {/* Own heading so the dialog keeps an accessible name in this state. */}
            <h2 id="finished-reminder-heading" className="sr-only">
              Reflection questions reminder
            </h2>
            <p className="text-sm text-ink-muted mb-5">
              No worries - you can view the reflection questions anytime by navigating to the book&apos;s page via the shelf tab.
            </p>
            {/* autoFocus keeps focus inside the dialog after the previous buttons unmount. */}
            <Button type="button" variant="primary" onClick={dismiss} autoFocus>
              Got it
            </Button>
          </div>
        ) : (
          <div>
            <h2 id="finished-prompt-heading" className="font-display text-lg font-semibold">
              <span aria-hidden="true">🎉</span> Congrats on finishing this book!
            </h2>
            <p className="text-sm text-ink-muted mb-5">
              Want to answer a few quick reflection questions about it?
            </p>
            <div className="flex justify-center gap-2">
              <Button type="button" variant="secondary" onClick={toggleReminder}>
                Later
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => router.push(`/shelf/${bookId}`)}
                autoFocus
              >
                Yes, let&apos;s go
              </Button>
            </div>
          </div>
        )}
      </Card>
    </dialog>
  );
}
