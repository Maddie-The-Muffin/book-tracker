import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

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
