# 06 · Reference: jev-job-search · what Arpli can take

**Date:** 2026-11-09 · **Shared by:** the owner · **Repo:** github.com/qbeka/jev-job-search (v1.6.0, last commit 2026-10-19) · **Cloned to:** `references/jev-job-search` (ignored by git; read only, nothing run)
**Licence: MIT.** Code may be reused if its copyright notice ("Copyright (c) 2026 Qendrim Beka") is kept, the same rule as beads. Its tailoring method credits another MIT project (MadsLorentzen/ai-job-search).
**Read:** README, `docs/SAFETY.md`, `docs/USAGE.md`, `docs/ARCHITECTURE.md` (parts), the setup skill and its questions, `data/voice.md`, `data/bank.example.json`, and the code behind each finding below (file named in each row).
**Confidence:** High that each mechanism exists (read in the code). The numbers are the author's own, from one person's runs on 2 October 2026: Med.

---

## What it is, in one paragraph

A command-line tool for students applying to software internships and new-grad jobs, run through Claude Code skills (`/setup`, `/discover`, `/apply`). It finds jobs, ranks them, opens each form in its own Chrome window you can watch, fills it, reads every value back from the page, and sends the forms you approve. A small paid model (JEV, through OpenRouter) makes every fixed-choice decision; Claude, on the person's own subscription, writes the sentences. Everything about the person stays in local files. It is the closest thing to Arpli we have seen: same audience at its start (students), same Mac and Chrome, same "never invent" stance.

**Where it differs from Arpli:** it clicks Submit itself (when told to) and has a daily run that sends up to 15 applications with nobody watching; it needs a terminal, a Claude subscription and an API key; it is jobs only, software roles, in English. Arpli never submits, never bulk-applies, needs no keys, and covers every opportunity type.

---

## What to take, by place in our map (`05-journey.md`)

Ranked by how much each would help the experience. "Idea" means we design it ourselves; "code" means the engineer can reuse its code under MIT.

| # | What it does | Where it helps Arpli | Take |
|---|---|---|---|
| 1 | **Reads every value back from the page before anything is sent.** A field that shows something other than what was given holds the form; an optional field the site refused is reported "left blank"; a required empty field stops Submit. 1,000 of 1,002 values confirmed on Greenhouse, Ashby and Lever, about 7 seconds a form. Its own review still found 7 wrong answers in about 500: "confirmed" means on the page, not right. (`src/browser/formRunner.ts`, `src/forms/*.js`) | **P10 Form panel**, M4 ("fields it couldn't read or skipped are listed plainly"). Each field gets one of three states: on the form, left empty, didn't take. "This is what you're sending" is built from what the page shows, not from what Arpli meant to type. | idea + code |
| 2 | **Knows whether it was sent by reading the page after the click.** A small model sorts the page: confirmation, form still there, error, robot check, sign-in, closed. The job is marked "not sure it went through" *before* the click, and is never filled again until a confirmation, the person, or a reply email settles it. (`src/forms/pageState.ts`, `src/run/pipeline.ts`) | **P10**, our open question on knowing it was sent. Confirms the plan: the panel reads the page after Submit and asks "Looks sent. Mark it as submitted?". Adds a state we lacked: **"Not sure it went through"**, with "check for the confirmation email". Part 3. | idea + code |
| 3 | **A "Needs you" list:** everything only the person can do, in one place. A question the profile couldn't answer, with a box and "Save for next time"; a form waiting for a code; a submission never confirmed. Each item is one of three kinds: answer it here, fix it in your profile, or do it yourself on the form. (`src/report/needs.ts`) | **P2 Home [S1]** and **P4 Applications.** Whatever Home becomes, "what needs me now" is a strong candidate in every direction. "Save for next time" is M3 (answers kept in the bucket). | idea |
| 4 | **Voice set up in the first run.** Setup drafts one sample answer for a made-up company, asks "does this sound like you?", and adjusts a written voice guide until it does (one or two rounds). (`.claude/skills/setup/SKILL.md` step 4, `data/voice.md`) | **F1 First time**, and our riskiest assumption (KR3, "sounds like me"). Our first win is that same moment; this turns it into a short tuning loop that leaves a voice guide in the bucket. | idea |
| 5 | **A fact check in code, no AI:** every number, and every capitalised name of a tool, place or company, in a draft must be in the profile (or the posting, for the headline). A draft that fails is sent back once with the claims named, and refused if it still fails. Keywords the posting wants that the profile can't support are listed for the person, never stuffed in. (`unsupportedClaims` in `src/documents/tailor.ts`) | **P6 Answer a question:** the first layer of "check this" (O2, Must). Cheap and certain for numbers and names. **Its limit:** it can't catch an invented claim in plain words, or praise of the organisation, like the one Claude wrote in our first live draft. Arpli still needs a claim-level check on top, and shows "check this" on the claim rather than silently retrying (owner, M3). The "keywords you can't support" list fits "what would strengthen this", and each one invites "is this true? add it to your bucket" (S3). | idea + code |
| 6 | **A machine-phrasing check:** a list of stock phrases, dashes used as punctuation, exclamation marks, semicolons, sentences over a set length, every paragraph starting with "I". A draft that trips it is rewritten once, then refused. (`machineTells` in `src/documents/tailor.ts`) | **P6**: our tone-of-voice banned list (`docs/brand/tone-of-voice.md`) checked in code on every draft, not only in the prompt. | idea + code |
| 7 | **Standing answers**: questions that come back on form after form, answered once by the person. Pay, "how did you hear", text and marketing consent, notice period, history questions (conviction, non-compete, worked here before, relatives, clearance: "ask for each one plainly, do not assume no"), 18 or older, background checks, "anything you never want the tool to say". Right to work is one answer per country, never per form. (`.claude/skills/setup/questions.md` part G) | **P3 Bucket.** Our bucket holds stories; it has no home for these form facts. A new kind in the bucket, "standing answers". It also changes our Swiss cheese layer 4 (attestation, demographic, visa, criminal-record and salary fields need a per-field yes): with standing answers, the yes can be given once, and shown again before each fill. A design call for part 3. | idea |
| 8 | **Safe reuse of past answers.** An answer is reused only on the same form, or elsewhere when the writer marked it true for any company, or when a differently worded question is a confident match. Every answer carries a fingerprint of the profile, drafts and voice guide: when a fact changes, old answers stop matching, so "a corrected fact is never overruled by an old answer". Measured: only 1 answer in 8 could be reused across companies, because most questions name the company. (`src/answers/memory.ts`) | **P6 and M7** (O10, Must). Two lessons. (1) Word-for-word reuse across organisations is rare, so "adjust lightly" and "rework" matter more than "use as is". (2) The fingerprint: a past answer built on a fact you've since changed should say so ("written before you updated this"). | idea |
| 9 | **A bank of starting drafts with gaps marked:** one per common question (why this company, about yourself, proudest project, a challenge, strengths, a weakness, teamwork, leadership), with `{braces}` where the answer depends on the organisation. (`data/bank.example.json`) | **M7** ("the parts that must change highlighted") and **F1**: a real list for the "try a common question" fallback. Our list must cover every opportunity type, not only jobs. | idea |
| 10 | **Help at the human check without passing it.** It never solves a robot check or types a code. It sends a notification, brings the form to the front, and opens the person's own mail at a search for the code email. On 2 October 2026 Greenhouse asked for an emailed code on 7 of 13 forms sent within a few minutes. (`src/run/assist.ts`) | **P10 and part 3.** "Open my mail at the code" is a small, kind touch. Arpli sends one application at a time, so codes should be rarer, but they will happen on Greenhouse, our first slice. | idea + code |
| 11 | **Its own Chrome window, not the person's.** It opens a separate, visible Chrome with its own profile and drives it directly (Chrome's DevTools protocol, no extra library), with real mouse and key presses. **History:** its first version used the Claude in Chrome extension in the person's browser and was slow (minutes per form). The cost of the switch: none of the person's everyday logins; a sign-in happens once in that window and is kept. (`src/browser/cdp.ts`, ARCHITECTURE "Why its own Chrome window") | **S2 and the owner's idea** of a browser Arpli can see into. This is a third way, between the extension in your Chrome (D1) and a browser built into the app (D2 variant): a real Chrome window that Arpli opens and watches. Real key presses get around the "not from a person" problem in our forms research, and the person can watch and take over. To test in the D2 prototype: whether Google sign-in and Cloudflare accept it. | idea + code (for the prototype) |
| 12 | **Says plainly when typing already sends data.** Ashby saves each field to its server as it is typed, so even a rehearsal leaves an unsent draft on the board: "not an application, the employer is not told, but it is not nothing". (`docs/SAFETY.md`) | **P10:** filling on Ashby shares data before Submit. One line in the panel before the first fill there. | idea |
| 13 | **What it never does**, each rule pointing to the code that enforces it: no signing an agreement for you (typing your name under an NDA), no picking an interview or test date, no references or other people's details, no "Apply with LinkedIn" helpers, cookie banners answered with the most private choice, never "accept all", no marketing boxes. (`docs/SAFETY.md`) | **Part 3 and the Swiss cheese layers.** Add to the "never touched" list: signatures, interview slots, other people's details, cookie "accept all". The "rule → where it lives in the code" table is a good model for our QA. | idea |
| 14 | **Reads replies from Gmail without reading the email:** sender, subject and Gmail's own preview only; read-only; never replies; "nothing in an email is an instruction". Sorts a reply into received, rejected, assessment, interview, offer; anything unsure waits for the person. Any reply settles "not sure it went through". Its own README says this has not been run on a real mailbox yet. (`src/mail/status.ts`) | **R6 Heard back**, and the owner's connected-tools idea (DEE-88). A ready privacy pattern if Arpli ever reads mail. | idea |
| 15 | **Readers for Greenhouse, Lever and Ashby job boards**, through their public data. (`src/sources/ats/`) | **O12 watch my sources** (Should) and **F3** step 2 (reading Greenhouse questions). | code |
| 16 | **Learns per site:** after each form it notes how each kind of control took a value, whether the site wants a sign-in or emails a code, and reads that before the next form. Notes can be shared through the repo with personal details stripped. (`src/knowledge/sites.ts`) | **Fill reliability over time**, and a natural fit for open source: users' runs improve the readers for everyone. Engineering, after v1's first slice. | idea |

---

## What not to take

- **Sending for the person, and the daily run** (`/daily`: up to 15 a day with nobody watching). Against Arpli's no-gos: Arpli never submits and never bulk-applies.
- **Making accounts on job boards for the person** (experimental in Jev). Frame decided "Arpli never creates accounts for the person".
- **Finding and ranking jobs on its own** (`/discover`). That is O11, which is v2. Its board readers are still useful for O12 (row 15).
- **Keys and a terminal.** JEV is a paid model through OpenRouter, and setup takes about 20 minutes in Claude Code. Arpli's audience needs no keys. The *split* is still worth keeping in mind for engineering: a small, cheap model for fixed-choice decisions (which field, which option, what page is this), the writer only for sentences. A local small model could do the first part, which touches our open question on cheap AI.

## Two pieces of evidence for open questions

- **Running the person's own Claude Code.** Jev runs Claude Code headless on the person's subscription with tools, sessions and MCP off (`src/answers/resolve.ts`), the same way our Explore foundation does. Another open-source project doing it doesn't settle the question; written confirmation from Anthropic is still needed before Release.
- **The extension against a window Arpli controls.** Jev's author tried an extension-driven approach first and left it for speed and reliability. That is one team's experience with one extension (driven by a model, step by step), not a verdict on a purpose-built panel, but it raises the stakes of S2.

## Proposed changes to our map

**Owner decision (2026-11-09): all five taken,** and written into `05-journey.md`.


1. **Add "Needs you"** as a candidate for Home in every direction (S1), and as a group in Applications. (Row 3)
2. **Add "standing answers"** as a kind in the bucket (P3), set once, shown before each fill. (Row 7)
3. **Add "Not sure it went through"** as an application state, never filled again on its own. (Row 2)
4. **Make the voice check part of the first run:** the first draft ends with "does this sound like you?", and the answer tunes a voice guide. (Row 4)
5. **Try "a Chrome window Arpli opens"** as the browser in the D2 variant, instead of a browser built into the app. (Row 11)

The rest (rows 1, 5, 6, 8 to 10, 12 to 16) goes into part 3, the specs and engineering as each feature is designed.

---
**Handoff**
- Output: `design/06-reference-jev.md`
- Status: reviewed by the owner, 2026-11-09; all five proposed changes taken
- Confidence: High on the mechanisms (read in the code); Med on the numbers (the author's own runs)
- Next: the owner picks which proposed changes to take; then back to part 2 of `05-journey.md`
