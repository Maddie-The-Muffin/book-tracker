// Input limits shared by the forms (maxLength) and the Server Actions, so the
// two can't drift apart. Server Actions are public endpoints, so the server
// must enforce these itself: the form attributes only stop honest users.
export const LIMITS = {
  searchQuery: 200,
  title: 300,
  author: 300,
  openLibraryId: 50,
  notes: 5000,
  reflection: 2000,
} as const;

// Only Open Library cover images are allowed (matches next.config.ts), so a
// forged coverUrl can't make next/image throw or point at another host.
const COVER_PREFIX = "https://covers.openlibrary.org/";

// Returns the URL if it's an allowed cover, otherwise null (no cover).
export function safeCoverUrl(value: string | null): string | null {
  if (!value || value.length > 300 || !value.startsWith(COVER_PREFIX)) return null;
  return value;
}

// Length of a form value as the user typed it. Browsers submit textarea line
// breaks as CRLF, but maxLength counts them as one character, so normalize
// before comparing to avoid rejecting text the form itself allowed.
export function withinLimit(value: string, max: number): boolean {
  return value.replace(/\r\n/g, "\n").length <= max;
}

// Ratings are 1 to 5 stars, or null for "no rating". Returns undefined when
// the raw value isn't valid so callers can reject it.
export function parseRating(raw: string): number | null | undefined {
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined;
}
