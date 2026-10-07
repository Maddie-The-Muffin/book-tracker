import type { Metadata } from "next";
import { NavLink } from "@/components/ui/NavLink";
import { Footer } from "@/components/ui/Footer";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { getUser } from "@/lib/session";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { GreetingText } from "@/components/ui/GreetingText";

// Warm serif for headings/brand text.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

// Body copy stays on a clean sans so long notes/titles remain easy to read.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Pages set their own `title`, which fills %s; the home page uses `default`.
  // Distinct titles tell screen reader users where they landed after navigating.
  title: { default: "Book Tracker", template: "%s | Book Tracker" },
  description: "A personal reading log.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Drives the nav: signed-in users get Shelf / Add / Sign out, visitors get Sign in / Sign up.
  const user = await getUser();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Skip link: invisible until focused, lets keyboard users jump past the nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-lg"
        >
          Skip to main content
        </a>
        <header className="border-b border-border bg-surface">
          <nav aria-label="Main" className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-1">
            <NavLink href="/" className="font-display text-lg font-semibold">
              {/* Emoji is decorative; hide it so it isn't read aloud. */}
              <span aria-hidden="true">📚</span> Book Tracker
            </NavLink>
            {user ? (
              <>
                <NavLink href="/shelf" className="text-sm text-ink-muted hover:text-ink">
                  Shelf
                </NavLink>
                <NavLink href="/add" className="text-sm text-ink-muted hover:text-ink">
                  Add a book
                </NavLink>
                <GreetingText />
                <NavLink href="/account" className="text-sm text-ink-muted hover:text-ink">
                  Account
                </NavLink>
                <p aria-hidden="true" className="text-sm text-ink-muted">|</p>
                <SignOutButton />
              </>
            ) : (
              <>
                <NavLink href="/sign-in" className="ml-auto text-sm text-ink-muted hover:text-ink">
                  Sign in
                </NavLink>
                <NavLink href="/sign-up" className="text-sm text-ink-muted hover:text-ink">
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </header>
        {/* id is the skip link's target; tabIndex -1 lets it receive focus programmatically. */}
        <main id="main" tabIndex={-1} className="focus:outline-none mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
