# 11 · Explore step 8 · Four directions

> **Dropped on 15 Nov 2026 by the owner:** the four direction prototypes are not going ahead; the owner is taking a fresh approach. This file stays as a record and a bank of ideas. Linear DEE-79 to DEE-83 and DEE-90 Canceled; beads `arpli-rln.3` to `.7` and `.4.1` closed.

**Date:** 2026-11-09 · **Linear:** DEE-79 to DEE-82 (D2's engineering check: DEE-90) · **beads:** `arpli-rln.3` to `arpli-rln.6` (`arpli-rln.4.1`) · **Depth:** deep · **AI overlay:** on
**Built on:** the journey and where it splits (`05-journey.md`: S1 where you land, S2 where an answer is written and by which AI, S3 how the bucket grows) · the 126 drilled decisions (`08-ux-elements.md`) · the screen map (`09-screen-map.md`) · the five principles (`10-principles.md`) · the plan approved by the owner (2026-11-02: four directions as loose coded prototypes with real AI on the owner's material; 2026-11-09: yes to this plan).
**Method:** Design OS Explore step 8: three to four directions that differ in approach (where the work happens, or its core mechanism), not in layout; one is the radical option; each has a name, a one-line bet, the principle it leans on, its riskiest assumption, rough screens of the key moment, a win-state and one failure case; a congruence check so no two test the same idea.

**What's fixed in every direction:** the journey, the drilled decisions, the screen map and the principles. A direction changes only S1, S2 and S3. So every direction drafts only from your bucket, marks "check this", shows sources, fills from the panel beside the form, and leaves Submit to you.

**The key moment, the same in all four:** one real question from one real opportunity → a draft → "check this" and sources → on the form → "Before you press Submit" → Submitted. The same material and the same question in each, so they can be compared.

---

## D1 · Next to the form

**Bet:** help belongs where the form is. You never leave the page you're applying on.
**Leans on:** Principle 4, Steady at 11 pm (one place, no switching).
**S1, where you land:** the Chrome panel is where you work. The Mac app is the back room (Applications, About you, Documents, Settings) and opens on Applications with Needs you at the top.
**S2, where an answer is written:** in the Chrome side panel, beside the form, by the AI on your Mac.
**S3, how the bucket grows:** from what you write in the panel ("save what's new", ask first when it's thin).
**Riskiest assumption:** a narrow panel gives enough room to read, judge and fix a long answer.
**The question it answers:** can someone read, check and fix a 300-word answer well in a side panel?

```
┌ Greenhouse form (Acme) ───────────────────┬ Arpli panel ──────────────────────┐
│ First name  [Ada            ]             │ Acme · Product designer           │
│ Email       [ada@…          ]             │ Reading this form · 6 fields      │
│ CV          [Ada_CV.pdf     ]             │ Eligibility · 2 requirements   ▸  │
│                                           │ Standard fields · 4 · Fill all ▸  │
│ Why do you want to work at Acme? *        │ ─────────────────────────────────  │
│ ┌───────────────────────────────────────┐ │ 2  Why do you want to work…       │
│ │ (outlined while selected)             │ │ Looks for: a real reason, and     │
│ └───────────────────────────────────────┘ │ what you'd bring. (General        │
│                                           │ reading · not from Acme)          │
│                                           │ Using 4 things from your bucket ▸ │
│                                           │ Claude on this Mac · Drafts from  │
│                                           │ your words                        │
│                                           │ [ Draft ]                         │
│                                           │ ┌ Draft ───────────────────────┐  │
│                                           │ │ I tutored 14 students… ¹ ³   │  │
│                                           │ │ Acme's mission inspires me   │  │
│                                           │ │ ┄┄ May not be in your bucket │  │
│                                           │ └──────────────────────────────┘  │
│                                           │ [Use this draft] [Not quite]      │
│                                           │ 182 / 250 words                   │
│                                           │ [ Fill ]  [ Copy ]                │
└───────────────────────────────────────────┴───────────────────────────────────┘
```

**Win-state:** the answer is on the form, read back as "on the form", and the person never left the tab.
**One failure case:** a 500-word personal statement in a 360-pixel panel. The person scrolls up and down to match source numbers, loses their place, and opens "Write it wide in Arpli", which is really D2.

## D2 · About you as home

**Bet:** start from your material. The more you pour in first, the truer and easier every application gets.
**Leans on:** Principle 1, Your words, or nothing, and Principle 5, Every application makes the next one easier.
**S1, where you land:** About you, your material growing, with Needs you as a strip at the top.
**S2, where an answer is written:** in the Mac app, wide, with room for sources and side-by-side compare. The form opens in a Chrome window Arpli opens (its own profile), where Arpli reads, fills and sees the Submit press. Your own Chrome with the panel is the fallback.
**S3, how the bucket grows:** you pour in first (CV, talk it through, documents); every application then adds to it.
**Riskiest assumption:** people will put in their material before they need it. The second risk is technical: sites accept the Chrome window Arpli opens (DEE-90).
**The question it answers:** does starting from your material make the first draft good enough to be worth the extra step?

```
┌ Arpli (Mac app) ─────────────────────────────────────────────────────────────┐
│ Applications │ Acme · Product designer · due Fri 17:00 (London)               │
│ About you    │ Question 2 of 4 · Why do you want to work at Acme?             │
│ Documents    │ ┌ Using ──────────────┐ ┌ Draft ────────────────────────────┐  │
│ Settings     │ │ ✓ Tutoring group    │ │ I tutored 14 students… ¹ ³         │  │
│              │ │   shows leading     │ │ …                                  │  │
│              │ │   ★ Lead with this  │ │ Acme's mission inspires me         │  │
│              │ │ ✓ Design course     │ │ ┄┄ May not be in your bucket       │  │
│              │ │ + Add from bucket   │ └────────────────────────────────────┘  │
│              │ └─────────────────────┘ [Use this draft] [Not quite]            │
│              │ 182 / 250 words · Ready to fill · [Open the form ↗]             │
└──────────────┴───────────────────────────────────────────────────────────────┘
        ↓ opens the form in a Chrome window Arpli can see into, panel ready to Fill
```

**Win-state:** a first draft with fewer "check this" marks than D1's, because the bucket was fuller when it was written.
**One failure case:** Google sign-in refuses the Arpli Chrome window ("This browser may not be secure"). Arpli says so plainly and offers your own Chrome with the panel.

## D3 · Story interview

**Bet:** talking is easier than writing. Answers built from what you said sound most like you, and this also works where a programme doesn't allow AI-written answers.
**Leans on:** Principle 1, Your words, or nothing, and Principle 2, You decide.
**S1, where you land:** Needs you, plus the next question waiting with "Let's find your story".
**S2, where an answer is written:** after a short interview (voice or typed) for that question. Arpli then shapes a draft mostly from your own spoken sentences, or, at "fields only" and "you draft", gives you your highlights to write from yourself.
**S3, how the bucket grows:** the interview is the main way in; every answer you speak is kept with its recording.
**Riskiest assumption:** someone will sit through an interview at 11 pm, and it beats draft-first on "sounds like me".
**The question it answers:** do drafts from an interview get a higher "sounds like me" rating, and is the time worth it?

```
┌ Arpli ──────────────────────────────────────────────────────┐
│ Acme · Question 2 · Why do you want to work at Acme?        │
│ Let's find your story · 1 of 3                              │
│                                                             │
│ You tutored in 2023. Tell me about one session or one       │
│ student that went well.                                     │
│                                                             │
│ [ ● Talk ]   or type here …                                 │
│                                                             │
│ "There was this boy, Chidi, who failed maths twice, and…"   │
│  Turned into text on this Mac · recording kept              │
│                                                             │
│ [ Next question ]                       Skip · Draft anyway │
└─────────────────────────────────────────────────────────────┘
        ↓ after 1 to 3 questions: highlights of your own sentences → a draft
          where most sentences are yours, each with its source
```

**Win-state:** a draft where most sentences are the person's own spoken words, rated 4 or 5 for "sounds like me".
**One failure case:** a shared room at night means no talking. Typed, the interview feels like a form, and the person presses "Draft anyway" after the first question.

## D4 · No AI of its own (the radical option)

**Bet:** people already have an AI they trust. Arpli doesn't compete with it: it holds your material, makes the answer true, and gets it onto the form.
**Leans on:** Principle 2, You decide (your AI, your choice), and Principle 3, Say what you checked.
**S1, where you land:** Applications with Needs you, and "Writing happens in your Claude" shown plainly.
**S2, where an answer is written:** in your own Claude or ChatGPT. Arpli hands over the question and the bucket items it would use, either through a connector your Claude reads from or as one copied hand-off. The answer comes back to Arpli (through the connector, or pasted), where "check this", sources and the voice rules run before you fill.
**S3, how the bucket grows:** as in the others, plus anything new in the returned answer is offered to your bucket.
**Riskiest assumption:** the round trip is smooth enough to beat pasting into ChatGPT on its own, and the checks still catch invented claims in text written elsewhere.
**The question it answers:** is the round trip worth it, and do "check this" and sources still work when another tool writes?

```
┌ Arpli panel ────────────────────────┐      ┌ Your Claude ─────────────────────┐
│ 2  Why do you want to work…         │      │ Arpli: the question, and 4 things│
│ Using 4 things from your bucket ▸   │ ───► │ from Ada's bucket                │
│ [ Write this in your Claude ↗ ]     │      │ Ada: make it warmer, shorter     │
│   or [ Copy for ChatGPT ]           │      │ Claude: "I tutored 14 students…" │
│                                     │ ◄─── │ [ Send to Arpli ]                │
│ Back from Claude · Checking claims  │      └──────────────────────────────────┘
│ ┌ Answer ──────────────────────┐    │
│ │ I tutored 14 students… ¹ ³   │    │
│ │ Acme is the leading…         │    │
│ │ ┄┄ May not be in your bucket │    │
│ └──────────────────────────────┘    │
│ [ Fill ]  [ Copy ]                  │
└─────────────────────────────────────┘
```

**Win-state:** the answer comes back, gets checked and is filled, in fewer steps than copying between ChatGPT and the form today.
**One failure case:** the person edits in ChatGPT, ChatGPT adds praise for the company, and the pasted answer has no sources, so half of it comes back marked "check this". It's honest, but it feels like a telling-off.
**Note:** D4 needs no AI on the Mac, so it's also an answer to the open question of what people without a paid AI use.

---

## Congruence check

Each direction tests a different idea, so none duplicates another:
- **D1:** where the work happens, beside the form.
- **D2:** in what order, your material first.
- **D3:** by what mechanism, an interview instead of a draft.
- **D4:** whose AI writes, yours instead of Arpli's.

D1 and D2 both touch "where", but they test different things: D1 asks whether the panel is enough, D2 asks whether material-first pays off.

---

## Brief for the prototypes (Design Studio)

Design Studio (`studio/`) is its own workspace: the prototypes are built in a chat opened there, starting from this brief.

**Read first:** `../design/Taste.md`, `../design/DesignSystem.md`, `../design/10-principles.md`, this file, and the drilled cards in `../design/08-ux-elements.md` for the elements on the key moment (U18 to U36 and U43).

**One prototype per direction, each clickable through the key moment**, with these states: reading the form · drafting (status in words with time, and Stop) · the draft arrived (source numbers, "check this" marks, Not quite) · filled and read back · "Before you press Submit" · Submitted with the "sounds like me" rows · the direction's one failure case.

**The same for all four:** the same material, the same opportunity and question, and a Greenhouse-style form page inside the prototype (the Chrome extension isn't built; the form is simulated).

**Real drafts:** drafts come from Arpli's engine on this Mac, written by Claude (the owner's Claude Code) and by the local model (gpt-oss:120b), so the two can be compared (owner, 2026-11-02). D4 hands off to the owner's own Claude instead.

**Plain screens:** the current design system, kept plain (Taste: v1 is plain until Polish). Each screen carries a one-line scope note: the question it answers.

**Not in scope:** polish, the real Chrome extension, real form filling on live sites (that's the 10-form check), D2's Chrome window (that's DEE-90).

**Done when:** four prototypes, each with a local link the owner can open and click through, and a short note per direction on what it showed.

---

## Owner review (2026-11-09)

- **All four directions kept as written**, one at a time: D1 Next to the form · D2 About you as home · D3 Story interview · D4 No AI of its own.
- **Material:** what's already in Arpli on this Mac, plus **one real opportunity the owner would apply to now**, with 2 to 4 written questions (a link). The material stays on this Mac; only the drafting request goes to the owner's own Claude. **Waiting for:** the link.
- **Engine for real drafts:** in `~/Developer/arpli`, `nvm use` then `npm run dev` (Node 24); the engine answers on `127.0.0.1:4848`.

---
**Handoff**
- Output: `design/11-directions.md`
- Status: approved by the owner (2026-11-09), all four kept; material agreed; waiting for one real opportunity link; then the prototypes are built in a Design Studio chat from the brief above
- Confidence: Med for the directions (built from approved decisions and splits); Low for every riskiest assumption (untested by design)
- Next: owner review → material → prototypes in Design Studio → critique and choose (DEE-83)
