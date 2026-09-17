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
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active ? "bg-terracotta text-surface" : "border border-border text-ink-muted hover:bg-cream"
      }`}
    >
      {label}
    </Link>
  );
}
