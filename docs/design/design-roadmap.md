# Arpli — Design Roadmap & Figma Plan

The engineering build and the design work run in parallel. By the time Phase 1 ships a working app, the visual language should be fully defined and ready to implement on top of it.

---

## Your role
You are the designer. The design agents assist you — they don't make aesthetic decisions for you. Figma is where you lead; the agents implement what you define.

---

## What to do in Figma right now (while engineering builds)

### Stage 1 — Art Direction (do this first)
Before any components or screens, define what Arpli FEELS like.

- **Mood board**: collect 10–15 visual references. Not necessarily other apps — materials, typography specimens, photography, brand moments. What emotional register does Arpli sit in? (Trustworthy and calm? Sharp and precise? Warm and human? Technical and confident?)
- **Keywords**: 5 adjectives that should describe the Arpli experience
- **Anti-keywords**: 3 things Arpli must NOT feel like
- **Reference apps/products**: 2–3 products whose design language you respect and can learn from (doesn't have to be direct competitors)

*Deliverable*: A mood board frame in Figma + a short brief (3–5 sentences) on the visual direction.

---

### Stage 2 — Typography
- Choose 1–2 typefaces (heading + body, or one typeface doing both)
- Set the type scale: 5–7 sizes from caption to display
- Define line height, letter-spacing, and weight choices per level
- Test at small sizes (12–13px) — Arpli will have dense information at times

*Deliverable*: Type specimen frame in Figma. CSS custom properties ready to drop into tokens.css.

---

### Stage 3 — Color System
This maps directly to the tokens.css custom properties already in the codebase.

- **Brand palette**: 1 primary color (used for actions, focus states, highlights)
- **Surface hierarchy**: 8 surface levels (already in tokens.css as --surface-1 through --surface-8) — define the values for both light and dark mode
- **Semantic colors**: danger, warning, success, info — what hues?
- **Foreground/background**: text and surface base values

*Deliverable*: Color system frame in Figma. HSL values for each token ready to paste into tokens.css.

---

### Stage 4 — Motion Language
The codebase already has spring physics (spring-fast, spring-moderate, spring-slow). Define what those should feel like for Arpli.

- What is Arpli's motion personality? (Snappy? Gentle? Energetic? Calm?)
- Which interactions animate at all? (Not everything should move)
- Define 3 spring presets: fast (e.g. button feedback), moderate (panel transitions), slow (page-level changes)

*Deliverable*: Motion principles written up. Spring values to configure in the code.

---

### Stage 5 — Component Inventory
Map out every UI component Arpli needs — based on what you know about the flows.

Known screens: Onboarding (4 steps), Profile, Opportunities library, Application tracker, Settings, Opportunity intake, Application drafting.

For each component, note: what it does, what states it has (default, hover, active, disabled, loading, error).

*Deliverable*: Component map frame in Figma — a grid of every component you'll need to design.

---

### Stage 6 — Key Screen Designs (after Phase 1 ships)
Once the functional app is running, you'll have real flows to react to. These screens get designed after:

- Onboarding flow (4 steps)
- Profile view — filled state + empty state
- Opportunity intake — pasting an opportunity
- Application drafting — question answering with AI
- Application tracker — Kanban view
- Settings — AI model configuration

---

## When Figma connects to this workspace

When you connect Figma:
- A design agent will read your Figma file to understand what you've built
- It can push token values from your color/type decisions directly into tokens.css
- It can implement screen designs as Svelte components on top of the functional code

---

## Team Structure

| Team | Who | What they do |
|---|---|---|
| **Product** | Arpli Product agent | Roadmap, feature ideas, spec updates |
| **Engineering** | Implementor agents (per task) | Build features, write code |
| **QA/Verify** | Verifier agent (after each wave) | Review output, check spec compliance |
| **Design** | You (lead) + design agents (assist) | Visual language, Figma, component design, design-to-code |
| **Coordinator** | This agent | Orchestrates all teams, delegates, tracks progress |

---

## Current Status
- Phase 1 engineering: Wave 2 running (profile engine, AI connector, desktop UI)
- Design work: Stage 1 (Art Direction) — ready for you to start in Figma


## Emotional Register — Human-Centered Analysis (Oct 10, 2026)

### User Emotional State When Applying

**Core emotional cocktail:**
- Vulnerable — asking to be evaluated and possibly rejected
- Overwhelmed — blank page, 20-question form, no idea where to start
- Isolated — no mentor, no network, no one nearby who has done this before
- Impostor syndrome — "do I deserve to apply? are my achievements enough?"
- Time-pressured — deadlines are real and unforgiving
- Skeptical — "is this tool actually made for someone like me?"

**Nigeria / Africa context adds:**
- Scarcity framing — sometimes applying for survival, not just growth
- Invisible structural barriers — knowing the odds are stacked
- Mistrust of tech hype — tired of tools that promise and don't deliver for them

### Counterbalancing Emotional Register

Core: **Steady · Warm · Enabling**

Like a knowledgeable, calm friend who has been where you're going — knows the unwritten rules, helps you present your best self, and does it without making you feel small.

| User feels → | Arpli should feel → |
|---|---|
| Overwhelmed | Structured, step-by-step, one thing at a time |
| Isolated | Alongside — never leaves you with a blank page |
| Impostor syndrome | Affirming — helps you see your own strength |
| Skeptical | Specific and grounded — no abstract hype |
| Time-pressured | Efficient — no wasted motion |
| Vulnerable | Safe — non-judgmental |

### Positive Adjectives (The YES list)
Steady · Warm · Clear · Enabling · Grounded · Alongside · Capable · Honest

### Anti-Keywords (Never these)
Technical · AI-heavy · Clinical · Cold · Expensive-looking · Out-of-reach · Feature-dense · Overwhelming · Difficult · Impressive (for its own sake)

### Guiding Phrase
**"The knowledgeable friend who's been where you're going."**
Not a product. A presence. Knows the unwritten rules. Helps you show up at your best.

### Implications for Voice and Design
- **Copy**: Short sentences. Active verbs. Outcome-focused. Never "leverage AI to…"
- **Empty states**: Encouraging and specific — never neutral
- **Onboarding**: Feels like a conversation, not a form
- **Error states**: Matter-of-fact and helpful — never alarming or blaming
- **AI output**: Presented as yours, not the machine's — it's your story, amplified
- **Visual**: Warm neutrals > cold blues · Human type scale > techy mono · Breathing room > density · Restraint > impressiveness
