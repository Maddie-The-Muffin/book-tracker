import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const statusValues = ["want_to_read", "reading", "finished"] as const;
export type Status = (typeof statusValues)[number];

export const books = pgTable("books", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  openLibraryId: text("open_library_id").notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("cover_url"),
  status: text("status", { enum: statusValues })
    .notNull()
    .default("want_to_read"),
  rating: integer("rating"),
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

// Post-finish reflection answers, kept in their own table (rather than more
// columns on `books`) so the core book row stays lean. One row per book:
// bookId doubles as the primary key and the FK, which makes saving/skipping
// a simple upsert keyed on bookId (see saveReflection/skipReflection).
export const bookReflections = pgTable("book_reflections", {
  bookId: text("book_id")
    .primaryKey()
    .references(() => books.id, { onDelete: "cascade" }),
  favoritePart: text("favorite_part"),
  leastFavoritePart: text("least_favorite_part"),
  wouldRecommend: boolean("would_recommend"),
  // True once the user has explicitly declined the questionnaire for this
  // book. Reset to false whenever real answers are saved.
  skipped: boolean("skipped").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BookReflection = typeof bookReflections.$inferSelect;
export type NewBookReflection = typeof bookReflections.$inferInsert;
