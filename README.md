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
│           ├── lib/components/ui/        UI kit (ported from Intent's cloudlands-fe)
│           ├── lib/components/patterns/  Screen, settings, notify, confirm… patterns
│           ├── lib/styles/tokens.css     Design tokens (colour, type, radius, motion)
│           └── stories/                  Storybook stories
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
| UI framework   | SvelteKit 2 + Svelte 5                      |
| Styling        | Tailwind CSS v4 + design tokens             |
| UI components  | Intent UI kit (bits-ui, Phosphor icons)     |
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

## Design system

Arpli's interface uses the design tokens, UI kit and motion system ported from
[Intent](https://github.com/intent-hq/cloudlands-fe) (cloudlands-fe, Apache-2.0 — see
`NOTICE`). Intent-specific components and branding were left out.

- **Tokens** live in `apps/desktop/src/lib/styles/tokens.css` and reach Tailwind v4
  through its `@theme` block; `src/app.css` adds fonts (Inter, Source Serif 4,
  JetBrains Mono), type roles (`type-body`, `type-title` …), focus and scrollbar styles.
  Use semantic tokens (`bg-card`, `text-muted-foreground`) — never raw colours.
- **Components** live in `apps/desktop/src/lib/components/ui/` (primitives) and
  `.../patterns/` (screen states, settings, confirm, notify, action menus).
- **Motion** comes from `$lib/motion` (`fade`, `fly`, `slide`, `scale` with a
  `fast` / `moderate` / `slow` tier). Don't import from `svelte/transition` or hand-write
  durations; reduced motion is handled centrally.
- **UI strings** used by the kit come from `apps/desktop/messages/en.json`; after porting a
  component that uses new keys, run `python3 apps/desktop/scripts/generate-messages.py`.

### Storybook

```bash
npm run storybook --workspace apps/desktop        # http://localhost:6006
npm run build-storybook --workspace apps/desktop  # static build in storybook-static/
```

Stories live in `apps/desktop/src/stories/`, grouped as Foundations, Primitives, Forms,
Overlays, Layout, Patterns and Arpli. Use the toolbar to switch light/dark.

## Scripts

| Script             | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | Start the daemon and the Electron desktop shell       |
| `npm run build`    | Build all workspaces (daemon, desktop, electron main) |
| `npm run check`    | Type-check every workspace                            |
| `npm run lint`     | Run ESLint                                            |
| `npm run format`   | Run Prettier                                          |
| `npm run db:migrate` | Apply pending SQLite migrations                     |
| `npm run storybook --workspace apps/desktop` | Browse the component library |

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
