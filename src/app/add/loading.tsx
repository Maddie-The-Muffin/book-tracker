export default function Loading() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Add a book</h1>

      <div className="flex gap-2">
        <div className="h-10 flex-1 rounded border border-neutral-300 bg-neutral-100" />
        <div className="h-10 w-20 rounded bg-neutral-200" />
      </div>

      <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
        Searching Open Library...
      </div>
    </div>
  );
}
