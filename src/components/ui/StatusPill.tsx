import type { Status } from "@/db/schema";
import { statusLabels } from "@/lib/format";

// One warm accent color per reading status, distinct from the terracotta
// used for primary actions so status doesn't visually compete with buttons.
const statusStyles: Record<Status, string> = {
  want_to_read: "border border-border text-ink-muted",
  reading: "bg-caramel-tint text-brick",
  finished: "bg-sage-tint text-sage-dark",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
