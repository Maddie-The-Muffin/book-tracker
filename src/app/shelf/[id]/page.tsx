import Image from "next/image";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { books } from "@/db/schema";
import { deleteBook } from "@/lib/actions";
import { BookForm } from "./BookForm";

export default async function BookDetailPage(props: PageProps<"/shelf/[id]">) {
  const { id } = await props.params;

  const [book] = await db.select().from(books).where(eq(books.id, id));
  if (!book) notFound();

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
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

      <form action={deleteBook}>
        <input type="hidden" name="id" value={book.id} />
        <button type="submit" className="text-sm text-brick hover:underline">
          Remove from shelf
        </button>
      </form>
    </div>
  );
}
