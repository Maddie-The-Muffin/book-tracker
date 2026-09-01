import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books, statusValues, type Status } from "@/db/schema";
import { statusLabels } from "@/lib/format";

function isStatus(value: string | undefined): value is Status {
  return !!value && (statusValues as readonly string[]).includes(value);
}

export default async function ShelfPage(props: PageProps<"/shelf">) {
  const { status: statusParam } = await props.searchParams;
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  const activeStatus = isStatus(status) ? status : undefined;

  const shelf = activeStatus
    ? await db.select().from(books).where(eq(books.status, activeStatus)).orderBy(desc(books.createdAt))
    : await db.select().from(books).orderBy(desc(books.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Shelf</h1>
        <Link href="/add" className="text-sm text-blue-600 hover:underline">
          + Add a book
        </Link>
      </div>

      <div className="flex gap-2 text-sm">
        <FilterTab href="/shelf" label="All" active={!activeStatus} />
        {statusValues.map((s) => (
          <FilterTab
            key={s}
            href={`/shelf?status=${s}`}
            label={statusLabels[s]}
            active={activeStatus === s}
          />
        ))}
      </div>

      {shelf.length === 0 ? (
        <p className="text-sm text-neutral-500">No books here yet.</p>
      ) : (
        <ul className="space-y-2">
          {shelf.map((book) => (
            <li key={book.id}>
              <Link
                href={`/shelf/${book.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-400"
              >
                <div>
                  <span className="font-medium">{book.title}</span>{" "}
                  <span className="text-neutral-500">by {book.author}</span>
                </div>
                <span className="text-xs text-neutral-500">{statusLabels[book.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 ${
        active ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200"
      }`}
    >
      {label}
    </Link>
  );
}
