import Image from "next/image";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { books, statusValues } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import { updateBook, deleteBook } from "@/lib/actions";

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
            className="rounded border border-neutral-200 object-cover"
          />
        ) : (
          <div className="flex h-36 w-24 items-center justify-center rounded border border-neutral-200 bg-neutral-100 text-xs text-neutral-400">
            No cover
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold">{book.title}</h1>
          <p className="text-neutral-500">by {book.author}</p>
        </div>
      </div>

      <form action={updateBook} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <input type="hidden" name="id" value={book.id} />

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={book.status}
            className="w-full rounded border border-neutral-300 p-2"
          >
            {statusValues.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            defaultValue={book.rating ?? ""}
            className="w-full rounded border border-neutral-300 p-2"
          >
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={book.notes ?? ""}
            rows={4}
            className="w-full rounded border border-neutral-300 p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Save changes
        </button>
      </form>

      <form action={deleteBook}>
        <input type="hidden" name="id" value={book.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Remove from shelf
        </button>
      </form>
    </div>
  );
}
