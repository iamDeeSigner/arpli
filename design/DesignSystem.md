# Design system · Arpli
Source: code, not Figma yet. Tokens in `apps/desktop/src/lib/styles/tokens.css`, fonts and type roles in `apps/desktop/src/app.css`, components in `apps/desktop/src/lib/components/ui/` and `.../patterns/`, browsable in Storybook (`npm run storybook --workspace apps/desktop`). Ported from Intent's cloudlands-fe (Apache-2.0, see `NOTICE`). Last checked: 2026-11-02.
Never invent tokens or components; anything missing becomes a design-system gap request.

**Decision 2026-11-02:** v1 is built on this system as it is. The brand values in `docs/brand/` are applied in Polish & QA.

## Tokens (semantic, as they are today)
| Token | Light | Dark | Use |
|---|---|---|---|
| background | 0 0% 100% (pure white) | 0 0% 10.2% | page |
| foreground | 0 0% 0% (pure black) | 0 0% 100% | text |
| primary | 66.4 67% 64.3% (yellow-green) | 67 78% 68% | primary action, focus |
| card, muted, border, ring, danger, success, warning | in `tokens.css` | in `tokens.css` | read the file when needed |

Use semantic utilities (`bg-card`, `text-muted-foreground`), never raw colours.

## Type
- Families: Inter (UI), Source Serif 4 (notes, editorial), JetBrains Mono (code)
- Roles in `app.css`: `type-display`, `type-title`, `type-body`, `type-caption`, `type-code` and others

## Spacing and layout
- Read from `tokens.css` and the Tailwind theme when needed; not yet documented here
- Radius tokens include `--radius-medium` and `--radius-large`

## Motion
- Import from `$lib/motion` only (`fade`, `fly`, `slide`, `scale`); never from `svelte/transition`
- Tiers: fast 80 ms (exit 60) · moderate 160 ms (exit 120) · slow 240 ms (exit 160) · cubic-out, no overshoot
- Reduced motion handled centrally

## Components (UI kit)
Accordion · badge · breadcrumb · button · button group · card · checkbox and checkbox group · combobox (plain, grouped, searchable) · copy input · dialog · dropdown · file input · input and input group · kbd · label · list · menu · message composer · popover · radio group · scroll area · select (plain, searchable) · separator · sheet · sidebar · skeleton · slider · switch · table · tabs · textarea · toast · toggle and toggle group · tooltip · plus helpers (hover card, copy button, editable name, relative time, virtual list, collapsible panel)

## Patterns
Screen states (empty, error, loading, takeover) · settings sections and rows · confirm, destructive and form dialogs · notify toasts · action menus and bars · forms with auto-save · collections (list, rows, sectioned lists)

## Rules
- Semantic tokens only · every state designed · confirmations use the confirm pattern, not browser pop-ups
- UI strings used by the kit live in `apps/desktop/messages/en.json`
