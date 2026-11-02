# Arpli — Typography System

Typography is Arpli's first act of hospitality. Before the colour palette is read, before any component renders in full, a user sees letterforms and starts deciding whether this product is for them. For users already carrying vulnerability, cold typography can read as "not for me" — in milliseconds, before any sentence lands.

**Design brief:** typography must feel **human, calm, confident, and legible at the kitchen-table hour** — 11pm on a cheap monitor or a mid-range phone, after a long day. It must sit squarely inside the emotional register: Steady · Warm · Enabling · Grounded.

---

## Design principles

1. **Legibility first.** Our users read dense prompts, their own long drafts, and reviewer-style feedback. If a typeface struggles at 14px on a mid-range Android panel at low brightness, it is not a candidate.
2. **One family, two optionals.** Arpli uses a single primary type family. A display face is optional and reserved for celebratory moments; a mono face is reserved for inline UI (keyboard hints, system values). We do not stack additional families.
3. **Warm, not technical.** Humanist proportions, open apertures, two-storey "a" and "g" where available. Geometric sans faces (Futura, Avenir, Montserrat) are explicitly rejected — they read as "techie," which is on the anti-keywords list.
4. **Earn density.** Arpli has dense moments (application tracker, settings tables). The body face must hold its shape at 13px. Dense views do not get a different face — they get tighter leading and clearer rhythm.
5. **Respect the user's reading settings.** Every size is defined in `rem`, keyed to a 16px root. If the user bumps their system font-size, the whole scale moves with them.
6. **No type as decoration.** Letter-spacing tricks, all-caps labels, and italic flourishes are used sparingly and only when they do real work.

---

## Primary typeface — Inter (Google Fonts)

### Why Inter

- Designed explicitly for UI legibility; drawn by Rasmus Andersson from the ground up for computer screens.
- Humanist sans with a slightly larger x-height — reads calmly at small sizes, holds composure at display sizes.
- Variable font — one file, every weight 100–900 and italics. Lower network cost (critical for African users on metered mobile data).
- Mature OpenType feature set: tabular figures, slashed zero, contextual alternates, stylistic sets for a less "default" feel.
- Available on every major OS as a free Google Font, and widely bundled on Android devices.
- Pairs cleanly with itself across heading and body — removing the need for a second family for 90% of the UI.

### Variants we use
- **Inter Variable** (weights 400, 500, 600, 700 primarily used; 300 reserved for display-size supporting text).
- **Inter Italic** (used sparingly — reflective prompts, user-provided quotes in drafts).
- OpenType features on by default:
  - `"cv11"` — single-storey "a" alternative (**off**; we want the warmer two-storey form).
  - `"ss01"` — open-`4` alternative (**on** for a less technical feel in numeric contexts).
  - `"ss03"` — curved `r` and `l` (**on**).
  - `"tnum"` — tabular numerals **only** in tables and timers (not in body copy).
  - `"zero"` — slashed zero (**off** in body, **on** inside code/mono blocks).

### Why not alternatives

| Candidate | Why rejected |
|---|---|
| **Geist Sans** | Lovely but too new in Nigerian/African device font stacks — would need to be loaded every time. Also skews Silicon Valley in current cultural reads. |
| **IBM Plex Sans** | Great character; slightly too corporate / editorial for the "friend" register. |
| **Söhne / Haffer** | Taste-correct, but commercial licenses add cost that reaches end-users via web font payloads. |
| **Söhne-adjacent free alternatives (General Sans, Satoshi)** | Beautiful but less tested on low-end Android; weight variations are not variable-font, which means more bytes. |
| **System default (San Francisco / Roboto)** | Removes any design signature. Fine as a fallback, not as the default. |

---

## Optional display face — Fraunces (Google Fonts)

Reserved for rare, deliberate moments. The product is not editorial by default; Fraunces appears only when warmth needs to turn up slightly.

### Where Fraunces appears
- **Onboarding welcome screen** — a single warm greeting ("Let's start with you.").
- **Celebratory moments** — a single, calm "Submitted." when an application sends.
- **Marketing site hero** — if/when a marketing surface exists.

### Where Fraunces never appears
- Any dense screen.
- Buttons, labels, form fields, body paragraphs.
- Error states or system messages.

### Variants
- Fraunces Variable, weight 400–500, optical size 72–144, softness **high**, wonk **low**.
- No italic in UI.

### Why Fraunces
Fraunces is a modern serif with a *soft* axis — crucial. At its warmest settings it reads human and literary without going cute. It is open-source, variable, and well-hinted at display sizes.

---

## Optional mono face — JetBrains Mono (Google Fonts)

Used only for:
- Inline keyboard hints — `⌘S` to save.
- Code or structured JSON in settings/debug surfaces.
- Technical model names ("Claude Opus 4.7") in advanced settings.

Never used for body copy, labels, or button text. Monospace reads "technical" — an anti-keyword — if misused.

---

## System font fallback stack

If Inter cannot load (slow connection, blocked font CDN, offline-first scenario), the body falls back to a carefully-ordered system stack. Users should never see Times New Roman:

```css
font-family:
  "Inter", "Inter var",
  -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell",
  "Helvetica Neue", "Helvetica", "Arial",
  sans-serif;
```

For the display face: fallback to a serif stack:

```css
font-family:
  "Fraunces", "Fraunces var",
  Georgia, "Iowan Old Style",
  "Palatino Linotype", "Book Antiqua",
  Palatino, serif;
```

For mono: fallback to a modern mono stack:

```css
font-family:
  "JetBrains Mono", "JetBrains Mono var",
  ui-monospace, SFMono-Regular, "SF Mono",
  Menlo, Consolas, "Liberation Mono",
  monospace;
```

---

## Type scale — specific values ready to paste

Based on a **16px root** (`html { font-size: 16px }`), a **1.200 (minor third)** modular ratio across body and heading sizes, with hand-tuned exceptions at the display end (ratio opens to 1.250–1.333) for cadence.

All sizes are expressed in `rem` so user settings scale the system.

### CSS custom properties — drop-in for `app.css`

```css
:root {
  /* Type family tokens */
  --font-sans: "Inter", "Inter var", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
    "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  --font-serif: "Fraunces", "Fraunces var", Georgia, "Iowan Old Style",
    "Palatino Linotype", "Book Antiqua", Palatino, serif;
  --font-mono: "JetBrains Mono", "JetBrains Mono var", ui-monospace,
    SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

  /* Font-size scale (rem, 16px root) */
  --text-xs:   0.75rem;    /* 12px — captions, timestamps, metadata */
  --text-sm:   0.875rem;   /* 14px — helper text, dense table cells */
  --text-base: 1rem;       /* 16px — body copy, form fields */
  --text-lg:   1.125rem;   /* 18px — large body, article intros */
  --text-xl:   1.25rem;    /* 20px — section leads, prominent paragraphs */
  --text-2xl:  1.5rem;     /* 24px — H3 */
  --text-3xl:  1.875rem;   /* 30px — H2 */
  --text-4xl:  2.25rem;    /* 36px — H1 */
  --text-5xl:  3rem;       /* 48px — display, onboarding greeting */

  /* Line-height scale (unitless, scales with font-size) */
  --leading-tight:   1.2;   /* Display and large headings */
  --leading-snug:    1.35;  /* Mid-size headings */
  --leading-normal:  1.5;   /* Body text — comfortable, kitchen-table reading */
  --leading-relaxed: 1.65;  /* Long-form reading, drafts */
  --leading-code:    1.6;   /* Mono blocks */

  /* Letter-spacing (tracking) */
  --tracking-tightest: -0.03em; /* Display sizes only */
  --tracking-tight:    -0.015em;/* H1, H2 */
  --tracking-normal:    0;      /* Body, most UI */
  --tracking-wide:      0.02em; /* Small caps / tiny labels */
  --tracking-caps:      0.08em; /* All-caps micro-labels (rare, deliberate) */

  /* Weight */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
}
```

### Role-based type styles

Each role declares size, weight, line-height, and tracking in one place. Components read from these, not from raw tokens.

```css
:root {
  /* Display — rare, warm, onboarding and celebrations */
  --type-display:
    var(--weight-regular) var(--text-5xl) / var(--leading-tight)
    var(--font-serif);
  --type-display-tracking: var(--tracking-tightest);

  /* Headings */
  --type-h1:
    var(--weight-semibold) var(--text-4xl) / var(--leading-tight)
    var(--font-sans);
  --type-h1-tracking: var(--tracking-tight);

  --type-h2:
    var(--weight-semibold) var(--text-3xl) / var(--leading-snug)
    var(--font-sans);
  --type-h2-tracking: var(--tracking-tight);

  --type-h3:
    var(--weight-semibold) var(--text-2xl) / var(--leading-snug)
    var(--font-sans);
  --type-h3-tracking: var(--tracking-normal);

  --type-h4:
    var(--weight-semibold) var(--text-xl) / var(--leading-snug)
    var(--font-sans);
  --type-h4-tracking: var(--tracking-normal);

  /* Body */
  --type-body-lg:
    var(--weight-regular) var(--text-lg) / var(--leading-relaxed)
    var(--font-sans);
  --type-body:
    var(--weight-regular) var(--text-base) / var(--leading-normal)
    var(--font-sans);
  --type-body-sm:
    var(--weight-regular) var(--text-sm) / var(--leading-normal)
    var(--font-sans);

  /* Draft prose — the user's own writing, our longest form */
  --type-draft:
    var(--weight-regular) var(--text-lg) / var(--leading-relaxed)
    var(--font-sans);

  /* UI micro-roles */
  --type-label:
    var(--weight-medium) var(--text-sm) / 1.35
    var(--font-sans);
  --type-helper:
    var(--weight-regular) var(--text-sm) / 1.4
    var(--font-sans);
  --type-caption:
    var(--weight-regular) var(--text-xs) / 1.4
    var(--font-sans);
  --type-micro-caps:
    var(--weight-semibold) var(--text-xs) / 1.3
    var(--font-sans);
  --type-micro-caps-tracking: var(--tracking-caps);

  --type-button:
    var(--weight-medium) var(--text-base) / 1
    var(--font-sans);
  --type-button-sm:
    var(--weight-medium) var(--text-sm) / 1
    var(--font-sans);

  --type-mono:
    var(--weight-regular) var(--text-sm) / var(--leading-code)
    var(--font-mono);
}
```

### Example application in CSS

```css
.h1 {
  font: var(--type-h1);
  letter-spacing: var(--type-h1-tracking);
}

.draft-prose {
  font: var(--type-draft);
  max-width: 68ch; /* comfortable measure */
}

.micro-caps {
  font: var(--type-micro-caps);
  letter-spacing: var(--type-micro-caps-tracking);
  text-transform: uppercase;
}
```

---

## The full scale, read as a specimen

| Token | Size | Weight | Line-height | Tracking | Role |
|---|---|---|---|---|---|
| `--text-5xl` | 48px / 3rem | 400 (Fraunces) | 1.2 | −0.03em | Display — onboarding greeting, submitted-state |
| `--text-4xl` | 36px / 2.25rem | 600 | 1.2 | −0.015em | H1 — screen title |
| `--text-3xl` | 30px / 1.875rem | 600 | 1.35 | −0.015em | H2 — section title |
| `--text-2xl` | 24px / 1.5rem | 600 | 1.35 | 0 | H3 — card title, major block |
| `--text-xl` | 20px / 1.25rem | 600 | 1.35 | 0 | H4 — intro paragraph, callout |
| `--text-lg` | 18px / 1.125rem | 400 | 1.65 | 0 | Draft prose, long-form reading |
| `--text-base` | 16px / 1rem | 400 | 1.5 | 0 | Default body, form fields |
| `--text-sm` | 14px / 0.875rem | 400 (or 500 for labels) | 1.4 | 0 | Labels, helper text, dense cells |
| `--text-xs` | 12px / 0.75rem | 400 (or 600 for micro-caps) | 1.4 | 0 (or 0.08em) | Captions, timestamps, tiny labels |

### A note on the smallest sizes
The 12px token exists but is **rarely** the right answer. Prefer 14px wherever possible. Reserve 12px for:
- Metadata that's spatially next to larger primary text.
- Timestamps on cards.
- Keyboard-shortcut hints.
Never a primary action label, never a form field value, never a draft paragraph.

### A note on the measure
Draft prose caps at **68ch**. Body text caps at **72ch**. Beyond that, line length becomes tiring — Arpli users already read a lot.

---

## Hierarchy patterns

### Standard screen
- One H1 at the top (`--type-h1`).
- Section titles below use H2 (`--type-h2`) with generous top margin — 1.5× line-height of the title itself.
- Body copy sets at 16px with 1.5 leading.

### Draft screen (where the user is writing)
- H1 for the application / opportunity name.
- Draft content sets at 18px with 1.65 leading. This is the only screen that gets the `body-lg` default.
- Question prompts above each draft block are `--type-label` in `--muted-foreground`.

### Dense table (application tracker)
- Column headers: `--type-micro-caps` — uppercase, 12px, tracked at 0.08em.
- Row content: `--type-body-sm` with `"tnum"` enabled for numeric columns.
- Row height: 48px minimum (keeps readable on touch).

### Onboarding
- Greeting: `--type-display` (Fraunces) — one line, generous surrounding space.
- Supporting prose: `--type-body-lg`.
- Prompt input: `--type-body` at 16px minimum — prevents iOS Safari zoom-on-focus.

### Buttons
- Default button: `--type-button` (16px, weight 500, line-height 1).
- Compact button (table rows, dense surfaces): `--type-button-sm` (14px, 500).
- Button text never shrinks below 14px, even in dense views.

---

## Density guidance

Arpli has three density levels. Each uses the same scale but different spacing and leading:

| Context | Primary body size | Line-height | Row/line gap |
|---|---|---|---|
| **Comfortable** (onboarding, draft, empty states) | 18px | 1.65 | 24px |
| **Default** (most screens) | 16px | 1.5 | 16px |
| **Dense** (table rows, settings grids) | 14px | 1.4 | 8px |

The user does not toggle these. The screen declares its density; Arpli does not expose a density setting.

---

## Accessibility and legibility

- **Minimum body size:** 16px for anything the user reads at length. 14px is reserved for secondary / dense UI.
- **Minimum line-height:** 1.5 for body prose. 1.4 for dense labels. Below 1.35 only for display headings.
- **Contrast:** every text style must pass WCAG AA against the surface it sits on (handled in the colour document, but typography commits to never requiring sub-AA pairings to look right).
- **Focus-visible text:** underline on focus for inline links (never just a colour change).
- **Scaling:** supports browser zoom to 200% without layout breaking (every size is `rem`, not `px`).
- **Dyslexia-friendly stance:** Inter's open apertures and distinct letterforms (b/d, p/q) are already strong. We do not ship a separate dyslexia-mode font — we commit to a strong default.
- **System preference:** respect `font-size` inheritance from the OS; never override the user's base.

---

## Loading strategy (so letterforms don't flash)

- Primary (Inter) and display (Fraunces) are self-hosted and preloaded as WOFF2 subsets.
- `font-display: swap` — users on slow connections see a fallback immediately in a close-metric fallback (San Francisco / Roboto / Segoe UI).
- Variable fonts loaded as a single file per family, reducing weight requests.
- Latin + Latin Extended subset only by default; extended ranges loaded on demand.

---

## Specimen plates — six exemplars

Each specimen uses only the tokens defined above. These are the anchor views for a Figma type specimen frame.

### 1. Onboarding greeting (display + body-lg)
> **Let's start with you.**
> You tell us what you're working toward. We help you say it clearly, in your own voice.

### 2. Screen title + section (H1 + H2 + body)
> **# Your applications**
> ## In progress
> Three applications are open. Chevening is due Friday — the oldest draft sits there.

### 3. Draft question + prompt (label + draft)
> **Question 2 of 12 · ~80 words**
> *What's a specific experience that shows your leadership?*
>
> Write one example. One moment. One sentence that could stand alone. We'll help you shape it after.

### 4. Dense table row (micro-caps + body-sm with tnum)
> **APPLICATION · DEADLINE · STATUS · PROGRESS**
> Chevening Scholarship · 24 Oct 2026 · Draft · 7/12 answered

### 5. Error (body + helper)
> **That didn't send.**
> Your draft is safe. Try again, or come back in a few minutes.

### 6. Celebration (display)
> **Submitted.**
> That's one down.

---

## When to deviate

- **Marketing / landing surfaces** may use larger display sizes (3.75rem / 60px) at Fraunces, and tighten tracking further (`-0.04em`). Everywhere else, hold to the scale.
- **Legal / terms copy** uses `--text-sm` at 1.5 leading, left-aligned, measure capped at 72ch. We don't shrink to `--text-xs` to hide it — this is on-brand behaviour.
- **Error pages (404, offline)** use the display face at a smaller size (`--text-3xl`) to soften the moment.

Everywhere else: use the tokens. If a design calls for a size that doesn't exist, the design probably doesn't need it.

---

## The one-sentence typography check

*Does the type on this screen feel like it was set by someone who wanted a reader to feel welcome — or by someone who wanted the product to look impressive?*
If it's the second, start again.
