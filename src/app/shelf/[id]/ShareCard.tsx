"use client";

import { useState, useSyncExternalStore } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Subscribing to nothing: whether the Web Share API exists never changes, so
// useSyncExternalStore is just a hydration-safe way to read it (the server
// snapshot says "unsupported", then the client swaps in the real answer).
const noopSubscribe = () => () => {};

export function ShareCard({
  title,
  author,
  rating,
}: {
  title: string;
  author: string;
  rating: number | null;
}) {
  // Native share sheet (mostly mobile) is the primary action where available.
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false
  );
  // Text shown in the polite live region after copying, so screen readers hear it.
  const [copyMessage, setCopyMessage] = useState("");

  // Pre-filled message. Notes are deliberately left out: they're private by default.
  const text = `I just finished reading "${title}" by ${author}${rating ? ` — ${rating}/5 stars.` : ""}.`;

  const nativeShare = async () => {
    try {
      await navigator.share({ text });
    } catch {
      // Dismissing the share sheet rejects with AbortError; nothing to do.
    }
  };

  // Opens the network's share page in a new tab; noopener stops it reaching back into this page.
  const openShareUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const shareToX = () =>
    openShareUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);

  // Facebook's sharer needs a URL; the text rides along as `quote`. It only
  // resolves for a publicly reachable site, so it won't preview on localhost.
  const shareToFacebook = () =>
    openShareUrl(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.origin
      )}&quote=${encodeURIComponent(text)}`
    );

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied to clipboard.");
    } catch {
      setCopyMessage("Couldn't copy. Please select the text and copy it manually.");
    }
  };

  return (
    <Card className="space-y-4 p-4">
      <h2 className="font-display text-lg font-semibold">Share</h2>

      {/* Preview of exactly what will be shared. */}
      <p className="rounded-lg bg-cream p-3 text-sm">{text}</p>

      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <Button type="button" onClick={nativeShare}>
            Share…
          </Button>
        )}
        {/* Secondary when native share is the primary action, otherwise these lead. */}
        <Button type="button" variant={canNativeShare ? "secondary" : "primary"} onClick={shareToX}>
          Share on X<span className="sr-only"> (opens in a new tab)</span>
        </Button>
        <Button type="button" variant="secondary" onClick={shareToFacebook}>
          Share on Facebook<span className="sr-only"> (opens in a new tab)</span>
        </Button>
        <Button type="button" variant="secondary" onClick={copyText}>
          Copy text
        </Button>
      </div>

      <p role="status" className="min-h-5 text-sm text-ink-muted">
        {copyMessage}
      </p>
    </Card>
  );
}
