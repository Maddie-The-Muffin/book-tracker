"use client";

import { useState } from "react";
import { statusValues, type Book, type Status } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import { updateBook } from "@/lib/actions";

export function BookForm({ book }: { book: Book }) {
  const [status, setStatus] = useState<Status>(book.status);
  const canRate = status !== "want_to_read";

  return (
    <form action={updateBook} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <input type="hidden" name="id" value={book.id} />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full rounded border border-neutral-300 p-2"
        >
          {statusValues.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="rating">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          defaultValue={book.rating ?? ""}
          disabled={!canRate}
          className="w-full rounded border border-neutral-300 p-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
            </option>
          ))}
        </select>
        {!canRate && (
          <p className="mt-1 text-xs text-neutral-500">
            Mark this book as reading or finished before rating it.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={book.notes ?? ""}
          rows={4}
          className="w-full rounded border border-neutral-300 p-2"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Save changes
      </button>
    </form>
  );
}
