# The experience in chunks, from the jobs to be done

**Date:** 2026-11-15 · **Stage:** Prioritize, as the owner shaped it (Linear DEE-92, beads `arpli-2nm`) · **Depth:** deep · **AI overlay:** on
**Status:** the list kept and the work order set by the owner (15 Nov); each chunk reviewed as it's worked through

## What this is, and how it was made

The whole of v1 broken into sizeable chunks. Each chunk is a part of the experience a person goes through end to end. The chunks are built from the people and their jobs, not from features, and then thought through one at a time until the product is well thought out on all its ramifications (owner, 15 Nov).

**Owner's rules for this stage (15 Nov):** we do everything, one by one; nothing is cut. No scoring and no primary persona: "lets just build what gets our jobs done". Chunks must be built from the jobs to be done.

**Built from:**
- The jobs (`12-synthesis.md`): the core job "present my real experience convincingly for a specific opportunity", inside a campaign; the 11-step job map and its 27 outcome statements; the functional, emotional and social sides; the related jobs; the ten themes; the HMWs; the owner's direction from the review.
- The six personas and six conditions (`13-personas.md`).
- What's already decided: the 47 drilled elements (`08-ux-elements.md`, U1 to U47, with 126 decisions), the rules across every step (X1 to X7), the journey (`05-journey.md`), the screen map (`09-screen-map.md`), the principles (`10-principles.md`).

**Method, opened 2026-11-15** (Notion, DESIGN OS, Human-Centered Design Manual): chapter 6, "Story Mapping / User Stories / User Journeys", is the chapter after "5. How to Prioritize". It says a journey is always based on a need; story mapping finds the stepping stones of the core experience; each workflow is mapped outcome first, from its entry point, along its critical path, with its bottlenecks; and a product is four journeys: discovery, onboarding, regular repeated use, and keeping people over time. Here the backbone is the job map, and each chunk is one workflow.

## The order, and why

**Work order (owner, 15 Nov): each chunk builds on the ones before.** What shapes the most comes first (see "What builds on what" below). Getting started comes once the first draft it leads to exists, since most of the experience sits past onboarding.
1. **The foundations** (chunks 1 to 4): the knowledge bank, the opportunity and its questions, the person's voice.
2. **The core job, in the order a person does it** (5 to 10): write, find the evidence, reshape, prepare documents, check, send. When these exist, a person can do the core job end to end.
3. **Again and again, as a campaign** (11 and 12): keep track, and make every result feed the next one.
4. **Getting in, finding more, and what runs across** (13 to 15): getting started, once the core exists; finding and choosing, a related job in the synthesis rather than the core job; settings, data and connections.

Plumbing a chunk needs (engine, data, AI connections, reading and filling forms) has nothing to see, so it's built ahead of its chunk, in whatever order engineering needs. The AI connection from Getting started is built early, because writing needs it (`14-ways-of-working.md`, Q1).

| # | Chunk | Job steps | The person is trying to |
|---|---|---|---|
| 1 | About you: the knowledge bank | 3 Gather · 11 Reuse | keep everything true about them in one place that grows with every answer |
| 2 | Bringing an opportunity in | 1 Find · 3 Gather | get an opportunity and everything it requires into one place |
| 3 | Understanding what's asked | 4 Decode | know what each question is really after, and which of their stories fits |
| 4 | Your voice | 5 Draft | have everything written sound like them |
| 5 | Writing an answer | 5 Draft | get from a blank page to a true first draft in their own words |
| 6 | Your experience as evidence | 3 Gather · 5 Draft | see and name the evidence already in their record |
| 7 | Reusing and reshaping | 6 Fit · 11 Reuse | carry what they've already written to a new place, limit and format |
| 8 | Documents | 3 Gather · 5 Draft · 6 Fit | have the right document, in the right format, with each application |
| 9 | Checking before it goes | 7 Check | stand behind every line and fact before it leaves |
| 10 | Filling the form and sending | 8 Submit | get it into the real form without errors, and know it arrived |
| 11 | Keeping track | 9 Track | always know what's due, what's missing and what was sent |
| 12 | After you send | 10 Wait and interview · 11 Outcome and reuse | hear back, match the page in person, and make the effort count either way |
| 13 | Getting started | Start | get Arpli working with what they already have, and see it work in the first sitting |
| 14 | Finding and choosing what to apply for | 1 Find · 2 Decide | not miss what fits, and spend effort where it's worth it |
| 15 | Settings, your data and connections | across | stay in control of their AI, their data, their connections and their money |

## Owner's review of the list (15 Nov)

The owner kept the 15 chunks ("this is great") and added:
- **Much of the experience sits past onboarding**, and **some jobs shape much more than others**.
- **Each piece of work should build on the one before**, and it should be **simple to go back and change** something already worked out.
- **Each chunk breaks down further.** Yes: a chunk holds the drilled pieces it already has (cards U1 to U47), and working it splits it into its flows (first time, the 20th time, when things go wrong), then screens and their states, then the copy.

### What builds on what

| Chunk | Builds on | Feeds |
|---|---|---|
| About you: the knowledge bank | nothing | almost everything: evidence, voice, writing, reshaping, documents, checking (where each line came from), filling (standing answers), after you send (a no still feeds it), getting started (the CV goes in first) |
| Bringing an opportunity in | nothing | understanding, documents (what's needed), filling, keeping track, finding and choosing |
| Understanding what's asked | the opportunity | writing, evidence (which story fits), reshaping (limits and formats) |
| Your voice | About you (samples, past answers) | writing, reshaping, documents |
| Writing an answer | About you, understanding, voice | reshaping, checking, filling, evidence |
| Your experience as evidence | About you, understanding, writing | About you and writing (better material) |
| Reusing and reshaping | About you, writing, understanding | documents, checking |
| Documents | About you, voice, reshaping, the opportunity | filling, keeping track |
| Checking before it goes | writing, reshaping, documents, About you | filling |
| Filling the form and sending | checking, About you, the opportunity | keeping track, after you send |
| Keeping track | the opportunity, filling | after you send |
| After you send | keeping track, filling | About you, voice (the rating tunes it) |
| Getting started | About you, voice, the opportunity, understanding, writing (its goal is the first draft) | first use of everything |
| Finding and choosing | the opportunity, keeping track | bringing an opportunity in |
| Settings, your data and connections | everything | everything (the rules X1 to X5 are already decided and applied inside each chunk as we go) |

### Making it simple to go back

- **One place per decision.** Each chunk keeps its decisions in its own spec in `design/specs/`. A change is made there once, with the same IDs (C, U, X) everywhere else pointing to it.
- **Changes ripple visibly.** Each chunk lists what it builds on and what it feeds (the table above). When something changes, the chunks it feeds get a look, and nothing else needs to.
- **A "changed later" line.** When we go back, the chunk's spec gets a dated line: what changed, why, and which chunks it touches.
- **The build stays changeable.** Small pieces on the real app, each with tests, so a later change doesn't quietly break something else.

## How each chunk is thought through

The owner leads the tools for each chunk (`14-ways-of-working.md`). What every chunk covers, whatever the tools:
- **From the job:** what the person is trying to get done, the outcomes it serves, how they want to feel and be seen.
- **Every ramification:** the first time and the 20th application; when things go wrong (the part 3 rules); each of the six personas and the six conditions (second language, little on paper, Nigeria or Africa, applying again, changing direction, no one to ask); for every AI moment, a confident answer, an unsure one, none, a wrong one, and how the person corrects it.
- **What's already decided:** the drilled decisions the chunk holds come back for a keep, change or drop, checked against the job. Decided points aren't reopened unless the job says they should be.
- **Then, as the owner directs:** for example, references from Mobbin, directions in Paper, Design Studio or built prototypes, the owner picks, a spec, the build, a clean-up in Figma brought back into the app, and feedback on the live build.

---

## 1 · About you: the knowledge bank

**Job steps:** 3 Gather (your evidence) · 11 Outcome and reuse. **The person is trying to** keep everything true about them in one place that grows with every answer, so they never start from zero or repeat themselves. Your direction: "the whole point".
**Outcomes served:** minimise the likelihood of leaving out real experience that counts as evidence · minimise the time to collect what each programme asks for (in part) · minimise the time to reapply or apply elsewhere with what I have · minimise the likelihood that work on an unsuccessful application is wasted.
**Feelings and how they want to be seen:** effort not wasted, even after a no.
**Themes and HMWs:** 4 · 5 · H8 (first priority) · H12.
**Already decided:** U11 Pour in what you have · U13 Your bucket (now About you) · U14 Standing answers · U15 Ask first when the bucket is thin · U16 Save what's new while you write · U46 Kept for next time. The bucket keeps the person's own words (M5); only finished answers become past answers.
**Open, from the jobs and your direction:**
- Every answer feeds the bank, long essays included, and later answers come from it.
- Finding beats storing: people's pain is finding and reshaping, not keeping (theme 4). How the bank lets you find the right piece fast.
- People already have home-made banks (Word files by word count, Notion, last year's files): bringing those in. Reading a ChatGPT or Claude export is an idea logged with O13.
**Plumbing:** the bank's data and search.

## 2 · Bringing an opportunity in

**Job steps:** 1 Find (saving what you found) · 3 Gather (the opportunity). **The person is trying to** get an opportunity, its deadline and everything it requires into one place, from wherever they found it.
**Outcomes served:** minimise the time to collect what each programme asks for · minimise the likelihood of missing an opportunity I qualify for before its deadline (in part).
**Feelings and how they want to be seen:** calm, in control; nothing lost.
**Themes and HMWs:** 9 · 4 · H18.
**Already decided:** U8 Save from Chrome in one click · U9 Add in the app · U10 Reading the opportunity. Save first, check after (M2); saved lands in Applications as "Saved" (3 Nov).
**Open, from the jobs and your direction:**
- Adapt to each application's requirements: read its format, limits and what it asks for, and (ASSUMPTION) the programme's own rule on AI help.
- Where requirements live beyond job pages: scholarship guidelines, grant calls, PDFs. Ada, Maya, Emeka and Ngozi apply through these as much as Sam applies through job forms.
- Which kinds of forms come first. The first slice was a Greenhouse job form, from 2 Nov.
**Plumbing:** reading a page and its requirements; the Chrome extension.

## 3 · Understanding what's asked

**Job steps:** 4 Decode. **The person is trying to** know what each question is really after, and which of their own stories fits it, before writing a word.
**Outcomes served:** minimise the time to understand what a question is really asking · minimise the likelihood of choosing a story that doesn't answer it.
**Feelings and how they want to be seen:** not lost, not out of their depth.
**Themes and HMWs:** 7 · H15 · H14 (fifth priority). Moment of truth 1, seeing the prompt.
**Already decided:** U18 Reading the form's questions · U19 What this question is really asking (the programme's own words first, with a link) · U20 The questions in one application · U21 The help level and the programme's rules · U22 What a draft will use.
**Open, from the jobs and your direction:**
- A way into each question: what it's after, and which of your stories fits.
- Reflective questions, and custom questions that "don't map to anything on your resume".
- When a programme's own words aren't there, a general reading said to be general (decided, U19): how it reads to someone in a second language.
**Plumbing:** finding the questions on a form or in a document.

## 4 · Your voice

**Job steps:** 5 Draft, and every place Arpli writes. **The person is trying to** have everything Arpli writes sound like them, not like an average AI. Your direction: "learns to sound like the applicant".
**Outcomes served:** minimise the likelihood of a draft that sounds generic or not like me · minimise the likelihood that I sound different in person from my writing.
**Feelings and how they want to be seen:** seen as the real author, a genuine person; use help without being looked down on.
**Themes and HMWs:** 3 · 8 · H6 (second priority) · H7 · H17. KR3 ("sounds like me" 4 or 5 out of 5).
**Already decided:** U30 Sounds like you. "Your voice" lives in About you (screen map). The "sounds like me" rating is asked after "Submitted", 1 to 5 per drafted answer, and a low rating asks "What's off?" and tunes the voice (9 Nov).
**Open, from the jobs and your direction:**
- What "sounds like me" means to people: the first thing to ask testers (synthesis, research recommendation 1).
- How Arpli learns a voice: from samples, past answers, ratings, edits.
- Second-language writers keep their own English and culture: Commonwealth English is not an error; too polished breaks the match with how they speak.
**Plumbing:** where the voice guide is kept and how drafting uses it.

## 5 · Writing an answer

**Job steps:** 5 Draft. **The person is trying to** get from a blank page to a true first draft in their own words, quickly. Your direction: "a starting point for every question".
**Outcomes served:** minimise the time from a blank page to a first draft in my own words · minimise the likelihood of a draft that sounds generic or not like me.
**Feelings and how they want to be seen:** relief once started; their own words.
**Themes and HMWs:** 7 · 3 · 1 · H14 · H6. Moment of truth 1.
**Already decided:** U27 Write it yourself · U28 Draft from your bucket · U29 Which AI writes, and when it can't. Drafts come only from the bucket, every claim traceable; the help level per opportunity (fields only · you draft, Arpli refines · Arpli drafts from your words); a note to steer a draft; "Draft the rest".
**Open, from the jobs and your direction:**
- Different ways in to each question: suggested answers, help filling in, a starting point to edit.
- Anything not from the person's own record is shown for them to confirm before it's used (principle 1, theme 1).
- AI is trusted for structure, grammar and length, not for the story (theme 3).
**Plumbing:** drafting with sources.

## 6 · Your experience as evidence

**Job steps:** 3 Gather · 5 Draft. **The person is trying to** see their ordinary record as evidence, and say it plainly without exaggerating. Your direction: "turn experience into evidence"; "this is a thing we will be doing".
**Outcomes served:** minimise the likelihood of leaving out real experience that counts as evidence · minimise the likelihood of choosing a story that doesn't answer the question (in part).
**Feelings and how they want to be seen:** "is my ordinary record enough?"; seen as capable, not as exaggerating or "too perfect".
**Themes and HMWs:** 6 · 1 · H13.
**Already decided:** U12 Talk it through (voice notes) · U17 Story interview (once for your whole story or per question was left to the D3 prototype, now dropped).
**Open, from the jobs and your direction:**
- How Arpli helps someone name evidence they don't see, while principle 2 says Arpli never judges them.
- Engaging, yet specific and true (theme 1).
- Hardest for: little on paper, changing direction (Tunde), and places where presenting yourself means showing humility (Ghana and South Africa in the research).
- The story interview's place now that the four directions are dropped.
**Plumbing:** transcription on this Mac (today's code sends audio online and keeps none, a check carried from drilling).

## 7 · Reusing and reshaping

**Job steps:** 6 Fit · 11 Outcome and reuse. **The person is trying to** carry what they've already written to a new place, at a new limit and in a new format, without losing substance. Your direction: "one answer, presented the right way for each place".
**Outcomes served:** minimise the time to reshape something I've already written to a new limit and format · minimise the likelihood of losing substance when cutting · minimise the likelihood of inconsistency across the essays of one application, or across programmes · minimise the time to reapply or apply elsewhere with what I have.
**Feelings and how they want to be seen:** effort not wasted; one consistent story.
**Themes and HMWs:** 4 · H8 (first priority) · H9 (fourth) · H10. Moment of truth 2, reshaping for this programme.
**Already decided:** U31 Reuse a past answer · U41 Versions, refine and tighten. Past answers are suggested automatically and quietly (M7); used as is, adjusted lightly or reworked; a warning on near-verbatim reuse for the same kind of programme (O10, 3 Nov).
**Open, from the jobs and your direction:**
- Keeping one story consistent across all the essays of one application and across programmes (founders' numbers especially, which the research couldn't settle).
- Cutting to a limit while keeping what counts.
**Plumbing:** reshaping to a limit and format.

## 8 · Documents

**Job steps:** 3 Gather · 5 Draft · 6 Fit. **The person is trying to** have the right document, in the right format, with each application: a tailored CV, a cover letter, a statement, and the ones they already have.
**Outcomes served:** minimise the likelihood of a missing document costing me the cycle · minimise the time to collect what each programme asks for.
**Feelings and how they want to be seen:** prepared; nothing missing at the deadline.
**Themes and HMWs:** 4 · 9 · H8 · H18.
**Already decided:** U33 Documents in an application · U47 Your documents. Every kind and every common format is a v1 Must (9 Nov); a tailored CV picks and orders your own lines; Arpli never writes writing samples or official papers; PDF by default, the form's choice wins; a deck you have is kept and attached.
**Open, from the jobs and your direction:**
- Which documents are needed most often across the six personas (CV, cover letter, personal statement, research statement, pitch summary).
- File formats beyond PDF, Word, Markdown and plain text, such as LaTeX (a check carried from drilling).
**Plumbing:** making and exporting documents in each format.

## 9 · Checking before it goes

**Job steps:** 7 Check. **The person is trying to** stand behind every line and every fact before anything leaves in their name, and be able to defend it in person.
**Outcomes served:** minimise the likelihood of a false or changed fact going out in my name · minimise the likelihood of breaking a programme's rule on help · minimise the likelihood of sending something I can't defend in conversation · minimise the time to recall how I used help when asked to disclose it.
**Feelings and how they want to be seen:** confident it's true, theirs and allowed; seen as genuine.
**Themes and HMWs:** 1 (first theme) · H1 (third priority) · H2. Moment of truth 3, the last look before sending.
**Already decided:** U34 Check this · U35 Where did this come from? · U36 This is what you're sending ("Before you press Submit" shows only what needs a look).
**Open, from the jobs and your direction:**
- Never change a fact, name, number or link without showing it (failure taxonomy: quiet fact changes).
- Keeping a record of what help was used on each answer. Theme 2 and its disclosure HMW were set aside, but when a programme's own rule asks for disclosure, it's a requirement like a word limit. Your call.
- No "AI score" of the person's own writing as a check (synthesis caution).
**Plumbing:** keeping where each sentence came from.

## 10 · Filling the form and sending

**Job steps:** 8 Submit. **The person is trying to** get everything into the real form without errors and without re-typing, press Submit themselves, and know it arrived.
**Outcomes served:** minimise the time spent re-entering details already in my CV · minimise the likelihood of an error I can't fix after submitting · minimise the likelihood of not knowing whether it arrived.
**Feelings and how they want to be seen:** relief, not worry.
**Themes and HMWs:** 4 · 9 · 1 · H18. Moment of truth 4, pressing Submit.
**Already decided:** U24 Fill standard fields in one press · U25 Fields that speak for you (anything that signs or agrees for you needs a yes each time) · U26 Tricky sites and human checks · U32 Fill this answer, or Copy · U43 Knowing it was sent. You press Submit; Arpli never ticks a box that speaks for you.
**Open, from the jobs and your direction:**
- Forms beyond Greenhouse, especially the Workday kind that makes people re-key their CV.
- A slow or unreliable connection on deadline day.
**Plumbing:** reading and filling real forms; noticing Submit and the confirmation page.

## 11 · Keeping track

**Job steps:** 9 Track. **The person is trying to** always know what's due, what's missing, what was sent and where, without a second job to keep it up.
**Outcomes served:** minimise the time to find what I sent, with which version, and when · minimise the likelihood of missing a follow-up or deadline · minimise the likelihood of a missing document or late referee costing me the cycle.
**Feelings and how they want to be seen:** calm and in control at the deadline.
**Themes and HMWs:** 9 · H18 (seventh priority).
**Already decided:** U37 Applications (six stages, one status word per row, list by deadline as default) · U38 Needs you · U39 Reminders (one bundle a day, email too) · U40 Menu bar and Dock.
**Open, from the jobs and your direction:**
- Tracking through the person's email: a proper record of what was sent and what came back (your direction).
- Referees: the research shows a late referee can cost a whole cycle, and recommender tracking was set to Won't on 2 Nov. Your call.
- It has to hold up past 50 applications, where spreadsheets break.
**Plumbing:** reminders and notifications; email reading (the spike: Gmail through the person's own Claude, Apple Mail for others).

## 12 · After you send

**Job steps:** 10 Wait and interview · 11 Outcome and reuse. **The person is trying to** hear back, sound in person like the person on the page, and make the effort count whether the answer is yes, no or silence.
**Outcomes served:** minimise the likelihood that I sound different in person from my writing · minimise the time to recall what I sent when someone calls · minimise the likelihood that work on an unsuccessful application is wasted.
**Feelings and how they want to be seen:** the fear of a wasted year; a no is not a verdict on their worth.
**Themes and HMWs:** 5 · 6 · H12 (eighth priority) · H11. Moment of truth 5, the answer or the silence.
**Already decided:** U42 Follow-ups after sending ("What you sent", a new Interview stage) · U44 Spotting replies in your email · U45 Recording the outcome (Accepted · Not this time · Waitlisted · Withdrew; a no gets one steady line).
**Open, from the jobs and your direction:**
- Learning what works: for example, one CV or cover letter version getting more positive replies than another. It needs enough replies before a pattern means anything.
- A no still makes the next application faster: its answers stay in the bank (chunk 1).
**Plumbing:** email reading, shared with chunk 11.

## 13 · Getting started

**Job steps:** Start, before the job map (the onboarding journey). **The person is trying to** get Arpli working with what they already have, and see it do something real for them in the first sitting.
**Outcomes served:** none of the 27 directly. It's how a person reaches the core job, and it carries KR1: a first useful draft in the first session.
**Feelings and how they want to be seen:** not another tool to learn; no second bill; nothing connected without asking (theme 10).
**Themes and HMWs:** 10 · 8 (an AI is required; no plan means a guided free local model) · H16.
**Already decided:** U1 Getting Arpli onto your Mac · U2 The first screen: start with what you have · U3 The AI on this Mac · U4 Adding Arpli to Chrome. From the journey: CV first, no welcome page; the AI found on the Mac pre-selected, with "Not now"; one "Looks right" press; the extension offered after the first draft; a voice check in the first run (from jev-job-search, 9 Nov).
**Open, from the jobs and your direction:**
- The free local model must run on a modest computer: the people with least help are least likely to have a powerful one, and the model tested so far (gpt-oss:120b) needs a powerful Mac.
- What happens for someone with no AI at all, now that an AI is required.
- Discovery, before install: why someone would start at all (the download page promises nothing unproven, U1).
- Its goal, the first draft, builds on chunks 1 to 5, which is why it's worked on after them. The AI connection it needs is built early as plumbing.
**Plumbing:** the AI connections (your Claude or ChatGPT, a local model), the installer, pairing with the Chrome extension.

## 14 · Finding and choosing what to apply for

**Job steps:** 1 Find · 2 Decide. A related job in the synthesis, not the core job. **The person is trying to** not miss what fits, trust it's real, and spend effort where it's worth it.
**Outcomes served:** minimise the likelihood of missing an opportunity I qualify for before its deadline · minimise the time spent checking whether an opportunity is genuine · minimise the likelihood of starting an application I'm not eligible for · minimise the time to judge whether it's worth the effort.
**Feelings and how they want to be seen:** hopeful, not anxious about missing out; not ruling themselves out.
**Themes and HMWs:** 9 · 5 · 6 · 8.
**Already decided:** U5 New from your sources · U6 Worth my time? · U7 Pin, snooze or let it go · U23 Eligibility and what's needed. Watch my sources is a v1 Should (2 Nov); Arpli finding opportunities on its own is v2; Arpli never judges fit or eligibility, it quotes and the person decides.
**Open, from the jobs and your direction:**
- Opportunities found late through cluttered information (Nigerian applicants in the research).
- Telling a genuine opportunity from a fake one, without judging.
**Plumbing:** checking the sources a person chooses (Greenhouse, Lever and Ashby boards, RSS and Atom feeds).

## 15 · Settings, your data and connections

**Job steps:** across every step. **The person is trying to** stay in control of their AI, their data, their connections and their money.
**Outcomes served:** none of the 27 directly; it carries theme 10 and the trust the rest depends on.
**Feelings and how they want to be seen:** safe; no surprises.
**Themes and HMWs:** 10 · 1.
**Already decided:** X1 Undo and a way out · X2 AI work in words, with Stop · X3 Where your text goes · X4 When something fails · X5 Offline · X6 Your data · X7 Sharing how it went. Settings is one page of sections (screen map). X1 to X5 are applied inside every chunk; this chunk holds the place where they're managed.
**Open, from the jobs and your direction:**
- Connections Arpli needs are fine when asked for and explained: email asked for the first time it's needed, with a plain line on what Arpli reads.
- The free core, paid later idea (to test; willingness to pay is still unknown): no surprise renewals, a reminder before any charge, easy cancelling.
- X7 serves Arpli's own learning (KR1 to KR3), not the applicant's job. It stays opt-in; your call whether it needs anything more.
**Plumbing:** export and delete; the account note (DEE-88).

---

## The drilled decisions against the jobs (card level)

All 47 cards and X1 to X7 sit in a chunk above, and each serves a job step. Two kinds don't serve one of the 27 outcomes directly:
- **Getting set up** (U1 to U4, chunk 13): they're how a person reaches the core job, and they carry KR1.
- **Sharing how it went** (X7, chunk 15): it serves Arpli's learning, not the applicant's job.

Nothing else is left without a job. The 126 decisions inside the cards come back one by one when their chunk is worked through.

## Questions for the owner (one at a time)

1. ~~The list of 15 chunks and their order.~~ Kept, and the work order changed so each chunk builds on the ones before (owner, 15 Nov).
2. Each chunk in work order, starting with chunk 1, About you: keep, change, add or cut what's in it, and the open points marked "your call". The owner leads the tools for working each one through.

---
**Handoff**
- Output: `design/15-experience-chunks.md`
- Status: list kept and work order set (owner, 15 Nov); each chunk reviewed as it's worked through, starting with chunk 1, About you
- Confidence: Med for the chunks and their job links (built from the reviewed synthesis and the approved, drilled decisions); the jobs themselves are Med at most until real applicants confirm them
- Next: chunk 1, About you: the knowledge bank, worked through with the owner leading the tools; its drilled decisions and open points reviewed one at a time
- Do not repeat: no scoring, no primary persona (owner, 15 Nov); don't cut anything
