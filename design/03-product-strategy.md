# 03 · Product strategy · Arpli

**One page that holds the strategy together.** Everything here comes from decisions already approved: Frame (`01-preplanning.md`, G1: GO with edits) and v1 scope (`02-opportunity.md`, G2: GO). Approved by the owner, including the vision line, on 2026-11-03.

---

## Where we're going
**Vision:** anyone can present their real experience convincingly, in their own words, for any opportunity.

**The core job** (one, shared by every user): *present my real experience convincingly for a specific opportunity.*

**The problem:** applicants face recalling, gathering and phrasing their own achievements from scratch when trying to apply for opportunities, causing them to undersell themselves, lose hours to repetitive forms and essays, and miss or abandon applications.

**Who:** students and recent graduates, job seekers and career changers, founders, researchers. The owner is user #1. **The floor:** the person with the least on paper, writing in a second language, late at night. If Arpli works for them, it works for everyone.

## The landscape (honest diagnosis)
- **Plain job autofill is crowded and free** (Simplify, Huntr). Arpli can't win on autofill alone; it must be reliable and fed by the person's own material.
- **The real competitor is the ChatGPT habit:** pasting a CV into a chat that's already open. Arpli has to beat it on effort, not just quality.
- **The open ground:** nothing found spans every opportunity type; every application tool keeps data in its own account; none is open source; AI letters get called "robotic"; nothing captures opportunities from social posts.
- **Rules shape the product:** many admissions and research-grant bodies restrict AI-written answers (UCAS, Brown, UKRI, NIH); LinkedIn and Indeed forbid automation; "connect the AI I already have" is clean for ChatGPT sign-in and local models, grey for reusing a Claude Code login.
- **What we don't know yet:** whether drafts truly sound like the person (desirability is the weakest lens), and whether real forms can be read and filled reliably enough.

## The bets
1. **A bucket that writes like you.** One private store of your achievements, work and stories, on your Mac, used for every opportunity type. It grows with every application: answers you've written are kept and can be reused as is, adjusted lightly, or reworked for a new context. Drafts come only from it, every claim traceable ("check this" on anything that isn't), in your own wording, at the AI help level the opportunity allows (fields only · you draft, Arpli refines · Arpli drafts from your words).
2. **On real forms.** Arpli works where the form lives: capture from Chrome, a side panel beside the real form, fill on request, copy for everything, you press Submit.
3. **Yours, free and open.** Local-first, open source, no account, and AI you already have, with no API keys to start.

## Not doing (in v1)
- Arpli never submits, never bulk-applies, never invents achievements.
- No reading or filling on LinkedIn or Indeed (copy only).
- No cloud account or sync; nothing sent to an AI without saying where it goes.
- No Arpli-chosen opportunity suggestions (v2); you bring opportunities in, or Arpli watches the sources you choose.
- No Windows, no phone, no recommender tracking, no outcome analysis, no full pitch decks, no team use.

## How we'll know
**Objective:** real applicants put their true best selves into real applications, with far less effort.
| Key result | Target (working) |
|---|---|
| KR1 · first useful draft in the first session | 20 of 20 install; at least 16 reach a first draft in session one |
| KR2 · real use | at least 15 of 20 submit one or more real applications with Arpli within 4 weeks |
| KR3 · true and theirs | at least 70% of submitted drafts rated "sounds like me" 4 or 5 out of 5; no invented claim reaches a submitted application |

Later: at least 40% "very disappointed" if Arpli went away (after 3 to 4 weeks). All measurement is opt-in; nothing is tracked by default.

---

## Product map: the whole app, by job step
Every feature exists to move the person through one step of the core job. **v1** shows the approved priority.

| Job step | What the person is trying to do | Feature | v1 |
|---|---|---|---|
| **Start** | get Arpli working with what they already have | **O6** first run and AI with no keys | Must |
| **1 · Plan** | choose what's worth their time | **O12** watch my sources · O11 Arpli finds opportunities | Should · v2 |
| **2 · Gather** | get the opportunity in; gather their evidence | **O4** one-click capture · **O1** pour in what you have · O9 learn from each form · O3 story interview | Must · Must · Should · Could (prototype decides) |
| **3 · Organise** | understand what each question asks; pick the right story | **O5** form companion (reads the questions) · **O2** AI help level per opportunity | Must · Must |
| **4 · Check** | confirm eligibility and what's needed | eligibility shown from the opportunity; recommender tracking | partly · Won't |
| **5 · Perform** | fill fields; write answers and documents | **O5** fill and copy · **O2** true drafts in your voice · **O10** reuse and adapt a past answer · O8 cover letter and CV · pitch summary · full decks | Must · Must · Must · Should · Could · Won't |
| **6 · Verify and track** | check every claim; see status and deadlines | **O2** "check this" guard · **O7** one tracker with reminders | Must · Must |
| **7 · Adjust** | revise; handle follow-ups | **O2** versions and refine · **O7** statuses | Must |
| **8 · Close** | submit; record the outcome; keep the best material | the person presses Submit · **O7** outcome · **O10** answers kept in the bucket for next time | always · Must · Must |

## What we focus on now
- **The bet in one line:** O1 + O2, on top of O6, delivered through O5. Capture (O4) and the tracker (O7) close the loop, and reuse (O10) makes every application feed the next.
- **The first slice:** one real application, start to finish: import a CV → connect AI → open a Greenhouse job in Chrome → see its questions beside the form → draft one answer with "check this" on → fill and press Submit → it shows in the tracker.
- **This batch (Batch 1, to 13 Dec):** Explore works out how all of this works and feels (patterns → journey and flows → screen map and principles → four directions → choose), then the "sounds like me" check and the 10-form check. Each feature then gets a spec, and is built on top of the existing code.

## Open strategy questions
- Cheap or free AI that's good enough for people without a Claude or ChatGPT subscription.
- Arpli's open-source licence.
- Written confirmation from Anthropic before reusing a Claude Code login becomes a headline feature.
- How Arpli sustains itself if it takes off (free and open source for now).

---
**Handoff**
- Output: `design/03-product-strategy.md`
- Status: approved by the owner, 2026-11-03
- Confidence: High that it matches approved decisions; the vision wording is the owner's choice and stays open to improvement
- Next: Explore step 1 (patterns, `design/04-explore.md`)
