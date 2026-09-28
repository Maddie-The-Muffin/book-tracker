import type { Status } from "@/db/schema";

export const statusLabels: Record<Status, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export const timePeriod = ["all_time", "week", "month", "year"] as const;
export type TimePeriod = (typeof timePeriod)[number];