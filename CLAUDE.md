# Arpli · working rules for Claude

## Project state
- Design OS project. Track: custom route (T1-based, no new interviews) · Depth: deep · Build path: AI-build · AI overlay: on.
- State lives in `design/design-state.md`. Read it at the start of every session and continue from **Next action**.
- Read `design/Taste.md`, `design/DesignSystem.md` and `design/memory.md` before generating directions, prototypes, screens or copy.
- Working `.md` files are the source of truth; Figma is an output.
- Update `design/memory.md` at the end of every stage.

## The team and the loop
Saved helpers in `.claude/agents/`: `product-lead`, `product-designer`, `engineer`, `qa-reviewer`. Every piece of work goes:
1. **Product** (what and why, "done means…") → 2. **Design** (flows, layout, every state, final copy) → owner approves → **Ready to build**
3. **Engineering** (exactly the spec, with tests) → 4. **QA** (against the spec, voice, accessibility, no-gos) → owner approves → **Done**

Each feature has one spec in `design/specs/` (template: `_template.md`), one beads issue linked to one Linear issue, one branch and one pull request. Nothing is built before its spec is "Ready to build". One session per piece of work: start by reading `design/design-state.md`.

**Linear** (the owner's board): project **Arpli v1** in team **Deesigner** (issues `DEE-…`), each issue labelled with one Arpli track: Product, Experience design or Engineering. Keep its status true as work moves:
Backlog = spec being written · Todo = ready to build (owner approved) · In Progress = being built · In Review = waiting for QA or the owner (a design to approve, or a build to check) · Done = works, matches the spec, owner has seen it.
**Time:** milestones are the 6-week batches (Batch 1: How Arpli works · Batch 2: Build v1 · Batch 3: Polish and release). Cycles are weekly, Monday to Monday, shared with the team's other project (filter by project). Each Monday: propose what goes into the cycle and get the owner's yes; each week ends with a short demo and review. Work is staggered: one feature in build, the next in design, the one after being thought through.
Each beads issue stores its Linear URL as its external ref (`bd show <id>`); new work gets both. Automatic beads-to-Linear sync is not set up; update Linear through the Linear tools when a beads status changes.

## Working with the user
- The user is a designer, not an engineer. Explain technical choices by what they mean for the person using Arpli. Ask product and experience questions; make low-stakes technical calls and say so briefly.
- Experience first: v1 screens are built on the current design system and stay plain until Polish & QA.
- Commit only when the user asks (exception: beads may commit its own files). One task per change, with a plain description.

## Rules
- Never invent metrics, quotes, users, tokens or components. Missing means ask, or mark it ASSUMPTION.
- Voice rules in `docs/brand/tone-of-voice.md` apply to every user-facing string from day one.
- Plain writing: sentence case, short paragraphs.

## One Arpli folder
Everything Arpli on this Mac lives in this folder. Two subfolders are not part of this repo and are ignored by git, lint and type checks:
- `references/`: other projects, read for ideas. Read them; don't run their scripts.
- `studio/`: Design Studio, its own git repo, for exploring interaction patterns. Open it as its own workspace to work in it.
The app's data stays in `~/.arpli/` (the database), outside the code on purpose.

## Reference repos (in `references/`)
- `dossier` (AGPL-3.0): ideas only. Copying its code would make Arpli AGPL, so write our own.
- `beads` (MIT): code may be reused if its copyright notice is kept.

## Task tracking (beads)
- Build tasks live in beads (`bd`, prefix `arpli-`), not in markdown TODO lists. Product and design decisions stay in `design/*.md`.
- Run `bd prime` for workflow context. Use `bd ready`, `bd show <id>`, `bd update <id> --claim` and `bd close <id>`.
- Beads may make its own git commits of its own files (owner's permission, 2026-11-02). Everything else is still committed only when the owner asks. Don't run `bd dolt push` unless the owner asks. Beads git hooks are on (installed by the owner, 2026-11-02, in `.beads/hooks`): they sync tasks on commit, pull, checkout and push.

## Code map
- `apps/desktop`: Electron shell + SvelteKit app (routes in `src/routes`, UI kit in `src/lib/components/ui`, patterns in `.../patterns`, tokens in `src/lib/styles/tokens.css`)
- `packages/daemon`: local engine on `127.0.0.1:4848` (profile, opportunities, applications, drafting, AI providers, transcription)
- `packages/db`: SQLite schema and migrations (`~/.arpli/arpli.db`)
- `packages/shared`: types shared by the app and the engine
- Use Node 24 (pinned in `.nvmrc`): run `nvm use` first. The SQLite module was built under Node 24, so Node 22 gives a `NODE_MODULE_VERSION` error.
- Run everything: `npm run dev`. Engine tests: `npm test --workspace packages/daemon`.
