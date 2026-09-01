CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"open_library_id" text NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"cover_url" text,
	"status" text DEFAULT 'want_to_read' NOT NULL,
	"rating" integer,
	"notes" text,
	"started_at" timestamp,
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
