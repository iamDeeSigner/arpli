# Arpli

**Local-first application intelligence hub.**

Arpli is a desktop application (macOS + Windows) that gives you a permanent, growing
personal knowledge base and end-to-end AI-powered support for applying to opportunities —
scholarships, grants, fellowships, accelerators, jobs — from discovery through submission
and outcome tracking. You bring your own AI model: run Ollama locally, use Groq's free
tier, or connect an existing Claude / OpenAI / Gemini subscription.

Everything lives on your machine. There is no cloud sync.

## Quick start

Requires Node.js 20+ and npm 10+.

```bash
git clone https://github.com/iamDeeSigner/arpli.git
cd arpli
npm install
npm run dev
```

`npm run dev` starts the local daemon (`http://127.0.0.1:4848`) and launches the Electron
desktop shell. The SQLite database is created on first run at `~/.arpli/arpli.db` and
migrations run automatically.

## Monorepo structure

```
arpli/
├── apps/
│   └── desktop/              Electron + SvelteKit shell
│       ├── electron/         Electron main + preload
│       └── src/              SvelteKit app (routes + lib)
│           └── lib/components/ui/   Replaceable UI primitives (design-token-driven)
└── packages/
    ├── daemon/               Node.js local HTTP daemon (Fastify)
    ├── db/                   SQLite schema + drizzle-orm migrations
    └── shared/               TypeScript types shared by desktop and daemon
```

The repo uses **npm workspaces**. Each package is a workspace; `npm install` at the root
installs everything and links the local packages together.

## Tech stack

| Layer          | Choice                                      |
| -------------- | ------------------------------------------- |
| Desktop shell  | Electron 32                                 |
| UI framework   | SvelteKit 2 + Svelte 4                      |
| Styling        | Tailwind CSS + CSS custom properties        |
| UI components  | shadcn/ui-style scaffold (replaceable)      |
| Daemon         | Node.js 20 + Fastify                        |
| Storage        | SQLite via `better-sqlite3`                 |
| ORM / migrate  | drizzle-orm + drizzle-kit                   |
| Language       | TypeScript end-to-end                       |
| Lint / format  | ESLint + Prettier                           |

### AI connector architecture (Bring Your Own Model)

Arpli's AI layer is tiered so the product is free for anyone to use:

- **Tier 1 — local**: Ollama (Llama, Mistral, Qwen, Gemma on your machine)
- **Tier 2 — free cloud**: Groq free tier, Google AI Studio free tier
- **Tier 3 — paid subscription**: Claude, OpenAI, Gemini

All features in the desktop app call a single internal API; the daemon routes requests to
whichever provider the user has configured.

## Design philosophy — Phase 1

The user of this codebase is a product designer who will replace the visual layer after
Phase 1 ships. Phase 1 is a functional scaffold:

- All colors, spacing, and typography are **CSS custom properties** (`src/app.css`).
  Nothing in Tailwind config or components hardcodes a value.
- UI components live in `apps/desktop/src/lib/components/ui/` — isolated and
  replaceable.
- No custom illustrations, animations, or visual polish.

## Scripts

| Script             | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | Start the daemon and the Electron desktop shell       |
| `npm run build`    | Build all workspaces (daemon, desktop, electron main) |
| `npm run check`    | Type-check every workspace                            |
| `npm run lint`     | Run ESLint                                            |
| `npm run format`   | Run Prettier                                          |
| `npm run db:migrate` | Apply pending SQLite migrations                     |

## Development notes

- The database file lives at `~/.arpli/arpli.db` by default. Override with
  `ARPLI_DB_PATH`.
- The daemon listens on `127.0.0.1:4848` by default. Override with
  `ARPLI_DAEMON_PORT` / `ARPLI_DAEMON_HOST`.
- Electron reads the dev URL from `ARPLI_DEV_URL` (defaults to
  `http://localhost:5173`).

## Status

Phase 1 — Foundation. See the project tasks in `/apps/desktop`, `/packages/daemon`, and
`/packages/db` for the current state of each layer.
