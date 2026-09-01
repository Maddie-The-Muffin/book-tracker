import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { statusLabels } from "@/lib/format";

export default async function Home() {
  const [currentlyReading, recentlyFinished, total] = await Promise.all([
    db.select().from(books).where(eq(books.status, "reading")).orderBy(desc(books.createdAt)),
    db
      .select()
      .from(books)
      .where(eq(books.status, "finished"))
      .orderBy(desc(books.finishedAt))
      .limit(5),
    db.select().from(books),
  ]);

  if (total.length === 0) {
    return (
      <div className="text-center text-neutral-500">
        <p className="mb-4">Your shelf is empty.</p>
        <Link href="/add" className="text-blue-600 hover:underline">
          Add your first book
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-3 gap-4 text-center">
        <Stat label="Total books" value={total.length} />
        <Stat label="Reading" value={currentlyReading.length} />
        <Stat
          label="Finished"
          value={total.filter((b) => b.status === "finished").length}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Currently reading</h2>
        {currentlyReading.length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing in progress right now.</p>
        ) : (
          <ul className="space-y-2">
            {currentlyReading.map((book) => (
              <li key={book.id}>
                <Link
                  href={`/shelf/${book.id}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-400"
                >
                  <span className="font-medium">{book.title}</span>{" "}
                  <span className="text-neutral-500">by {book.author}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recently finished</h2>
        {recentlyFinished.length === 0 ? (
          <p className="text-sm text-neutral-500">
            {statusLabels.finished} shelf is empty so far.
          </p>
        ) : (
          <ul className="space-y-2">
            {recentlyFinished.map((book) => (
              <li key={book.id}>
                <Link
                  href={`/shelf/${book.id}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-400"
                >
                  <span className="font-medium">{book.title}</span>{" "}
                  <span className="text-neutral-500">by {book.author}</span>
                  {book.rating ? (
                    <span className="ml-2 text-amber-500">{"★".repeat(book.rating)}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-neutral-500">{label}</div>
    </div>
  );
}
