export type OpenLibrarySearchResult = {
  result: OpenLibrarySearchItem[];
  error: Error | null;
};

export type OpenLibrarySearchItem = {
  openLibraryId: string;
  title: string;
  author: string;
  coverUrl: string | null;
}

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
};

export const errorReturn : OpenLibrarySearchResult = { result: [], error: new Error() };

export async function searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult> {
  if (!query.trim()) return errorReturn;

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "10");
  url.searchParams.set("fields", "key,title,author_name,cover_i");

  const headers = new Headers({
    "User-Agent": "BookTracker/0.1a (maddie.law19@gmail.com)"
  });
  const options = {
    method: 'GET',
    headers: headers,
    next: {revalidate: 0}
  };

  console.log("url: " + url);

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
    console.log("Womp womp womp woooomp");
    throw new Error(`Open Library search failed: ${res.status}`);
  }

  const data = (await res.json()) as { docs: OpenLibraryDoc[] };

  const results = data.docs.map((doc) => ({
    openLibraryId: doc.key.replace("/works/", ""),
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown author",
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));

  return {result: results, error: null}
  }
  catch (e: any) {
    console.log("NO");
    return {result: [], error: new Error("Oops!")};
  }
  
}
