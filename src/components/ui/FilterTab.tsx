import Link from "next/link";

export function FilterTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      // Tells screen readers which tab is selected; colour alone doesn't convey it.
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs sm:text-sm font-medium transition-colors ${
        active ? "bg-terracotta text-surface" : "border border-border text-ink-muted hover:bg-cream"
      }`}
    >
      {label}
    </Link>
  );
}
