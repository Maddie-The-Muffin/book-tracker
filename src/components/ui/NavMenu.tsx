"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// Wraps the header links. On small screens the links collapse behind a
// hamburger button; from the `md` breakpoint up they sit inline as before.
// `children` are rendered by the server layout (so async server components
// like GreetingText still work inside this client component).
export function NavMenu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Remember the page the menu was opened on instead of a plain boolean: the
  // menu counts as open only while we're still on that page, so navigating
  // (clicking a link, signing out) closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenPath(isOpen ? null : pathname)}
        // Tells assistive tech whether the menu is expanded and what it controls.
        aria-expanded={isOpen}
        aria-controls="nav-links"
        aria-label="Main menu"
        // Pushed to the right of the brand; hidden once links fit inline.
        className="ml-auto inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:hidden"
      >
        {/* Icon is decorative; the button's aria-label carries the meaning. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        id="nav-links"
        // Escape closes the menu (keyboard users).
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpenPath(null);
        }}
        // Mobile: full-width column under the brand row, shown only when open.
        // md+: inline row filling the rest of the bar (children use md:ml-auto).
        className={`${isOpen ? "flex" : "hidden"} basis-full flex-col items-start pb-2 md:flex md:flex-1 md:basis-auto md:flex-row md:items-center md:gap-6 md:pb-0`}
      >
        {children}
      </div>
    </>
  );
}
