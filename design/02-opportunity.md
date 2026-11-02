# 02 · Choose the bet · Arpli v1 scope

**Phase:** Define · Prioritize · **Depth:** deep · **AI overlay:** on · **Date:** 2026-11-02
**Inputs:** `01-preplanning.md` (G1: GO with edits). Design OS stage 3 (Make sense) was skipped by decision, so opportunities trace to Frame's HMWs, job map, job stories and desk research instead of an evidence count from interviews. · Confidence labels as in Frame.
**Sources opened:** `01-preplanning.md` · Design OS `modules.md` (Prioritize contract) · `~/design-os/stage-checks/stage-4-notion.md` · HCD ch. 3 and ch. 4 (opened in Frame) · skill: opportunity framework.

**Stage 4 re-locks, it doesn't re-create:**
| From Frame | Status |
|---|---|
| Objective and KR1 to KR3 | **confirmed** (owner accepted as working versions) |
| Appetite: three batches of up to 6 weeks | **confirmed** |
| Rabbit-hole calls | **confirmed** |
| DVF: desirability weakest | **confirmed** |

---

## 1. Moments of truth

| # | Moment | Job map step | Linked to |
|---|---|---|---|
| M1 | First run: from install to a first useful draft | Gather | KR1 |
| M2 | "I found this": an opportunity seen in Chrome or on X gets saved | Plan, Gather | HMW 3 |
| M3 | Facing a question: from blank page to a true draft in my voice | Organise, Perform | KR3, HMW 2 |
| M4 | Filling the real form: fields and answers go in, I press Submit | Perform | KR2, HMW 3 |
| M5 | Something new happened: it goes into the bucket in seconds | Gather, Close | HMW 1 |
| M6 | Keeping track: what's due, and where each application stands | Verify and track | KR2 |

## 2. Opportunities

Written with HCD ch. 4 template #2: "We believe we will achieve [outcome] if [persona] can [need] using [feature]."

| # | Opportunity | Hypothesis | Traces to |
|---|---|---|---|
| O1 | **Pour in what you have** | We'll get people to a strong first draft if applicants can turn what they already have (CV, LinkedIn export, a voice ramble, links, files) into their bucket in minutes. | HMW 1 · M1, M5 · H1 |
| O2 | **True drafts in your voice** | We'll get drafts people submit if applicants can get answers built only from their own material, with every claim traceable, in their own wording, at the AI help level the opportunity allows. | HMW 2 · M3 · KR3 · harms 1, 2, 3 |
| O3 | **Story interview** | We'll get stronger material into the bucket if applicants can be interviewed (often by voice) and see their experience turned into strong, true statements. | HMW 2 · M5 · H3 |
| O4 | **One-click capture** | We'll lose fewer opportunities if applicants can save any page or post (including X) from Chrome, with its deadline and questions pulled out. | HMW 3 · M2 · gap 5 |
| O5 | **Form companion** | We'll save real time if applicants can see a form's questions next to the form, fill fields with one press each, attach their CV, and copy anything. | HMW 3 · M4 · A5 |
| O6 | **First run and AI with no keys** | We'll get people started if applicants can connect AI they already have (or a private local model) without keys, and see plainly where their text goes. | M1 · KR1 · A4 |
| O7 | **One tracker** | We'll keep people applying if applicants can see status and deadlines in one place and get a Mac reminder before each deadline. | M6 · KR2 |
| O8 | **Tailored documents** | We'll save rewriting if applicants can get a CV, cover letter or pitch summary tailored to this opportunity from the same bucket. | job story 6 |
| O9 | **Learn from each form** | The bucket grows without extra work if, while drafting, applicants are asked "this is new, save it to your profile?" and "anything I should know for this one?". | HMW 1 · M5 · H2 · Dossier idea 4 |
| O10 | **Reuse past answers** | We'll avoid starting from scratch if applicants are shown "you answered something similar for X". | HMW 1 · roadmap E7 |
| O11 | **Arpli finds opportunities for you** | We'll help people find what's worth their time if Arpli searches for opportunities that match their bucket. | job map step 1 (Plan) · activation model trigger 4 · **v2** (owner) |
| O12 | **Watch my sources** (added by the owner at G2) | We'll keep people's pipeline full if applicants can add the job boards and opportunity sites they already trust and be told what's new there, with deadlines pulled out. | job map step 1 (Plan) · M2 · O4 capture |

## 3. Filters (before scoring)

| # | Needed this cycle? | Our advantage? | Serves the core job? | Beats the ChatGPT habit? | Passes |
|---|---|---|---|---|---|
| O1 | yes, nothing works without it | yes: local, cross-type | yes | yes: done once, used every time | ✓ |
| O2 | yes | **yes, the differentiator** (section 8 of Frame) | yes | yes: traceable and in your words | ✓ |
| O3 | maybe | partly | yes | unknown | ✓ (test) |
| O4 | yes | partly (nothing captures from X) | yes | yes | ✓ |
| O5 | yes | no on its own (Simplify, Huntr); yes when fed by the bucket | yes | yes: no pasting between tabs | ✓ |
| O6 | yes, it gates everything | yes: no keys, no account, open source | enabling | yes | ✓ |
| O7 | yes (owner: "all four") | no on its own | partly (Verify step) | n/a | ✓ |
| O8 | owner wants it | partly | yes | yes | ✓ |
| O9 | nice | yes | yes | yes | ✓ |
| O10 | low in v1 (the bank starts empty) | yes | yes | yes | ✓ (later) |

## 4. Light opportunity solution tree

**Outcome:** real applicants put their true best selves into real applications, with far less effort.
- **"My evidence is scattered"** → O1 pour in · O9 learn from each form · O3 story interview · O10 reuse
- **"I can't phrase it, the page is blank"** → O2 true drafts · O3 story interview
- **"Forms are repetitive and live somewhere else"** → O5 form companion · O4 capture
- **"I lose opportunities and deadlines"** → O4 capture · O7 tracker
- **"Setup stops me before I start"** → O6 first run

## 5. Scores

Impact (H 3 · M 2 · L 1) × confidence ÷ effort (S 1 · M 2 · L 3). **Effort is a relative guess, not weeks.** We have no build-speed history yet (planning-fallacy warning); Batch 1 gives us one.

| # | Impact | Confidence | Effort | Score | Kano | Note |
|---|---|---|---|---|---|---|
| O7 tracker | 2 | 80% (engine has statuses) | S | **1.60** | must-be | |
| O4 capture | 2 | 70% (extension reads any page) | S | **1.40** | performance | |
| O6 first run | 3 | 80% (paths known, section 9) | M | **1.20** | must-be | |
| O1 pour in | 3 | 70% (importer built; UI missing) | M | **1.05** | must-be | |
| O9 learn from forms | 2 | 50% | S | **1.00** | attractive | |
| O2 true drafts | 3 | 60% (drafting built; guard and levels new) | M | **0.90** | attractive → performance | override: Must |
| O5 form companion | 3 | 60% (widgets are per-site work) | L | **0.60** | performance | override: Must |
| O10 reuse | 2 | 50% | M | **0.50** | attractive | |
| O3 story interview | 2 | 40% (H3 untested) | M | **0.40** | attractive | |
| O8 documents | 2 | 50% | L | **0.33** | performance | |

**Overrides (logged):** O2 and O5 rank lower only because they are bigger builds. O2 *is* the product's promise (the riskiest assumption), and O5 is the owner's top three #2. Both are Musts regardless of score.
**Cross-check (value vs effort):** high value, low effort: O7, O4, O6 · high value, high effort: O2, O5, O1 · lower value now: O3, O8, O10.

## 6. Roadmap strip

| Quick wins | Meaningful shift (the bet) | Big bets or parked |
|---|---|---|
| O7 tracker basics · O4 capture · O9 "save this to your profile?" | **O1 + O2 on top of O6: "a bucket that writes like you"**, delivered through O5 on real forms | O3 story interview (test as a direction in Explore) · O8 full documents, including pitch decks · O10 reuse bank (grows with use) · discovery (v2) |

## 7. Choosing the bet

**The bet:** *a bucket that writes like you, on real forms.* People pour in what they have (O1), connect AI with no keys (O6), and get true answers in their own voice (O2) right next to the real form (O5). Capture (O4) and tracking (O7) are the thin edges that make it a loop.

**Devil's advocate:** "Ship plain autofill first; it's faster to value." Rejected: it's free and crowded (Frame section 8), and it doesn't test the riskiest assumption.

**Radical option (anchoring check):** *Arpli with no AI of its own.* Arpli is only the bucket plus the form filler; drafting happens inside the person's Claude or ChatGPT through a connector or a hand-off (Frame section 9). It is cheaper to build and avoids every no-key problem, but the work moves out of Arpli and the voice checks get harder. **Not chosen as the bet, but worth one prototype direction in Explore.** · owner agreed to include it, 2026-11-02

**Pre-mortem:** "Six weeks after release, almost nobody uses Arpli. Why?"
1. Setup took too long: unsigned app, extension, AI, bucket, all before any value. → KR1 and O6; measure time to first draft.
2. Drafts felt generic, or invented things. → O2 with the fact guard; the "sounds like me" check.
3. Filling broke on their forms. → O5 with Copy always there; the 10-form check.
4. They forgot Arpli existed when they found an opportunity. → O4 capture, plus reminders.
5. A programme's AI rule scared them off. → AI help levels and visible rules.

**Decision record:** chosen: the bet above, **confirmed by the owner on 2026-11-02, together with the first slice.** Rejected: autofill-first (crowded, untested core) · story-first as the main bet (H3 untested; kept as a direction to prototype) · documents-first (big build, not the riskiest assumption).

## 8. Success (re-locked)

Objective and KR1 to KR3 from Frame, unchanged. Baselines are 0 (new product); the first measurement is the baseline.
**Leading signals:** time from install to first draft (adoption), and the share of drafted answers that get submitted (task success).
**Every metric triggers a decision** (Frame section 13).

## 9. v1 scope

**MoSCoW rule:** Musts take at most 60% of the v1 build batch (6 weeks, so about 3.5 weeks of build). **This can't be checked honestly until Batch 1 shows our real build speed.** If the Musts don't fit, the first cut is O5's coverage of custom widgets (Copy covers the rest).

| | v1 |
|---|---|
| **Must** | **O6 first run:** the profile saves; no-key AI (Continue with ChatGPT, local models, Claude as opt-in); "where your text goes"; the engine accepts only Arpli's own app and extension |
| | **O1 pour in:** import a CV or LinkedIn export, a voice or text ramble, "facts about me"; see and edit the bucket |
| | **O2 true drafts:** per-question drafts, the fact guard ("check this"), never-invent on by default, the faithful / balanced / expressive dial, AI help levels per opportunity, "where did this come from?" |
| | **O4 capture:** save any page or post from Chrome as an opportunity, with deadline and questions |
| | **O5 form companion (basic):** a side panel with the form's questions, Fill per field for standard fields and text answers, CV attach, Copy for everything, copy-only on LinkedIn and Indeed, Greenhouse and Lever readers |
| | **O7 tracker:** statuses, a deadline list, Mac reminders, manual add for applications sent elsewhere |
| **Should** | O9 learn from each form · O8 light: a tailored cover letter and CV, exported as PDF (owner confirmed the document split, 2026-11-02) |
| **Could** | O3 story interview (a prototype direction in Explore; moves up if the prototypes favour it, owner 2026-11-02) · O10 "you answered something similar" · the built-in browser for pasted links when the extension isn't installed · a one-page pitch summary |
| **Should (added at G2)** | **O12 watch my sources:** the person adds links (a company's job board, a job-board search, an opportunity site, a feed); Arpli checks them and shows what's new, with deadlines. Risks to design for: scam listings that ask for fees, and sites whose terms forbid automated reading. Which sources can be read is being researched |
| **Won't (v1)** | O11 Arpli finding opportunities on its own (v2) · Windows · phone · recommender tracking · outcome analysis · full pitch-deck generation · auto-submit · filling on LinkedIn or Indeed · team use |

**First vertical slice (the thinnest end-to-end path):**
*One real application, start to finish.* The owner imports a CV → connects AI → opens a Greenhouse job in Chrome → clicks the extension → sees its questions in the side panel → drafts one answer (fact guard on) → fills the standard fields and that answer → presses Submit → the application shows in the tracker as Submitted.
Greenhouse first because its questions come from a public endpoint (Frame section 10, High). The slice also gives both Batch 1 checks what they need.

## 9b. Watch my sources: what can be watched (desk research, 2026-11-02)

Live checks plus official docs and terms; quotes gathered by a helper, spot-check before quoting outside this file.

| Source the person adds | How Arpli checks it | Confidence |
|---|---|---|
| A **Greenhouse, Lever or Ashby** job board | their public data, no key ("Job Board data is publicly available, so authentication is not required for any GET endpoints", Greenhouse docs); new jobs found by ID. Deadlines are rarely filled in | High |
| A **company careers page** that embeds one of those boards | find the board behind the page, then as above | Med |
| An **opportunity site with a feed** (e.g. Opportunity Desk, Opportunities for Africans; WordPress sites; Substack newsletters) | its RSS or Atom feed, found from the pasted link; deadlines are pulled out of the post text | High |
| HN "Who is hiring", Remotive, Arbeitnow | optional preset feeds, no key (Remotive: name it as the source, about 4 checks a day) | High |
| Other pages | compare against the last copy, only where robots.txt allows it; labelled "best effort" | Med |
| **LinkedIn, Indeed, X, job-board search pages** (Jobberman, MyJobMag) | **not watched.** Terms or robots rules forbid it: LinkedIn bans "browser plugins and add-ons" that scrape or copy; Indeed bans "any automated system"; X bans "crawling or scraping ... in any form" and its API is paid; Jobberman and MyJobMag block search pages in robots.txt. Fallback: the person opens the page and saves one listing; on LinkedIn and X, Arpli stores the link plus text the person pastes | High |
| Email-only newsletters | no route without connecting a mailbox (not in v1) | Med |

**Rules for watching:** at most once or twice a day per source while the Mac is on; obey robots.txt and crawl delays; an honest user agent; only a plain request to the link the person chose goes out (no profile data, no search terms beyond the link). The bucket, matching, deadline extraction and the list of seen items stay on the Mac.

**Scam checks on every new item** (show a warning, don't hide it): asks for any fee ("Don't pay for the promise of a job", FTC; "If a job offer requires you to pay for anything, walk away", MyJobMag) · "guaranteed" or "you're a finalist" for something never entered · high pay for little work · free-mail contact address · apply link on a domain that doesn't match the named funder · no official link or no deadline.

**This also changes O4 capture:** on LinkedIn and X the extension doesn't read the page; the person pastes the text.

## 10. Risks and tests

| Risk | Lens | Test | When |
|---|---|---|---|
| A1 + A2: drafts aren't true, don't sound like the person, or aren't acceptable to submit | desirability (weakest) | the "sounds like me" check (Frame section 12) | Batch 1 |
| A5: forms can't be read and filled reliably | feasibility | the 10-form check | Batch 1 |
| A4 and KR1: setup is too slow | desirability, feasibility | time from install to first draft with the owner plus 2 people | Batch 1 |

**Swiss cheese layers** for filling a real form: carried over from Frame section 11.
**AI autonomy:** start low. Arpli suggests and the person accepts every fill and every draft (assistant level). Each AI output gets pass / review / fail from the fact guard plus a short rubric.

**Business case:** not applicable (free, open source). Here, "can we sell it?" means: will people install it and tell a friend?

## 11. G2 checks

| Check | Status |
|---|---|
| HCD ch. 4 evaluation | done in Frame, still holds |
| One objective, ≤3 KRs with a baseline plan | ✓ |
| DVF plan, weakest lens first | ✓ desirability, tested in Batch 1 |
| Musts ≤ 60% of appetite | **unverified until Batch 1** (cut order named) |
| Appetite fits | ✓ (batches) |
| Definition of Ready for Explore | ✓ bet, core job, moments of truth, slice, success criteria |
| No High confidence without a primary source | ✓ (desk sources only; user claims stay Low or Med) |

**G2 decision (2026-11-02, owner): GO**, with the condition to re-check the Must list size after the Batch 1 prototypes. **Changed at G2:** "watch my sources" (O12) joins v1 as a Should. (A first reading, "Arpli suggests opportunities", was a wording mix-up and stays v2.)

---
**Handoff**
- Output: `design/02-opportunity.md`
- Status: done, pending owner questions and G2
- Confidence: Med. The structure is solid; the scores are judgement calls without user data.
- Next module: Explore (how it works) · needs from here: the bet, the moments of truth, the Must list, the first slice, the radical option, H3 as a direction
- Open questions: the radical option as a prototype direction; documents in v1 (cover letter and CV as Should, pitch decks out?); the story interview's place
- Do not repeat: scoring effort in weeks before we know build speed
