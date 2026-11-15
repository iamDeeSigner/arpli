# 08 · Explore step 6 · UX elements by job step

**Date:** 2026-11-09 · **Linear:** DEE-86 (first part) · **beads:** `arpli-rln.10` · **Depth:** deep · **AI overlay:** on
**Built on:** the core job, job map and job stories (`01-preplanning.md` section 6) · the product map by job step (`03-product-strategy.md`) · the seven moments and their decisions (`04-explore.md`, M1 to M7) · the journey, parts 1 to 3 (`05-journey.md`, P, F, R and E numbers) · the personas (`docs/brand/user-personas.md`) · the older jobs list (`docs/design/jobs-to-be-done.md`, 11 Oct).
**Method (Notion, DESIGN OS, opened 2026-11-09):** "Story Mapping for End-to-End Workflow Design" (Best Practices Library, UX-315): the job steps run across the top, the pieces of experience sit under each step in order of importance, one "minimum slice" crosses every step end to end, and a line separates what's in from what's later; the map shows gaps between steps that a feature list hides. "Design & System requirements template" (UX Research Templates): each piece gets a line for the person ("you need to…") and one for the system ("Arpli needs to…"); the person's line states a goal, not a solution.

**What this is.** The experience broken into small pieces, each one card, so we can drill into them one at a time and brainstorm. Nothing here is a screen or a layout. Names are working names; on-screen labels are set in step 5 (the screen map).

**How to read a card**
- **Job story:** "When I…, I want…, so I can…". Stories marked (§6) are from Frame; the rest are written here from the journey and are **Low confidence**: none has been checked with people yet.
- **Hardest for:** the person this piece fails first. The floor is "the person with the least on paper, writing in a second language, late at night" (`03-product-strategy.md`).
- **Decided:** what's already settled, with its source (M, P, F, R, E numbers, or a dated decision). We don't reopen these while drilling.
- **Splits:** where the four directions answer differently (S1 home, S2 where an answer is written and by which AI, S3 how the bucket grows; `05-journey.md`).
- **v1:** the approved level (Must, Should, Could, partly). **Today:** what the current code has, only where we know it.
- **Needs:** the requirement line (template above).
- **To brainstorm:** two or three open questions. Decisions from drilling go back into the card.

---

## The map

★ = on the first slice: one real application from opening Arpli to "Submitted" (F1 then F3). ◇ = on the second slice, "the second application" (owner, 2026-11-09): it starts in Plan (new from your sources, worth my time, pin), passes Check (eligible, what's needed), reuses a past answer, and goes through Adjust (versions, a follow-up); in between it uses the first slice's pieces again. Per the story mapping practice, the first slice is the minimum path that crosses the job end to end. **It is not a cut:** everything in v1 is built (owner, 2026-11-09). It marks what one real application touches, which is where drilling starts.

| Job step | The person is trying to | Elements |
|---|---|---|
| **Start** | get Arpli working with what they already have | U1 Getting Arpli onto your Mac ★ · U2 The first screen ★ · U3 The AI on this Mac ★ · U4 Adding Arpli to Chrome ★ |
| **1 · Plan** | choose what's worth their time | U5 New from your sources ◇ · U6 Worth my time? ◇ · U7 Pin, snooze or let it go ◇ |
| **2 · Gather** | get the opportunity in | U8 Save from Chrome ★ · U9 Add in the app ★ · U10 Reading the opportunity ★ |
| | gather their evidence | U11 Pour in what you have ★ · U12 Talk it through · U13 Your bucket ★ · U14 Standing answers · U15 Ask first when the bucket is thin ★ · U16 Save what's new while you write · U17 Story interview |
| **3 · Organise** | understand each question; pick the right story | U18 Reading the form's questions ★ · U19 What this question is really asking ★ (gap, now v1) · U20 The questions in one application ★ · U21 The help level and the programme's rules ★ · U22 What a draft will use ★ |
| **4 · Check** | confirm eligibility and what's needed | U23 Eligibility and what's needed ◇ |
| **5 · Perform** | fill fields; write answers and documents | U24 Fill standard fields ★ · U25 Fields that speak for you ★ · U26 Tricky sites and human checks · U27 Write it yourself · U28 Draft from your bucket ★ · U29 Which AI writes, and when it can't ★ · U30 Sounds like you ★ · U31 Reuse a past answer ◇ · U32 Fill this answer, or Copy ★ · U33 Documents in an application · U47 Your documents (new) |
| **6 · Verify and track** | check every claim; see status and deadlines | U34 Check this ★ · U35 Where did this come from? ★ · U36 This is what you're sending ★ · U37 Applications ★ · U38 Needs you · U39 Reminders · U40 Menu bar and Dock |
| **7 · Adjust** | revise; handle follow-ups | U41 Versions, refine and tighten ◇ · U42 Follow-ups after sending ◇ |
| **8 · Close** | submit; record the outcome; keep the best material | U43 Knowing it was sent ★ · U44 Spotting replies in your email · U45 Recording the outcome · U46 Kept for next time ★ |
| **Across every step** | | X1 Undo and a way out · X2 AI work in words, with Stop · X3 Where your text goes · X4 When something fails · X5 Offline · X6 Your data · X7 Sharing how it went |

**What the map shows, and what was decided (owner, 2026-11-09)**
- **One gap in the job itself.** Organise is "understand what each question is really asking" (job map step 3), but nothing in the journey did that. It's the floor user's need (Ada: "what does 'demonstrated leadership' actually mean?"). **Decided:** U19 is a v1 Must, part of drafting, with its source always said; it joins the first slice.
- **Documents had no place.** **Decided:** every document is a Must, in every common format; documents have a place of their own (U47, new) and also live inside each application (U33); Arpli writes text documents, and a deck you have is kept and attached (Linear DEE-89, beads `arpli-95z`).
- **Nothing asked for the "sounds like me" rating KR3 needs.** **Decided:** asked after "Submitted", for everyone, kept on this Mac, shared only with a yes (U30, X7).
- **Plan, Check and Adjust had nothing on the first slice.** **Decided:** the first slice stays as it is; a second slice, "the second application" (◇), crosses all three and is drilled as its own group.

---

## Drill order

The bet is "a bucket that writes like you, on real forms". The pieces that make or break it come first; then documents; then what gets the first person to a draft (KR1); then the second application and what brings people back (KR2); then the one Could the prototypes decide. Reordered after the owner's decisions on 2026-11-09; 47 elements.

**The bet, part 1: it writes like you, and it's true**
1. U28 Draft from your bucket
2. U30 Sounds like you
3. U34 Check this
4. U35 Where did this come from?
5. U22 What a draft will use
6. U15 Ask first when the bucket is thin
7. U11 Pour in what you have
8. U13 Your bucket
9. U31 Reuse a past answer
10. U19 What this question is really asking (the gap, now v1)

**The bet, part 2: on real forms**
11. U18 Reading the form's questions
12. U24 Fill standard fields in one press
13. U32 Fill this answer, or Copy
14. U25 Fields that speak for you
15. U36 This is what you're sending
16. U43 Knowing it was sent

**Documents** (owner, 2026-11-09: every document is a Must; a document is a draft that leaves through Fill, so it follows both parts of the bet)
17. U33 Documents in an application
18. U47 Your documents

**Getting the first person to a draft (KR1)**
19. U3 The AI on this Mac
20. U2 The first screen: start with what you have
21. U21 The help level and the programme's rules
22. U29 Which AI writes, and when it can't
23. U8 Save from Chrome in one click
24. U10 Reading the opportunity
25. U4 Adding Arpli to Chrome
26. U1 Getting Arpli onto your Mac

**The second application: Plan, Check and Adjust (KR2)** (the second slice, ◇)
27. U5 New from your sources
28. U6 Worth my time?
29. U7 Pin, snooze or let it go
30. U23 Eligibility and what's needed
31. U41 Versions, refine and tighten
32. U42 Follow-ups after sending

**Bringing them back (KR2)**
33. U37 Applications
34. U38 Needs you
35. U39 Reminders
36. U20 The questions in one application
37. U27 Write it yourself
38. U14 Standing answers
39. U26 Tricky sites and human checks
40. U12 Talk it through
41. U16 Save what's new while you write
42. U9 Add in the app
43. U45 Recording the outcome
44. U46 Kept for next time
45. U44 Spotting replies in your email
46. U40 Menu bar and Dock

**Could, decided by the prototypes**
47. U17 Story interview

X1 to X7 are rules already decided; they get drilled when they come up inside a card.

---

## Start

### U1 · Getting Arpli onto your Mac · drill 26 · ★ · drilled 2026-11-09
- **Job story:** When I hear about Arpli from a friend or a post, I want to install it and open it without getting stuck on a warning, so I can try it tonight.
- **Hardest for:** the person least sure with computers, met by the macOS "can't be opened" warning. Ada works mostly on a phone and a shared library desktop, so a Mac may not be hers to install on (a recruiting criterion for Test).
- **Decided:** free for the 20 testers, with a short picture guide to the one-time "Open Anyway" step; pay Apple before the public release (F2 open questions, 2026-11-09) · the download page says Arpli is free, open source, stays on your Mac, and which AI it works with (F4).
- **Drilled (owner, 2026-11-09):** **the "Open Anyway" picture guide lives in both places**: on the download page right after Download ("macOS will warn you the first time. Here's what to press."), and inside the window the download opens, next to the Arpli icon.
- **Drilled (owner, 2026-11-09):** **the download page's line**: "Arpli keeps your stories on your Mac and helps you draft and fill applications in your own words."; it must not promise yet: that it works on every form, that drafts will sound like you (KR3, still being tested), any outcome ("get accepted"), Windows or phone; no hype words (tone of voice).
- **Drilled (owner, 2026-11-09):** **a way back for testers who give up at the warning**: the tester guide has "Stuck at the warning? Message me" with the owner's contact, and a short video of the step; for the public release, Apple's signing removes the warning (decided); no email asked for on the download page.
- **v1:** Must (Release; KR1 counts installs).
- **Needs:** you need to get from the download to Arpli's first screen on your own · Arpli needs to warn you, before macOS does, that the warning is coming and what to press.
- **To brainstorm:**
  1. ~~Where the "Open Anyway" guide lives.~~ Decided: both places.
  2. ~~What the download page promises, and what it must not.~~ Decided: the plain line, no unproven promises.
  3. ~~Someone who gives up at the warning: any way back?~~ Decided: testers get the owner's contact and a video.

### U2 · The first screen: start with what you have · drill 20 · ★ · drilled 2026-11-09
- **Job story:** When I open Arpli for the first time, I want to start with something I already have, so I'm not filling in a profile before anything useful happens.
- **Hardest for:** someone with no CV at hand, or one that's out of date, at 11 pm.
- **Decided:** no welcome page; this screen is the welcome (F1 step 1) · material first, AI alongside (M1) · ways in: a CV, a LinkedIn export, a link, typed lines, or talk · Arpli reads in the background while you go on · "first time" is decided by the bucket, not by a remembered flag (E1, DEE-74).
- **Drilled (owner, 2026-11-09):** **one privacy line before anything is dropped**: "Everything you add is kept on this Mac. Only the AI you choose reads it, to sort it and write your drafts."; which AI is named one step later with its own line (U3). Follows: nothing is sent to an AI before you've chosen one; reading before then is done on this Mac.
- **v1:** Must (O6, O1). **Today:** four onboarding screens (welcome, connect your AI, start your profile, done) that save nothing (memory, intake).
- **Needs:** you need to know in one look what to give and why · Arpli needs to start reading what you give at once, and keep it even if you leave.
- **To brainstorm:**
  1. ~~What the screen says about privacy, in one line.~~ Decided: kept here, read by your AI.
  2. ~~Five ways in: all equal, or CV first?~~ Already decided in part 2 (2026-11-09): CV first; the other ways in quieter.
  3. ~~While the CV is read: wait, or move on?~~ Already decided: Arpli reads in the background while you go on.

### U3 · The AI on this Mac · drill 19 · ★ · drilled 2026-11-09
- **Job story:** When I set Arpli up, I want it to use the AI I already have, with no keys, so I can start without learning anything technical.
- **Hardest for:** someone who doesn't know which AI they have, or has none and no budget for one.
- **Decided:** a card with its state in words: checking · not found · sign in · needs attention · off · ready; one fixing action per state, a button or a short guide, never a terminal; looking never starts anything (P1, P8, E2, E3) · the AI found is pre-selected, with "Not now" (F1) · one line on where your text goes · Arpli never switches AI on its own (rules) · with no AI, everything except drafting works (E2).
- **Drilled (owner, 2026-11-09):** **with no AI found, the order is: an AI you already use, then a model on this Mac, then a key**: first an AI you already pay for or sign in to (ChatGPT, Claude); second a model on this Mac, said honestly as free and private but slower, a big download, only on Macs that can run it; last, folded under "Other ways", an API key (technical, costs money); "Not now" always there. The engineer's check decides which of these exist; this sets the order.
- **Drilled (owner, 2026-11-09):** **"where your text goes" names who receives it and through whose account, with their own policy linked**: "Your text goes to Anthropic through your own Claude account." · "Your text goes to OpenAI through your own ChatGPT account." · "Your text stays on this Mac." · "Your text goes to [company] using your key."; each ends with "What they keep", opening that company's policy page; no promises on their behalf.
- **Drilled (owner, 2026-11-09):** **two AIs found: both shown, one pre-selected, with a few words why**: the one ready to draft now; if both are ready, the one that drafts faster on this Mac; one click switches; no separate "which AI?" question.
- **Splits:** D4 needs no AI on the Mac (S2).
- **v1:** Must (O6). **Today:** 13 AI providers in the engine; for Claude Code it reports "found, signed in, plan" without the email (memory, foundation).
- **Needs:** you need to know whether you can draft tonight, and what to do if not · Arpli needs to find each AI it supports without starting it, and say its state in words.
- **To brainstorm:**
  1. ~~With no AI found, which way comes first?~~ Decided: yours, then on this Mac, then a key.
  2. ~~"Where your text goes" in one line for each kind of AI.~~ Decided: who, whose account, their policy.
  3. ~~Two AIs found: which is pre-selected?~~ Decided: both shown, the ready (or faster) one pre-selected.
- **Watch:** running the person's own Claude is still an open question to Anthropic (design-state).

### U4 · Adding Arpli to Chrome · drill 25 · ★ · drilled 2026-11-09
- **Job story:** When I'm about to apply on a real form, I want Arpli in my own Chrome, so the form and my answers are in one place.
- **Hardest for:** someone who has never installed or pinned a Chrome extension.
- **Decided:** offered after the first draft, never forced (F1 step 8; the one choice in part 2) · a picture of how to pin it · pair by entering the code Arpli shows (P11) · the link shown as a dot and a word: Paired · Reconnecting · Arpli isn't open (E18) · Save still works when Arpli is closed (E18).
- **Drilled (owner, 2026-11-09):** **after "Later", it's offered again only when it would help**: one quiet line on an application whose form is online, "Fill this on the real form: add Arpli to Chrome"; once per application, never a pop-up; always in Settings; after two passes, Settings only.
- **Drilled (owner, 2026-11-09):** **on a form, a badge on Arpli's toolbar icon** shows the number of questions found ("4") when the page has a form Arpli can read; nothing is added to the page (U18); one click opens the panel at that form.
- **v1:** Must (O4, O5). **Today:** nothing built in Chrome.
- **Needs:** you need to get from "Use Arpli on the real form" to a working extension in about a minute · Arpli needs to talk only to its own extension, and say plainly when the link is broken.
- **To brainstorm:**
  1. ~~A code to type, or pairing that just happens?~~ Already decided (P11): pair by entering the code Arpli shows; it's also how the engine knows the caller is Arpli's own extension (DEE-70).
  2. ~~Someone who pressed "Later": where is it offered again?~~ Decided: when it would help, quietly.
  3. ~~On a form, how does the person know Arpli is there and ready?~~ Decided: a badge on the toolbar icon.

---

## 1 · Plan

### U5 · New from your sources · drill 27 · ◇ · drilled 2026-11-09
- **Job story:** When I follow a few job boards or opportunity sites, I want Arpli to check them while my Mac is on and show what's new with deadlines, so I find opportunities without searching every day. (Owner's description, G2.)
- **Hardest for:** a student who doesn't know which links Arpli can read.
- **Decided:** add a source; see what's new, with deadlines and when each source was last checked; save one in one click, as "Saved"; dismiss an item; remove a source; a source that can't be read is said plainly, with paste-in (P7, R5, E17) · readable: Greenhouse, Lever and Ashby boards, RSS and Atom feeds; not LinkedIn, Indeed, X or search pages (`02-opportunity.md` 9b) · Arpli-chosen opportunity suggestions stay v2.
- **Drilled (owner, 2026-11-09):** **watching is offered where you already are**: from a list page ("Watch this page for new ones", U8) and from a single saved job on a board Arpli can read ("Watch Acme's jobs for new ones"); you never type a feed link; pasting a link in your sources still works.
- **Drilled (owner, 2026-11-09):** **"3 new from your sources" is one folded line near the top of Applications**, below Needs you; it opens to the list, where you save or dismiss each; no Mac notification; not counted on the menu bar or Dock (those count what needs you).
- **Drilled (owner, 2026-11-09):** **a new item shows only the opportunity's facts**: title, organisation, deadline with its time zone, and which source it came from; nothing about you or fit (U6 decides fit, and applies here too).
- **v1:** Should (O12). **Today:** none.
- **Needs:** you need to add a source without knowing what a feed is · Arpli needs to check only the sources you chose, only while the Mac is on, and say when it last checked.
- **To brainstorm:**
  1. ~~How does someone find a link worth adding?~~ Decided: offered from saved jobs and list pages; paste still works.
  2. ~~Where "3 new" shows.~~ Decided: one folded line in Applications.
  3. ~~Does a new item show something about you?~~ Decided: facts only.

### U6 · Worth my time? · drill 28 · ◇ · drilled 2026-11-09
- **Job story:** When I'm looking at an opportunity, I want to see quickly whether it fits me and when it's due, so I spend my few evening hours on the right ones. (Job map step 1, §6.)
- **Hardest for:** Ada, who fears her story "isn't impressive enough" and may talk herself out of applying; Tunde, who fears reviewers will "quietly down-rank him".
- **Decided:** deadline with its time zone, eligibility and the AI rules when the opportunity states them (P5) · no Arpli-chosen suggestions in v1 · eligibility "shown from the opportunity", partly (product map, step 4).
- **Drilled (owner, 2026-11-09):** **Arpli shows only what the organisation states, never how well you fit**: eligibility quoted exactly (U10), the deadline, the questions and any AI rule; you make the call.
- **Drilled (owner, 2026-11-09):** **a readiness hint framed as the work ahead, not a match**: "4 questions · 2 past answers you could reuse · 1 will ask you a couple of things first"; a thin spot reads as a step Arpli helps with (U15), never "1 of 4 missing".
- **Drilled (owner, 2026-11-09):** **size in facts, no time estimate in v1**: the number of questions and the total word limit ("4 questions · about 1,200 words in all"), next to the work-ahead hint; a time estimate only once there's real data from testers.
- **v1:** partly. **Today:** opportunity parsing (title, deadline, questions) exists.
- **Needs:** you need to decide in under a minute whether to pin it or let it go · Arpli needs to show what the opportunity states, and never present a guess about fit as a fact.
- **To brainstorm:**
  1. ~~Does Arpli ever say how well you fit?~~ Decided: only what they ask.
  2. ~~A readiness hint: helpful, or a score in disguise?~~ Decided: framed as work ahead.
  3. ~~Should Arpli say roughly how long this one will take?~~ Decided: size in facts, no time.

### U7 · Pin, snooze or let it go · drill 29 · ◇ · drilled 2026-11-09
- **Job story:** When I have more opportunities than evenings, I want to mark the ones I mean to do, put some aside, and drop the rest, so my list shows only what I'm really doing.
- **Hardest for:** someone with 20 saved and a deadline tomorrow.
- **Decided:** Pin: stays at the top and gets reminders (P4) · Snooze with presets or a date, and Wake; told first if the deadline falls before then (P4) · Not for me: leaves the list with Undo for five seconds, reminders stop, Bring it back from a filter (P5) · undo instead of "are you sure?" (rules).
- **Drilled (owner, 2026-11-09):** **Pin is a mark, not a stage**: "I mean to do this one"; a pinned application stays at the top of its group in Applications; stages stay about progress (saved, started, ready, sent); reminders cover every unsent application, pinned or not (P12).
- **Drilled (owner, 2026-11-09):** **snooze presets**: "Tomorrow", "Next week", "A week before the deadline" (only when there is a deadline), and "Pick a date".
- **Drilled (owner, 2026-11-09):** **"Not for me" asks no question**; it just leaves, with Undo; nothing in v1 would use a reason.
- **v1:** Must (O7). **Today:** confirmations use browser pop-ups (part 3, today's code).
- **Needs:** you need to clear your list in seconds without fear of losing anything · Arpli needs to make every one of these reversible.
- **To brainstorm:**
  1. ~~Does pinning mean "I'm applying"; a stage or a mark?~~ Decided: a mark; stays on top.
  2. ~~Snooze presets.~~ Decided: tomorrow, next week, a week before the deadline, pick a date.
  3. ~~Does "Not for me" ask why?~~ Decided: no question.

---

## 2 · Gather

### U8 · Save from Chrome in one click · drill 23 · ★ · drilled 2026-11-09
- **Job story:** When I see an opportunity in a post on X or on a website, I want to save it to Arpli in one step, so I don't lose it before I'm ready to apply. (§6)
- **Hardest for:** someone who finds it on their phone or in WhatsApp (phone capture waits for the account), or on LinkedIn (paste only).
- **Decided:** save first, check after (M2) · one click saves; the panel then shows title, organisation, deadline and questions as editable fields; no deadline, it asks for one (P9, R1) · saved before: "You saved this on 3 Nov", no second copy (E14) · LinkedIn and Indeed: paste-in only, said once (E16) · Arpli closed: the page waits in the extension (E18).
- **Drilled (owner, 2026-11-09):** **"Saved" at once, with the page's own title**; one status line under it ("Reading the page · 2s"); when reading finishes, the editable fields (title, organisation, deadline, questions) appear together, not one by one (the same rule as drafts, U28).
- **Drilled (owner, 2026-11-09):** **a page listing several opportunities**: Arpli says what it sees ("This page lists 12 roles") and you tick the ones you want, each saved as its own opportunity, nothing ticked for you; below, "Watch this page for new ones" adds the board as a source (U5).
- **Drilled (owner, 2026-11-09):** **saving asks only for a missing deadline**; Pin is one quiet button among the fields, never a question; the help level and the rest come when you start the application.
- **v1:** Must (O4). **Today:** nothing built in Chrome.
- **Needs:** you need to save without thinking · Arpli needs to keep the link, the page title and the date even when nothing else can be read.
- **To brainstorm:**
  1. ~~What the panel shows in the first second.~~ Decided: "Saved" at once, fields together.
  2. ~~A page listing several opportunities: save the page, or pick one?~~ Decided: pick ones, offer to watch.
  3. ~~Does saving ever ask more than a missing deadline?~~ Decided: only the deadline; Pin as a button.

### U9 · Add in the app · drill 42 · ★ · drilled 2026-11-09
- **Job story:** When I have a link from my phone or a friend, I want to paste it into Arpli, so it's tracked with the rest.
- **Hardest for:** someone whose link can't be read.
- **Decided:** paste a link or text; saved first, checked after (P4, M2) · the first run asks "What are you applying for?" with a common question as the fallback (F1 step 4) · add one you sent elsewhere in a few seconds, already "Submitted" (P4) · a page that can't be read is saved anyway, with "Paste the text", and shows in Needs you as "Missing its details" (E14).
- **Drilled (owner, 2026-11-09):** **in the first run, only the questions have to be read** before you can pick one; the deadline, eligibility and the rest fill in after; if the questions can't be read within a few seconds, or at all, the common question is offered at once.
- **Drilled (owner, 2026-11-09):** **one sent elsewhere needs only the organisation and the date sent**; title and link optional; enough to show it as sent, record an outcome later, and match its email replies (U44).
- **Drilled (owner, 2026-11-09):** **a PDF call for proposals uses the same Add**: drop or pick it; read like a page, every detail quoted with its page number, empty and asking where unsure.
- **v1:** Must. **Today:** paste a link or text exists; it uses a plain page fetch, which fails on Greenhouse, Ashby and LinkedIn (memory, intake).
- **Needs:** you need one place to drop any opportunity · Arpli needs to save first and read after, so nothing is lost to a slow page.
- **To brainstorm:**
  1. ~~In the first run, how much has to be read first?~~ Decided: just the questions.
  2. ~~"One you sent elsewhere": what's the least it needs?~~ Decided: organisation and date sent.
  3. ~~A PDF-only call: the same Add, or a file drop?~~ Decided: the same Add.

### U10 · Reading the opportunity · drill 24 · ★ · drilled 2026-11-09
- **Job story:** When I open an application form, I want Arpli to already know its questions, so I start from a draft, not a blank page. (§6)
- **Hardest for:** Ngozi, whose funder calls are long documents and whose deadlines sit in another time zone.
- **Decided:** title, organisation, deadline with its time zone, link, eligibility, and the AI rules if stated (P5) · unsure means empty and asks, never guessed (part 3 rules) · no time zone: "Whose time?" yours or the organisation's, then shown in both (E15) · "Rolling" kept as words, with a reminder in a week (E15) · Greenhouse questions come from its public data (F3 step 2) · fix anything; saved again (M2).
- **Drilled (owner, 2026-11-09):** **an empty, asking field is calm words, listed first**: "Not found on the page · Add" inside the field; no red, no error icon, never colour alone; the empty fields come first so you see at once what Arpli wasn't sure about.
- **Drilled (owner, 2026-11-09):** **eligibility: the hard requirements quoted exactly, in the programme's words**, each with where it came from ("Must be enrolled full time"); "See full eligibility" opens the whole text; never reworded.
- **v1:** Must (O4, O5). **Today:** parsing of title, deadline and questions exists, from a plain page fetch.
- **Needs:** you need to see at once what Arpli wasn't sure about · Arpli needs to mark every field it left empty, and keep a link back to the source.
- **To brainstorm:**
  1. ~~How an empty, asking field looks.~~ Decided: calm words, listed first.
  2. ~~Where the AI rules get found, and how they're quoted.~~ Settled by U19 (2026-11-09): the form, the saved page and linked guidance; quoted with where from; only the lines that matter, with a link.
  3. ~~Eligibility: quoted whole, or the lines that matter pulled out?~~ Decided: key lines quoted exactly.

### U11 · Pour in what you have · drill 7 · ★ · drilled 2026-11-09
- **Job story:** When I start, I want to give Arpli what I already have, so my bucket fills without me typing my life again.
- **Hardest for:** someone whose only CV is a scan or a photo (E4); someone with two different CVs.
- **Decided:** your own words, kept as they are; Arpli adds only a title and tags (M5) · a CV or LinkedIn export shows what Arpli found, as your own lines, ready to keep or fix; one "Looks right" press in the first run (P3a, F1 step 3) · a second CV: what to do with the overlaps, one choice recommended (P3a) · a file that can't be read: paste, talk, or another file; the file stays in the bucket (E4).
- **Drilled (owner, 2026-11-09):** **your CV's lines are grouped by role, as on your CV**: each job, course or project with its bullets underneath, one line per bullet, word for word; the kind of each line (experience, skill, result) is a quiet tag for finding things, not the layout.
- **Drilled (owner, 2026-11-09):** **"Looks right" means "save these to my bucket"**, not "every line is perfect"; nothing is locked; a line is found and fixed later from bucket search, or straight from a draft's source number (U35); the CV file stays in the bucket.
- **Drilled (owner, 2026-11-09):** **what Arpli can't place gets its own group at the end, "Couldn't place these"**, open, never folded, word for word; each piece can be moved under a role, kept as it is, or deleted.
- **v1:** Must (O1). **Today:** importers exist in the engine (CLAUDE.md).
- **Needs:** you need to see that Arpli kept your words, not rewrote them · Arpli needs to split a CV into lines without changing a word, and say what it couldn't place.
- **To brainstorm:**
  1. ~~How "your own lines" look for a CV?~~ Decided: grouped by role, as on your CV.
  2. ~~What "Looks right" commits to, and how a line gets found and fixed later.~~ Decided: saves all, fix any time.
  3. ~~A section Arpli can't place: shown with the rest, or folded?~~ Decided: own group at the end, open.

### U12 · Talk it through · drill 40 · drilled 2026-11-09
- **Job story:** When I finish something worth telling (a project, an award, a result), I want to drop it into Arpli in seconds as a file, link or voice note, so it's ready when I need it. (§6)
- **Hardest for:** someone speaking English as a second language, with an accent the transcription may miss; someone in a shared room at night.
- **Decided:** a ramble (voice or typed) gives suggested highlights of your own sentences, accepted one by one; a voice entry keeps the recording with the transcript (P3a, M5) · microphone not allowed: a picture guide, or type instead (E5) · the words didn't come through: the recording is kept, try again, or type over it (E5).
- **Drilled (owner, 2026-11-09):** **your voice is turned into text on this Mac by default**, said plainly: "Turned into text on this Mac." (macOS on-device recognition or a local Whisper model; the engineer's check confirms which); an online service only as an opt-in, with where your voice goes said first. Changes from today's code: it sends audio online (Groq or OpenAI, with a key) and keeps no recording; both change (the recording is kept, M5).
- **Drilled (owner, 2026-11-09):** **up to five highlights**, each one of your sentences word for word, in the order said; none fit: "Nothing stood out as a story yet", the whole ramble and the recording are kept in the bucket anyway, with "Pick a sentence yourself".
- **Drilled (owner, 2026-11-09):** **mixed languages are kept as said**: the transcript is never "corrected" into standard English; the recording stays beside it; a draft writes in the language the application asks for, and its source number still points to your original words.
- **v1:** Must (part of O1). **Today:** transcription exists in the engine (CLAUDE.md code map).
- **Needs:** you need to speak freely and keep only what's true and useful · Arpli needs to pick highlights only from your own sentences, and keep the recording.
- **To brainstorm:**
  1. ~~Does transcription run on this Mac, and is that said?~~ Decided: on this Mac by default, said.
  2. ~~How many highlights, and what if none fit?~~ Decided: up to five; keep it all if none.
  3. ~~Talking in a mix of languages: kept as said?~~ Decided: kept as said.

### U13 · Your bucket · drill 8 · ★ · drilled 2026-11-09 (name: step 5)
- **Job story:** When I need a story for a question, I want to find it in my own words in one place, so I don't dig through old documents.
- **Hardest for:** Ada, whose bucket starts thin and who may not think her tutoring is worth keeping.
- **Decided:** Add, or drop anything anywhere (P3) · search; narrow by tag or kind: experience, story, file, past answer (P3) · past answers are a filter, not a separate place (O10) · one item: edit words, title and tags; see where it was used; play the recording; delete with undo (P3b) · titles and tags done quietly; your edit is never overwritten (AI notes) · your voice guide lives here (P3) · Add from the menu bar (R4).
- **Drilled (owner, 2026-11-09):** **one item is the smallest true thing you'd point to: a line (a CV bullet) or a short story** (a few sentences about one moment, from your answers or a voice note); files and past answers hold lines inside them, and a source number opens the exact line, not the whole file.
- **Drilled (owner, 2026-11-09):** **the bucket grows in plain counts, what's new and where it's used**: "42 lines · 6 stories · 3 files", "Added this week: 3", and on each item "Used in 4 applications"; no percentages, no meter, nothing "incomplete". Basis: step 1 noted that Grammarly's "Overall score" turns writing into a grade (`04-explore.md`).
- **v1:** Must (O1). **Today:** "Profile".
- **Needs:** you need to trust that everything here is yours and true · Arpli needs to keep your words exactly, and keep what it added (titles, tags) visibly apart.
- **To brainstorm:**
  1. What it's called on screen: bucket, profile, or something else? (Moved to step 5, the screen map, where all names are set together, 2026-11-09.)
  2. ~~What one item is?~~ Decided: a line or a short story.
  3. ~~How the person sees their bucket growing, without a score.~~ Decided: counts, what's new, where used.

### U14 · Standing answers · drill 38 · drilled 2026-11-09
- **Job story:** When a form asks for details I've typed a hundred times, I want them filled from my profile, so I spend my time on the parts that matter. (§6)
- **Hardest for:** someone whose right to work differs by country, or who finds a history question uncomfortable.
- **Decided:** questions that come back on form after form, answered once: pay, how you heard, notice period, messages and marketing, history questions (conviction, non-compete, worked or applied here before, relatives there); each asked plainly, never assumed "no"; right to work is one answer per country (P3) · facts only; nothing that signs or agrees for you; demographic answers only if you set them yourself (choice C, part 3) · shown by name before each fill (E22).
- **Drilled (owner, 2026-11-09):** **each standing answer is asked the first time a form needs it**, in the Chrome panel just before Fill, with "Save for next time" ticked; after that it's filled from your answer, shown by name each time; all of them sit in one list in your bucket, to see and change any time.
- **Drilled (owner, 2026-11-09):** **a history question quotes the form's own words and choices**, plus one neutral line: "Used only when a form asks exactly this, and shown to you before each fill. You can change it any time."; no softening, warnings or judgement. (On a form, a checkbox version still goes to "Yours to fill", U25.)
- **Drilled (owner, 2026-11-09):** **pay is asked per application, with your last answer offered**: "Expected salary · last time: £45,000 · Keep or change"; shown by name before Fill.
- **v1:** Must (part of filling, O5).
- **Needs:** you need to state each fact once and see it every time it's used · Arpli needs to fill only facts you set, and show each by name before filling.
- **To brainstorm:**
  1. ~~When they get asked.~~ Decided: the first time a form needs each one.
  2. ~~How a history question is asked.~~ Decided: the form's words plus how it's used.
  3. ~~Pay: one answer, or ask each time?~~ Decided: per application, last answer offered.

### U15 · Ask first when the bucket is thin · drill 6 · ★ · drilled 2026-11-09
- **Job story:** When my bucket has little for a question, I want Arpli to ask me a couple of things first, so the draft is built from true material, not filler.
- **Hardest for:** the floor user: least on paper, second language, late at night.
- **Decided:** one or two short questions first, "1 of 2", with Skip and draft anyway; your answers go into the bucket (M3, E8) · a gap is never filled with something invented: it shows as a marked blank, "[the result, as a number]" (E8) · nothing fits at all: no draft; answer two questions, write it yourself, or add to your bucket (E8).
- **Drilled (owner, 2026-11-09):** **"thin" means no specific match**: Arpli asks first when nothing in your bucket specifically matches what the question looks for (U19), even if general lines match; Ada's "Tutor, 2023" matches "leadership" but has no story (what happened, what she did, what changed), and a draft on that alone would pad it out.
- **Drilled (owner, 2026-11-09):** **the questions start from your own line, ask for one moment, then what changed**: "You tutored in 2023. Tell me about one session or one student that went well." then "What changed because of it? A number helps, a sentence is fine."; general to particular (Tunde); never asks you to rate yourself ("Describe your leadership skills").
- **Drilled (owner, 2026-11-09):** **speak or type, in the same box**: a microphone beside each answer box, equal to typing; what you say appears as text you can fix before it's used; the recording is kept with the bucket item (U12, M5); microphone not allowed: typing still works, with the picture guide (E5).
- **Splits:** S3 (D3 makes this the main way in).
- **v1:** Must (O2).
- **Needs:** you need to be asked only what makes the draft true · Arpli needs to tell when the bucket is too thin for a question, and say why.
- **To brainstorm:**
  1. ~~What counts as "thin": nothing matches, or only general matches?~~ Decided: no specific match.
  2. ~~What the two questions sound like?~~ Decided: your line, one moment, what changed.
  3. ~~Can the answers be spoken, not typed?~~ Decided: speak or type, same box.

### U16 · Save what's new while you write · drill 41 · drilled 2026-11-09
- **Job story:** When something true comes up while I'm writing, I want it kept in my bucket, so I don't have to remember it next time. (The "growing context loop", older jobs list, Job 4.)
- **Hardest for:** someone who types a new fact into an answer and never thinks to save it.
- **Decided:** "Save this to your bucket?" while writing (O9, P6) · "It's true, add it to my bucket" on a check-this mark (E9).
- **Drilled (owner, 2026-11-09):** **Arpli asks once, when you mark the answer ready or leave it**, never while you type: "2 new things in this answer", each with Save or Skip.
- **Drilled (owner, 2026-11-09):** **what's saved is your sentence, word for word**, as a line in the bucket, labelled with where it came from ("From your Acme answer · 9 Nov"); never a rewritten fact (M5).
- **Drilled (owner, 2026-11-09):** **it never nags**: at most once per answer; something skipped is never asked about again; after three answers in a row with everything skipped, it asks once: "Keep suggesting new things to save?"; a Settings switch turns it off.
- **Splits:** S3.
- **v1:** Should (O9).
- **Needs:** you need new facts kept without extra work · Arpli needs to notice a new fact and ask once, without nagging.
- **To brainstorm:**
  1. ~~When it asks.~~ Decided: once, when the answer is ready.
  2. ~~The sentence as you wrote it, or the fact inside it?~~ Decided: your sentence, word for word.
  3. ~~How often before it becomes nagging?~~ Decided: once per answer; skips remembered.

### U17 · Story interview · drill 47 · drilled 2026-11-09 (rest: D3)
- **Job story:** When I don't know how to tell my story, I want to be asked good questions, so it comes out in my own words. (Tunde: "reflection prompts, not forms".)
- **Hardest for:** Tunde, framing a pivot story that doesn't sound like running away.
- **Decided:** a Could for v1 and a prototype direction (D3) that gathers the story first, then drafts; moves up if the prototypes favour it (decision, 2026-11-02).
- **Splits:** S2 and S3 (D3).
- **Drilled (owner, 2026-11-09):** **the decided patterns apply; the rest is for the D3 prototype**: speak or type in the same box (U15); questions start from your own line, ask for one moment, then what changed (U15); what you say lands in the bucket as your own sentences, highlights accepted one by one, recording kept (U12). Once for your whole story or per question, and how long before it feels like work: the D3 prototype shows.
- **v1:** Could (O3; the prototypes decide).
- **Needs:** you need to tell your story in pieces, at your pace · Arpli needs to keep what you say in your words.
- **To brainstorm:**
  1. ~~Spoken or typed?~~ Decided: speak or type, same box. How long before it feels like work: the D3 prototype shows.
  2. Once, for your whole story, or per question? Left to the D3 prototype (owner, 2026-11-09).
  3. ~~How what it gathers lands in the bucket.~~ Decided: your sentences, as highlights (U12).

---

## 3 · Organise

### U18 · Reading the form's questions · drill 11 · ★ · drilled 2026-11-09
- **Job story:** When I open an application form, I want Arpli to already know its questions, so I start from a draft, not a blank page. (§6)
- **Hardest for:** anyone on a form spread over several pages (Workday), or one inside another site's page.
- **Decided:** the panel names the page and the form it's reading, and how many questions it found (P10, F3 step 3) · can't read it: paste the questions, or copy answers; nothing filled (E19) · inside another site's page: asks once for that site · partly read: what was found, with "Missing a question? Add it." · several pages: read again on each, "Page 2 of 4 · 6 fields"; Fill never presses Next or Submit · changed since saved: the new question is added (E19) · LinkedIn and Indeed: copy only (E16).
- **Drilled (owner, 2026-11-09):** **panel and page point to each other**: selecting a question in the panel scrolls the page to its field and gives it a calm, steady outline while selected (no flashing); clicking into a field on the page selects its question in the panel; nothing permanent is added to the organisation's page (no numbers or badges).
- **Drilled (owner, 2026-11-09):** **the panel leads with one folded line for the standard fields**, "Standard fields · 38 · Fill all" (the one press, M4), opened to see each one; then the written questions in the form's order; then "Yours to fill" at the end (U25). This also settles the 40-fields case.
- **Added by U23 (owner, 2026-11-09):** above everything, one folded line "Eligibility · 3 requirements".
- **v1:** Must (O5). **Today:** nothing built in Chrome.
- **Needs:** you need to know the panel and the form are talking about the same thing · Arpli needs to tie each question to its field on the page.
- **To brainstorm:**
  1. ~~How a question in the panel points to its field on the page?~~ Decided: both ways, scroll and outline.
  2. ~~Questions in form order, or written answers first?~~ Decided: standard line, then written questions in form order.
  3. ~~A form with 40 fields and 2 written questions: what does the panel lead with?~~ Decided with question 2.

### U19 · What this question is really asking · drill 10 · ★ · gap, now in v1 · drilled 2026-11-09
- **Job story:** When I read a question like "describe a time you demonstrated leadership", I want to understand what the reviewers are looking for, so I pick the right story and don't undersell it. (Job map step 3, §6.)
- **Hardest for:** Ada: "what does 'demonstrated leadership' actually mean?"; one of her goals is to "understand what each programme actually wants, not what the brochure says" (personas).
- **Decided (owner, 2026-11-09):** in v1, as part of drafting (O2). One short line above each question: what they're looking for · the programme's own words first, quoted with a link · if the programme says nothing, a general reading, said to be general · it steers which stories the draft uses (U22), and you can change that · it also shows when you write the answer yourself (U27). Before this, the product map gave the step only reading the questions (O5) and the help level (O2); the older jobs list had "What is this question really asking?" (Job 2).
- **Drilled (owner, 2026-11-09):** **Arpli reads the form, the saved opportunity page, and any guidance page or PDF they link to**, plus any guidance file you drop in; it always says what it read ("From the Chevening guidance PDF, page 4"); long guidance: only the lines about this question are quoted, with a link to the full text; nothing found: it says so, and the line falls back to a general reading said to be general.
- **Drilled (owner, 2026-11-09):** **a general reading is labelled and says "usually"**: "General reading · not from Chevening", then one sentence: "Leadership questions usually look for one time you got others moving toward something, and what changed."; the programme's own words are always in quote marks and never get "usually"; a general reading never gets quote marks.
- **Drilled (owner, 2026-11-09):** **overlapping questions get a quiet note on both and in the list of questions (U20)**: "Close to question 2"; drafts then lead each with a different story, unless you pick the same one with "Lead with this" (U22), so reviewers don't hear the same story twice.
- **v1:** Must (owner, 2026-11-09).
- **Needs:** you need to know what a question wants before choosing a story · Arpli needs to say where any reading of a question comes from (the programme's own guidance, or general advice), and say when it's guessing.
- **To brainstorm:**
  1. ~~Where the programme's guidance is found, and what happens when it's long.~~ Decided: form, page and linked guidance; only the relevant lines quoted.
  2. ~~How "general reading" is worded.~~ Decided: label plus "usually".
  3. ~~Links between two questions that overlap: here, or in U20?~~ Decided: a note on both and in U20; different stories by default.

### U20 · The questions in one application · drill 36 · ★ · drilled 2026-11-09
- **Job story:** When I come back to an application, I want to see which questions are done and which aren't, so I pick up where I left off.
- **Hardest for:** Ngozi, with long funder applications and many sections.
- **Decided:** each question with its state: not started, your draft, ready (P5) · a reminder opens the next question not yet answered (R2) · the row in Applications shows progress, "3 of 5 answers drafted" (P4).
- **Added by U32 (owner, 2026-11-09):** two more question states, "On the form" and "Changed since filling"; progress can read "3 of 5 on the form".
- **Drilled (owner, 2026-11-09):** **five states plus two word flags**: states say where the question is (not started, your draft, ready, on the form, changed since filling); flags say what still needs a look, next to the state: "Ready · 32 words over", "Your draft · 1 check this left".
- **Drilled (owner, 2026-11-09):** **questions in the form's order**, the same as the panel (U18); above the list, progress and a "Next" jump to the first question not done ("3 of 5 on the form · Next: question 4").
- **v1:** Must. **Today:** the application workspace has drafts per question, with versions.
- **Needs:** you need to see what's left at a glance · Arpli needs to keep each question's state true as you work.
- **To brainstorm:**
  1. ~~Are three states enough?~~ Decided: five states plus two word flags.
  2. ~~The form's order, or what's left first?~~ Decided: form's order plus a Next jump.
  3. ~~Two questions that ask nearly the same thing: say so here?~~ Decided in U19: "Close to question 2" on both and in this list; different stories by default.

### U21 · The help level and the programme's rules · drill 21 · ★ · drilled 2026-11-09
- **Job story:** When a programme limits AI in applications, I want Arpli to help only as far as the rules allow, so I don't put my application at risk.
- **Hardest for:** Ada, applying to a scholarship whose AI rule sits in a guidance PDF she hasn't read.
- **Decided:** three levels: fields only · you draft, Arpli refines · Arpli drafts from your words (O2, P5) · starts at what the stated rules allow, or at your default from Settings (P5, P8) · the rule stays next to Draft, quoted with its link; you can change the level; it's your call (E12) · shown next to Draft, one click to change (P6).
- **Drilled (owner, 2026-11-09):** **a new person starts at "Arpli drafts from your words", not asked**, because a first draft in the first session is the goal; a programme's stated rule still wins; the level sits next to Draft, one click to change; your own default in Settings.
- **Drilled (owner, 2026-11-09):** **"you draft, Arpli refines" means suggestions on your text, one change at a time**: your words struck through, the suggested words beside them, accept or skip each (the same pattern as rewording a CV, U33); never a whole rewrite at this level; Tighten still works over the limit.
- **Drilled (owner, 2026-11-09):** **no rule found: Arpli says what it checked**, quietly next to the level: "No AI rule found in what Arpli read: the form, the page, the guidance PDF.", with the programme's link.
- **v1:** Must (O2).
- **Needs:** you need to know what help is allowed before you start · Arpli needs to quote a stated rule, and never say there's no rule when it simply didn't find one.
- **To brainstorm:**
  1. ~~A new person's default level, and whether the first run asks.~~ Decided: drafts from your words, not asked.
  2. ~~What "you draft, Arpli refines" does in practice.~~ Decided: one change at a time.
  3. ~~No rule found: what does Arpli say?~~ Decided: says what it checked.

### U22 · What a draft will use · drill 5 · ★ · drilled 2026-11-09
- **Job story:** When Arpli is about to draft, I want to see which of my stories it will use, so I can steer it to the right one.
- **Hardest for:** Tunde, who wants the climate story to lead, not the accounting one.
- **Decided:** the bucket items a draft would use, numbered; untick any before drafting (M3, P6) · on the very first draft, folded into one line, "Using 4 things from your bucket"; after that, the full list (F1 step 5).
- **Drilled (owner, 2026-11-09):** **each picked item says why in a few words**, tied to the question's "what they're looking for" line (U19): "Tutoring group · shows leading others"; never a paragraph; on the first draft folded into one line, the reasons there when opened.
- **Drilled (owner, 2026-11-09):** **you can add and choose the lead**: "Add from your bucket" at the bottom of the list opens a search of your bucket; "Lead with this" on any item makes it the opening story, one lead at a time; both optional (Tunde's climate story first).
- **Drilled (owner, 2026-11-09):** **a folded "Add a note for this draft"**: one optional line that steers this draft only; shown above the draft so you see what steered it; a new fact in it gets one "Save this to your bucket?" ask (U16), so the draft stays traceable.
- **v1:** Must (O2).
- **Needs:** you need to steer the draft without writing instructions · Arpli needs to say which items it chose, and use only those.
- **To brainstorm:**
  1. ~~How Arpli picks the items, and does it say why each one?~~ Decided: a few words why, per item.
  2. ~~Can the person add an item Arpli didn't pick, or choose the one to lead with?~~ Decided: Add, and Lead with this.
  3. ~~A free line of direction ("lead with my research", older jobs list, Job 3): here, or not at all?~~ Decided: a folded "Add a note".

---

## 4 · Check

### U23 · Eligibility and what's needed · drill 30 · ◇ · drilled 2026-11-09
- **Job story:** When I'm about to commit time, I want to know I'm eligible and what I'll need (documents, referees), so I don't find out at the end. (Job map step 4, §6.)
- **Hardest for:** Ada, who may miss "must be enrolled full time" in the small print; Ngozi, waiting on referee letters.
- **Decided:** eligibility shown from the opportunity (product map, partly) · recommender tracking is a Won't for v1.
- **Drilled (owner, 2026-11-09):** **the application's own list is the checklist**: everything it asks you to attach shows as an item next to the questions ("Transcript · asked for · Drop a file", U33); references show only as the programme's quoted requirement ("2 references required"), not tracked (Won't).
- **Drilled (owner, 2026-11-09):** **no "you may not meet this" flag**: requirements are quoted exactly (U10) and you decide; "Not for me" is one click away.
- **Drilled (owner, 2026-11-09):** **eligibility shows in two places**: on the application and the saved opportunity, right under the deadline, key lines quoted (U10); in the Chrome panel, one folded line at the top, "Eligibility · 3 requirements".
- **v1:** partly.
- **Needs:** you need to see any hard requirement before you start writing · Arpli needs to show what the opportunity states, and say when it couldn't find eligibility.
- **To brainstorm:**
  1. ~~A list of what's needed per application: in v1?~~ Decided: the application's list is the checklist.
  2. ~~Does Arpli ever flag "you may not meet this"?~~ Decided: no flag; quote and you decide.
  3. ~~Where eligibility shows.~~ Decided: the application, plus a folded line in the panel.

---

## 5 · Perform

### U24 · Fill standard fields in one press · drill 12 · ★ · drilled 2026-11-09
- **Job story:** When a form asks for details I've typed a hundred times, I want them filled from my profile, so I spend my time on the parts that matter. (§6)
- **Hardest for:** anyone on a form with custom dropdowns or an unusual upload box.
- **Decided:** standard fields together, written answers one by one (M4) · one press: name, email, phone, links, CV (P10, F3 step 4) · what goes in each field is shown before filling (Swiss cheese, layer 4) · each field read back after: on the form · left empty · didn't take; "didn't take" offers Copy; Undo per field (E20) · read back means "on the page", not "right" (E20) · Fill never presses Next or Submit (E19).
- **Drilled (owner, 2026-11-09):** **the folded line always shows the values that cost most when wrong**: your name, email, phone and the CV file that will be attached, by file name; then "+34 more · See all".
- **Drilled (owner, 2026-11-09):** **on the page, only fields that need you are marked**: "Didn't take" and "Left empty" get a steady outline and a short label in words beside them ("Didn't take · Copy"), never colour alone; fields that took get nothing on the page and are listed in the panel as "on the form".
- **Drilled (owner, 2026-11-09):** **Fill attaches the CV picked for this application, otherwise your Main CV**: one CV in Your documents is marked "Main CV", set at first run from the CV you dropped in, changeable any time (U47); the file is always named before Fill, with "Change" beside it.
- **v1:** Must (O5). **Today:** nothing built in Chrome.
- **Needs:** you need to know exactly what went where · Arpli needs to read every field back from the page after filling.
- **To brainstorm:**
  1. ~~Before the press: the full list, or a short summary with "See all"?~~ Decided: key values shown, the rest folded.
  2. ~~How the three read-back states show on the page itself.~~ Decided: only problems are marked on the page.
  3. ~~Which CV gets attached when there are two?~~ Decided: the one picked for this application, else Main CV.

### U25 · Fields that speak for you · drill 14 · ★ · drilled 2026-11-09
- **Job story:** When a form asks me to agree, sign or declare something, I want that left to me, so nothing is said in my name without my yes.
- **Hardest for:** a tired person at the end of a long form, pressing yes without reading.
- **Decided:** choice C (part 3): facts about you come from standing answers and are shown by name; anything that signs or agrees for you needs a yes on that field each time, or is yours to do; demographic only if you set it yourself · never filled: signatures, interview or test slots, other people's details, cookie banners, "Apply with LinkedIn", marketing boxes (E22) · all of these listed as "Yours to fill".
- **Drilled (owner, 2026-11-09):** **Arpli never ticks an agreement, declaration or signature itself**: each is listed in "Yours to fill" (at the end of the panel, U18) with the form's exact words quoted, and "Go to it" scrolls to the field so you tick it on the form yourself; facts about you ("Are you over 18?") come from standing answers, shown by name (U14). This settles question 3 too.
- **Drilled (owner, 2026-11-09):** **Fill all never ticks a checkbox and never fills a field it isn't sure about**: anything uncertain goes to "Yours to fill" as "Not sure what this one is", with "Go to it"; Arpli fills only fields it clearly recognises as standard details (dropdowns and radio buttons only when they clearly match a standing answer, shown by name), plus the written answers filled one by one; a fact asked as a checkbox goes to "Yours to fill" with your standing answer shown beside it. It may leave a few harmless fields for you; it never speaks for you by accident.
- **v1:** Must (O5; Swiss cheese, layer 5).
- **Needs:** you need every field that speaks for you in front of you before you send · Arpli needs to recognise these fields, and skip any field it's unsure about rather than guess.
- **To brainstorm:**
  1. ~~How a yes per field is asked so it stays a real yes.~~ Decided: you tick it on the form.
  2. ~~How a sensitive field with an odd label gets caught.~~ Decided: no checkboxes; unsure means yours.
  3. ~~Where "Yours to fill" sits, and does each item jump to its field?~~ Decided: end of the panel, with "Go to it".

### U26 · Tricky sites and human checks · drill 39 · drilled 2026-11-09
- **Job story:** When a site does something unexpected, I want Arpli to tell me before it matters, so I'm not caught out.
- **Hardest for:** someone who doesn't know a site saves what's typed before Submit, or whose form sends a code to an inbox they rarely check.
- **Decided:** a site that saves as you type (Ashby): said before the first fill, Fill or Not yet (E21) · a robot check: "That one's yours"; Arpli waits (E23) · an emailed code: open your mail at the code, or see it in Arpli if email is connected; you type it (E23) · sign in or make an account: yours; Arpli reads the form again after (E23) · LinkedIn and Indeed: copy only, said once (E16).
- **Drilled (owner, 2026-11-09):** **a site's habits are said once per site; human checks every time**: habits ("Ashby saves what you type before you press Submit", "LinkedIn: copy only") the first time you fill there; robot checks, emailed codes and sign-ins each time they happen.
- **Drilled (owner, 2026-11-09):** **an emailed code shows in the Chrome panel**, large, with Copy and where it came from ("From Acme · 2 min ago"); a Mac notification only if you've left the form's page; you type it yourself.
- **Drilled (owner, 2026-11-09):** **LinkedIn and Indeed: one factual line, once per site, then just Copy**; the line is E16's, already written: "LinkedIn doesn't allow tools to read or fill its forms. Your answers are here to copy."; no apology; any detail under Details.
- **v1:** Must (part of O5).
- **Needs:** you need to hear about a site's habits before they cost you · Arpli needs to know which sites do what, and never act for you at a human check.
- **To brainstorm:**
  1. ~~Which warnings come once per site, and which every time?~~ Decided: habits once, human checks always.
  2. ~~The emailed code: in the panel, or as a notification?~~ Decided: in the panel; notify if you've left.
  3. ~~How much "why" for LinkedIn and Indeed?~~ Decided: one line once (E16's), then Copy.

### U27 · Write it yourself · drill 37 · drilled 2026-11-09
- **Job story:** When I'd rather write my own answer, I want a calm place to write with the limit in view, so writing myself never feels second-class.
- **Hardest for:** Ngozi on a programme that asks for her own writing; anyone with no AI connected (E2).
- **Decided:** always works, whatever happens to the AI (part 3 rules) · the count always there, in the form's unit; over: "32 words over", Tighten or edit (E11) · names and numbers still checked in code, with no AI (E2) · never cut off silently (E11).
- **Drilled (owner, 2026-11-09):** **the writing box is plain text with paragraphs**, matching what Copy and Fill send (U32); no formatting that disappears on the way.
- **Drilled (owner, 2026-11-09):** **at "you draft, Arpli refines", suggestions come only when you ask**: a "Suggest changes" button, never while you type; names and numbers are still checked quietly in code (E2).
- **v1:** Must.
- **Needs:** you need to write with nothing in the way · Arpli needs to keep every word you type, through any failure.
- **To brainstorm:**
  1. ~~Plain text, or some formatting?~~ Decided: plain text with paragraphs.
  2. ~~What does Arpli offer while you write?~~ Decided: only when you ask.
  3. ~~Does your own text get versions, or only drafts?~~ Settled by U41 (2026-11-09): yes, in the same version list, labelled "Your edit".

### U28 · Draft from your bucket · drill 1 · ★ · drilled 2026-11-09
- **Job story:** When I face an essay question, I want a draft built from my real achievements and in my voice, so I submit something true that I'm proud of. (§6)
- **Hardest for:** Ada at 11 pm, with little on paper: "I don't want it to sound too strong, it's not really that big a deal."
- **Decided:** drafts come only from your bucket (bet 1) · while it drafts: what it's doing and for how long, with Stop (P6, rules) · the draft arrives beside your own text; insert and replace are separate choices (P6) · numbered marks to your material, and "check this" on anything it can't trace (F1 step 6) · thin bucket: ask first (U15) · a gap is a marked blank, never invented (E8) · slow, stopped, empty or declined: said plainly, your text as you left it (E7).
- **Drilled (owner, 2026-11-09):** **the whole draft arrives at once**, never word by word: until then, one line in words with time and Stop ("Drafting from 4 things in your bucket · 6s"); dashes, exclamation marks and banned phrases are fixed and names and numbers checked before it arrives (E10, E9); the slower check of claims follows on its own line ("Checking claims · 2s") and its marks appear when done. Why: streaming would show words we then change; T3 Code's rule against screens that keep repainting (`07-reference-t3code.md`) and Taste's "no spinning spinners, no pulsing dots".
- **Drilled (owner, 2026-11-09):** **the draft sits in its own box directly under your text**, the same in every direction; your text is untouched until you press **Insert below** or **Replace**, two separate buttons (Confluence, Explore step 1); Replace keeps your text as an earlier version (U41); with an empty answer box the button reads "Use this draft". Side by side is kept for comparing versions (U41) and reworking a past answer (U31).
- **Drilled (owner, 2026-11-09):** **one question first, then "Draft the rest"**: the button appears after the first draft passes the voice check ("Does this sound like you?", F1 step 7), so every later draft uses what you said about your voice; it drafts the remaining questions in order, "Drafting 2 of 5 · 12s", with Stop; each draft still waits for your read and each answer is filled on its own (M4); out of usage, only the drafts you asked for wait (E6).
- **Splits:** S2: D1 in the Chrome panel · D2 in the Mac app, or in a Chrome window Arpli opens · D3 a short interview first · D4 in your own Claude or ChatGPT, with the answer brought back.
- **v1:** Must (O2). **Today:** drafting per question, with versions, in the application workspace; 5 s per answer through Claude Code in the first live test, which also invented praise for the company and used an em dash (memory, foundation).
- **Needs:** you need a first draft from your own material without facing a blank page · Arpli needs to draft only from the items you allowed, at the help level set, and mark what it can't trace.
- **To brainstorm:**
  1. ~~While it drafts: words arriving as they're written, or the whole draft at once?~~ Decided: at once.
  2. ~~"Beside your own text": side by side, below, or in place with your text kept as a version?~~ Decided: its own box under your text.
  3. ~~One question at a time, or "draft all" for the whole form (older jobs list, Job 3)?~~ Decided: one first, then Draft the rest.

### U29 · Which AI writes, and when it can't · drill 22 · ★ · drilled 2026-11-09
- **Job story:** When I ask for a draft, I want to know which AI is writing and what happens if it can't, so I'm never left wondering or surprised where my words went.
- **Hardest for:** someone on a free plan who hits a usage limit at midnight, mid-application.
- **Decided:** next to Draft: which AI writes ("Claude on this Mac"), one click to change (P6) · out of usage: it waits and says when it's back; only the drafts you asked for wait, each with Cancel (E6) · "Use another AI for this one": your choice, for one draft, with where the text goes said; never kept as a switch (E6) · slow, Stop, Force stop, empty, declined (E7) · status in words with time (rules).
- **Drilled (owner, 2026-11-09):** **the AI is named next to Draft every time**, small and quiet, beside the help level; it's also the moment your text leaves your Mac, so it never disappears for being familiar.
- **Drilled (owner, 2026-11-09):** **waiting drafts go on their own when the AI is back**, in the order you asked; you hear once when all are done: one Mac notification ("5 drafts ready to read · Acme") and one item in Needs you; cancelled ones simply don't run.
- **Drilled (owner, 2026-11-09):** **a declined draft is said plainly, naming the AI, with no guessed reason**: "Claude didn't write this one. It sometimes declines certain topics. Your text is as you left it."; then Try again · Write it yourself · Use another AI for this one (E6); the AI's own reason, if any, under Details; never hints you asked for something wrong.
- **v1:** Must. **Today:** never switches on its own; failures show the technical message ("AI returned an empty draft"); usage limits aren't recognised (part 3, today's code).
- **Needs:** you need to know who's writing and what's waiting · Arpli needs to recognise each AI's limits and failures and say them in plain words.
- **To brainstorm:**
  1. ~~The AI next to Draft every time, or only when unusual?~~ Decided: every time, small and quiet.
  2. ~~Five drafts waiting for 14:00: do they go, and does the person hear?~~ Decided: on their own, one notice.
  3. ~~A declined draft: how plain can we be?~~ Decided: plain, no guessing, three steps.

### U30 · Sounds like you · drill 2 · ★ · drilled 2026-11-09
- **Job story:** When I read a draft, I want it to sound like me, not like a template, so I can stand behind every sentence.
- **Hardest for:** Emeka, who "can smell marketing speak from one sentence away"; anyone whose English carries a home language a draft might flatten.
- **Decided:** the voice check after the first draft: "Does this sound like you?" yes, or say what's off in your own words, then a new draft; what you said tunes your voice guide (F1 step 7) · the voice guide lives in the bucket, readable and editable (P3, AI notes) · faithful · balanced · expressive, plain labels that say what changes (P6) · banned phrasing, dashes as punctuation and exclamation marks are fixed in code before you see the draft; facts are never rewritten without showing you (E10).
- **Drilled (owner, 2026-11-09):** **your voice guide is a short list of plain lines plus your own examples**: everyday rules ("Short sentences.", "Starts with what happened, not how I felt.", "Never says 'passionate'.", "UK spelling."), each saying where it came from ("you said 'too formal' on 9 Nov", "from your CV"), and under them one or two passages of your own writing it learns from; you can edit, delete or add any line (the jev-job-search voice guide works this way, `06-reference-jev.md` row 4).
- **Drilled (owner, 2026-11-09):** **"Does this sound like you?" is asked out loud once, on your very first draft**; after that, every draft has a quiet **Not quite** button next to Insert, opening the same box: say what's off in your own words, get a new draft, and the guide learns; Arpli shows what it learned in one line ("Added to your voice: 'Don't open with a quote.'"), so nothing changes behind your back; a low rating after "Submitted" opens the same box.
- **Decided (owner, 2026-11-09), the "sounds like me" rating for KR3:** asked right after you confirm "Submitted" (U43), for everyone · one row for each answer Arpli drafted, 1 to 5, one press each; answers you wrote yourself aren't rated · Skip always there; can be turned off in Settings · a 1 to 3 asks "What's off?" in your own words and tunes your voice guide, so the rating helps you too · kept on this Mac with the application; shared only if you've said yes to sharing how it went (X7).
- **Drilled (owner, 2026-11-09), how the rating looks:** one row per drafted answer: the question's short name and five buttons, 1 to 5, words only at the ends ("Not me", "Just like me") · one press saves that row; one Skip for the whole set · the same every time; a text box only after 1 to 3 ("What's off?") · after three skipped applications in a row, it asks once: "Keep asking after each application?" · 1 to 5 stays because KR3 counts 4 or 5.
- **v1:** Must (O2; KR3; the riskiest assumption).
- **Needs:** you need drafts you'd say out loud · Arpli needs to learn your voice from what you tell it, and show you what it learned.
- **To brainstorm:**
  1. ~~What the voice guide holds, and how it reads to the person?~~ Decided: plain lines plus your examples.
  2. ~~The voice check: only in the first run, or whenever a draft gets "not quite"?~~ Decided: once, then a quiet Not quite.
  3. ~~The rating after "Submitted": how it reads the twentieth time?~~ Decided: rows of 1 to 5, one press.

### U31 · Reuse a past answer · drill 9 · ◇ · drilled 2026-11-09
- **Job story:** When a new question looks like one I've answered before, I want to start from my old answer, so each application is faster than the last.
- **Hardest for:** Ngozi, whose Wellcome and Gates applications "want fundamentally different things"; reusing too directly could cost her.
- **Decided:** similar past answers appear quietly under the question, never inserted on their own (M7) · use as is · adjust lightly (changes shown inline) · rework (side by side; "keep the original" and "use the new one" as equal choices) (P6, R3) · nearly the same words to the same kind of programme: a gentle warning before you use it (M7, E13) · built on a fact you've since changed: "Written before you updated your bucket", never offered as is without that line (E13) · in jev's test only 1 answer in 8 was reusable word for word, so adjust and rework matter most (memory).
- **Drilled (owner, 2026-11-09):** **up to two past answers show, matched by meaning**: on what the question asks for (its U19 line), not shared words; the closest first, each labelled with where it went ("Written for Chevening · Mar 2026"); "See more" for the rest.
- **Drilled (owner, 2026-11-09):** **each opportunity has a kind, shown and editable**: read from the page when saved (job, scholarship, fellowship, accelerator, grant); the near-word-for-word warning appears for the same organisation (Chevening two years running) or the same kind (two accelerators); a wrong kind is easy to fix and never decides anything silently.
- **Drilled (owner, 2026-11-09):** **the warning states the fact, says reuse is fine, and offers one step**: "Nearly the same words as your Chevening 2025 answer. Reusing is fine. Adjust it for this one?", with **Adjust lightly** and **Use as is** as equal buttons; steady and warm, no "reviewers may notice".
- **v1:** Must (O10).
- **Needs:** you need your best past words in reach without hunting · Arpli needs to find similar answers, and know when reuse is risky.
- **To brainstorm:**
  1. ~~How similar a past answer must be to show, and how many show at most.~~ Decided: up to two, by meaning.
  2. ~~How Arpli knows "the same kind of programme"?~~ Decided: a kind on each opportunity, editable.
  3. ~~What the warning says?~~ Decided: fact, "fine", offer to adjust.

### U32 · Fill this answer, or Copy · drill 13 · ★ · drilled 2026-11-09
- **Job story:** When my answer is ready, I want it in the form's field in one press, or on my clipboard, so I never retype it.
- **Hardest for:** anyone on a form with a rich text box, or a limit the form enforces silently.
- **Decided:** Fill or Copy, with Copy always next to Fill (M4, P10) · read back after filling (E20) · never filled into a field that would cut it off (E11) · Undo per field (P10) · LinkedIn and Indeed: Copy only.
- **Splits:** S2: in D2 and D4 the answer is written away from the panel and has to reach it (F3).
- **Drilled (owner, 2026-11-09):** **Fill always happens in the panel beside the form**, where you can see the field; every answer is kept in Arpli's engine, so the panel shows the latest version wherever it was written; in the Mac app a finished answer shows "Ready to fill" with "Open the form", which opens the page with the panel at that question; nothing is ever typed into a page you can't see.
- **Drilled (owner, 2026-11-09):** **a filled answer is read back and its question becomes "On the form" everywhere in Arpli**: the panel, the application's list of questions (U20) and its progress ("3 of 5 on the form"); editing it afterwards shows "Changed since filling", so the form and Arpli never quietly disagree.
- **Drilled (owner, 2026-11-09):** **Copy and Fill give plain text with paragraph breaks kept**: no bold, no bullet symbols, no source numbers.
- **v1:** Must (O5).
- **Needs:** you need the answer on the form exactly as you approved it · Arpli needs to confirm what landed.
- **To brainstorm:**
  1. ~~An answer written in the Mac app: how does it reach the field?~~ Decided: always fill from the panel.
  2. ~~What confirms it landed?~~ Decided: read back plus an "On the form" state.
  3. ~~Copy: plain text always, or keep paragraphs?~~ Decided: plain text, paragraphs kept.

### U33 · Documents in an application · drill 17 · drilled 2026-11-09
- **Job story:** When I'm asked for a CV, cover letter or pitch summary, I want a version tailored to this opportunity from the same knowledge, so I don't rewrite it from scratch. (§6)
- **Hardest for:** Ngozi, whose work "must leave the tool cleanly" (Word, Overleaf).
- **Decided:** tailored cover letter and CV, as PDF: Should; one-page pitch summary: Could; full decks: out of v1 (decision, 2026-11-02; O8) · **documents get planned and built in v1** (owner, 2026-11-09; Linear DEE-89, beads `arpli-95z`) · **documents have a place of their own and also live inside each application** (owner, 2026-11-09): every document you have lives in one place, Your documents (U47), where you make new ones, manage them and reuse them later; each application shows the documents it uses, made or picked for it, so the right one goes with the right application; Fill attaches the one picked for this application.
- **Decided (owner, 2026-11-09, level):** **every document is a Must.** Documents are more than a cover letter and a CV: Arpli is built to handle every kind of document an application might need, and every common format: Markdown, PDF, Word, plain text and others. **Decks:** any deck you have lives in Your documents and is attached and reused like any other file; Arpli writes text documents only in v1 (CV, cover letter, statements, proposals, summaries); making slides stays out of v1 (owner, 2026-11-09).
- **Drilled (owner, 2026-11-09):** **documents come in both ways**: Arpli spots an upload field on the form ("Cover letter", "Writing sample") or a request on the opportunity page ("please include a personal statement") and lists it next to the questions as "Cover letter · asked for"; you can also add any document yourself; each offers three ways: make it from your bucket, pick one from Your documents (U47), or drop in a file you have.
- **Drilled (owner, 2026-11-09):** **documents Arpli writes get every check answers get**: "check this" (U34), footnote sources while you review (U35), your voice guide, Not quite and the "sounds like me" rating (U30); source numbers never appear in the finished file.
- **Drilled (owner, 2026-11-09):** **a tailored CV picks, orders and trims your own lines, word for word**, leading with what the role asks for; rewording only as suggestions, each one change (your line struck through, the new wording beside it), accepted or skipped one at a time. Basis: the change-by-change review noted from Grammarly in step 1, and "changes shown inline" kept for reuse (M7).
- **Drilled (owner, 2026-11-09):** **Arpli writes documents that are your own words about yourself**: CV, cover letter, personal statement, statement of purpose, motivation letter, bio, pitch or proposal summary. **It keeps and attaches, never writes**: anything official or made by someone else (transcripts, certificates, reference letters), anything visual (decks, portfolios), and writing samples, which must be your real work.
- **v1:** Must (owner, 2026-11-09; was Should for cover letter and CV, Could for the pitch summary).
- **Needs:** you need the right document for this application, as true and as yours as your answers · Arpli needs to build it from the bucket with the same checks, and keep which document went with which application.
- **To brainstorm:**
  1. ~~How a document is asked for in the application?~~ Decided: spotted, or added by you; make, pick or drop.
  2. ~~Do documents get "check this" and "where did this come from?" like answers?~~ Decided: every check answers get.
  3. ~~A tailored CV: picks and orders your lines, or rewrites them?~~ Decided: pick and order; rewording as suggestions.
  4. ~~Which kinds Arpli writes, and which it keeps and attaches?~~ Decided: writes about-you documents; keeps the rest as they are.

### U47 · Your documents · drill 18 · drilled 2026-11-09
- **Job story:** When I've made a CV or cover letter I like, I want all my documents in one place, so I can find, change and reuse the right one for the next application. (Owner, 2026-11-09.)
- **Hardest for:** someone with three CVs for three kinds of role, unsure which one went where.
- **Decided:** a place of its own where all your documents live; make a new document from scratch, not only from an application; manage them (open, edit, rename, copy, delete with undo); reuse one later for another application (owner, 2026-11-09).
- **v1:** Must, with U33 (owner, 2026-11-09; DEE-89). Holds every kind of document and every common format (Markdown, PDF, Word, plain text and others).
- **Drilled (owner, 2026-11-09):** **a reused document is used as is until you change it**: picking "CV for Acme" for Beta attaches the same file, and each application records exactly which version it sent; once you start changing it for Beta, Arpli makes a copy named for it ("CV for Beta"), so the one sent to Acme stays exactly as sent.
- **Drilled (owner, 2026-11-09):** **Fill attaches PDF by default; the form's own choice wins**: when a form only accepts Word or names another format, Arpli attaches that and says so ("This form takes Word: attaching CV for Beta.docx"); in Your documents any document can be saved in any format, any time (Word to keep editing; Markdown or plain text to paste elsewhere; LaTeX for Overleaf is one of the "others" for the spec to confirm).
- **Needs:** you need every document you've made in one place, with where each one went · Arpli needs to keep each document's versions and the applications it was used for.
- **To brainstorm:**
  1. ~~Your documents and your bucket: two places, or documents inside the bucket?~~ Settled by the owner (2026-11-09): a place of its own.
  2. ~~The CV you imported at the start: is it your first document here?~~ Decided in U24: it becomes your "Main CV" here (its lines also go into the bucket, U11); changeable any time.
  3. ~~Reusing a document: used as is, or copied?~~ Decided: as is; a named copy once you change it.
  4. ~~Which file format goes onto a form.~~ Decided: PDF by default, the form's choice wins.

---

## 6 · Verify and track

### U34 · Check this · drill 3 · ★ · drilled 2026-11-09
- **Job story:** When a draft says something about me, I want anything that isn't in my bucket marked, so nothing untrue goes out under my name.
- **Hardest for:** a tired reader who trusts the draft; Ada, who might keep a claim stronger than her story because it "sounds better".
- **Decided:** two layers: names and numbers checked in code (certain); claims in plain words and praise of the organisation checked by the AI and marked "may not be in your bucket" (less certain, and the words say so) (E9) · each mark: Fix · Remove · It's true, add it to my bucket · many marks: "Much of this isn't in your bucket yet", try faithful (E9) · if the check couldn't run: "Not checked yet", never looks checked · never blocks Insert or Fill; anything still marked is listed in "This is what you're sending" (E9).
- **Drilled (owner, 2026-11-09):** **a draft carries one kind of mark only, "check this", and it's always about truth.** Voice is handled by Not quite on the whole draft (U30), so a mark never has two meanings.
- **Drilled (owner, 2026-11-09):** **the words and the line carry how sure a mark is**: checked in code (names, numbers, dates, credentials) says "Not in your bucket" with a solid underline; checked by the AI (claims, praise of the organisation) says "May not be in your bucket" with a dotted underline; never colour alone; no explanation paragraph, "How this was checked" under Details.
- **Drilled (owner, 2026-11-09):** **"Much of this isn't in your bucket yet" shows by share**: when about a third or more of the sentences carry a mark (a starting point, ASSUMPTION, tuned with the testers); once, at the top of the draft, with **Try faithful** and **Add what's missing** (one or two short questions, as in U15).
- **v1:** Must (O2; KR3: no invented claim reaches a submitted application). **Today:** no check; the first live draft invented praise for the company (memory, foundation).
- **Needs:** you need every untraceable claim in front of you before it goes out · Arpli needs to check every claim against the bucket, and say how sure each check is.
- **To brainstorm:**
  1. ~~A "check this" mark next to a "doesn't sound like you" mark: the same look, or clearly different?~~ Decided: one kind of mark, truth only.
  2. ~~How the person learns the AI layer is less sure, without reading an explanation.~~ Decided: words plus solid or dotted line.
  3. ~~How many marks before "Much of this isn't in your bucket yet"?~~ Decided: about a third of sentences, tuned later.

### U35 · Where did this come from? · drill 4 · ★ · drilled 2026-11-09
- **Job story:** When I read a sentence in a draft, I want to see which of my stories it came from, so I can trust it, and fix the source if it's wrong.
- **Hardest for:** Ngozi values trust signals ("show why a suggestion is a suggestion"); the floor user may find numbers in the text clutter.
- **Decided:** numbered marks to your material on each sentence (F1 step 6, AI notes) · "Where did this come from?" on any sentence opens its bucket item (P6).
- **Drilled (owner, 2026-11-09):** **numbers in the draft, gone after Insert**: in the draft box, small footnote numbers at the end of each sentence, always there while you judge whether it's true; once inserted, your answer reads as clean text, and pointing at any sentence still shows "Where did this come from?"; nothing with numbers ever goes into the form.
- **Drilled (owner, 2026-11-09):** **every number shows**, small and side by side ("1 3 4"), each opening its own item; past three, the first three and "+2".
- **Drilled (owner, 2026-11-09):** **an edited sentence keeps its sources and is checked again**: names and numbers as you type (in code, instant), claims when you leave the box; a sentence you write from scratch has no sources, and its names and numbers are still checked (E2).
- **v1:** Must (O2).
- **Needs:** you need to trace any sentence to your own words in one step · Arpli needs to keep the link from each sentence to its sources.
- **To brainstorm:**
  1. ~~Numbers in the text, or shown only when you point at a sentence?~~ Decided: in the draft, gone after Insert.
  2. ~~A sentence built from three items: three numbers, or "3 sources"?~~ Decided: every number, +more after three.
  3. ~~When you edit a sentence, do its marks stay, change, or go?~~ Decided: sources stay, checked again.

### U36 · This is what you're sending · drill 15 · ★ · drilled 2026-11-09
- **Job story:** When I'm about to press Submit, I want one last look at exactly what's on the form, so I don't send something wrong or empty.
- **Hardest for:** someone skimming under a deadline (the known hole in layer 7).
- **Decided:** before Submit, "this is what you're sending", and a nudge to look over the form (P10, F3 step 7) · built from what the page shows; lists anything still marked "check this" and any required field left empty (Swiss cheese, layer 7).
- **Drilled (owner, 2026-11-09):** **it appears on its own at the top of the panel, "Before you press Submit"**, when the form's Submit button comes into view or nothing is left for Arpli to fill, whichever comes first.
- **Drilled (owner, 2026-11-09):** **it leads with only what needs a look**: "2 things to check: a 'check this' left in question 2, and a required field that's empty", each with "Go to it"; "See everything" opens the full summary; when nothing needs a look, one calm line: "Everything Arpli filled is on the form: 2 answers, 36 fields, your CV. Have a last look, then press Submit."
- **Drilled (owner, 2026-11-09):** **only there to see**: no "I've read this" tick or confirm; the safety is that problems lead, each with "Go to it".
- **v1:** Must (O5).
- **Needs:** you need to see what's going out, in the time you actually have · Arpli needs to build the summary from the page, not from what it meant to fill.
- **To brainstorm:**
  1. ~~Shown on its own, or when the person reaches the Submit button?~~ Decided: on its own, near Submit.
  2. ~~Everything, or only what needs a look?~~ Decided: only what needs a look, See everything for the rest.
  3. ~~Does the person mark it read?~~ Decided: only there to see.

### U37 · Applications · drill 33 · ★ · drilled 2026-11-09 (words: step 5)
- **Job story:** When I have many applications going, I want one place with status, deadlines and a reminder before each, so nothing slips. (§6)
- **Hardest for:** Emeka, applying to a dozen programmes at once.
- **Decided:** one place, "Applications", with Saved as its first stage (part 1 choice) · sorted by who needs whom: Needs you; Arpli is working (folded, with a count); the rest by deadline (overdue, this week, later, no deadline); Sent (folded, with a count); "Not for me" behind a filter (P4) · one status word per application, in a fixed order; never colour alone (P4) · the list by deadline is the default; a board you can switch to, cards moved by drag or keyboard (M6) · progress on each row · a missed deadline: once, in Needs you; never moved or deleted on its own (E26).
- **Drilled (owner, 2026-11-09):** **the board's columns are the stages**: Saved → Started → Ready to send → Submitted → Interview → Outcome (words set in step 5, `09-screen-map.md`); dragging a card changes its stage; the who-needs-whom order stays the list's.
- **Drilled (owner, 2026-11-09):** **a lean row**: title and organisation, deadline (with its time zone when it isn't yours), one status word, progress ("3 of 5 on the form"), the Pin mark; the help level and AI rule only when they limit you ("Fields only · programme rule").
- **v1:** Must (O7). **Today:** two sections, "Opportunities" and "Applications"; the data already holds the statuses discovered to withdrew.
- **Needs:** you need to know what to do next across everything · Arpli needs to keep each status true, and sort by who has to act.
- **To brainstorm:**
  1. Which status words the person sees, and which stay inside: moved to step 5, the screen map, with all names (2026-11-09). Inputs from drilling: Pin is a mark, not a stage (U7); a new "Interview" stage (U42); question states "On the form" and "Changed since filling" (U32).
  2. ~~The board's columns: stages, or the who-needs-whom groups?~~ Decided: stages.
  3. ~~What a row shows.~~ Decided: lean row; the rule only when it limits.

### U38 · Needs you · drill 34 · drilled 2026-11-09 (Home: the directions)
- **Job story:** When I open Arpli, I want to see only what's waiting on me, so I don't hunt through everything.
- **Hardest for:** anyone back after a week away, with several things waiting.
- **Decided:** everything only you can do; each item is one of three kinds: answer it here (with "Save for next time"), fix it in your bucket, or do it yourself on the form (P2) · examples: a question your bucket couldn't answer, a form waiting for a code, one that may not have gone through, connect an AI, missing its details, a missed deadline (P2, E1, E14, E26) · at the top of Applications when anything waits (P4) · a count on the menu bar and the Dock (P13).
- **Drilled (owner, 2026-11-09):** **an item leaves on its own when the thing is done** (code typed, question answered, AI connected); "Later" moves it out of the way with the Snooze presets (U7); news-only items (a missed deadline) have "Got it"; no "clear all".
- **Drilled (owner, 2026-11-09):** **when nothing needs you: one calm line, then your next thing**: "Nothing needs you right now. Next: Chevening, due Friday 17:00 (London) · Open"; with nothing due, "Add something to your bucket".
- **Splits:** S1: a candidate for Home in every direction.
- **v1:** Must (part of O7).
- **Needs:** you need one short list of what's yours to do · Arpli needs to add and clear items as things change, and never pile them up.
- **To brainstorm:**
  1. Home, the top of Applications, or both? Left to the four directions (S1, where Home is a split by design); already at the top of Applications in all of them (P4).
  2. ~~How an item leaves.~~ Decided: done clears it; Later; Got it.
  3. ~~When nothing waits: what does it say?~~ Decided: a calm line plus your next thing.

### U39 · Reminders · drill 35 · drilled 2026-11-09
- **Job story:** When a deadline is coming, I want a reminder that tells me what's left, so I pick it up in time. (From the §6 story on many applications.)
- **Hardest for:** Tunde, who writes after 10 pm and whose laptop is closed all day.
- **Decided:** a Mac notification and an email (P12) · every application not yet sent: saved, pinned and started · titled by type ("Due in 2 days", "Needs you", "Not sure it went through"), each with Open · says what's left: "2 of 5 answers to go. Due Friday 17:00 (London)." · confirmed in one sentence with the real time (P5) · change or turn off per application · missed while the Mac slept: once, together (E28) · how the email is sent is open; the free route is your own Google Calendar (way A), waiting on DEE-88.
- **Drilled (owner, 2026-11-09):** **two reminders by default: a week before the deadline and two days before**, confirmed in one sentence with the real times when you save; changeable per application.
- **Drilled (owner, 2026-11-09):** **at most one reminder notification a day**, bundling what's due, most urgent first ("3 due this week · Chevening Fri, Acme Sat, Wellcome Sun"); anything due within two days gets its own; Needs you and "Not sure it went through" keep their own notifications.
- **Drilled (owner, 2026-11-09):** **email reminders aim for at most one a day**, only on days something is due, matching the daily notification; the final shape waits on how email is sent (DEE-88): with Google Calendar, Google sends its own email per deadline event.
- **v1:** Must (O7). **Today:** none.
- **Needs:** you need reminders worth opening · Arpli needs to send them at the time you set, and say plainly when one can't arrive.
- **To brainstorm:**
  1. ~~The default timing for a new application.~~ Decided: a week and two days before.
  2. ~~With 20 saved, how do reminders stay worth opening?~~ Decided: one a day; urgent ones alone.
  3. ~~One email listing everything due: keep it?~~ Decided: keep as the aim; shape waits on DEE-88.

### U40 · Menu bar and Dock · drill 46 · drilled 2026-11-09
- **Job story:** When Arpli is closed but on, I want a glance at what's due and a quick way to add something, so I don't have to open the whole app.
- **Hardest for:** someone who never opens the app unless reminded.
- **Decided:** shows Arpli is on, including while it checks sources · the count of what needs you, on the icon and the Dock, "9+" past nine · what's due next · Open Arpli · Add to your bucket (P13, R4) · what else it holds is set in step 5.
- **Drilled (owner, 2026-11-09):** **Add opens a small box straight from the menu bar**: type a line, press the microphone and talk, or drop a file or link; saved to the bucket at once ("Saved to your bucket"), with "Open in Arpli" for more; the same one Add as everywhere, smaller.
- **Drilled (owner, 2026-11-09):** **"Arpli is working" is one quiet line in the menu**, only while something is waiting or running ("Arpli is working · 5 drafts waiting until 14:00"); the icon's count stays for what needs you.
- **Drilled (owner, 2026-11-09):** **starting with the Mac is asked once, right after the first reminder is set**: "Start Arpli when your Mac starts, so reminders arrive on time?", Yes or Not now; never switched on silently; changeable in Settings.
- **v1:** owner's yes (2026-11-03), part of O7 (Must).
- **Needs:** you need Arpli at hand without it taking over · Arpli needs to stay quiet unless something needs you.
- **To brainstorm:**
  1. ~~What Add opens.~~ Decided: a small box to type, talk or drop.
  2. ~~Does it show "Arpli is working"?~~ Decided: one quiet line in the menu.
  3. ~~Does Arpli start with the Mac, and is that asked?~~ Decided: asked once, after the first reminder.

---

## 7 · Adjust

### U41 · Versions, refine and tighten · drill 31 · ◇ · drilled 2026-11-09
- **Job story:** When a draft is close but not right, I want to change part of it without losing what I had, so I can try things safely.
- **Hardest for:** Tunde, who "will write things he deletes" that "often hold the honest version" (personas).
- **Decided:** every draft and every dial change is a new version; see any earlier one and go back (P6) · insert and replace are separate (P6) · Tighten when over the limit (E11) · a draft stopped early is kept as a version (E7).
- **Drilled (owner, 2026-11-09):** **you can redo one sentence**: select it, "Try this sentence again", and one alternative appears in the one-change pattern (struck through, new beside it), accept or skip; the rest of the draft stays exactly as it is.
- **Drilled (owner, 2026-11-09):** **one version list, newest first, labelled by who and when**: "Your edit · 23:10", "Tightened · 23:15", "Draft · Claude · 23:02"; any version can be opened, compared side by side, or brought back.
- **v1:** Must (O2). **Today:** drafts per question with versions, sorted by version number (memory, foundation).
- **Needs:** you need to try things without fear of losing a good line · Arpli needs to keep every version, yours and its own.
- **To brainstorm:**
  1. ~~Redo part of a draft, or only whole drafts?~~ Decided: redo a sentence, one change.
  2. ~~Your edits and Arpli's drafts in one list, or apart?~~ Decided: one list, labelled by who.
  3. ~~Comparing two versions: side by side, or inline?~~ Settled by U28 (2026-11-09): side by side, kept for comparing versions; changes marked in both (the Semrush pattern noted in step 1).

### U42 · Follow-ups after sending · drill 32 · ◇ · drilled 2026-11-09
- **Job story:** When an organisation asks for more (an interview, extra material), I want it on the same application, so the whole story stays in one place. (Job map step 7, §6.)
- **Hardest for:** Emeka, juggling follow-ups across a dozen programmes.
- **Decided:** statuses exist in the data (awaiting, and the outcomes) (P4) · step 7 is "partly" in v1 (product map) · Arpli spots replies in your email (U44).
- **Drilled (owner, 2026-11-09):** **an interview invite is a stage, plus a Needs you item when there's something to do**: the application moves to a new "Interview" stage (today's data has none; a small change, engineering to add); anything only you can do, such as picking a time slot (always yours, E22), shows in Needs you until done; with email connected, Arpli suggests the change from the invite, one click to confirm (U44).
- **Drilled (owner, 2026-11-09):** **a request for more goes onto the same application** as new items next to the originals ("Extra question · asked 12 Nov"), drafted, checked and filled the same way; the application shows "1 new" in Needs you.
- **Drilled (owner, 2026-11-09):** **for interviews, a "What you sent" view only**: one click shows exactly what was sent (answers, documents, the reference number, U43), each answer with its sources (U35); no practice questions or coaching in v1.
- **v1:** partly.
- **Needs:** you need follow-ups next to the application they belong to · Arpli needs to let an application move on after "Submitted".
- **To brainstorm:**
  1. ~~An interview invite: a status, or an item in Needs you?~~ Decided: a stage, plus Needs you when there's an action.
  2. ~~A request for more material: a new question on the same application?~~ Decided: new items on the same application.
  3. ~~Anything to help prepare for an interview?~~ Decided: "What you sent" view only.

---

## 8 · Close

### U43 · Knowing it was sent · drill 16 · ★ · drilled 2026-11-09
- **Job story:** When I've pressed Submit, I want Arpli to know it went, so my list is honest and the reminders stop.
- **Hardest for:** anyone on a site that sends without changing the page, or who closes the tab first.
- **Decided:** you press Submit, never Arpli (Frame no-go) · the panel reads the page after the click: "Looks sent. Mark it as submitted?", one click (P10, F3 step 9) · can't tell: "Not sure it went through", in Needs you; "I've sent it" stays; Arpli looks for the confirmation email (P10) · settled by you, a confirmation page, a confirmation email or a reply; "It didn't go through" goes back to "Ready to send" with every answer kept (E25) · the form still showing: stays "Ready to send" (E24) · never marked sent on a guess.
- **Drilled (owner, 2026-11-09):** **after "Mark it as submitted", the same steady lines every time**: "Submitted · Acme · 9 Nov, 23:41. Reminders stopped.", then the "sounds like me" rows (U30); the first time only, one more line: "Your answers are kept in your bucket, ready for next time."; no confetti, no exclamation mark.
- **Drilled (owner, 2026-11-09):** **"Mark as submitted" in the Mac app sits on the application and in its row menu**: on the application it becomes the main button once its answers are ready; in Applications it's in the row's menu; both lead to the same lines and rating rows; one sent elsewhere entirely is added already submitted (U9).
- **Drilled (owner, 2026-11-09):** **a reference number is kept quietly if the confirmation page shows one**: read from the page and saved with the application ("Reference ACM-2231 · 9 Nov, 23:41"), with exactly what was sent; no number on the page, nothing is asked.
- **v1:** Must (O7).
- **Needs:** you need a "Submitted" you can trust · Arpli needs to tell "looks sent" from "sent", and let you settle it.
- **To brainstorm:**
  1. ~~The moment after "Looks sent".~~ Decided: the same steady lines; one extra line the first time.
  2. ~~"I've sent it" in the Mac app: where does it sit?~~ Decided: on the application and in the row menu.
  3. ~~Anything to keep on submitting, such as a confirmation number?~~ Decided: kept quietly if shown.
- **Not here:** Arpli pressing Submit for you stays an open question, recommended out of v1 (design-state).

### U44 · Spotting replies in your email · drill 45 · drilled 2026-11-09
- **Job story:** When an organisation replies, I want Arpli to notice and suggest the outcome, so my list stays true without me updating it.
- **Hardest for:** someone who doesn't use Claude or Gmail (the first way to try needs both).
- **Decided:** with your email connected, Arpli notices a reply from an organisation you applied to and suggests the outcome; one click; never changed on its own (R6) · it also finds confirmation emails and codes (R6, E23) · reads only messages that match your applications; keeps nothing else (R6, P8) · first way to try: the Gmail connection in your own Claude, read-only; Arpli says email is read by Claude online before it's turned on (decision, 2026-11-09) · each suggestion shows sender, subject and date; "Not this application" ignores it; an unclear reply is kept as "a reply"; nothing in an email is taken as an instruction (E27) · not connected: "Search your email for Acme" (E27).
- **Drilled (owner, 2026-11-09):** **connecting email is always in Settings, and offered once when it solves a problem**: the first time an application shows "Not sure it went through" ("Connect your email and Arpli will look for the confirmation"); never part of the first run.
- **Drilled (owner, 2026-11-09):** **a suggestion appears in Needs you and on the application**, "Acme replied · looks like an interview invite · Confirm"; one Mac notification says only who replied ("A reply from Acme"), never a guessed outcome, so a no never lands on the lock screen.
- **Drilled (owner, 2026-11-09):** **a "What Arpli read" list in Settings, under Email**: every email opened, with sender, subject, date and the application it matched; "Not this application" and "Forget this" on each; one line at the top: "Arpli never reads other emails, and never sends or deletes any." (The spec checks this line against what the connection route actually does.)
- **v1:** working level Should (set at the Must re-check after Batch 1).
- **Needs:** you need your list to keep up with your inbox · Arpli needs to read only what matches your applications, and show what it read.
- **To brainstorm:**
  1. ~~When connecting email is offered.~~ Decided: Settings, plus the first "Not sure".
  2. ~~Where a suggestion appears.~~ Decided: Needs you and the application, plus a plain notice.
  3. ~~How the person sees what Arpli read.~~ Decided: a "What Arpli read" list.

### U45 · Recording the outcome · drill 43 · drilled 2026-11-09
- **Job story:** When I hear back, I want to record what happened, so my list is honest and I know where I stand. (Job map step 8, §6.)
- **Hardest for:** Tunde, for whom a first rejection could "lose his nerve" (personas).
- **Decided:** change the stage; record the outcome (P5) · the data holds won, rejected, waitlisted, withdrew (P4) · its answers stay in the bucket (R6).
- **Drilled (owner, 2026-11-09):** **plain outcome words and, for a no, one steady line**: "Accepted", "Not this time", "Waitlisted", "Withdrew" (final words in step 5); a no gets "Recorded. Your answers stay in your bucket for next time." and nothing more; no consoling paragraph, no exclamation marks.
- **Drilled (owner, 2026-11-09):** **one optional line: "Anything to remember for next time?"**, for a note or feedback the organisation gave; kept with the application and shown next time a similar question comes up (U31); never asked twice; no structured feedback form.
- **v1:** Must (O7).
- **Needs:** you need to close an application in one step, whatever the news · Arpli needs to keep the outcome with the application and its answers.
- **To brainstorm:**
  1. ~~The words for each outcome, and the tone for a no.~~ Decided: plain words, one steady line.
  2. ~~Does a no offer anything?~~ Decided: one optional note.
  3. ~~Anything beyond the outcome, such as feedback?~~ Decided with question 2: the same optional note.

### U46 · Kept for next time · drill 44 · ★ · drilled 2026-11-09
- **Job story:** When an application is done, I want my answers kept with my stories, so the next one starts ahead.
- **Hardest for:** someone coming back months later, for the next season.
- **Decided:** answers kept in the bucket after submitting, each with where and when it was used (F3 step 9, P3) · in the long run, reminders stop when the season ends; the bucket keeps everything; nothing has to be rebuilt (F4) · emails about Arpli itself only with a separate yes (F4).
- **Drilled (owner, 2026-11-09):** **only answers that were sent or marked ready become past answers**, in their final version; half-finished drafts stay on their own application and aren't offered for reuse (U31).
- **Drilled (owner, 2026-11-09):** **a past answer shows how its application went, quietly, as a fact**: "Sent to Chevening · Mar 2026 · Not this time", plus your outcome note if any (U45); never ranked or scored by outcome; a no never hides an answer.
- **Drilled (owner, 2026-11-09):** **back after months: the usual view, one line, one step**: Applications as usual (Needs you, then what's due); one line, "Your bucket has 120 lines and 14 past answers, ready for this season."; one step, "Add what's new since March"; no tour, no welcome-back screen.
- **v1:** Must (O10).
- **Needs:** you need each application to make the next one easier · Arpli needs to keep every answer with where it went.
- **To brainstorm:**
  1. ~~Every answer kept, or only those marked ready or sent?~~ Decided: sent or ready, final version.
  2. ~~Does a kept answer show how its application went?~~ Decided: shown quietly as a fact.
  3. ~~Back after months: what does Arpli show first?~~ Decided: usual view, one line, add what's new.

---

## Across every step

These are rules already decided. They're drilled when they come up inside a card.

- **X1 · Undo, and a way out of everything.** Not for me and Bring it back, Snooze and Wake, Pin and Unpin; Undo for five seconds (⌘Z too) instead of "are you sure?"; a confirm only for what can't be undone (rules, part 1). Emeka: "no 'are you sure?' friction". *Brainstorm:* where Undo appears, and what ⌘Z undoes.
- **X2 · AI work in words, with time, and Stop.** "Reading the form · 4s", "Drafting 2 of 5", "Drafted in 12s"; nothing spins without saying what it's doing (rules, part 1; Taste). *Brainstorm:* where "Arpli is working" shows once you leave the screen.
- **X3 · Where your text goes.** Said at the moment it goes; "it stays on this Mac" for a local AI; the AI you chose is the only one used (M1, P6, rules). *Brainstorm:* said on every draft, or once per AI and again when it changes?
- **X4 · When something fails.** Your words are never lost; each message says what happened, what's safe and one next step; detail under "Details"; one line that updates, not a pile; what can work keeps working (part 3 rules). *Brainstorm:* where error lines sit: in place, or in one shared spot?
- **X5 · Offline.** One line, once: "You're offline. Everything on this Mac still works."; what waits is said where it happens, and goes on its own when you're back (E30). *Brainstorm:* is a model on this Mac offered when you're offline and need a draft?
- **X6 · Your data.** Where it lives on this Mac, export it, delete everything with a summary and a confirm (P8). Ngozi: work "must leave the tool cleanly". *Brainstorm:* what an export holds, and in which formats.
- **X7 · Sharing how it went.** All measurement is opt-in; nothing is tracked by default (`03-product-strategy.md`). KR1 to KR3 need numbers from the 20 testers. The "sounds like me" rating is asked of everyone after "Submitted", kept on this Mac, and shared only with this yes (U30, owner, 2026-11-09). *Brainstorm:* how a tester chooses what to share, and how; whether the other half of KR3 (no invented claim reaches a sent application) is counted the same way, from the "check this" marks still open at Submit (U36).

---

## Below the line: not in v1

Kept on the map so the whole job stays visible (story mapping: the line between in and later).
- Arpli finding opportunities on its own (O11): v2 (Frame no-go).
- Recommender tracking: Won't. Arpli making slide decks: not in v1; a deck you already have is kept and attached like any document (U47, owner, 2026-11-09).
- Saving from the phone: needs the account; later (R1).
- Arpli pressing Submit for you: an open question; recommended "you press Submit" for v1 (design-state).
- Material in from your tools (Google Docs, Notion, Fathom) and reading a ChatGPT or Claude export: an idea (O13), decided at the Must re-check after Batch 1.
- Windows, phone, team use, outcome analysis: not doing (`03-product-strategy.md`).
- Interview practice and coaching: not in v1; v1 has "What you sent" (U42, owner, 2026-11-09).

## From the older jobs list, not yet placed

Ideas in `docs/design/jobs-to-be-done.md` (11 Oct) that the journey doesn't cover. Not in scope until decided; each sits with the card where it would come up while drilling.

| Idea | Older job | Comes up in |
|---|---|---|
| "What is this question really asking?"; links between overlapping questions | 2 | U19, U20 (both decided, 2026-11-09) |
| Notes to yourself on an application | 1, 10 | U20; U45 decided a note at the outcome (2026-11-09) |
| A free line of direction for a draft ("lead with my research"); a word target | 3 | U22 (the note: decided, 2026-11-09), U30 |
| Draft every question at once | 3 | U28 ("Draft the rest": decided, 2026-11-09) |
| Formatting, a character count option | 5 | U27 (formatting: plain text with paragraphs, decided 2026-11-09; the count is in the form's own unit, E11) |
| Redo a selected sentence; expand or shorten; changes marked; lock a draft | 5 | U41 |
| Voice instructions; voice notes to self; the raw transcript beside the draft | 6 | U12 |
| "What's weak about this?"; three opening lines to pick from | 7 | U30, U41 |
| A score for each answer | 7 | U30 (step 1 noted that Grammarly's "Overall score" turns writing into a grade) |
| Ask a question about this application, as a chat | 7 | no card yet |
| A checklist of documents and referees | 8 | U23 (decided, 2026-11-09: the application's list is the checklist; referees not tracked) |
| A confirmation number and where it was sent | 8 | U43 (decided, 2026-11-09) |
| The form beside the workspace, in one window | 9 | S2 (the D2 variant) |
| Export to Word or PDF | 9 | U33, X6 |
| Tags on applications; "this one fits you best" | 10 | U37, U6 |

## Carried forward from drilling

All 47 cards were drilled with the owner on 2026-11-09, one question at a time; every recommendation was kept. What drilling handed on:

**To step 5, the screen map**
- Names on screen: the bucket (U13), the status words (U37), the outcome words (U45).
- Where Home is: left to the four directions (S1, U38).

**To the D3 prototype**
- The story interview: once for your whole story or per question, and how long before it feels like work (U17).

**Checks for the engineer (each goes into its feature's spec)**
- Which ways to connect an AI exist (U3), and nothing sent to an AI before one is chosen; reading before then on this Mac (U2).
- Transcription on this Mac, and the recording kept; today's code sends audio online and keeps none (U12).
- A new "Interview" stage in the data (U42).
- The "What Arpli read" line matches what the email route actually does (U44); the email reminder shape waits on DEE-88 (U39).
- File formats beyond PDF, Word, Markdown and plain text, such as LaTeX (U47).

**To tune with the testers**
- When "Much of this isn't in your bucket yet" appears: about a third of sentences marked, a starting point (U34, ASSUMPTION).

---
**Handoff**
- Output: `design/08-ux-elements.md`
- Status: the map, the drill order and 47 cards written; the open items decided (2026-11-09); all 47 cards drilled with the owner the same day, decisions in each card ("Drilled" lines)
- Confidence: Med for the elements and decisions (approved by the owner, built on approved decisions and the journey; not yet seen in a prototype); Low for job stories written here (not checked with people)
- Decided 2026-11-09: U19 in v1 (Must); documents every kind and format, Must, a place of their own plus inside each application (U33, U47; DEE-89); the KR3 rating after "Submitted"; a second slice across Plan, Check and Adjust; then 126 drilled decisions across the 47 cards
- Next: step 5, the screen map and principles (rest of DEE-86), starting from the names and Home carried forward above
- Module skill: Design OS Explore step 6, adapted by the owner from "story map and use cases" to UX elements by job step; the requirement line on each card stands in for the Design & System requirements table
