import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import { Card, CardLink } from "@/components/ui/Card";
import { ReadingStats } from "@/components/ui/ReadingStats";

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
      <div className="text-center text-ink-muted">
        <p className="mb-4">Your shelf is empty.</p>
        <Link href="/add" className="text-terracotta hover:underline">
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

      {/* Section: Currently reading */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Currently reading</h2>
        {currentlyReading.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing in progress right now.</p>
        ) : (
          <ul className="space-y-2">
            {currentlyReading.map((book) => (
              <li key={book.id}>
                <CardLink href={`/shelf/${book.id}`} className="flex p-3">
                  <span className="max-w-7/10 font-medium truncate">{book.title}</span>{" "}
                  <span className="text-ink-muted px-[5px] truncate">by {book.author}</span>
                </CardLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section: Finished books ("Recently finished")
      possible todo: change this/add a filter to show only books within a certain timeframe */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Recently finished</h2>
        {recentlyFinished.length === 0 ? (
          <p className="text-sm text-ink-muted">
            {statusLabels.finished} shelf is empty so far.
          </p>
        ) : (
          <ul className="space-y-2">
            {recentlyFinished.map((book) => (
              <li key={book.id}>
                <CardLink href={`/shelf/${book.id}`} className="flex p-3">
                  <span className="max-w-7/10 font-medium truncate">{book.title}</span>{" "}
                  <span className="text-ink-muted px-[5px] truncate">by {book.author}</span>
                  {book.rating ? (
                    <span className="ml-2 text-caramel">{"★".repeat(book.rating)}</span>
                  ) : null}
                </CardLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section: Reading stats summary */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Your reading stats</h2>
        <ReadingStats allBooks={total} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-sm text-ink-muted">{label}</div>
    </Card>
  );
}
