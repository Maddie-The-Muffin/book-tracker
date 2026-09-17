export default function Loading() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-semibold">Add a book</h1>

      <div className="flex gap-2">
        <div className="h-10 flex-1 rounded-lg border border-border bg-surface" />
        <div className="h-10 w-20 rounded-full bg-border" />
      </div>

      <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-terracotta" />
        Searching Open Library...
      </div>
    </div>
  );
}
