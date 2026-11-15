# 10 · Explore step 7 · Design principles

**Date:** 2026-11-09 · **Linear:** DEE-86 (last part) · **beads:** `arpli-rln.10` · **Depth:** deep · **AI overlay:** on
**Built on:** the bet, "a bucket that writes like you, on real forms" (`03-product-strategy.md`) · the floor user, "the person with the least on paper, writing in a second language, late at night" · the 126 decisions from drilling (`08-ux-elements.md`) · the screen map (`09-screen-map.md`) · the tone of voice (`docs/brand/tone-of-voice.md`) · Taste (`Taste.md`).
**Method:** Design OS Explore step 7: three to five principles tied to the bet, each with "this means / this doesn't mean", written before any direction is judged; AI products answer the seven question sets in "Human Centered AI Design Principles" (Notion, DESIGN OS, Content Link Library, opened 2026-11-09). The design principles skill adds: opinionated, testable, ranked for conflicts, tested against past decisions.

**Where these came from.** Drilling kept reusing the same few patterns across very different cards. These principles name them, so the four directions and every later screen can be judged against them. Each is tested against decisions already made.

**Ranked.** When two principles pull apart, the higher one wins.

**Owner review (2026-11-09):** all five kept as written, one at a time, in this order.

---

## 1 · Your words, or nothing

Arpli only works from what you gave it, and says so when it can't trace something.

**This means**
- Drafts come only from your bucket; anything not in it is marked "check this" (U28, U34).
- The bucket keeps your words exactly; Arpli adds a title and tags, never a rewritten summary (U11, U16).
- The programme's words are quoted, never paraphrased: eligibility, AI rules, the form's own questions (U10, U14, U19).
- A tailored CV picks and orders your own lines; any rewording is a change you accept (U33).

**This doesn't mean**
- Arpli won't write. It drafts, refines and suggests; it just never makes things up.
- Your words can't change. You edit anything, any time; Arpli offers changes, one at a time.

**Tested against:** a draft built on a thin bucket would read better padded out. Decided: ask first, and leave a marked blank rather than invent (U15).

## 2 · You decide; Arpli never judges you

Arpli shows, suggests and recommends. It never grades you, your fit or your writing, and it never acts in your name.

**This means**
- No fit scores, no "you may not meet this", no score on an answer (U6, U23).
- You press Submit; you tick every agreement on the form yourself (U25, U43).
- Changes come one at a time, each accepted or skipped (U21, U33, U41).
- Nothing switches on, sends or fills by itself: the AI, starting with the Mac, sharing a rating (U3, U30, U40).

**This doesn't mean**
- Arpli has no view. It pre-selects an AI, picks stories and says why, and says when much of a draft isn't in your bucket (U3, U22, U34).
- You must decide everything. Defaults are set so the first draft comes fast (U21).

**Tested against:** a fit signal would help Emeka triage a dozen programmes. Decided: only what the organisation states, because a wrong signal could talk Ada out of applying (U6).

## 3 · Say what you checked, not what you guess

When Arpli is unsure, it says what it looked at and stops there. Unknown means said, never filled in.

**This means**
- "No AI rule found in what Arpli read: the form, the page, the guidance PDF." (U21)
- An empty field says "Not found on the page · Add", never a guess (U10).
- "Looks sent. Mark it as submitted?", never "Submitted" on a guess (U43).
- A general reading is labelled as general and says "usually"; a less certain mark looks and reads less certain (U19, U34).
- Where your text and your voice go is said at the moment they go (U3, U12).

**This doesn't mean**
- Warnings everywhere. One plain line, with any detail under Details.
- Arpli hedges everything it's sure of. Names and numbers checked in code say "Not in your bucket" plainly (U34).

**Tested against:** "No AI rule" would be shorter. Decided: say where Arpli looked, because a rule can sit in a PDF it never saw (U21).

## 4 · Steady at 11 pm

Arpli is calm for someone tired, writing in a second language, with a deadline. One thing at a time, and nothing that makes a moment bigger than it is.

**This means**
- Things arrive whole: a draft at once, fields together, never text repainting in front of you (U8, U28).
- It asks once and remembers: the voice check, "save what's new", the rating, the extension (U4, U16, U30).
- At most one reminder notification a day; a no gets one steady line; no confetti, no exclamation marks (U39, U43, U45).
- Your words are never lost, whatever fails (part 3 rules, E7).

**This doesn't mean**
- Quiet about what matters. A deadline within two days, a code, a robot check and a reply still reach you every time (U26, U39, U44).
- Slow. A first draft in the first session is the goal (U21, F1).

**Tested against:** streaming words would feel faster. Decided: the whole draft at once, after checks, so nothing changes in front of you (U28).

## 5 · Every application makes the next one easier

What you write once is kept, findable and ready to reuse, in your words, with where it went.

**This means**
- Finished answers become past answers, shown with where they went and how it went (U46).
- Up to two similar past answers wait quietly under a new question (U31).
- New facts you write are offered to your bucket once (U16); documents are reused and copied only when changed (U47).
- Coming back after months shows what's ready, and one step to add what's new (U46).

**This doesn't mean**
- Reuse happens by itself. Nothing is inserted on its own; near-identical reuse to the same kind of programme gets a gentle line first (U31).
- The bucket fills with drafts. Half-finished answers stay on their application (U46).

**Tested against:** offering every past answer would give more to choose from. Decided: up to two, by meaning, because most past answers need adjusting anyway (U31).

---

## When principles pull apart

- **1 over 4:** "check this" can slow a tired person down. Truth wins: marks stay, but never block Fill (U34).
- **2 over 5:** reuse would be faster if Arpli inserted the best past answer itself. You decide: it waits under the question (U31).
- **3 over 4:** a calm screen would hide "Not checked yet". Saying it wins: a check that didn't run never looks like a pass (U34).

---

## The seven Human Centered AI question sets

| Question set (Notion) | Arpli's answer |
|---|---|
| User-centric: trust, transparency, control | Principles 1 to 3: drafts only from your bucket, sources on every sentence, you decide every change and every send |
| Branding and differentiation | Against the ChatGPT habit, Arpli's difference is truth and your voice, said in a calm friend's tone (tone of voice; Principles 1 and 4) |
| Ethical: fairness, privacy, explainability | No fit or eligibility judgements, which are where bias would hurt (Principle 2); your data on your Mac, where text goes always said (Principle 3); "where did this come from?" on every sentence |
| Usability and accessibility | Plain words for second-language readers, never colour alone, one thing at a time, every action by keyboard (Principle 4; screen map) |
| Consistency and coherence | The same few patterns everywhere: one change at a time, quote don't paraphrase, say what was checked, ask once |
| Adaptability and learning | Your voice guide learns from "Not quite" and shows what it learned in one line; nothing changes behind your back (U30) |
| Reliability and performance | Every failure has a plain line, a safe state and one next step (part 3, E1 to E31); Principle 3 |

---
**Handoff**
- Output: `design/10-principles.md`
- Status: approved by the owner (2026-11-09), all five kept as written and in this order
- Confidence: Med (drawn from 126 decisions the owner made; not yet used to judge a direction)
- Next: DEE-86 is done; the four directions (DEE-79 to DEE-82) come next, each judged against these principles
