export type OpenLibrarySearchResult = {
  openLibraryId: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
};

export async function searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult[]> {
  if (!query.trim()) return [];

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "10");
  url.searchParams.set("fields", "key,title,author_name,cover_i");

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Open Library search failed: ${res.status}`);
  }

  const data = (await res.json()) as { docs: OpenLibraryDoc[] };

  return data.docs.map((doc) => ({
    openLibraryId: doc.key.replace("/works/", ""),
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown author",
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));
}
