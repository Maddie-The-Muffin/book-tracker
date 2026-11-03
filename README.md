# Book Tracker

Never forget a read again! A personal reading log where you search for books, sort them onto a shelf, rate them, and jot down what you thought.

**Live demo: [a-book-tracker.vercel.app](https://a-book-tracker.vercel.app)**

Built as a portfolio project using Next.js, Drizzle, Neon, and Claude Code.

## Features

- **Book search** powered by the [Open Library](https://openlibrary.org/developers/api) API, with cover art
- **Shelf with status tabs**: "want to read," "reading," and "finished"
- **Ratings** for in-progress and finished books
- **Notes**: love a plot twist? Really hate a character? Write it down
- **Reflection questions** when you finish a book (favorite part, least favorite part, would you recommend it) to encourage deeper thinking. Completely skippable
- **Reading stats** on the home page, including reading pace based on start and finish dates
- **Share on finish** via X, Facebook, or your device's native share sheet
- **Accounts**: email and password sign-up, password reset by email, and account deletion. Each user only ever sees their own shelf
- **Accessible and responsive**: works on small screens, with ARIA labels and reduced-motion support

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Server Components, Server Actions) and React 19
- TypeScript and Tailwind CSS v4
- [Neon](https://neon.tech/) Postgres with [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/) for authentication
- Nodemailer (Gmail SMTP) for password-reset emails

## Getting started

### Prerequisites

- Node.js 20+
- A free [Neon](https://neon.tech/) Postgres database

### Setup

```bash
git clone <your-fork-or-repo-url>
cd book-tracker
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Public base URL of the app (`http://localhost:3000` in dev) |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Optional. Used to send password-reset emails. Without them, reset links are logged to the server console |

Then create the database tables and start the dev server:

```bash
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate a SQL migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
| `npm run db:push` | Push the schema straight to the DB (fast dev iteration) |
| `npm run db:studio` | Open Drizzle Studio |

## How it works

There is no separate API layer. Pages are async Server Components that query the database directly, and all writes go through Server Actions in `src/lib/actions.ts`.

- **Auth and data isolation:** every page and Server Action calls `requireUser()` and scopes queries to the signed-in user's ID.- **Schema:** `src/db/schema.ts` is the single source of truth for the database.
- **Book lookup:** `src/lib/open-library.ts` wraps the Open Library search API.
- **Abuse protection:** input length limits, a cover-URL allow-list, and database-backed sign-up rate limiting.

```
src/
├── app/          # Routes: home, shelf, add, account, auth pages
├── components/   # Shared UI components
├── db/           # Drizzle schema and client
└── lib/          # Server Actions, auth, Open Library client
```

## Deployment

The app deploys well to [Vercel](https://vercel.com/) with a Neon database. Set the same environment variables in your project settings, and set `BETTER_AUTH_URL` to your deployed URL.

## License

Released under the [MIT License](LICENSE).

## Acknowledgements

Book data and covers from [Open Library](https://openlibrary.org/).
