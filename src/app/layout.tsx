import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Book Tracker",
  description: "A personal reading log.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <header className="border-b border-border bg-surface">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-4">
            <Link href="/" className="font-display text-lg font-semibold">
              📚 Book Tracker
            </Link>
            <Link href="/shelf" className="text-sm text-ink-muted hover:text-ink">
              Shelf
            </Link>
            <Link href="/add" className="text-sm text-ink-muted hover:text-ink">
              Add a book
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
