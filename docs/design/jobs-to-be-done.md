# Application Workspace — 10 Jobs to be Done

*Captured from design conversation Oct 11. These are the user jobs the Application Workspace must serve. Open each one to design it properly.*

---

## JOB 1 — Arrive and understand what I'm working on

Everything needed to feel oriented the moment the workspace opens.

- Opportunity header — title, organization, type badge (scholarship / grant / job / fellowship), deadline with live countdown ("6 days, 14 hours"), URL to the original form, eligibility summary
- Application status strip — qualifying → drafting → reviewing → submitted → awaiting → outcome. Visual pipeline, current state highlighted, clickable to change
- Progress at a glance — X of N questions drafted, word counts in/over range, unanswered questions
- Profile context panel — whose profile is active, link to profile, any detected profile gaps for this opportunity
- Personal notes area — free text I write to myself: "check if they want APA citations", "use research angle not startup angle"
- Quick-access source — original listing, rendered or linked, so I can reference without leaving

---

## JOB 2 — Understand each question before I answer it

- Question list sidebar — all extracted questions at a glance, jump to any, status dot per question (empty / drafted / edited / saved / over limit)
- Question detail card — full question text, word limit badge, any sub-prompts
- AI question analysis — "What is this question really asking for?" — the committee's intent surfaced before drafting
- Related questions link — "Q3 overlaps with Q5 — consider keeping consistent themes"
- Word limit type — hard cap vs. guideline vs. minimum-to-maximum range
- Manual question add — for questions the parser missed, cover letter fields, supplemental document prompts

---

## JOB 3 — Get a first draft fast

- One-click generate — uses full profile + opportunity context
- Tone selector — Concise / Warm / Formal / Narrative / Direct / Enthusiastic — set before drafting
- Word target — soft target within allowed range ("aim for 280 of 300")
- Free-form instructions — "Lead with my UBC research, mention the Kenyan solar project, close with the fellowship's specific mission"
- Model choice — which AI provider drafts this (fast cheap draft vs. thorough long draft)
- Draft all in parallel — fire all questions at once, fill them as they resolve
- Progress indicator while generating — streaming display or animated skeleton

---

## JOB 4 — Use my history and knowledge base

This is where Arpli becomes more than a text editor.

- Profile grounding — AI draws explicitly from: bio, education, work, projects, accomplishments, essays
- Relevant experience surfacing — show which profile items were used ("Pulled from: UBC AI Lab, Lekki Solar Grid project, 2024 NSERC award")
- Previous essays as source — "You wrote something similar for the Rhodes — want to use that as a base?"
- Cross-application insights — "You've answered a nearly identical question for the Google Fellowship."
- Gap identification — "This question asks about teaching. Your profile has none listed. Want to add something or handle it in the draft?"
- Profile quick-add from workspace — add a missing accomplishment without leaving the page; it immediately informs the current draft
- Evidence tagging — highlight claims that could use citations; attach links or documents to individual claims

**The growing context loop:** Every form you fill teaches Arpli more about you. When new information surfaces during drafting ("I just remembered I won a regional award"), Arpli asks: "This is new — should I add this to your profile?" The context compounds over time. The more you use it, the less you start from scratch.

---

## JOB 5 — Edit and refine the draft

- Rich text answer editor — prose-first, bold/italic/paragraphs, no markdown syntax showing
- Word count live — counts as I type, color-coded: green (in range), yellow (approaching), red (over)
- Character count option — for apps that cap by characters not words
- Version history — every generate and every save creates a version. AI versions vs. manual edits visually distinguished
- Diff view — what changed between my version and the previous AI version
- Track changes — inline view of what I added vs. what AI wrote
- Undo entire last AI generation as a single step
- Inline regenerate selection — highlight a sentence → "Rewrite this section"
- Expand / condense — "I'm 50 words short, expand" / "I'm 40 over, trim" — targeted, not full regen
- Readonly mode — lock a draft so I don't accidentally edit it

---

## JOB 6 — Hear myself (voice)

Voice input is first-class, not a bonus.

- Voice answer mode — open mic, speak the answer, get a live transcript. AI polishes it into a draft while preserving exact points and voice
- Voice instructions — instead of typing "lead with the research angle", say it
- Voice annotation — add audio notes to a question without converting to text. Personal reminders, not part of the draft
- Speak → instant draft — ramble for 90 seconds, AI extracts structure and drafts from that, not just from the profile
- Mixed mode — start voice, switch to typing to refine, back to voice for a paragraph
- Transcription display — raw transcript always visible alongside polished draft

---

## JOB 7 — Get help when I'm stuck or unsure

- Critique mode — "What's weak about this?" — AI reviews against likely selection criteria, gives specific feedback
- Scoring — relevance (is this actually answering the question?), specificity (concrete examples?), fit (aligns with their stated values?)
- Rewrite suggestions — inline margin comments: "This paragraph is vague — consider naming a specific outcome"
- Opening line alternatives — "Give me 3 different ways to start." I pick one, rest stays intact
- Closing line alternatives — same for endings
- Tone check — "Does this sound like me or like an AI?"
- Plagiarism self-check — compare against my own other drafts to avoid verbatim repetition across apps
- Eligibility flag — "Based on your profile, you may not meet: 'Must be enrolled full-time'" — surface early
- Ask a question — free-form chat about this specific application. Contextual, not generic

---

## JOB 8 — Manage the full application, not just the answers

- Checklist for supporting documents — rec letters, transcripts, portfolio link. Status: needed / requested / ready / uploaded
- Application requirements — full submission criteria with completion state
- Deadline tracker — countdown + "If you need two rec letters, request them 2 weeks before. That's [date]"
- Status update — move through the pipeline from this page. Mark "submitted" → auto-stamps date
- Submission notes — email/portal submitted to, confirmation number
- Post-submission log — interview invite, rejection, waitlisted, additional materials requested

---

## JOB 9 — Copy my work into the actual form

The workspace is not the submission surface — the real form is elsewhere. This handoff is critical.

- Copy answer to clipboard — one-click per question, formatted as plain text (no markdown)
- Copy all answers — all drafted answers in sequence, separated cleanly, ready to paste in order
- Open source URL — click to open original form in browser, ready to paste
- Side-by-side mode — workspace left, embedded browser/webview right showing the actual form. Paste directly without switching apps
- Field mapping — AI identifies which draft answer maps to which form field on the target URL
- Auto-paste (future) — for known platforms (Submittable, common university portals), fill form fields via extension
- Export as document — clean Word doc or PDF for apps that require a document submission

---

## JOB 10 — Manage multiple applications without losing track

- Related applications — "You have 3 others to similar organizations." Are any asking the same question?
- Application notes — running log personal to this application. Not drafts. Notes: "This committee cares about community impact"
- Reuse manager — surface answers from other applications that match this question type. Candidates to choose, adapt, or ignore — not auto-paste
- Tag and categorize — type, organization, deadline month, status
- Opportunity comparison — "Of your active drafts, this one has the highest match with your profile"

---

## The Extension → Workspace Flow

The activation loop that makes everything else matter.

1. Browsing. See an opportunity — fellowship page, grants portal, LinkedIn job posting.
2. Click the Arpli extension.
3. Extension extracts page content → fires to daemon → gets parsed opportunity back.
4. Arpli desktop comes forward (or opens).
5. "Confirm this opportunity" half-step — see what was extracted, confirm or edit.
6. One click → Application workspace opens, questions loaded, ready to draft.
7. Workspace shows live link back to source page.

**The experience must feel like:** I clicked once on a webpage and I'm in a personalized workspace with my questions already loaded. Not like I pasted a URL and waited for a parser.

---

## The Underlying Principle

Every draft must sound like the user. Not like an AI. Not like a template. The value proposition is not "AI writes your application" — it's "AI drafts from what you actually know, then gets out of the way so you can make it yours."

The draft is the starting line, not the finish line. Every element should invite editing, iterating, speaking, thinking — not just generating and copying.
