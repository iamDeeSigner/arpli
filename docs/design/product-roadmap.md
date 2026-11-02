# Arpli Product Backlog — Epics & JTBD

## Working Mode (the order that matters)

1. **Product thinking** — conversations here. Break epics into flows and JTBD. No building without shared understanding of intent and why it matters.
2. **Design** — before any engineering task, screens are sketched in Pencil/Figma and approved. You design; agents assist and implement what you define.
3. **Engineering** — agents build only after design approval. Backend work that doesn't depend on UI may run in parallel.

---

## Design Principles (cut across everything)

- **Local-first, private-by-default** — feels like your personal space, not a service
- **Supportive companion** — every moment feels like working with an encouraging advisor, not a robot
- **Voice preservation** — AI amplifies you, it doesn't replace you. The output should sound like you
- **Progressive disclosure** — show only what's needed when it's needed; never overwhelm
- **Reduce the weight of applying** — applying is already emotionally costly; remove obstacles, don't add them

---

## Epics

### E1 — Arrival & Onboarding
**Core JTBD:** "Help me understand what this is, trust it, and get to my first useful moment without a long setup."

**Why it matters:** First impressions determine whether someone commits. If the first 5 minutes are confusing or don't demonstrate value immediately, they leave — and the work of building a profile never happens.

**Key flows:**
- First launch: what do I see and why does it make me want to stay?
- Value proposition moment: "here is what you'll be able to do — and it's different from everything else because it's yours, local, private"
- AI provider setup: guided choice between Groq (free, no card), Ollama (local), and paid tiers — with real guidance on which to pick
- First profile prompt: how do I get the user to start building without feeling like a form
- "Your first application in 3 steps" — a micro-guided experience on day one so the user sees the whole loop
- What does "done with onboarding" feel like?

**Built so far:** 4 routes exist: /onboarding → /onboarding/connect → /onboarding/profile → /onboarding/done. Shallow 4-step wizard. Needs full redesign.

**What's wrong with the current flow:**
- Value proposition is abstract jargon ("personal application intelligence hub") — user feels nothing
- AI setup appears before the user has experienced any value — high drop-off risk
- Profile start is a cold blank form — no warmth, no guidance on what to write
- "Done" screen doesn't deliver an aha moment — user lands in the app not knowing what to do
- No first output — user never experiences "this knows me" during onboarding

**Proposed redesigned flow (5 steps):**

1. **Welcome** — Emotional, not a feature list. Acknowledge the user's situation: applications are competitive, most feel copy-pasted, Arpli is different because it's yours and local. One clear CTA: "Let's start."

2. **A little about you** — 3 warm conversational questions before any technical setup:
   - What's your name?
   - What do you do? (student / researcher / founder / professional)
   - What's one thing you're genuinely proud of?
   This seeds the profile. No form feel — feels like a quick chat. Done in 2 minutes.

3. **Connect your AI** — Opinionated, not a menu. Lead with Groq (free, 30 seconds, no card). One link, one field to paste the key. "I use something else" → secondary path for OpenAI / Claude / Ollama.

4. **Your first draft preview (the aha moment)** — Take the 3 answers, generate a 2-sentence personal statement opening. Show it. "This is Arpli working with your story. The more you tell it, the sharper it gets." This is the moment the product proves itself.

5. **Into the app** — Not "done." A specific first action: "Your profile is started. Add more or find your first opportunity." Two clear paths. No blank dashboard.

**Open design questions (to resolve before design starts):**
- Is the aha moment (tiny first draft during onboarding) the right hook, or should that happen after the user is fully in the app?
- AI setup before or after the personal questions?
- Emotional tone: problem-focused ("applications are broken") vs. aspirational ("your story deserves to be told well")?
- Minimum profile capture: is 3 questions enough before the aha moment?

**Design status:** Ready to design — flows defined, questions to resolve in session
**Depends on:** Nothing

---

### E2 — Identity & Profile
**Core JTBD:** "Help me capture who I am so AI can represent me accurately and compellingly across every application."

**Why it matters:** The profile is the source of truth for every AI output. A shallow profile = generic drafts. A rich, structured profile = applications that actually sound like the person. Everything else in the app depends on this.

**Key flows:**
- Resume/CV import (PDF, DOCX) → structured extraction into sections
- "Tell me about yourself" — conversational profile building via voice or text
- Structured profile sections: summary/bio, education, work experience, projects, skills, awards, publications, volunteerwork
- Each section: add, edit, delete individual entries
- Writing voice calibration: formal/casual, direct/narrative, first-person intensity
- Profile completeness indicator: "your AI drafts improve when you add X"
- "How AI sees me" — a preview of what context gets sent to the model
- Profile update flow: "I just got a new award / started a new job — how do I add this?"
- Profile versioning considerations: what if I want a different profile for different types of opportunities?

**Built so far:** Bio text input, resume import modal, voice input MicButton. The DB has all the structure (education, work, projects, accomplishments) but the UI only surfaces bio. Deep redesign needed.
**Design status:** Surface exists, full UX not designed
**Depends on:** Nothing — this is the foundation

---

### E3 — Opportunity Intelligence
**Core JTBD:** "Help me quickly understand if this opportunity is worth my time before I invest in applying."

**Why it matters:** Users waste enormous energy applying to things they're not right for, or skipping things they would win. Fit analysis before commitment is one of the highest-value things this app can do.

**Critical insight:** Discovery happens in the browser, not in the app. Users stumble on opportunities while scrolling — a fellowship page, a grant listing, an accelerator site. The friction of switching to Arpli, copying a URL, and pasting it manually means many opportunities get forgotten or never captured. The entry point for E3 must meet users where they are.

**Key flows:**

*In-app capture (current):*
- Add opportunity: paste URL, or type/paste raw description text
- Opportunity parsing: AI extracts deadline, eligibility, requirements, essay prompts, word limits, focus areas
- Opportunity detail view: all parsed requirements, timeline, what materials are needed
- Saved opportunities list: browse what you've added

*Browser extension capture (future surface — see E12):*
- One-click capture while browsing: click extension → page is parsed and saved to Arpli
- Mini popup: shows what was captured, lets user confirm or add a quick note before saving
- Catalog, don't act: extension only documents and categorizes — it never auto-fills or submits anything
- Status: "saved to Arpli, waiting for you when you're ready"

*Analysis:*
- Fit analysis view: "Here is how you match this — your strengths, the gap, and our honest read on your odds"
- Gap framing: not "you're not qualified" but "here's what would strengthen your case"
- Future: strategic portfolio view — am I applying to a healthy mix of reach/match/safety?

**Built so far:** Opportunity input form + basic parsing. Fit analysis and detail view not designed or built.
**Design status:** Basic input only. Full intelligence layer needs design.
**Depends on:** Profile (for fit analysis)

---

### E4 — Application Crafting
**Core JTBD:** "Help me create compelling, tailored materials that sound like me — without starting from scratch every time."

**Why it matters:** This is the core value loop of the app. If drafting feels magical and fast, and the output doesn't read like generic AI slop, users will never go back to writing alone.

**Key flows:**
- Choose what to create: personal statement, statement of purpose, cover letter, specific prompt response, CV tailoring
- Essay prompt entry: paste the exact prompt, set word/character limit
- First draft generation: AI uses profile + opportunity context to write
- Draft editing: rich text editor, inline editing, undo history
- AI suggestions within the editor: "rephrase this paragraph", "make this more specific", "add a concrete example"
- "Too AI" meter / authenticity controls: slider or feedback for how much to push toward your natural voice
- "Write more like my bio" — anchoring to voice samples
- Multi-prompt applications: some opportunities have 5+ distinct prompts; managing them as a set
- Word/character count: live count, warnings, "help me cut this by 150 words"
- Adapting existing material: "I wrote something similar for X — use that as a starting point"

**Built so far:** Basic draft generation UI on the application/[id] page. No rich editor, no inline AI suggestions, no multi-prompt management.
**Design status:** Stub only. Full drafting experience not designed.
**Depends on:** Profile, Opportunity

---

### E5 — Refinement & Review
**Core JTBD:** "Help me know if my application is actually good before I submit it — and tell me honestly."

**Why it matters:** Users often can't tell if their draft is strong or just familiar. An honest reviewer mode that simulates how a committee reads the application is one of the most requested features in this space.

**Key flows:**
- Reviewer mode: AI reads the application from the perspective of a selection committee and gives structured feedback
- Prompt compliance check: "Does this actually answer what was asked?" with specific callouts
- Story structure review: does it have a clear arc? Does it answer who/what/why?
- Specificity check: flags vague claims ("I am passionate about") and suggests concrete examples from profile
- Word count compliance review: is this within limits?
- Authenticity check: "Does this sound like you based on your writing voice?"
- Comparison to profile: "You mentioned this achievement in your profile — you should include it here"
- "Read it aloud" mode: synthesized voice reads back the essay so you can hear how it flows

**Built so far:** Nothing.
**Design status:** Not started
**Depends on:** Application Crafting (E4)

---

### E6 — Tracking & Pipeline
**Core JTBD:** "Help me stay on top of multiple applications without dropping anything — and pick up exactly where I left off."

**Why it matters:** Serious applicants manage 5–20 concurrent applications. Without a single place to track all of them — with deadlines, statuses, and what's blocking each one — things fall through the cracks and deadlines get missed.

**Key flows:**
- Application list / Kanban: status columns (Exploring → Drafting → Reviewing → Submitted → Awaiting → Outcome)
- The DB already has the status enum: discovered, qualifying, drafting, reviewing, submitted, awaiting, won, rejected, waitlisted, withdrew
- Deadline view: "What's due this week / this month" — deadline-first calendar view
- Context restoration: "You were working on the leadership essay — here's where you left off"
- Priority / urgency signals: deadline proximity drives visual weight
- Notifications / reminders: "Your Rhodes application is due in 3 days"
- Application history: a record of everything, even completed or withdrawn applications
- Progress within an application: % of required materials drafted/reviewed

**Built so far:** Applications list page exists. Status enum is in DB. Kanban layout not designed or built.
**Design status:** List page only. Full pipeline experience not designed.
**Depends on:** Opportunity, Application

---

### E7 — Material Library (Essay Bank)
**Core JTBD:** "Help me build a personal collection of my best writing so nothing goes to waste and I'm never starting from scratch."

**Why it matters:** Over time, a user's best work sits in applications they submitted and forgot. The library surfaces reusable gold: strong paragraphs, well-crafted stories, good answers to common prompt types. It becomes exponentially more valuable with each cycle.

**Key flows:**
- Save a draft / section to library with title and tags
- Tag by theme: leadership, adversity, research motivation, community impact, etc.
- Search library: "find everything I've written about resilience"
- "Use this as a starting point" from library into a new draft
- "This prompt is similar to something you've written before" — proactive suggestion
- Curated personal story library: my top 5 stories / examples I always draw from
- Review and retire: "this no longer represents who I am — archive it"

**Built so far:** Nothing. (profileEssays table exists in DB — good foundation.)
**Design status:** Not started
**Depends on:** Application Crafting (E4)

---

### E8 — Recommenders & Support
**Core JTBD:** "Help me manage the people who are going to bat for me — so I don't drop the ball on their end."

**Why it matters:** For fellowships, scholarships, and grad school, a significant part of the application is out of the user's hands — it lives with recommenders. Tracking who agreed, whether they've submitted, and what to send them is a chronic pain point.

**Key flows:**
- Add a recommender: name, role/relationship, email, deadline for their letter
- Status tracking: Asked → Confirmed → Reminder needed → Submitted
- Reminder flow: "Prof. Okafor's letter is due in 5 days and shows as pending"
- Materials to share: one-click package — "here's my CV, personal statement, and a note about this opportunity" for the recommender
- Multiple recommenders per application (most need 2–3)
- Recommender history: who has written for you before, for what

**Built so far:** Nothing.
**Design status:** Not started
**Depends on:** Application Tracking (E6), Profile (for share package)

---

### E9 — Outcomes & Growth
**Core JTBD:** "Help me learn from every application — wins and losses — so I become a better applicant over time."

**Why it matters:** Applications happen in seasons. After a cycle ends, users want to understand what worked, what didn't, and how to improve. Without this, each cycle starts from zero. With it, the app becomes a genuine long-term partner in their development.

**Key flows:**
- Mark outcome: won / rejected / waitlisted / declined by me
- Rejection reflection (optional, gentle): "Would you like to note any feedback you received or what you'd do differently?"
- Win reflection: "What do you think made this application strong?"
- Cycle overview: visualize a full application season — what you applied to, what you won, patterns
- AI-powered pattern analysis: "Your most successful applications emphasize X; your weaker ones lack specific examples"
- Longitudinal profile view: "Your profile has grown — here's what's changed in the last year"
- Application improvement suggestions: "Based on your outcomes, here are areas to strengthen"

**Built so far:** Status enum exists in DB (won, rejected, waitlisted, withdrew). No outcome UI or analytics.
**Design status:** Not started
**Depends on:** Tracking (E6), multiple completed applications

---

### E10 — AI Collaboration & Voice
**Core JTBD:** "Help me feel like the AI is co-writing with me — not writing for me. My voice should come through."

**Why it matters:** The #1 fear users have with AI-assisted applications is "this doesn't sound like me." If the AI is indistinguishable from any other user's AI output, the application loses the authentic voice that selection committees are actually looking for.

**Key flows:**
- Voice calibration: sample writing → AI learns your rhythm, vocabulary, and formality level
- Writing style settings: formal↔casual, narrative↔direct, sparse↔detailed
- "Make this more me" — inline refinement tied to voice profile
- Per-model assignment: use Groq for quick drafts, Claude for final polish
- Feedback loop: "I liked this paragraph" / "not quite right" — AI learns over time
- Transparency layer: distinguish AI-generated from user-edited sections visually
- "Explain this choice" — AI explains why it wrote something a certain way

**Built so far:** Model selection in settings. No voice calibration or transparency layer.
**Design status:** Settings stub only. Voice and collaboration flows not designed.
**Depends on:** Profile (voice samples from bio), Application Crafting (E4)

---

### E11 — Settings & Data Control
**Core JTBD:** "Help me trust that my data is mine, I know where it lives, and I can always get it back."

**Why it matters:** Local-first is a promise. Users choosing Arpli over cloud alternatives are making a bet that their sensitive professional data won't be sent to a server. This trust must be visible and verifiable in the UI.

**Key flows:**
- AI provider management: add, test connection, set as default, remove
- Data location: show where the SQLite file lives, option to move it
- Export all data: download everything as JSON or PDF portfolio
- Import from other tools: bring in data from LinkedIn, Notion, CV files
- Notification preferences: deadline reminders on/off, how far in advance
- App update / changelog: what changed in this version
- Account reset / fresh start: wipe data and start over (with confirmation)
- Storage usage: how big is my database?

**Built so far:** AI provider settings page. Data location, export, notifications not built.
**Design status:** Provider settings only. Full settings experience not designed.
**Depends on:** Nothing (can be built anytime)

---

## Cross-epic: The Emotional Layer

This isn't an epic — it's a quality standard that applies everywhere.

Arpli users apply from a place of **hope mixed with vulnerability**. They're asking: "Am I good enough?" The product must never make that anxiety worse.

- **Empty states** must encourage, not shame. "You haven't added any applications yet" → "Let's find your first opportunity."
- **Rejection handling** must be gentle, private, and forward-looking
- **Progress** must feel visible — users need to feel momentum even on slow days
- **AI output** must never feel like it's judging the user — it's working *with* them
- **Celebrating wins** — accepted applications should feel like a real moment

---

## What's been built (Phase 1 summary)

| Epic | What exists | Depth |
|------|------------|-------|
| E1 Onboarding | 4-step wizard | Shallow |
| E2 Identity & Profile | Bio + resume import + voice input | Shallow — DB has full schema, UI doesn't |
| E3 Opportunity Intelligence | Input form + basic parse | Stub |
| E4 Application Crafting | Draft generation page | Stub |
| E10 AI Collaboration | Model selection settings | Minimal |
| E11 Settings & Data | AI provider settings | Minimal |
| E5–E9 | Not started | — |

---

---

### E12 — Browser Extension (Opportunity Capture)
**Core JTBD:** "Let me capture an opportunity in one click while I'm browsing — without breaking my flow or switching apps."

**Why it matters:** This is a missing link in the discovery-to-application pipeline. Right now there's a dead zone between "I found something interesting online" and "I'm ready to apply in Arpli." The extension bridges it without requiring the user to interrupt their browsing or remember to follow up later.

**What it does:**
- Installed from Chrome Web Store (or developer mode for early users)
- One click while on any opportunity page → extension reads the page content → sends to the local Arpli daemon (already running on port 4848)
- Daemon extracts: title, organization, deadline, description, requirements, apply link
- Adds to Arpli opportunities list with status "discovered"
- Extension popup: shows a summary of what was captured + optional quick note

**What it does NOT do:**
- Auto-fill any forms
- Submit anything
- Store data anywhere except the local SQLite database
- Require an account or cloud connection

**Technical notes:**
- Chrome extension content script reads the DOM, POSTs to http://127.0.0.1:4848/api/opportunities/capture
- Daemon needs CORS headers for localhost extension origin
- No new parsing logic needed — reuses existing opportunity parser
- Needs a dedicated /capture endpoint in the daemon

**Design scope:**
- Extension popup UI (icon, capture confirmation, quick note field, "open in Arpli" link)
- Extension icon states: idle / capturing / captured / error (daemon not running)
- In-app: "Captured from browser" badge on opportunity cards
- Graceful error: "Make sure Arpli is running on your computer"

**Phase:** Not in scope for current sprint. Design when E3 in-app intelligence is complete.
**Design status:** Idea parked. Needs full UX exploration before engineering.
**Depends on:** E3 (opportunity detail must exist to receive captured opportunities), daemon running locally

---

## What to design first

**Recommendation: E2 Identity & Profile — full redesign.**

Reason: Every other epic depends on a rich, complete profile. If users don't understand the value of building their profile deeply, every downstream feature underperforms. This is the highest-leverage design investment right now.

After E2: E1 (Onboarding redesign to lead users into E2 intentionally), then E3 and E4 together (they form the core application loop).
