"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { books, statusValues } from "@/db/schema";

export async function addBook(formData: FormData) {
  const openLibraryId = formData.get("openLibraryId") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const coverUrl = formData.get("coverUrl") as string | null;

  if (!openLibraryId || !title || !author) {
    throw new Error("Missing required book fields");
  }

  const [book] = await db
    .insert(books)
    .values({ openLibraryId, title, author, coverUrl: coverUrl || null })
    .returning({ id: books.id });

  revalidatePath("/shelf");
  redirect(`/shelf/${book.id}`);
}

export async function updateBook(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const ratingRaw = formData.get("rating") as string;
  const notes = formData.get("notes") as string;

  if (!id) throw new Error("Missing book id");
  if (!statusValues.includes(status as (typeof statusValues)[number])) {
    throw new Error("Invalid status");
  }

  const rating = status === "want_to_read" ? null : ratingRaw ? Number(ratingRaw) : null;

  await db
    .update(books)
    .set({
      status: status as (typeof statusValues)[number],
      rating,
      notes: notes || null,
      finishedAt: status === "finished" ? new Date() : null,
    })
    .where(eq(books.id, id));

  revalidatePath("/shelf");
  revalidatePath(`/shelf/${id}`);
  redirect("/shelf?updated=1");
}

export async function deleteBook(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing book id");

  await db.delete(books).where(eq(books.id, id));

  revalidatePath("/shelf");
  redirect("/shelf");
}
