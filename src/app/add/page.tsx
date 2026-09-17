import Image from "next/image";
import Form from "next/form";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { searchOpenLibrary, errorReturn } from "@/lib/open-library";
import { addBook } from "@/lib/actions";
import { SearchButton } from "./search-button";
import { AddButton } from "./add-button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/fields";

export default async function AddBookPage(props: PageProps<"/add">) {
  const { q } = await props.searchParams;
  const query = Array.isArray(q) ? q[0] : q;

  const results = query ? await searchOpenLibrary(query) : {result: [], error: null};

  // Look up which of the search results are already on the shelf so we can
  // disable adding them again instead of letting duplicates slip through.
  const openLibraryIds = results.result.map((result) => result.openLibraryId);
  const existingIds = new Set(
    openLibraryIds.length
      ? (
          await db
            .select({ openLibraryId: books.openLibraryId })
            .from(books)
            .where(inArray(books.openLibraryId, openLibraryIds))
        ).map((row) => row.openLibraryId)
      : []
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-semibold">Add a book</h1>

      <Form action="/add" className="flex gap-2">
        <Input
          type="text"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Search by title or author..."
          className="flex-1"
        />
        <SearchButton />
      </Form>

      {/* todo: if the query returns with an error (eg connection error) display that to the user instead of "no results found"*/}

      {query && results.error === null && results.result.length === 0 &&  (
        <p className="text-sm text-ink-muted">No results for &ldquo;{query}&rdquo;.</p>
      )}


      <ul className="space-y-2">
        {results.error ? <p className="text-sm text-ink-muted">Oops! There was a problem retrieving results. Please try again (and maybe check your internet connection?)</p>
        : results.result.map((result) => (
          <li key={result.openLibraryId}>
            <Card className="flex items-center gap-3 p-3">
              {result.coverUrl ? (
                <Image
                  src={result.coverUrl}
                  alt={`Cover of ${result.title}`}
                  width={40}
                  height={60}
                  className="rounded object-cover"
                />
              ) : (
                <div className="h-[60px] w-10 flex-shrink-0 rounded bg-cream" />
              )}
              <div className="flex-1">
                <p className="font-medium">{result.title}</p>
                <p className="text-sm text-ink-muted">by {result.author}</p>
              </div>
              {existingIds.has(result.openLibraryId) ? (
                <span className="rounded-full border border-border px-3 py-1 text-sm text-ink-muted">
                  Already added
                </span>
              ) : (
                <form action={addBook}>
                  <input type="hidden" name="openLibraryId" value={result.openLibraryId} />
                  <input type="hidden" name="title" value={result.title} />
                  <input type="hidden" name="author" value={result.author} />
                  <input type="hidden" name="coverUrl" value={result.coverUrl ?? ""} />
                  <AddButton />
                </form>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
