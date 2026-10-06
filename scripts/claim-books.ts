// One-off migration helper: assigns every book that has no owner (user_id IS NULL)
// to the account with the given email. Run once after signing up through the UI:
//
//   npx tsx scripts/claim-books.ts you@example.com
//
// Afterwards, make books.user_id NOT NULL in src/db/schema.ts and run
// `npm run db:generate && npm run db:migrate`.
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, isNull } from "drizzle-orm";
import { books, user } from "../src/db/schema";

config({ path: ".env.local" });

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Usage: npx tsx scripts/claim-books.ts <email>");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

  const db = drizzle(process.env.DATABASE_URL);

  // Find the account that should own the legacy rows.
  const [owner] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (!owner) throw new Error(`No user with email ${email}. Sign up first.`);

  // Only touch unowned rows so re-running is harmless.
  const claimed = await db
    .update(books)
    .set({ userId: owner.id })
    .where(isNull(books.userId))
    .returning({ id: books.id });

  console.log(`Assigned ${claimed.length} book(s) to ${email}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
