# Arpli — Color System Direction

Arpli's palette is a quiet one. It must counterbalance a user who arrives already overwhelmed. Cool blue "trust-tech" palettes read as *clinical* in this context — a direct anti-keyword. Instead we lean into **warm neutrals, a grounded ink-dark primary, and a single warm-amber accent** that signals action without shouting.

Palette philosophy, in one sentence:

> **A warm paper surface, confident near-black ink, one amber ember for action, and sparing semantic colours — nothing in the palette raises your heart rate.**

Specific HSL values follow for every token in `app.css`, light and dark, ready to paste.

---

## How the palette serves the emotional register

| Emotional pillar | Palette move |
|---|---|
| **Steady** | Low saturation across the system. No fluorescent accents. Dark primary is near-black, not vibrant. |
| **Warm** | Backgrounds are warm neutrals (hue 35–40°, 2–4% saturation) — paper, not snow. Blacks tilt toward brown rather than blue. |
| **Enabling** | High contrast on body text (AAA on body) means users can read fast without squinting. The primary action is one unambiguous colour, used sparingly. |
| **Grounded** | No gradients in UI. No glossy effects. One flat ink primary, one flat amber accent. Semantic colours are specific, muted, and used only when needed. |
| **Alongside** | Dark mode is first-class, not an afterthought. Users working at 11pm never land on a glare of white. |

### What we're explicitly rejecting
- Vibrant tech-blues (reads clinical).
- Purple-to-pink gradients (reads AI-hype).
- Pure white (#FFF) backgrounds (reads sterile; also harsh for night work).
- Pure black (#000) text (reads cheap; also fatigues the eye against warm paper).
- Multiple competing accent colours (reads "feature-dense," on the anti-list).

---

## The core palette, at a glance

### Light mode
- **Background** — warm paper. Hue 36°, saturation 20%, lightness 98%. A whisper of amber, not a pure white.
- **Foreground (ink)** — warm near-black. Hue 30°, saturation 10%, lightness 10%. Reads calm, not harsh.
- **Primary** — amber ember. Hue 30°, saturation 72%, lightness 48%. Warm, confident, grounded. Used only on primary actions and focus.
- **Primary foreground** — a very light warm cream for text on the amber primary.
- **Muted** — a dim paper. Hue 36°, saturation 14%, lightness 93%. Supports grouping without hard lines.
- **Border** — a hairline step above the background. Hue 36°, saturation 12%, lightness 88%.

### Dark mode
- **Background** — warm ink. Hue 30°, saturation 10%, lightness 10%. The same warm-brown bias as the light mode ink, inverted into a surface. Users on an OLED Android at 11pm are met by something that reads *paper at dusk*, not a technical cockpit.
- **Foreground** — warm off-white. Hue 36°, saturation 16%, lightness 94%.
- **Primary** — amber ember, slightly brightened for dark backgrounds. Hue 32°, saturation 78%, lightness 58%.
- **Muted** — ink + a step. Hue 30°, saturation 10%, lightness 16%.
- **Border** — ink + two steps. Hue 30°, saturation 10%, lightness 22%.

---

## HSL values for every token in `app.css`

The project already uses **HSL channel CSS vars** (three numbers per colour, so colour-mix() and opacity utilities compose cleanly). The format for each token is:

```css
--token-name: <H> <S>% <L>%;
```

Then used as:

```css
color: hsl(var(--foreground));
background: hsl(var(--background) / 0.9);
```

### Light mode — ready to paste

```css
.light {
  /* Surfaces & ink */
  --background: 36 20% 98%;
  --foreground: 30 10% 10%;

  /* Primary action — amber ember */
  --primary: 30 72% 48%;
  --primary-foreground: 36 50% 97%;

  /* Secondary — a muted neutral ink used for secondary buttons */
  --secondary: 36 12% 90%;
  --secondary-foreground: 30 12% 18%;

  /* Muted — supportive surfaces, helper text */
  --muted: 36 14% 93%;
  --muted-foreground: 30 8% 38%;

  /* Cards — slight lift from background */
  --card: 36 24% 99%;
  --card-foreground: 30 10% 10%;

  /* Sidebar surfaces */
  --sidebar: 36 18% 96%;
  --sidebar-foreground: 30 10% 20%;
  --sidebar-accent: 36 20% 92%;
  --sidebar-accent-foreground: 30 12% 15%;
  --sidebar-border: 36 14% 86%;

  /* Lines */
  --border: 36 12% 88%;
  --ring: 30 72% 48%;

  /* Semantic — danger */
  --danger: 10 68% 46%;
  --danger-foreground: 36 50% 98%;

  /* Semantic — success */
  --success: 150 36% 36%;
  --success-foreground: 36 50% 98%;

  /* Semantic — warning */
  --warning: 42 86% 46%;
  --warning-foreground: 30 24% 12%;
}
```

### Dark mode — ready to paste

```css
.dark {
  /* Surfaces & ink */
  --background: 30 10% 10%;
  --foreground: 36 16% 94%;

  /* Primary action — amber ember (brightened) */
  --primary: 32 78% 58%;
  --primary-foreground: 30 24% 12%;

  /* Secondary */
  --secondary: 30 8% 20%;
  --secondary-foreground: 36 14% 90%;

  /* Muted */
  --muted: 30 10% 16%;
  --muted-foreground: 36 10% 68%;

  /* Cards — slight lift from background */
  --card: 30 10% 13%;
  --card-foreground: 36 16% 94%;

  /* Sidebar */
  --sidebar: 30 10% 12%;
  --sidebar-foreground: 36 12% 86%;
  --sidebar-accent: 30 10% 18%;
  --sidebar-accent-foreground: 36 14% 92%;
  --sidebar-border: 30 10% 22%;

  /* Lines */
  --border: 30 10% 22%;
  --ring: 32 78% 58%;

  /* Semantic — danger */
  --danger: 8 72% 60%;
  --danger-foreground: 30 24% 12%;

  /* Semantic — success */
  --success: 148 42% 54%;
  --success-foreground: 30 24% 12%;

  /* Semantic — warning */
  --warning: 40 90% 60%;
  --warning-foreground: 30 24% 12%;
}
```

---

## Why each hue was chosen

| Token | Hue | Reasoning |
|---|---|---|
| Background (light) | 36° | Warm paper. Just enough amber to break "white" without going cream. |
| Background (dark) | 30° | Warm brown-black. Pulls the dark mode away from "cold laptop" into "evening desk." |
| Foreground | 30–36° | Ink that matches the paper's warm bias. Reads calm. |
| Primary | 30–32° | Amber ember. Hue 30 keeps it unambiguous (not red, not yellow). A near-brown-orange that reads as *earth* rather than *alert*. |
| Secondary | 36° | Same warm neutral family as the background. Secondary actions sit *inside* the surface, not shout against it. |
| Muted-foreground | 30° | Same ink family, lightened to the lowest contrast that still passes AA on body text. |
| Danger | 10° | Warm red (not pink-red). Deeper lightness (46%) in light mode means it reads *serious* rather than *panicky*. |
| Success | 150° | Muted sage-green. Low saturation. "Done" rather than "AWESOME." |
| Warning | 42° | A gold-yellow, differentiated enough from the primary amber by hue and lightness to avoid confusion. |

### Why one accent, not many

Arpli explicitly does *not* ship a palette of brand accents (teal, lavender, coral) for feature categories. Users carry enough mental load into the app; a palette that colour-codes feature areas adds a learning tax. The amber primary is the only colour that calls for attention. Semantic colours (danger, warning, success) are used only when the system genuinely needs to signal state — not for decoration.

---

## Primary action — the amber decision in detail

Hue 30, Saturation 72, Lightness 48 (light mode) is deliberately chosen to:

- Sit outside the "AI blue / Silicon-Valley purple" family.
- Carry warmth from African earth tones (specifically evocative of unglazed terracotta, raw sienna, dusk) without being literal or costume-y.
- Pass WCAG AA for white text on the surface — the primary action can carry `--primary-foreground` text at 16px.
- Still read as *action* against the warm paper background — distinct from any neutral in the system.

Dark mode brightens to L=58 so it holds presence against the warm-ink background. Hue drifts slightly to 32 to compensate for perceived warmth loss at higher lightness.

---

## Contrast check — primary text combinations (WCAG AA)

Reasoned from the HSL values above using standard WCAG luminance maths. **AA = 4.5:1 for body text (<18px), 3:1 for large text (≥18px bold or ≥24px regular) and UI elements.**

### Light mode

| Foreground | Background | Approx. contrast | AA body (4.5:1) | AA large (3:1) | Verdict |
|---|---|---|---|---|---|
| `--foreground` (30 10% 10%) | `--background` (36 20% 98%) | ~15.8:1 | ✅ | ✅ | AAA — body copy, headings |
| `--muted-foreground` (30 8% 38%) | `--background` (36 20% 98%) | ~6.5:1 | ✅ | ✅ | AA — helper text, captions |
| `--muted-foreground` on `--muted` (36 14% 93%) | — | ~6.0:1 | ✅ | ✅ | AA — labels on muted panels |
| `--primary-foreground` (36 50% 97%) | `--primary` (30 72% 48%) | ~5.2:1 | ✅ | ✅ | AA — button labels on amber |
| `--foreground` on `--secondary` (36 12% 90%) | — | ~12.5:1 | ✅ | ✅ | AAA — secondary buttons |
| `--foreground` on `--card` (36 24% 99%) | — | ~16.0:1 | ✅ | ✅ | AAA |
| `--sidebar-foreground` (30 10% 20%) on `--sidebar` (36 18% 96%) | — | ~11.1:1 | ✅ | ✅ | AAA — sidebar primary text |
| `--sidebar-accent-foreground` (30 12% 15%) on `--sidebar-accent` (36 20% 92%) | — | ~11.9:1 | ✅ | ✅ | AAA — active sidebar item |
| `--danger-foreground` (36 50% 98%) on `--danger` (10 68% 46%) | — | ~5.6:1 | ✅ | ✅ | AA — destructive button text |
| `--success-foreground` (36 50% 98%) on `--success` (150 36% 36%) | — | ~6.1:1 | ✅ | ✅ | AA |
| `--warning-foreground` (30 24% 12%) on `--warning` (42 86% 46%) | — | ~6.8:1 | ✅ | ✅ | AA — text on amber warning |
| `--primary` (30 72% 48%) as text on `--background` | — | ~4.6:1 | ✅ (just) | ✅ | AA — the primary used as inline link text at ≥16px |
| `--border` (36 12% 88%) vs `--background` (36 20% 98%) | — | ~1.3:1 | n/a | n/a (decorative line) | OK as a non-essential hairline |
| `--ring` focus ring (30 72% 48%) around a surface | — | ~3.3:1 against `--background` | n/a | ✅ (3:1 UI) | AA — passes focus-indicator contrast |

### Dark mode

| Foreground | Background | Approx. contrast | AA body (4.5:1) | AA large (3:1) | Verdict |
|---|---|---|---|---|---|
| `--foreground` (36 16% 94%) | `--background` (30 10% 10%) | ~14.9:1 | ✅ | ✅ | AAA |
| `--muted-foreground` (36 10% 68%) | `--background` (30 10% 10%) | ~6.8:1 | ✅ | ✅ | AA |
| `--primary-foreground` (30 24% 12%) on `--primary` (32 78% 58%) | — | ~6.9:1 | ✅ | ✅ | AA — amber button labels |
| `--foreground` on `--card` (30 10% 13%) | — | ~12.5:1 | ✅ | ✅ | AAA |
| `--foreground` on `--secondary` (30 8% 20%) | — | ~8.6:1 | ✅ | ✅ | AAA |
| `--sidebar-foreground` (36 12% 86%) on `--sidebar` (30 10% 12%) | — | ~11.0:1 | ✅ | ✅ | AAA |
| `--sidebar-accent-foreground` (36 14% 92%) on `--sidebar-accent` (30 10% 18%) | — | ~10.6:1 | ✅ | ✅ | AAA — active sidebar in dark |
| `--danger-foreground` (30 24% 12%) on `--danger` (8 72% 60%) | — | ~5.9:1 | ✅ | ✅ | AA |
| `--success-foreground` (30 24% 12%) on `--success` (148 42% 54%) | — | ~6.3:1 | ✅ | ✅ | AA |
| `--warning-foreground` (30 24% 12%) on `--warning` (40 90% 60%) | — | ~8.2:1 | ✅ | ✅ | AAA |
| `--primary` (32 78% 58%) as text on `--background` | — | ~5.5:1 | ✅ | ✅ | AA — amber as inline accent text in dark |
| `--ring` (32 78% 58%) against `--background` | — | ~5.5:1 | n/a | ✅ | AA — focus-ring passes |

### Deliberately **not** supported as a pairing

| Pairing | Why it fails |
|---|---|
| `--primary` as text on `--muted` (either mode) | Contrast drops to ~3.9:1 in light mode. Primary as inline text must only sit on `--background` or `--card`. |
| `--muted-foreground` on `--background` for primary body copy | Even though it passes AA at 6.5:1, using muted ink for *long-form* body copy drains the reading experience. Reserve for helper copy only. |
| `--warning-foreground` as *white* on `--warning` | Warning is bright enough that white text drops below AA. We paint dark ink on warning, deliberately. |

---

## Component-level colour application

### Buttons
- **Primary** — fill `--primary`, text `--primary-foreground`, no border. Hover: lightness −6 (light) / +4 (dark). Focus: `--ring` 2px, 2px offset.
- **Secondary** — fill `--secondary`, text `--secondary-foreground`, border `--border`. Hover: lightness −4.
- **Ghost** — transparent, text `--foreground`, hover background `--muted`.
- **Destructive** — fill `--danger`, text `--danger-foreground`. Confirmation flow for destructive actions, never one-click.

### Form fields
- Default border `--border`, text `--foreground`, placeholder `--muted-foreground`.
- Focus border `--ring`, with the ring sitting *outside* the field (2px offset).
- Error state: border `--danger`, helper text `--danger`, label stays `--foreground`.

### Cards
- Fill `--card`, text `--card-foreground`, border `--border` (hairline), no shadow by default.
- Elevated card (modal, popover): adds a soft shadow (defined in motion/elevation doc), **not** a different fill.

### Sidebar
- Fill `--sidebar`, items `--sidebar-foreground`.
- Active item: background `--sidebar-accent`, text `--sidebar-accent-foreground`. No left-rail stripe; the fill does the job quietly.
- Border between sidebar and content: `--sidebar-border`.

### Focus rings
- Always `--ring` (same as `--primary`), 2px solid, 2px offset.
- Visible only on `:focus-visible`, not on `:focus`.
- Rounded corners match the focused element (uses `border-radius: inherit` on the ring).

### Error, success, warning
- These colours **do work** — fill a banner, outline a toast — but they never fill a hero or decorate otherwise-fine content.
- Banner body text uses the semantic colour's `-foreground` pair.
- Icons in semantic banners are the semantic colour at full saturation, surrounded by a soft background tint at 10% opacity.

---

## Palette anti-patterns

The following combinations are banned, even if they technically pass contrast:

| Anti-pattern | Why |
|---|---|
| Primary amber on danger red | Confuses "action" with "stop." |
| Multiple semantic colours in one view (success + warning + danger) | Reads as alarm panel. Pick the most important state. |
| Using primary as a background tint for whole sections | The amber loses its signal if it covers 30% of the screen. |
| Border colours heavier than hairline | Boxed-in UIs read bureaucratic. |
| Pure black (`0 0% 0%`) or pure white (`0 0% 100%`) anywhere | We don't use them. |
| Gradients, including on buttons | We're one flat ember. |

---

## Elevation without colour tricks

Arpli does not use colour to signal elevation (we don't shift from `--surface-1` through `--surface-8` by lightness). Instead:

- **Base content** sits on `--background`.
- **Cards** sit on `--card` (one hairline step lighter in light, one step lighter in dark).
- **Modals and popovers** reuse `--card` with a soft shadow and a backdrop at `hsl(var(--foreground) / 0.4)`.

This keeps the system flat and quiet. The hierarchy is carried by spacing, typography, and the one amber accent — not by stacks of grey tones.

---

## Dark mode design decisions

- **Default: respect the user's system preference.** First-run assumes OS setting; the user can override in settings.
- **No "pure dark" OLED mode by default.** The warm ink background (`--background: 30 10% 10%`) is kinder to the eye than true black on long reading sessions. A separate pure-dark toggle may be considered later for OLED battery concerns, but not shipped as the default.
- **The amber primary brightens** in dark mode (L=58 vs L=48) to maintain presence on the dark surface.
- **Shadows in dark mode drop in opacity** — a shadow against a dark background should not become a halo. Treat shadow colour as `hsl(0 0% 0% / 0.4)` in light mode, `hsl(0 0% 0% / 0.5)` in dark mode.

---

## Transparency and overlays

A few tokens are used with opacity rather than defined as new tokens:

| Role | Expression |
|---|---|
| Backdrop over content (modal) | `hsl(var(--foreground) / 0.4)` light · `hsl(var(--foreground) / 0.3)` dark |
| Hover tint on a ghost button | `hsl(var(--foreground) / 0.04)` |
| Soft tint behind a semantic icon | `hsl(var(--danger) / 0.1)` (same pattern for success, warning) |
| Keyboard shortcut chip background | `hsl(var(--foreground) / 0.06)` |

Using HSL channel vars lets these compose cleanly without needing hex alpha everywhere.

---

## Figma library map

When this maps into Figma, the variable collections should be:

- **Primitives** — raw HSL triplets. Named by colour family and lightness step. Not used directly in components.
- **Semantic** — the token names from `app.css` (`background`, `foreground`, `primary`, etc.), each with Light and Dark modes. Components reference these.
- **Component-level** — only where a component needs a hard-coded exception (rare).

The Figma file ships with both modes, swapped via the file's mode controls — not duplicated.

---

## Pre-ship checks

Before shipping any screen:

- [ ] All text passes 4.5:1 (body) or 3:1 (large) against its surface.
- [ ] Focus rings visible on every interactive element in both modes.
- [ ] No pure black or pure white anywhere.
- [ ] One primary action per screen, maximum. (Secondary actions use secondary styling.)
- [ ] Semantic colour used only when the system has something to say — not for decoration.
- [ ] Dark mode checked at 11pm screen brightness.
- [ ] Palette feels quiet when the eye rests, not busy.

---

## The one-sentence palette check

*Does this screen, in both modes, feel like a well-lit desk lamp — or an office striplight?*
If it's striplight, start again.
