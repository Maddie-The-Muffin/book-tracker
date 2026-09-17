"use client";

import { useActionState, useState } from "react";
import { statusValues, type Book, type Status } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import { updateBook, type UpdateBookState } from "@/lib/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/fields";

const initialState: UpdateBookState = { error: null };

export function BookForm({ book }: { book: Book }) {
  const [status, setStatus] = useState<Status>(book.status);
  const canRate = status !== "want_to_read";
  const [state, formAction, isPending] = useActionState(updateBook, initialState);

  return (
    <Card className="p-4">
      <form action={formAction} onReset={(e) => e.preventDefault()} className="space-y-4">
        <input type="hidden" name="id" value={book.id} />

        {state.error && (
          <p className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
            {state.error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="status">
            Status
          </label>
          <Select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            {statusValues.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="rating">
            Rating
          </label>
          <Select id="rating" name="rating" defaultValue={book.rating ?? ""} disabled={!canRate}>
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </Select>
          {!canRate && (
            <p className="mt-1 text-xs text-ink-muted">
              Mark this book as reading or finished before rating it.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <Textarea id="notes" name="notes" defaultValue={book.notes ?? ""} rows={4} />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
