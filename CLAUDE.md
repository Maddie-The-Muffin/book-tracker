# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run lint         # eslint

npm run db:generate  # generate SQL migration from src/db/schema.ts into drizzle/
npm run db:migrate   # apply migration files in drizzle/ to DATABASE_URL
npm run db:push      # push schema.ts directly to the DB without a migration file (fast dev iteration)
npm run db:studio    # open Drizzle Studio against DATABASE_URL
```

There is no test suite configured. Requires `DATABASE_URL` in `.env.local` (copy from `.env.example`) — a Neon Postgres connection string.

## Architecture

Next.js App Router (v16) + React 19 + TypeScript + Tailwind v4, backed by Neon Postgres via Drizzle ORM. There is no API layer: pages are async Server Components that query the DB directly, and all writes go through the Server Actions in `src/lib/actions.ts` (`addBook`, `updateBook`, `deleteBook`), wired to `<form action={...}>` in the page components.

- `src/db/schema.ts` — single source of truth for the DB shape. Currently one table, `books`, with a `status` enum (`want_to_read` | `reading` | `finished`) that drives the filter tabs on `/shelf` and the stat counts on `/`. After editing this file, run `db:generate` (+ `db:migrate`) or `db:push` to sync the DB.
- `src/db/index.ts` — Drizzle client (`neon-http` driver), imported as `db` anywhere server-side code needs it.
- `src/lib/open-library.ts` — thin wrapper around the public Open Library search API, used only by `/add` to look up books before they're inserted (`openLibraryId`/`title`/`author`/`coverUrl` from search results are passed as hidden form fields into `addBook`). Cover images are served from `covers.openlibrary.org`, allow-listed in `next.config.ts`.
- `src/lib/format.ts` — shared display mappings (e.g. `statusLabels`) kept next to the schema types they format.
- Route params/search params are typed with the generated `PageProps<"/route">` / `LayoutProps<"/">` helpers (see e.g. `src/app/shelf/[id]/page.tsx`, `src/app/shelf/page.tsx`) rather than hand-written prop types — both `params` and `searchParams` are async and must be awaited.
- Path alias `@/*` resolves to `src/*` (see `tsconfig.json`).
