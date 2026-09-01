import type { Status } from "@/db/schema";

export const statusLabels: Record<Status, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
};
