# Arpli — Motion Language

Motion in Arpli has one job: **make the product feel calm, present, and in step with the user.** Not energetic. Not showy. Not snappy for its own sake. If a user cannot tell that something moved, we succeeded in the right places.

**Motion personality (one line):** *Steady breath — unhurried, bounded, honest.*

The arrival emotion is the design constraint. Our users arrive carrying overwhelm, time pressure, and vulnerability. Motion must *lower the room temperature* when they enter, not raise it. A product that bounces its UI chrome at a stressed user feels like a tool that doesn't understand them.

---

## Core principles

1. **Calm, not urgent.** Durations err long rather than short. Easing eases *out*, so motion settles into place rather than slamming into it. We never use elastic overshoots or bouncy settles.
2. **Motion as orientation, not decoration.** Every animation answers one question: *where did that come from, and where did it go?* If an animation doesn't help the user orient, it doesn't ship.
3. **Interruptibility is a feature.** A user who changes their mind mid-animation should not be punished with a half-second of "finishing the previous thought." Every tween cuts gracefully to a new target.
4. **Bounded by default.** We use **bounded easings** (cubic-out) over **unbounded springs** (physical simulation) because a dropped frame or interrupted gesture must still land in a predictable place.
5. **Respect reduced-motion as a design constraint, not a fallback.** The reduced-motion experience is designed first, with content and transitions that work without animation. The animated variant is the enhancement.
6. **Not everything animates.** Dense views (application tracker rows, settings tables, text fields on keystroke) do not animate. Reserve motion for state transitions the user needs to understand.
7. **Compositor-friendly.** We animate `transform` and `opacity` almost exclusively. Width, height, and top/left are last resorts.

---

## The three Arpli motion tiers

The codebase carries three named motion tiers. Based on the existing `springs.ts` conventions (bounded easings with a settle duration and a shorter exit duration), Arpli defines them as:

| Tier | Codebase name | Settle duration | Exit duration | Easing | Role |
|---|---|---|---|---|---|
| **1 — Fast** | `fast` | **120 ms** | 80 ms | `cubicOut` | Button press feedback, hover reveal, tooltip appear, input focus ring |
| **2 — Moderate** | `moderate` | **220 ms** | 160 ms | `cubicOut` | Panel open/close, sidebar expand, menu open, inline reveals, modal open |
| **3 — Slow** | `slow` | **360 ms** | 240 ms | `cubicOut` | Page transitions, major view changes, onboarding step advance, celebration moments |

> **Mapping note:** if the current springs are named `gentle / standard / snappy`, the mapping is: snappy → fast, standard → moderate, gentle → slow. The *values* above are the Arpli targets; the names should align with the codebase convention.

### Why these specific durations

- **120ms fast** — long enough to be perceived as motion (sub-80ms reads as a cut), short enough to feel responsive. The user's finger is still on the button when the animation completes.
- **220ms moderate** — just inside Doherty's threshold for perceived instant response (~400ms). Panels have time to breathe without the user waiting.
- **360ms slow** — brushes the upper limit of what feels responsive. Reserved for moments where orientation matters (page change, celebration).

### Why cubicOut everywhere

- Predictable settle, no overshoot — never adds visual noise.
- Perceived "settling into place" matches our Steady register.
- Easier to tune and reason about than a physical spring.
- Interruption-safe: cutting an easing partway through to a new target is clean.

**We explicitly do not use:**
- `elastic` / `bounce` easings — read as playful or imprecise, both off-register.
- Linear easings — read as mechanical, missing the "ease into place" feel.
- Unbounded physical springs — a dropped frame can overshoot the target.

---

## When each tier is used

### Fast (120ms)

Any moment where the user has just acted and we need to acknowledge it.

- **Button press** — `transform: scale(0.98)` on `:active`, settle back on release.
- **Hover reveal** — tooltip or micro-caption appears.
- **Focus ring** — fades in on `:focus-visible` (never on `:focus`).
- **Checkbox / toggle flip** — the thumb slides, not the frame.
- **Icon state change** — pencil → check on save, played at fast tier.
- **Dropdown item hover highlight** — background colour easing.

### Moderate (220ms)

State changes within a view.

- **Sidebar collapse / expand** — the panel slides, content reflows.
- **Modal / dialog open & close** — background fades in; the dialog scales from 0.96 to 1.00 with opacity 0 → 1.
- **Popover / menu open** — scale from 0.96, opacity 0 → 1, origin from the trigger.
- **Inline accordion expand** — height transitions with a shadow handled separately (see "Height animation" below).
- **Tab switch within a screen** — the active underline slides to the new tab, content cross-fades at moderate.
- **Draft section save confirmation** — a check icon appears, a subtle label fades in, both fade out after 2 seconds.

### Slow (360ms)

Moments where the user's attention changes location — orientation is at stake.

- **Page transitions** — content fades out, new content fades in with a 4px rise.
- **Onboarding step advances** — step 1 → step 2 slides right-to-left (step forward) or left-to-right (step back) at slow tier.
- **Opportunity view open** — the opportunity card expands into the full view (shared-axis Z, not literal expansion).
- **Empty state reveal** — first-time users see the empty state fade in with an 8px rise over 360ms.
- **Celebration** — "Submitted" renders with a slow fade-and-rise. No confetti. One quiet moment.
- **Error state transition** — when a form switches to error state, the error message rises in slowly, enough that the user doesn't miss it.

---

## Interaction pattern specs

### Page transitions

**Goal:** show the user that they are on a new surface, without taking so long that it feels like loading.

- **Exit (old page):** opacity 1 → 0 over 160ms (exit duration of slow tier), no translation. The old page simply fades.
- **Enter (new page):** 60ms delay after exit begins, then new page fades in (opacity 0 → 1) with a 4px `translateY` rise, over 360ms (settle of slow tier).
- **During transition:** page scroll is locked and the sidebar remains static — no cascade.
- **On reduced-motion:** cut. No fade. New page replaces old page. Scroll position of new page is preserved or set to top as the page requires.

### Onboarding step advances

Onboarding is a 4-step conversation. Each step is a soft horizontal slide.

- **Forward step:**
  - Current step: opacity 1 → 0 + `translateX: 0 → -8px` over 160ms.
  - Next step enters 80ms into the exit: opacity 0 → 1 + `translateX: 8px → 0` over 360ms (slow tier).
- **Backward step:** mirror of the above (translation inverts).
- **Progress indicator** (dots or line) uses moderate tier to update between steps so it feels tied to the content, not independent.
- **On reduced-motion:** immediate step swap; progress indicator updates instantly.

### Sidebar state

The sidebar collapses to an icon rail and expands back out.

- **Collapse:** sidebar `width` animates from expanded to collapsed over 220ms (moderate tier, cubicOut). Nav item labels fade out in the first 80ms. Content area reflows naturally.
- **Expand:** mirror — width animates out, labels fade in with a 60ms delay.
- **Active indicator** (background on the current nav item) does not animate on collapse/expand — it stays put.
- **On reduced-motion:** immediate width change; labels show/hide without fade.

### Modal and dialog open

- **Backdrop:** opacity 0 → 1 (final 0.4 in light, 0.3 in dark) over 160ms, moderate exit easing.
- **Dialog:** `scale(0.96) + opacity 0` → `scale(1) + opacity 1` over 220ms, moderate tier.
- **Origin:** scale originates from `transform-origin: center` for a central modal; from the trigger button for an anchored menu.
- **Close:** reverse of open; dialog scales back to 0.96 and fades out over 160ms (moderate exit), backdrop follows at the same rate.
- **Focus management:** focus moves into the dialog immediately (not after the animation). The animation is a decoration; the state change is instantaneous for assistive tech.
- **On reduced-motion:** no scale; backdrop and dialog cross-fade in 80ms. Focus still moves on open.

### Empty state reveal

Empty states must never feel like absence. The reveal is small, confident, warm.

- **On first view** (e.g. first time the user opens their applications screen with no applications yet):
  - Container: opacity 0 → 1 + `translateY: 8px → 0` over 360ms (slow tier).
  - Illustration (if any): opacity 0 → 1 over 360ms with a 60ms delay.
  - Call-to-action button: 120ms delay, fades in with the same timing.
- **Subsequent views** (e.g. navigating back to an already-empty screen): no reveal animation — the state is cached. We don't re-perform the gesture.
- **On reduced-motion:** everything is visible immediately, no translation.

### Loading states

Loading signals exist to say "we're still here." They must not look urgent.

- **Short waits (<400ms):** no indicator. Prefer optimistic UI — show the expected result and quietly roll back if the request fails.
- **Medium (400ms–3s):** a subtle, non-rotating indicator — three dots with a staggered opacity pulse, each dot cycling 0.3 → 1 opacity over 1200ms with a 400ms stagger. Linear timing on this loop (not cubic-out) because it's a steady breath.
- **Long (>3s):** add text — "Pulling the questions from your opportunity link. About 30 seconds." Text appears 1s after the request starts (not immediately — avoids flashing it for near-instant responses).
- **Progress with known duration:** a thin bar at the top of the content area that fills with moderate easing. No gradient, no stripes, no shimmer.
- **Skeleton states:** rectangles filled with `hsl(var(--muted) / 0.6)` with a subtle 2s linear sweep. Only used where the final content's shape is predictable (list rows, card grids). Not used for free-form text.
- **On reduced-motion:** replace pulses and sweeps with a static indicator (a filled dot, a static bar). Still indicates "working," just doesn't move.

### Input focus and form field feedback

- **Focus ring:** fades in over 120ms (fast tier) when `:focus-visible` triggers. On blur, fades out over 80ms (fast exit).
- **Error reveal:** when a field becomes invalid, the error message rises into place over 160ms with the border colour changing simultaneously. The field does **not** shake, flash, or vibrate.
- **Success check:** on successful submission of a single-field edit (inline), a check icon fades in next to the field over 160ms, holds for 2000ms, fades out over 240ms.

### Button press feedback

- **Press:** `transform: scale(0.98)` + `transition: transform 120ms cubicOut`. Applied on `:active`.
- **Release:** returns to `scale(1)` on the same timing.
- **Primary buttons** also get a subtle brightness shift (`filter: brightness(0.96)`) on press; secondary buttons do not.
- **On reduced-motion:** background colour change only, no scale.

### Height animation (a known-tricky case)

Animating height is expensive and jittery. Where we must animate height (accordions, inline-expanding sections):

- Measure the natural height, animate from `0` to the measured value using a wrapper with `overflow: hidden`.
- Opacity of inner content fades in over the second half of the animation.
- Prefer `max-height` only when the content is small and predictable (<300px).
- Prefer displacing content via `transform: translateY()` when possible — far cheaper on the compositor.

---

## Reduced-motion policy

Arpli respects `prefers-reduced-motion: reduce` as a first-class user preference.

### What changes
- Translations (slide, rise) are removed; the destination state renders immediately.
- Scaling (modal open) is removed; opacity cross-fade only.
- Looping animations (loading dots, skeleton sweeps) stop looping; use a static indicator.
- Durations shorten substantially — any remaining fade is at 80ms maximum.
- Autoplay animations (celebrations) become static.

### What stays
- Opacity transitions remain, at ≤80ms. Instant appearance can be jarring; a tiny crossfade preserves orientation without triggering vestibular responses.
- Focus-ring reveal stays — accessibility affordance.
- Progress bars still fill (progress has to be communicated), but without decorative shimmer.
- Essential state communication (expanding a section, revealing an error) still happens — the destination state renders, we just skip the gesture.

### How it's implemented
- A single `prefersReducedMotion()` check in the motion module.
- Every spring respects it at the call site — if reduced-motion is on, duration becomes 0 (for translations/scales) or 80ms (for opacity).
- CSS fallback via media query so transitions set in CSS also degrade.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 80ms !important;
    scroll-behavior: auto !important;
  }
}
```

The rule above is a safety net; the real reduced-motion handling happens in JS where we know *which* animations are decorative (removable) vs communicative (shortened).

---

## Motion anti-patterns in Arpli

| Anti-pattern | Why it's banned |
|---|---|
| Elastic / bouncy settles | Reads playful; off-register. |
| Micro-animations on every hover (chrome, nav items, icons wiggling) | Visual noise; fatigues the eye over a long session. |
| Confetti or celebratory bursts | Patronising for the gravity of the moment (a scholarship submission). Reserve celebration to a single quiet line. |
| Rotating or spinning spinners | Reads as "the system is working hard." We prefer dots or a static indicator. |
| Shimmer / shine effects on buttons | Marketing visual; reads hype. |
| Parallax on scroll | Reads expensive and showy. Also an accessibility risk. |
| Animated gradients on backgrounds | Visual noise; fatigues. |
| Carousels that autoplay | Removes user agency; also an accessibility issue. |
| Modal exit animations longer than their entrance | Breaks the "settle in / cut out" instinct — users want to leave quickly. |
| Scroll-linked animations beyond "underline follows scroll" | Expensive, hard to tune, often broken on low-end Android. |
| Pulsing attention-grabbers (notification dots pulsing forever) | Visually noisy. A static dot is enough; a one-time ping on arrival is enough. |

---

## Performance guardrails

- Animate `transform` and `opacity` only, whenever possible.
- Avoid animating box-shadow, filter, backdrop-filter — expensive on mid-range Android.
- Prefer `will-change` on short animated gestures (modal open, sidebar expand); never leave it set permanently.
- Keep animation count on screen low — if more than three things are animating simultaneously, something is wrong.
- Test every motion on a representative mid-range Android device at 60Hz. If it drops frames, re-tune — don't ship.

---

## Shared motion tokens (CSS)

For CSS-driven transitions that match the TS motion tiers, drop these into `app.css`:

```css
:root {
  /* Durations (match TS tiers) */
  --motion-fast:     120ms;
  --motion-moderate: 220ms;
  --motion-slow:     360ms;

  /* Exit durations (shorter — gesture leaves faster than it arrives) */
  --motion-fast-exit:     80ms;
  --motion-moderate-exit: 160ms;
  --motion-slow-exit:     240ms;

  /* Easings */
  --ease-out:         cubic-bezier(0.33, 1, 0.68, 1); /* cubicOut */
  --ease-standard:    cubic-bezier(0.33, 1, 0.68, 1);

  /* Idle loop timing (loading dots, skeleton) */
  --motion-breath:    1200ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast:     0ms;
    --motion-moderate: 80ms;
    --motion-slow:     80ms;
    --motion-fast-exit:     0ms;
    --motion-moderate-exit: 80ms;
    --motion-slow-exit:     80ms;
    --motion-breath:   0ms;
  }
}
```

A CSS transition reads:

```css
.card {
  transition:
    transform var(--motion-moderate) var(--ease-out),
    opacity   var(--motion-moderate) var(--ease-out);
}
```

**Never** write `transition: all` — list the animated properties explicitly. This both avoids accidentally animating layout properties and matches the project's existing rule.

---

## Accessibility beyond reduced-motion

- Animations never flash (contrast changes faster than 3Hz) — this is a seizure-safety rule, not optional.
- Focus moves immediately on dialog open; the animation is purely visual.
- No motion is required to understand state (a slide-reveal always has a text label).
- Autoplay content (none in Arpli) would need explicit controls. We ship none.
- When a loading state exceeds 3 seconds, we add accessible text (`aria-live="polite"`) announcing the wait.

---

## Celebration moments — a note

Arpli users are applying for things that matter. When they submit, we celebrate — but like a friend who has been where you're going, not like a theme park.

- The screen renders "Submitted." in the display face.
- A soft rise-and-fade over 360ms (slow tier).
- One line of context underneath: "That's one down." (voice doc).
- No confetti. No modals. No ping sound.
- The user can keep moving — the celebration doesn't block.

If we ever add a bigger celebration (first acceptance, first scholarship won), it earns a slightly larger moment: a soft illustration, a longer line of warmth. Still no confetti.

---

## Pre-ship motion checks

Before any screen or interaction ships:

- [ ] Every animation uses one of the three defined tiers (fast / moderate / slow).
- [ ] Only `transform` and `opacity` animate (height / shadow / blur require explicit justification).
- [ ] No `transition: all`.
- [ ] Reduced-motion path tested and designed — not left to the browser default.
- [ ] Nothing flashes faster than 3Hz.
- [ ] Loading indicator for any wait >400ms; accessible text for any wait >3s.
- [ ] Interruption tested: cancel the animation mid-way; the final state is still correct.
- [ ] Tested on a mid-range Android device at low brightness.
- [ ] No motion that could be mistaken for urgency when the moment is routine.

---

## The one-sentence motion check

*Would this motion feel reassuring to a user with a scholarship deadline tomorrow — or would it make them feel the room is spinning?*
If motion makes the room spin, pull it.
