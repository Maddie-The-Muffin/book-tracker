import type { Metadata } from "next";
import Image from "next/image";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { books, bookReflections } from "@/db/schema";
import { deleteBook } from "@/lib/actions";
import { BookForm } from "./BookForm";
import { Reflection } from "./Reflection";
import { ShareCard } from "./ShareCard";
import { requireUser } from "@/lib/session";

// Use the book's own title so each detail page is distinguishable.
export async function generateMetadata(props: PageProps<"/shelf/[id]">): Promise<Metadata> {
  const user = await requireUser();
  const { id } = await props.params;
  const [book] = await db
    .select({ title: books.title })
    .from(books)
    .where(and(eq(books.id, id), eq(books.userId, user.id)));
  // notFound() in the page handles missing books; just fall back here.
  return { title: book?.title ?? "Book not found" };
}

export default async function BookDetailPage(props: PageProps<"/shelf/[id]">) {
  const user = await requireUser();
  const { id } = await props.params;

  // Scoped to the owner: another user's id looks exactly like a missing book.
  const [book] = await db
    .select()
    .from(books)
    .where(and(eq(books.id, id), eq(books.userId, user.id)));
  if (!book) notFound();

  const [reflection] = await db
    .select()
    .from(bookReflections)
    .where(eq(bookReflections.bookId, id));

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            // Decorative: the title is the h1 right beside it.
            alt=""
            width={96}
            height={144}
            className="rounded-lg border border-border object-cover shadow-warm"
          />
        ) : (
          <div className="flex h-36 w-24 items-center justify-center rounded-lg border border-border bg-cream text-xs text-ink-muted">
            No cover
          </div>
        )}
        <div>
          <h1 className="font-display text-xl font-semibold">{book.title}</h1>
          <p className="text-ink-muted">by {book.author}</p>
        </div>
      </div>

      <BookForm book={book} />

      {book.status === "finished" && (
        <Reflection bookId={book.id} reflection={reflection ?? null} />
      )}

      {/* Sits alongside (not instead of) the reflection card once the book is finished. */}
      {book.status === "finished" && (
        <ShareCard title={book.title} author={book.author} rating={book.rating} />
      )}

      <form action={deleteBook}>
        <input type="hidden" name="id" value={book.id} />
        <button type="submit" className="min-h-11 text-sm text-brick hover:underline">
          Remove from shelf
        </button>
      </form>
    </div>
  );
}
