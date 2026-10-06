"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Header link that marks itself as the current page for assistive tech.
// Needs to be a client component because it reads the current pathname.
export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  // "/" only matches exactly; other links also match their sub-routes (e.g. /shelf/123).
  const isCurrent = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} aria-current={isCurrent ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
}
