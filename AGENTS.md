# Arpli · working rules for AI agents (Cursor, Claude, others)

- Design OS project. Track: custom route (T1-based, no new interviews) · Depth: deep · Build path: AI-build · AI overlay: on.
- State lives in `design/design-state.md`; continue from **Next action**.
- Read `design/Taste.md`, `design/DesignSystem.md` and `design/memory.md` before generating anything.
- Working `.md` files are the source of truth; Figma is an output.
- Every piece of work: product (what, why, "done means…") → design (flows, layout, states, final copy) → owner approves → build with tests → QA against the spec → owner approves. One spec in `design/specs/` (template `_template.md`), one branch, one pull request. Nothing is built before its spec is "Ready to build". Role briefs: `.claude/agents/`.
- Experience first: build on the current design system (`apps/desktop/src/lib/components/ui`, `tokens.css`); keep screens plain until Polish & QA.
- Use semantic tokens only; motion from `$lib/motion`; confirmations through the confirm pattern, never browser pop-ups.
- Voice rules in `docs/brand/tone-of-voice.md` apply to every user-facing string.
- Never invent metrics, quotes, users, tokens or components. Missing means ask, or mark it ASSUMPTION.
- Update `design/memory.md` at the end of every stage.
- Plain writing: sentence case, short paragraphs.
- Everything Arpli lives in this folder. `references/` (other projects, read for ideas) and `studio/` (Design Studio, its own git repo) are ignored by git, lint and type checks. `references/dossier` is AGPL-3.0: ideas only, no copied code. `references/beads` is MIT: reuse allowed with its notice.
- Code map and commands: see `CLAUDE.md`.

## Owner's board (Linear)
- Project **Arpli v1**, team **Deesigner** (issues `DEE-…`), one Arpli track label per issue: Product, Experience design or Engineering.
- Status: Backlog = spec being written · Todo = ready to build · In Progress = being built · In Review = QA or owner review · Done = works, matches the spec, owner has seen it. Keep it true.
- Each beads issue stores its Linear URL as its external ref; new work gets both.

## Task tracking (beads)
- Build tasks live in beads (`bd`, prefix `arpli-`), not in markdown TODO lists. Product and design decisions stay in `design/*.md`.
- Run `bd prime` for workflow context. Use `bd ready`, `bd show <id>`, `bd update <id> --claim` and `bd close <id>`.
- Beads may make its own git commits of its own files (owner's permission, 2026-11-02). Everything else is committed only when the owner asks. Don't run `bd dolt push` unless the owner asks. Beads git hooks are on (in `.beads/hooks`).
