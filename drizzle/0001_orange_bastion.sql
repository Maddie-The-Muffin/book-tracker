CREATE TABLE "book_reflections" (
	"book_id" text PRIMARY KEY NOT NULL,
	"favorite_part" text,
	"least_favorite_part" text,
	"would_recommend" boolean,
	"skipped" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_reflections" ADD CONSTRAINT "book_reflections_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;