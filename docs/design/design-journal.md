# Design Journal: Application Workspace

*Running capture of design conversations, open questions, and decisions. Updated as thinking evolves.*

---

## Status
Active exploration — pre-divergence. We have a sandbox at `/sandbox/application-workspace` but have not yet committed to any direction.

---

## The Central Product Question (Unresolved)

When a user "brings a form into Arpli," what mode are they in?

**Mode A — Form extraction:** Arpli visits the URL, parses the form structure, creates an internal copy of all questions. User answers inside Arpli. Arpli auto-fills the original.
- Pro: seamless, no context switching
- Con: parsing is hard, breaks on complex ATS systems, legal grey area

**Mode B — Embedded browser companion:** Arpli opens an embedded browser showing the actual form. The Arpli panel sits alongside. User fills the real form; Arpli assists.
- Pro: always works, form stays authoritative
- Con: cramped on smaller screens, limited to desktop

**Mode C — Extension/overlay:** Arpli runs as a browser extension that overlays on any web page. User is always on the actual form site.
- Pro: works everywhere, unobtrusive
- Con: requires extension install, separate platform entirely

**Mode D — Manual import (current sandbox):** User reads the form, pastes questions into Arpli. Arpli becomes the answer workspace. User copies answers back.
- Pro: always works, no parsing required
- Con: highest friction, questions may drift from original

*This question must be answered before the Application Workspace can be designed properly. Each mode implies a fundamentally different screen.*

---

## Design Tensions

1. **The form is elsewhere.** The real form lives on another site. Arpli is always in relation to something external — not a primary authoring surface.
2. **Different form types.** A 150-word YC answer and a 1,500-word Fulbright essay need different interfaces. Word limits, file uploads, structured data fields are all different contexts.
3. **Progress vs. draft quality.** Some users want to get through a form quickly; others are crafting something they'll submit to Rhodes or Fulbright. Different pacing, different AI involvement.
4. **The profile is the anchor.** Every answer should be grounded in the user's actual experience — the profile is what makes Arpli different from just using ChatGPT.

---

## Open Questions

- [ ] What integration mode does Arpli use? (See Central Product Question above)
- [ ] Does Arpli handle file upload prompts? ("Upload your writing sample") — how?
- [ ] What happens when a question has pre-defined answer choices vs open text?
- [ ] How does the user track overall progress across all questions in a form?
- [ ] What does "saving" mean? Is it saving to Arpli, or submitting to the real form?
- [ ] How does the version history connect to the actual submission?

---

## Sessions

### Session 1 (Oct 11)
- Built initial sandbox: `/sandbox/application-workspace` — PR #16
- Feedback: jumped to implementation without enough divergence
- Next: explore the design space properly before committing

### What the sandbox got right
- Three-column structure (question list | editor | context) — worth keeping as one of the directions
- Per-question tone/instruction controls
- Version history per question
- Mock data from a real fellowship (Schwarzman)

### What needs more exploration
- The header (opportunity metadata) — too much in one row?
- Does the "profile emphasis" chip work conceptually?
- What about forms with uploads, selects, dates — not just essay questions?
- The AI action — "Draft with AI" is the right verb but when/how it's invoked needs work


## Session — Nov 2, 2026: First Principles & Four Triggers

**Key shift this session:** Moved from designing the workspace UI to designing the product's activation model — how does a user get FROM discovering an opportunity TO being inside Arpli working on it?

**Core insight discovered:** Arpli is Electron, which IS Chromium. Every form is a webpage. The embedded Chromium view (webview / BrowserWindow) is the universal ingestion mechanism — no forks, no external dependencies.

**Decision made:** Design and build all four activation triggers, not just one:
1. URL Paste — MVP, universal
2. Browser Extension — Phase 2, frictionless for active browsing
3. Share from Phone — Phase 3, mobile-first discovery
4. Built into Arpli — Phase 4, proactive discovery

**Full documentation:** See [Activation Model & Four Triggers](activation-model.md)

**Open design questions from this session:**
- What's the exact UI for URL paste on the Arpli home screen?
- How does the browser extension communicate with the desktop app?
- Phone→desktop sync: account-based cloud or local LAN?
- Auto-fill vs copy-paste for the handoff?
- How does Arpli handle multi-step forms (questions revealed one at a time)?
