import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy" };

// Public page (listed in the proxy matcher exclusions), linked from the footer.
// Keep this in sync with what the app actually stores: see src/db/schema.ts,
// src/lib/auth.ts and src/lib/email.ts.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-1 text-sm text-ink-muted">Last updated: October 7, 2026</p>
      </header>

      <p>
        Book Tracker is a personal reading log. This page explains what information it keeps,
        why, and how you can remove it. The short version: we only store what the app needs to
        work, we don&apos;t use analytics or advertising, and we don&apos;t sell your data.
      </p>

      <section aria-labelledby="collect" className="space-y-2">
        <h2 id="collect" className="font-display text-xl font-semibold">
          What we collect
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Account details:</strong> your name and email address, and your password.
            Your password is stored only as a salted hash, never in plain text.
          </li>
          <li>
            <strong>Your reading data:</strong> the books you add, their status, dates, ratings,
            notes, and your reflection answers.
          </li>
          <li>
            <strong>Session information:</strong> when you sign in, we record a session along with
            your IP address and browser details (user agent) so we can keep you signed in.
          </li>
          <li>
            <strong>Rate-limit records:</strong> to prevent abuse, we keep short-lived counters of
            how many sign-in, sign-up and password-reset requests come from each IP address.
          </li>
        </ul>
      </section>

      <section aria-labelledby="cookies" className="space-y-2">
        <h2 id="cookies" className="font-display text-xl font-semibold">
          Cookies and analytics
        </h2>
        <p>
          We use a single session cookie that keeps you signed in. It is required for the app to
          work. We do not use analytics, advertising, or tracking cookies of any kind.
        </p>
      </section>

      <section aria-labelledby="use" className="space-y-2">
        <h2 id="use" className="font-display text-xl font-semibold">
          How we use it
        </h2>
        <p>
          Your information is used only to run the app: signing you in, showing your shelf,
          sending password-reset emails you ask for, and protecting the site from abuse. Your
          shelf is private and only visible to you.
        </p>
      </section>

      <section aria-labelledby="services" className="space-y-2">
        <h2 id="services" className="font-display text-xl font-semibold">
          Services that handle your data
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Neon</strong> hosts the database that stores the information above.
          </li>
          <li>
            <strong>Vercel</strong> hosts the website.
          </li>
          <li>
            <strong>Resend</strong> delivers password-reset emails, so it receives your email
            address when you request one.
          </li>
          <li>
            <strong>Open Library</strong> powers book search. The search terms you type on the Add
            page are sent to Open Library, without your name or email.
          </li>
        </ul>
        <p>
          If you use the share button, the text you share is passed to the app or site you choose
          (for example X or Facebook), under their own privacy policies.
        </p>
      </section>

      <section aria-labelledby="control" className="space-y-2">
        <h2 id="control" className="font-display text-xl font-semibold">
          Your choices
        </h2>
        <p>
          You can edit or remove any book from your shelf at any time. You can also delete your
          whole account from the{" "}
          <Link href="/account" className="underline">
            Account page
          </Link>
          . Deleting your account permanently removes your profile, sign-in details, books, notes
          and reflections from our database. Copies may remain in database backups for a limited
          time before they are overwritten.
        </p>
      </section>

      <section aria-labelledby="changes" className="space-y-2">
        <h2 id="changes" className="font-display text-xl font-semibold">
          Changes and contact
        </h2>
        <p>
          If this policy changes, the date at the top will be updated. Questions or requests about
          your data can be sent through the contact details on the{" "}
          <a
            href="https://www.maddietavares.dev/"
            target="_blank"
            referrerPolicy="no-referrer"
            className="underline"
          >
            developer&apos;s website<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </section>
    </article>
  );
}
