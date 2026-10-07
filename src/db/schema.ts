import { pgTable, text, integer, bigint, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";

export const statusValues = ["want_to_read", "reading", "finished"] as const;
export type Status = (typeof statusValues)[number];

// ---------------------------------------------------------------------------
// Better Auth tables (user / session / account / verification).
// These follow Better Auth's core schema for the Drizzle adapter; keep the
// column names in sync with the library if you upgrade it.
// ---------------------------------------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// One row per sign-in method for a user; for email+password the hashed
// password lives in `password` on the "credential" provider row.
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Better Auth's rate-limit counters (used because rateLimit.storage is
// "database": in-memory counters don't work across serverless instances).
// The export name and the property names (key/count/lastRequest) must match
// what Better Auth expects.
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  // Epoch milliseconds, which overflows a 32-bit integer, so use bigint.
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const books = pgTable(
  "books",
    {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    // Owner of this row; every query must filter on it. Deleting a user
    // deletes their books. (Legacy rows were claimed via scripts/claim-books.ts.)
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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
  },
  (table) => [
    // Every query filters by owner, so index it.
    index("books_user_id_idx").on(table.userId),
    // A user can't add the same Open Library book twice, but different users can.
    uniqueIndex("books_user_open_library_idx").on(table.userId, table.openLibraryId),
  ]
);

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
