import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books, statusValues, type Status } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import { UpdateSuccessDialog } from "./UpdateSuccessDialog";
import { FinishedPrompt } from "./FinishedPrompt";
import { CardLink } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { FilterTab } from "@/components/ui/FilterTab";
import { clearShelf } from "@/lib/actions";

function isStatus(value: string | undefined): value is Status {
  // !!value is equivalent to value !== undefined and rules out empty strings as well
  return !!value && (statusValues as readonly string[]).includes(value);
}

export default async function ShelfPage(props: PageProps<"/shelf">) {
  const { status: statusParam, updated, justFinished } = await props.searchParams;
  console.log("params: " + statusParam);
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  const activeStatus = isStatus(status) ? status : undefined;
  const justUpdated = (Array.isArray(updated) ? updated[0] : updated) === "1";
  // Present only right after a book transitions to "finished" (see updateBook).
  const justFinishedId = Array.isArray(justFinished) ? justFinished[0] : justFinished;

  const shelf = activeStatus
    ? await db.select().from(books).where(eq(books.status, activeStatus)).orderBy(desc(books.createdAt))
    : await db.select().from(books).orderBy(desc(books.createdAt));

  return (
    <div className="space-y-6">
      {/* The modal already communicates success, so it replaces the plain toast rather than stacking with it. */}
      {justFinishedId ? <FinishedPrompt bookId={justFinishedId} /> : justUpdated && <UpdateSuccessDialog />}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Shelf</h1>
        <Link href="/add" className="text-sm text-terracotta hover:underline">
          + Add a book
        </Link>
        <form action={clearShelf}>
          <button type="submit" className="text-sm text-brick hover:underline cursor-pointer">
            Clear shelf
          </button>
        </form>
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
        <p className="text-sm text-ink-muted">No books here yet.</p>
      ) : (
        <ul className="space-y-2">
          {shelf.map((book) => (
            <li key={book.id}>
              <CardLink href={`/shelf/${book.id}`} className="flex items-center justify-between p-3">
                <div className="flex max-w-9/10">
                  <span className="max-w-7/10 font-medium truncate">{book.title}</span>{" "}
                  <span className="text-ink-muted px-[5px] truncate">by {book.author}</span>
                </div>
                <StatusPill status={book.status} />
              </CardLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
