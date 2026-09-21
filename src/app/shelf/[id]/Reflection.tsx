"use client";

import { useActionState, useState } from "react";
import type { BookReflection } from "@/db/schema";
import { saveReflection, skipReflection, type SaveReflectionState } from "@/lib/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/fields";

const initialState: SaveReflectionState = { error: null };

export function Reflection({
  bookId,
  reflection,
}: {
  bookId: string;
  reflection: BookReflection | null;
}) {
  const [state, formAction, isPending] = useActionState(saveReflection, initialState);
  // Lets a skipped-with-no-answers row show the form again without a reload.
  const [reopened, setReopened] = useState(false);

  const hasAnswers =
    !!reflection?.favoritePart ||
    !!reflection?.leastFavoritePart ||
    typeof reflection?.wouldRecommend === "boolean";
  const isCollapsedSkip = !!reflection?.skipped && !hasAnswers && !reopened;

  if (isCollapsedSkip) {
    return (
      <Card className="flex items-center justify-between p-4">
        <p className="text-sm text-ink-muted">You skipped the reflection for this book.</p>
        <button
          type="button"
          className="text-sm text-terracotta hover:underline"
          onClick={() => setReopened(true)}
        >
          Add a reflection
        </button>
      </Card>
    );
  }

  const wouldRecommendDefault =
    reflection?.wouldRecommend === null || reflection?.wouldRecommend === undefined
      ? ""
      : String(reflection.wouldRecommend);

  return (
    <Card className="space-y-4 p-4">
      <h2 className="font-display text-lg font-semibold">Reflection</h2>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="bookId" value={bookId} />

        {state.error && (
          <p className="rounded-lg border border-brick/30 bg-brick-tint p-2 text-sm text-brick">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="rounded-lg border border-sage/30 bg-sage-tint p-2 text-sm text-sage-dark">
            Reflection saved.
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="favoritePart">
            Favorite part
          </label>
          <Textarea
            id="favoritePart"
            name="favoritePart"
            defaultValue={reflection?.favoritePart ?? ""}
            rows={3}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="leastFavoritePart">
            Least favorite part
          </label>
          <Textarea
            id="leastFavoritePart"
            name="leastFavoritePart"
            defaultValue={reflection?.leastFavoritePart ?? ""}
            rows={3}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="wouldRecommend">
            Would you recommend it?
          </label>
          <Select id="wouldRecommend" name="wouldRecommend" defaultValue={wouldRecommendDefault}>
            <option value="">No answer</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save reflection"}
        </Button>
      </form>

      {!hasAnswers && (
        <form action={skipReflection}>
          <input type="hidden" name="bookId" value={bookId} />
          <Button type="submit" variant="secondary">
            Skip for now
          </Button>
        </form>
      )}
    </Card>
  );
}
