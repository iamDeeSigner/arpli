# 09 · Explore step 5 · Screen map

**Date:** 2026-11-09 · **Linear:** DEE-86 (second part) · **beads:** `arpli-rln.10` · **Depth:** deep · **AI overlay:** on
**Built on:** the places and actions in the journey (`05-journey.md` part 1, P1 to P13, approved 2026-11-03) · the 47 drilled elements (`08-ux-elements.md`, drilled 2026-11-09) · today's code (`apps/desktop/src/lib/stores/nav.ts`: Profile, Opportunities, Applications, Settings).
**Method:** "8. Information Architecture" (Notion, DESIGN OS, Human-Centered Design Manual, opened 2026-11-09): main categories from what people need to do; one simple global navigation limited to the major sections; local navigation inside a section; breadcrumbs only for deep structures; labels in the users' own language, checked with a card sort. The information architecture skill adds: design from tasks inward, three levels at most, every place answers "where am I, how did I get here, how do I get back".

**What this is.** Every place in Arpli, how the places group, what they're called, and how you move between them. It holds for all four directions; where a direction changes something (S1 home, S2 where an answer is written) it says so. Labels here are proposals until the owner decides them, and **Low confidence** until testers try them: no card sort is possible before there are testers, so labels get a first-click check in Test.

---

## The map

```
MAC APP
  First run (P1) ─────────────────────────────► Applications
  Sidebar, always there:
    Applications (P4)
      Needs you · 3 new from your sources · Arpli is working · by deadline · Submitted · Not for me (filter)
      List ⇄ Board · Add · Sources (manage what you watch, P7)
      └─ One application (P5)
           deadline · eligibility · help level and AI rule · reminders · outcome · What you sent
           questions and documents, in the form's order · progress · Next
           ├─ Answer a question (P6) [S2]
           └─ A document in this application (U33)
    About you (P3, the bucket)
      Add · search · lines, stories, files, past answers · Standing answers · Your voice
      └─ One item (P3b)
    Documents (U47)
      Main CV · every document, by kind, each with where it was used · New document
      └─ One document
    Settings (P8), at the bottom
      The AI on this Mac · default help level · Chrome extension · Reminders · Email (What Arpli read)
      · Start with your Mac · Sharing how it went · Your data

CHROME
  Arpli's toolbar icon, with a badge when a form can be read ("4")
  Side panel:  Save (P9) · Form panel (P10) · Pair (P11)

ON THE MAC, OUTSIDE THE APP
  Menu bar (P13): Arpli is working · count of what needs you · due next · Add box · Open Arpli
  Notifications (P12): one reminder bundle a day; due within two days, Needs you, "Not sure it went through", replies

OUTSIDE ARPLI
  Download page and tester guide (U1) · email reminders (P12, DEE-88) · the real form, where you press Submit
```

**Small windows that open over a place, not places of their own:** Add review (P3a) · the "sounds like me" rows after Submitted (U30) · "Before you press Submit" (U36, in the panel) · the Add box from the menu bar (U40).

---

## Navigation

**Global: the sidebar.** It already exists in the design system (it folds to a row of icons). Four items, Settings at the bottom as the utility item. Every place in the app is at most three levels down: Applications → One application → Answer a question.

**Local, inside a place.**
- One application: its questions and documents as one list, in the form's order, with progress and a Next jump (U20).
- The bucket: search and filters (lines, stories, files, past answers), not sub-pages.
- Settings: one page of sections.

**Contextual links: the ones that make Arpli feel joined up.**
| From | To | Decided in |
|---|---|---|
| A source number in a draft | the exact line in the bucket | U35 |
| "Used in 4 applications" on an item | those applications | U13 |
| A Needs you item | the place where it gets done | U38 |
| A reminder or notification | the application, at the next question not done | P12, U20 |
| "Open the form" in the app | the real form, panel open at that question | U32 |
| "Go to it" in the panel | the field on the page | U25, U36 |
| A document in an application | the same document in Documents | U47 |
| The toolbar badge in Chrome | the panel, at that form | U4 |

**No breadcrumbs.** Three levels is shallow enough; Answer a question shows its application's name at the top with a way back.

**Where Arpli opens** is S1, the home question the four directions test. Until then it opens where you left off (P2), as today.

---

## Where am I, and where can I go

| Place | You know where you are by | Ways on | Ways back |
|---|---|---|---|
| First run | one screen at a time, "1 of 3" | Applications, with your first draft | Not now, at every step |
| Applications | the sidebar item is marked | an application · Add · Sources · Board | none needed (top level) |
| One application | its title, organisation and deadline at the top | a question · a document · the form in Chrome | Applications |
| Answer a question | the question, with its application's name above | Next question · Fill from the panel | the application |
| Bucket | the sidebar item is marked | an item · Add · Standing answers · Your voice | none needed |
| One item | its title, and "Used in…" | the applications it was used in | the bucket |
| Documents | the sidebar item is marked | a document · New document | none needed |
| Settings | the sidebar item is marked | each section on one page | none needed |
| Chrome panel | it names the page and form it's reading | Open in Arpli · Go to it | close the panel; the page is untouched |
| Menu bar | always the same short menu | Open Arpli · Add · due next | closes on its own |

---

## Labels

| What | Today in the code | Proposed | Status |
|---|---|---|---|
| The bucket | Profile | **About you** | decided 2026-11-09 (owner); first-click check in Test |
| Opportunities and applications | two sections | **Applications**, with Saved as its first stage | decided 2026-11-03 |
| Documents | none | **Documents** (the card's working name was Your documents) | decided with the sidebar, 2026-11-09 |
| Watching job boards and feeds | none | **Sources**, a button inside Applications | decided 2026-11-09 (owner) |
| Settings | Settings | **Settings** | unchanged |
| Stages and status words | discovered … withdrew in the data | see "Stages and status words" below | decided 2026-11-09 (owner) |
| Outcome words | won, rejected, waitlisted, withdrew in the data | Accepted · Not this time · Waitlisted · Withdrew | decided in U45 |

### Stages and status words (owner, 2026-11-09)

**Stages**, the board's columns and the stage you can change: Saved · Started · Ready to send · Submitted · Interview · Outcome. Outcome shows its word: Accepted · Not this time · Waitlisted · Withdrew.

**One status word per row**, the first that applies, in the who-needs-whom order (P4): Needs you · Not sure it went through · Deadline passed · Waiting for your AI · Due soon (within two days, matching reminders, U39) · then the row's stage. Always a word, never colour alone. "Submitted", not "Sent": it matches the button pressed on the form and the lines already written (U43).

| In the data today | Stage on screen |
|---|---|
| discovered | Saved |
| qualifying, drafting | Started |
| reviewing | Ready to send |
| submitted, awaiting | Submitted |
| (new, U42) | Interview |
| won · rejected · waitlisted · withdrew | Outcome: Accepted · Not this time · Waitlisted · Withdrew |

---

## What the directions change

- **S1, home:** what you see when Arpli opens (Needs you, the bucket, the Chrome panel). The sidebar stays the same in every direction.
- **S2, where an answer is written:** D1 in the Chrome panel · D2 in the Mac app or a Chrome window Arpli opens · D3 after a short interview · D4 in your own Claude or ChatGPT. Wherever it's written, Fill happens in the panel beside the form (U32), so the map above holds.
- **S3, how the bucket grows:** changes what Add and the interview do, not where they sit.

---

## Today's code against this map

| Today | This map |
|---|---|
| Sidebar: Profile, Opportunities, Applications, Settings | Applications, About you, Documents, Settings |
| Opens the last section visited (Profile by default) | the same until S1 is decided |
| Onboarding: four screens | First run: material first (P1) |
| Nothing in Chrome, no menu bar, no notifications | new |

---

## Questions for the owner

Asked one at a time.

1. ~~The bucket's name on screen.~~ **About you** (owner, 2026-11-09).
2. ~~The sidebar.~~ **Four items: Applications · About you · Documents · Settings; Sources inside Applications** (owner, 2026-11-09).
3. ~~Stages and status words.~~ **Six stages, and one status word per row in the who-needs-whom order** (owner, 2026-11-09).

---
**Handoff**
- Output: `design/09-screen-map.md`
- Status: written; the owner's three questions answered (2026-11-09): About you; four sidebar items with Sources inside Applications; six stages and the status words
- Confidence: Med for the structure (from approved places and drilled decisions); Low for labels until the first-click check with testers
- Next: the owner's answers, then step 7, the design principles
