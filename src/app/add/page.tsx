import Image from "next/image";
import { searchOpenLibrary } from "@/lib/open-library";
import { addBook } from "@/lib/actions";

export default async function AddBookPage(props: PageProps<"/add">) {
  const { q } = await props.searchParams;
  const query = Array.isArray(q) ? q[0] : q;

  const results = query ? await searchOpenLibrary(query) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Add a book</h1>

      <form action="/add" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Search by title or author..."
          className="flex-1 rounded border border-neutral-300 p-2"
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Search
        </button>
      </form>

      {query && results.length === 0 && (
        <p className="text-sm text-neutral-500">No results for &ldquo;{query}&rdquo;.</p>
      )}

      <ul className="space-y-2">
        {results.map((result) => (
          <li
            key={result.openLibraryId}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3"
          >
            {result.coverUrl ? (
              <Image
                src={result.coverUrl}
                alt={`Cover of ${result.title}`}
                width={40}
                height={60}
                className="rounded object-cover"
              />
            ) : (
              <div className="h-[60px] w-10 flex-shrink-0 rounded bg-neutral-100" />
            )}
            <div className="flex-1">
              <p className="font-medium">{result.title}</p>
              <p className="text-sm text-neutral-500">by {result.author}</p>
            </div>
            <form action={addBook}>
              <input type="hidden" name="openLibraryId" value={result.openLibraryId} />
              <input type="hidden" name="title" value={result.title} />
              <input type="hidden" name="author" value={result.author} />
              <input type="hidden" name="coverUrl" value={result.coverUrl ?? ""} />
              <button
                type="submit"
                className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
              >
                Add
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
