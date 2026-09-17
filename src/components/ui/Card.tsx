import { type ReactNode } from "react";
import Link from "next/link";

// Shared "book card" surface: cream card, warm hairline border, soft shadow.
// Kept as a plain string (not a component) so Card/CardLink can apply it to
// different root elements (div vs. Link) without duplicating the class list.
const cardStyles = "rounded-xl border border-border bg-surface p-4 shadow-warm";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${cardStyles} ${className}`}>{children}</div>;
}

// Same card treatment, but as a clickable Link (list items that navigate to
// a book's detail page) with a terracotta hover border.
export function CardLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${cardStyles} block transition-colors hover:border-terracotta ${className}`}
    >
      {children}
    </Link>
  );
}
