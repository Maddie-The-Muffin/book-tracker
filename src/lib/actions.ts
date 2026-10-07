"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { books, bookReflections, statusValues } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { LIMITS, parseRating, safeCoverUrl, withinLimit } from "@/lib/limits";

// Throws unless the book exists AND belongs to this user. Used before touching
// book_reflections, which has no owner column of its own (it's reached only
// through its book). Server Actions are public endpoints, so a forged bookId
// must never reach another user's data.
async function assertOwnsBook(bookId: string, userId: string) {
  const [owned] = await db
    .select({ id: books.id })
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, userId)))
    .limit(1);
  if (!owned) throw new Error("Book not found");
}

export async function addBook(formData: FormData) {
  const user = await requireUser();
  const openLibraryId = formData.get("openLibraryId") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const coverUrl = formData.get("coverUrl") as string | null;

  if (!openLibraryId || !title || !author) {
    throw new Error("Missing required book fields");
  }
  // These come from hidden form fields, so a caller can forge them: cap sizes.
  if (
    openLibraryId.length > LIMITS.openLibraryId ||
    !withinLimit(title, LIMITS.title) ||
    !withinLimit(author, LIMITS.author)
  ) {
    throw new Error("Book fields too long");
  }

  // Guard against duplicates: if this book is already on THIS USER's shelf
  // (e.g. from a repeat click that slipped past the disabled button), send
  // them to the existing entry instead of inserting a second copy.
  const [existing] = await db
    .select({ id: books.id })
    .from(books)
    .where(and(eq(books.userId, user.id), eq(books.openLibraryId, openLibraryId)))
    .limit(1);

  if (existing) {
    redirect(`/shelf/${existing.id}`);
  }

  const [book] = await db
    .insert(books)
    .values({ userId: user.id, openLibraryId, title, author, coverUrl: safeCoverUrl(coverUrl) })
    .returning({ id: books.id });

  revalidatePath("/shelf");
  redirect(`/shelf/${book.id}`);
}

export type UpdateBookState = {
  error: string | null;
};

export async function updateBook(
  _prevState: UpdateBookState,
  formData: FormData
): Promise<UpdateBookState> {
  const user = await requireUser();
  // Reused in every update below so a forged id can only match the caller's own book.
  const owned = (id: string) => and(eq(books.id, id), eq(books.userId, user.id));
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const ratingRaw = formData.get("rating") as string;
  const notes = formData.get("notes") as string;

  if (!id) throw new Error("Missing book id");
  if (!statusValues.includes(status as (typeof statusValues)[number])) {
    throw new Error("Invalid status");
  }

  // Reject anything but 1-5 (or empty); "want to read" books never have a rating.
  const parsedRating = parseRating(ratingRaw ?? "");
  if (parsedRating === undefined) throw new Error("Invalid rating");
  const rating = status === "want_to_read" ? null : parsedRating;
  if (!withinLimit(notes ?? "", LIMITS.notes)) throw new Error("Notes too long");
  const currentDate : Date = new Date();
  // Set inside the try block below if this update is the one transitioning
  // the book into "finished" for the first time.
  let justFinished = false;

  try {
    await db
      .update(books)
      .set({
        status: status as (typeof statusValues)[number],
        rating,
        notes: notes || null,
      })
      .where(owned(id));

      // update book's started date the first time it has been started only
      if (status === "reading") {
        await db.update(books).set({
          startedAt: currentDate
        }).where(and(owned(id), isNull(books.startedAt)))
      }

      // Update book's finished date the first time it has been finished only.
      // `.returning()` tells us whether THIS call is the one that made the
      // transition (row affected) vs. re-saving an already-finished book
      // (isNull guard excludes it, so no row comes back) — used below to
      // decide whether to prompt for a reflection.
      if (status === "finished") {
        const [row] = await db
          .update(books)
          .set({ finishedAt: currentDate })
          .where(and(owned(id), isNull(books.finishedAt)))
          .returning({ id: books.id });
        justFinished = !!row;
      }
  } catch {
    return {
      error: "Oops! We couldn't save your changes. Please check your connection and try again.",
    };
  }

  revalidatePath("/shelf");
  revalidatePath(`/shelf/${id}`);
  // Only prompt for a reflection on the transition into "finished", not on
  // every subsequent edit of an already-finished book.
  redirect(justFinished ? `/shelf?updated=1&justFinished=${id}` : "/shelf?updated=1");
}

export type SaveReflectionState = {
  error: string | null;
  success?: boolean;
};

// Saves post-finish reflection answers. Kept separate from updateBook so the
// reflection form can be submitted independently of the main edit form.
export async function saveReflection(
  _prevState: SaveReflectionState,
  formData: FormData
): Promise<SaveReflectionState> {
  const user = await requireUser();
  const bookId = formData.get("bookId") as string;
  if (!bookId) throw new Error("Missing book id");
  await assertOwnsBook(bookId, user.id);

  const favoritePart = formData.get("favoritePart") as string;
  const leastFavoritePart = formData.get("leastFavoritePart") as string;
  const wouldRecommendRaw = formData.get("wouldRecommend") as string;
  // HTML form values are always strings; "" means "no answer" (null).
  const wouldRecommend = wouldRecommendRaw === "" ? null : wouldRecommendRaw === "true";
  if (
    !withinLimit(favoritePart ?? "", LIMITS.reflection) ||
    !withinLimit(leastFavoritePart ?? "", LIMITS.reflection)
  ) {
    throw new Error("Reflection too long");
  }

  try {
    await db
      .insert(bookReflections)
      .values({
        bookId,
        favoritePart: favoritePart || null,
        leastFavoritePart: leastFavoritePart || null,
        wouldRecommend,
        skipped: false, // saving real answers un-skips a previously-skipped row
      })
      .onConflictDoUpdate({
        target: bookReflections.bookId,
        set: {
          favoritePart: favoritePart || null,
          leastFavoritePart: leastFavoritePart || null,
          wouldRecommend,
          skipped: false,
        },
      });
  } catch {
    return { error: "Oops! We couldn't save your reflection. Please try again." };
  }

  // Reflection only shows on the book detail page, so no /shelf list revalidation is needed.
  revalidatePath(`/shelf/${bookId}`);
  redirect("/shelf?updated=1");
}

// Marks the reflection as declined without requiring any answers. A plain
// action (no pending/error UI needed) like deleteBook, rather than the
// useActionState shape saveReflection uses.
export async function skipReflection(formData: FormData) {
  const user = await requireUser();
  const bookId = formData.get("bookId") as string;
  if (!bookId) throw new Error("Missing book id");
  await assertOwnsBook(bookId, user.id);

  await db
    .insert(bookReflections)
    .values({ bookId, skipped: true })
    .onConflictDoUpdate({ target: bookReflections.bookId, set: { skipped: true } });

  revalidatePath(`/shelf/${bookId}`);
}

export async function deleteBook(formData: FormData) {
  const user = await requireUser();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing book id");

  await db.delete(books).where(and(eq(books.id, id), eq(books.userId, user.id)));

  revalidatePath("/shelf");
  redirect("/shelf");
}

export async function clearShelf() {
  const user = await requireUser();
  // Scoped to the caller: an unfiltered delete here would wipe every user's shelf.
  await db.delete(books).where(eq(books.userId, user.id));

  revalidatePath("/shelf");
  redirect("/shelf");
}
