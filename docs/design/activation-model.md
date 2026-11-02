# Arpli — Activation Model & Four Triggers

*How does a user get from "I want to apply to this" to being inside an Arpli workspace?*

---

## The Core Problem

Every form a user would fill is a **webpage** — a React/Angular SPA. The form questions only exist once JavaScript runs and the DOM renders. You can't fetch them with a simple HTTP request (confirmed: Ashby, Greenhouse, LinkedIn all fail this way).

**The key insight:** Arpli is an Electron app — it already IS a Chromium browser. It can open any URL in a secondary embedded view, run JavaScript, read the rendered DOM, and extract form fields. No external dependency needed.

---

## The Four Triggers

All four will be designed and built. They serve different moments in the user's day.

---

### Trigger 1 — Paste a URL
**When:** User sees a job/form anywhere (email, Twitter, a website) and copies the link.
**What happens:** User opens Arpli → pastes URL → Arpli loads the page in an embedded Chromium view → extracts form structure → creates Application Workspace.
**Coverage:** Universal — works for every form that renders in a browser.
**Dependencies:** None. This is the MVP trigger.

**Design questions:**
- Where in the Arpli UI does the URL paste happen? (Home screen input? Command palette?)
- What does the loading state look like while Arpli reads the form?
- What if the form requires login? (LinkedIn, internal company portals)

---

### Trigger 2 — Browser Extension
**When:** User is browsing Chrome/Safari and lands on a job/form page.
**What happens:** Extension detects a form page → shows "Open in Arpli" button or badge → user clicks → Arpli opens with that form pre-loaded.
**Coverage:** Any form the user is actively browsing.
**Dependencies:** Chrome/Safari extension + communication channel to Electron app (deep link or local socket on 127.0.0.1).

**Design questions:**
- Does the extension auto-detect that you're on a form, or does the user trigger it manually?
- What does the extension UI look like — floating button, sidebar panel, or badge?
- How does the extension communicate with the desktop app? (Deep link like `arpli://open?url=...`, or local HTTP on a fixed port?)
- What if Arpli isn't running when the extension fires?

---

### Trigger 3 — Share from Phone
**When:** User sees an opportunity on mobile (Twitter, LinkedIn, newsletter, email) and wants to add it to Arpli on desktop.
**What happens:** User taps iOS Share Sheet → selects Arpli → URL is queued → Desktop Arpli shows "New opportunity waiting for you."
**Coverage:** Mobile-first discovery moments — the majority of how people find opportunities today.
**Dependencies:** iOS share extension + sync mechanism (local LAN or cloud relay).

**Design questions:**
- Does the URL open immediately on desktop, or go into an "inbox" queue?
- What's the iOS experience — just a share target, or also a mobile form-filling view?
- How does phone→desktop sync work without requiring an account/cloud? (LAN broadcast? iCloud? Clipboard?)

---

### Trigger 4 — Built into Arpli (Opportunity Discovery)
**When:** User browses opportunities directly inside Arpli — a curated feed, saved searches, or followed companies.
**What happens:** User browses → clicks an opportunity → Arpli opens the Application Workspace directly, no URL paste needed.
**Coverage:** Proactive discovery — Arpli becomes the starting point, not just the tool.
**Dependencies:** Opportunity intelligence layer — job board integrations, company feeds, or newsletter parsing.

**Design questions:**
- What's the source of opportunities? (Ashby public boards, LinkedIn scraping, newsletter parsing, RSS?)
- Is this a "for you" feed or a structured search?
- How does Arpli know what you're looking for? (From your profile, from past applications, from explicit preferences?)
- This is a significant product direction shift — Arpli as discovery tool vs. Arpli as filling tool.

---

## Technical Architecture Decision: How Does DOM Extraction Work?

When Arpli loads a form in its embedded Chromium view:

1. **Load** — Open URL in `<webview>` or hidden `BrowserWindow`
2. **Wait** — Wait for the page to fully render (listen for DOM mutations to settle, or use a fixed delay + retry)
3. **Extract** — Inject JavaScript: walk the DOM, find `<input>`, `<textarea>`, `<select>`, `[role="textbox"]` etc. Read labels, placeholders, aria attributes, surrounding text
4. **Normalize** — Map extracted fields to Arpli's internal form schema: `{ id, label, type, required, maxLength, options }`
5. **Persist** — Save the form structure to the application workspace

**Known edge cases:**
- Multi-step forms (questions revealed one at a time) — need to navigate forward and extract each step
- Login-gated forms — Arpli needs the user to log in inside the embedded view
- CAPTCHA on submission — Arpli fills answers, user completes CAPTCHA themselves

---

## The Handoff (How Answers Get Back Into the Form)

Two options:

**A. Copy-paste** — Arpli shows each answer, user copies it and pastes into the real form manually.
- Pros: User stays in control, deliberate review, no automation detection risk
- Cons: Friction — 20 questions = 20 copy-pastes

**B. Auto-fill** — Arpli injects the answers back into the embedded form view, user reviews and submits.
- Pros: Fast, seamless
- Cons: Some sites detect and block automation, form may have changed since extraction

**Decision pending.** Likely: auto-fill as the default, copy-paste as the fallback.

---

## Trigger Roadmap

| Trigger | Phase | Dependencies |
|---|---|---|
| URL Paste | MVP (Phase 1) | None |
| Browser Extension | Phase 2 | Chrome extension + deep link |
| Share from Phone | Phase 3 | iOS share extension + sync |
| Built into Arpli | Phase 4 | Opportunity intelligence layer |

---

*Last updated: November 2, 2026*
