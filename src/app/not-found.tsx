import type { Metadata } from "next";
import Link from "next/link";

// Page title for the 404 screen (Next.js also adds noindex automatically).
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="font-display text-3xl font-semibold">404</h1>
      <p className="text-ink-muted">We couldn&apos;t find the page you were looking for.</p>
      {/* A Link styled like the primary Button — navigation should be an anchor, not a <button> */}
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-terracotta-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
