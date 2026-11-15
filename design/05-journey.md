# 05 · Explore steps 2 to 4 · How Arpli works, end to end

**Date:** 2026-11-03 · **Linear:** DEE-85 · **beads:** `arpli-rln.9` · **Depth:** deep · **AI overlay:** on
**Built on:** the seven step 1 decisions (end of `04-explore.md`) · the moments, v1 scope and first slice (`02-opportunity.md` sections 1 and 9) · the product map (`03-product-strategy.md`) · the forms research and the Swiss cheese layers (`01-preplanning.md` sections 10 and 11) · the current app's screens and data (code read 2026-11-03).
**Method (Notion pages opened):** "Breadboarding for Interaction Flow Design" (Design OS Best Practices Library): places, the things you can do in each, and where each one leads, in words only; "when a breadboard feels overly complex or confusing as text, that complexity is a design problem to solve before proceeding". HCD manual ch. 6 (story mapping and user journeys), used in part 2: outcome first, entry point, critical path, bottlenecks, one first-time and one returning journey, the first win-state.
**Parts:** 1 places and actions · 2 flows · 3 when things go wrong. Each part is reviewed on its own with keep / change / add / cut.

**What this is not.** No screens and no layout. Names of places are working names; the labels people see are set in step 5 (screen map).

---

## Split points (left open on purpose)

The four directions answer these differently. This map shows where they split and does not choose. Only what is already known about each direction is filled in; the rest is for its prototype to show.

| # | Split point | What is known so far |
|---|---|---|
| S1 | **Where you land when you open Arpli** | D2 makes the bucket home. The other directions decide in their prototypes. Until then the map uses a neutral "Home". **"Needs you" is a candidate for Home in every direction** (owner, 2026-11-09, from `06-reference-jev.md`). |
| S2 | **Where an answer gets written, and which AI writes it** | D1: beside the form, in the Chrome panel. D2: inside the Mac app (with a variant that opens the form in **a Chrome window Arpli opens and can see into**, a real Chrome with its own profile, rather than a browser built into the app; owner, 2026-11-09, from `06-reference-jev.md`). D3: a short interview gathers the story first, then the draft. D4: in the person's own Claude or ChatGPT; Arpli hands over the right material and takes the answer back. **Owner's note on the built-in browser (2026-11-03):** Arpli can see everything that happens in the page, including the Submit press. A real Chrome window may avoid the embedded-browser limits found in Frame (Google blocking sign-in, Cloudflare refusing it; `01-preplanning.md` section 10); the D2 prototype tests this. Either way people log in again there, because their everyday Chrome logins don't carry over. |
| S3 | **How the bucket grows beyond what you pour in** | All directions: "ask first when the bucket is thin" (M3), and "this is new, save it to your bucket?" while drafting (O9, Should). D3 adds the story interview as a main way in. |

---

## Part 1 · Places and actions

### The map at a glance

```
MAC APP
  First run ──► Home [S1]
  Home ◄──► Bucket · Applications · New from your sources · Settings
  Applications ──► One application ──► Answer a question [S2]
  Bucket ──► One item (a story, a file, a past answer)

CHROME EXTENSION
  Any page ──► Save ──► lands in Applications as "Saved"
  A form page ──► Form panel ──► fills the real form; you press Submit
  Form panel ◄──► One application · Answer a question [S2]

MAC AND BEYOND
  Menu bar ──► what's due next · open Arpli
  Reminder (Mac notification and email) ──► One application
```

Each place below lists what you can do there (→ where it leads). "AI" marks the places where AI does part of the work; part 3 covers what happens when it fails or isn't sure.

**Rules for every place** (owner, 2026-11-09, from `07-reference-t3code.md`)
- **Every way in has a way out:** Not for me and Bring it back, Snooze and Wake, Pin and Unpin. Anything that can be undone shows **Undo** for five seconds (⌘Z works too) instead of asking "are you sure?". A confirm is kept only for what can't be undone, such as deleting everything.
- **AI work is said in plain words, with time:** "Reading the form · 4s", "Drafting 2 of 5", "Drafted in 12s". **Stop** is always there while it works. Nothing spins without saying what it's doing.
- **The AI you chose is the only one used.** If it is offline or out of usage, Arpli waits and says when it's back; it never switches to another AI on its own, because that would send your words somewhere you didn't choose. You can pick another AI you've connected for one draft, as your own choice, with where the text goes said; it isn't kept as a switch (E6, owner, 2026-11-09). Part 3 covers the details.

### In the Mac app

**P1 · First run** · reshapes today's onboarding (four screens: welcome, connect your AI, start your profile, done)
Step 1 decision (M1): material first; AI connects alongside; the bucket sorts itself once AI is ready.
- Add what you have: a CV, a LinkedIn export, a link, a note, or talk → your bucket fills while you go on
- Use the AI found on this Mac (pre-selected, no keys; others optional) → connected, with one line on where your text goes
- **The AI on this Mac** is shown as a card with its state in plain words: checking · not found · sign in · needs attention · off · ready ("Claude is on this Mac and signed in (Max)"). Each state that isn't ready has one action that fixes it: a button or a short guide, never a terminal. Looking for an AI never starts anything: no sign-in window, no session (owner, 2026-11-09)
- Not now → the bucket keeps everything as you gave it; drafting waits until AI is connected
- Get the Chrome extension, as its own step with a picture of how to pin it → Pair (P11)
- Done → Home
- AI: sorting the bucket (titles, tags) and reading the CV.

**P2 · Home** · [S1]
- Until S1 is decided, Arpli opens where you left off, as it does today.
- Candidate in every direction: **Needs you**, everything only you can do, each item one of three kinds: answer it here (with "Save for next time"), fix it in your bucket, or do it yourself on the form. Examples: a question your bucket couldn't answer, a form waiting for an emailed code, an application that may not have gone through (owner, 2026-11-09).

**P3 · Bucket** · reshapes today's "Profile"
Step 1 decision (M5): your own words, kept as they are; Arpli adds only a short title and tags.
- Add (one button, or drop anything anywhere): file, link, note, voice → Add review (P3a)
- Search, or narrow by tag or kind (experience, story, file, past answer) → the list narrows
- Answers you've written: a filter in the bucket, not a separate place (O10) → past answers, each with where and when it was used
- Standing answers (owner, 2026-11-09): questions that come back on form after form, answered once. Pay, "how did you hear about us", notice period, messages and marketing, and history questions (conviction, non-compete, worked or applied here before, relatives there), each asked plainly and never assumed "no". The right to work is one answer per country. Used to fill forms, and shown by name before each fill. Only facts about you live here: anything that signs or agrees for you never does, and demographic answers only if you set them yourself (part 3, the one choice, way C; owner, 2026-11-09).
- Your voice: a short guide to how you write, tuned by the voice check in the first run (F1)
- Open an item → Item (P3b)
- AI: titles and tags.

**P3a · Add review**
- A CV or LinkedIn export → what Arpli found, as your own lines, ready to keep or fix
- A second CV → what to do with the overlaps, with one choice recommended
- A ramble (voice or typed) → suggested highlights of your own sentences, accepted one by one; a voice entry keeps the recording with the transcript
- AI: reading the file; picking highlights.

**P3b · Item**
- Read and edit the words, the title, the tags
- See where it was used (which applications, when)
- Play the recording (voice entries)
- Delete, with undo

**P4 · Applications** · merges today's "Opportunities" and "Applications" (see the choice at the end of this part)
Step 1 decision (M6): list and board, switchable; the list by deadline is the default.
- **Sorted by who needs whom** (owner, 2026-11-09):
  - **Needs you** at the top when anything is waiting on you (see P2)
  - **Arpli is working**, folded, with a count ("Working 2"): applications where Arpli is drafting, reading a form or checking a page. Each comes back to the top the moment it finishes or needs you.
  - **The rest, by deadline** (M6): overdue, this week, later, no deadline; each row shows progress ("3 of 5 answers drafted")
  - **Sent**, folded, with a count: submitted ones and those with an outcome
  - "Not for me" ones are out of sight, found with a filter, each with Bring it back
- **One status word per application**, picked in a fixed order of who needs whom: needs you · not sure it went through · deadline passed · Arpli is working (including "waiting for your AI") · due soon · drafting · ready to send · submitted (part 3, E6 and E26). Always a word, never colour alone. A finished word ("Drafted") shows only until you've seen it. The exact words are set in step 5.
- **Snooze** (presets such as tomorrow or next week, or a date you pick) → leaves the list and comes back at the top on that day; **Wake** brings it back sooner. If the deadline falls before then, Arpli says so before snoozing.
- Board: one column per stage; move a card by dragging, or with the keyboard
- Add: paste a link or text (exists today) → One application (P5), saved first, checked after
- Add one you sent elsewhere, in a few seconds → One application (P5), already "Submitted"
- Open one → One application (P5)
- Pin one you mean to apply to → it stays at the top and gets reminders (owner, 2026-11-03)
- Working stages: Saved · Drafting · Submitted · Outcome, plus one state that can sit on any sent application: **"Not sure it went through"** (owner, 2026-11-09). It is never filled again on its own; it is settled by you, by a confirmation page, or by a reply. The data already has finer statuses (discovered, qualifying, drafting, reviewing, submitted, awaiting, won, rejected, waitlisted, withdrew); how they group, and their labels, are set in step 5.

**P5 · One application** · reshapes today's application workspace
- See the opportunity: title, organisation, deadline (with its time zone), link, eligibility, and the AI rules if the form states them
- Fix anything Arpli got wrong (save first, check after, M2)
- Set the AI help level: fields only · you draft, Arpli refines · Arpli drafts from your words (O2); it starts at what the stated rules allow, or at your default from Settings → applies to every answer here
- See the questions, each with its state (not started, your draft, ready) → Answer a question (P6)
- Open the form in Chrome → the real form, with the Form panel (P10)
- Pin or unpin · Snooze or wake
- Reminders: on for anything not yet sent; change when, and where they go (Mac, email) → confirmed in one sentence with the real time ("2 days before: Thursday 9:00")
- Change the stage; record the outcome → Applications (P4)
- Not for me (archive) → leaves the list with Undo for five seconds, and its reminders stop; Bring it back from the "Not for me" filter in Applications
- AI: reading the opportunity (title, deadline, questions).

**P6 · Answer a question** · [S2]
Wherever this lives, it does the same things.
- See the question and its limit
- **Next to Draft:** which AI writes ("Claude on this Mac") and the help level for this application, each one click to change. Where your text goes is said at the moment it goes (M1; owner, 2026-11-09)
- Past answers that look similar appear quietly under the question (M7) → use as is · adjust lightly (changes shown inline) · rework (side by side, with "keep the original" and "use the new one" as equal choices)
- See the bucket items a draft would use, numbered; untick any before drafting (M3)
- Bucket too thin → one or two short questions first; your answers go into the bucket (M3)
- Write it yourself, or ask for a draft if the help level allows → while it drafts, what it's doing and for how long, with Stop → the draft arrives beside your own text, with insert and replace as separate choices
- Faithful · balanced · expressive (plain labels that say what changes) → a new version
- "Check this" on any claim that can't be traced to the bucket → fix it, remove it, or add the fact to the bucket
- "Where did this come from?" on any sentence → the bucket item it came from
- Versions → see any earlier one, go back to it
- Nearly the same words going to the same kind of programme → a gentle warning, before you use it (M7)
- Mark ready · Copy · Fill this answer (when the form is open in Chrome)
- Something new came up while writing → "Save this to your bucket?" (O9, Should)
- AI: drafting, "check this", finding similar past answers, the reuse warning.

**P7 · New from your sources** · new (O12, Should)
- Add a source: a company's job board, an opportunity site, a feed → checked while the Mac is on
- See what's new, with deadlines, and when each source was last checked
- Save one, in one click → Applications (P4), as "Saved"
- Dismiss an item; remove a source
- A source Arpli can't read is said plainly, with paste-in as the fallback (`02-opportunity.md` 9b)
- AI: reading each new listing (title, deadline).

**P8 · Settings** · exists, to extend
- AI: the AI on this Mac card (the same states as in the first run, each with its one fixing action), where your text goes, change or disconnect; the default help level for new applications
- Chrome extension: paired or not, pair again → Pair (P11)
- Reminders: the default timing, and where they go (Mac notification, email)
- Your email (owner, 2026-11-09): connected or not, exactly what Arpli reads (only replies and confirmations that match your applications), disconnect
- Your data: where it lives on this Mac, export it, delete everything (with a summary of what goes, and a confirm)

### In Chrome (the extension: nothing built yet)

**P9 · Save** · on any page, from the Arpli button
Step 1 decision (M2): save first, check after.
- One click → saved; the panel then shows title, organisation, deadline and questions as editable fields
- No deadline found → the panel says so and asks for one
- Fix anything → saved again
- Open in Arpli → One application (P5)
- Start applying, when the page is a form → Form panel (P10)
- On LinkedIn and Indeed: paste-in only, no reading
- AI: reading the page.

**P10 · Form panel** · beside a real form
Step 1 decision (M4): standard fields together, written answers one by one.
- The panel names the page and the form it is reading
- Fill standard fields (name, email, phone, links, CV) in one press → each field is read back from the page as on the form · left empty · didn't take (E20), and the fields it couldn't read or skipped are listed plainly
- Each written answer: read it, then Fill or Copy (Copy always sits next to Fill) → [S2] for where the answer was written
- Undo, per field
- Attestations, consent, demographic, visa, criminal-record and salary fields are never touched without a yes for that field (Swiss cheese layer 4, `01-preplanning.md` section 11). Facts about you can come from standing answers, shown by name; signatures, interview slots, other people's details, cookie banners and marketing boxes are never filled. The panel lists all of these as "Yours to fill" (E22, the one choice in part 3)
- Before you press Submit: "this is what you're sending", and a nudge to look over the form
- You press Submit on the site → the panel notices the press and the confirmation page that follows, and asks "Looks sent. Mark it as submitted?" → one click → Applications (P4), "Submitted"
- The panel can't tell, or you close the tab first → the application is marked **"Not sure it went through"** and goes to Needs you; "I've sent it" stays in the panel, and Arpli looks for the confirmation email (if your email is connected; otherwise it suggests you look). Arpli never marks an application sent on a guess alone: a wrong "Submitted" could make someone miss a deadline they thought they'd met.
- On LinkedIn and Indeed: copy only, no reading and no filling
- AI: reading the form's questions.

**P11 · Pair**
- Enter the code Arpli shows → paired; the engine then answers only Arpli's own app and extension (O6)

### On the Mac and beyond

**P12 · Reminder** · a Mac notification and an email (owner, 2026-11-03: notifications on the Mac alone may not do much)
- Covers every application not yet sent: saved, pinned and started
- Titled by what it is, each with **Open** (owner, 2026-11-09): "Due in 2 days", "Needs you", "Not sure it went through"
- Says what's left: "2 of 5 answers to go. Due Friday 17:00 (London)."
- Arrives at the time you set → One application (P5)
- Proposal: when several are due, one email lists them all, rather than one email per application
- Turn reminders off for any one application, or change when they come
- How the email gets sent is open: see the open questions below

**P13 · Menu bar** · new (owner, 2026-11-03: yes)
- Shows that Arpli is on, including while it checks your sources
- A count of what needs you, on the menu bar icon and on the Dock ("9+" past nine) (owner, 2026-11-09)
- What's due next → One application (P5)
- Open Arpli
- Add to your bucket (owner, 2026-11-09, from R4)
- What else it holds is set in step 5

### Outside Arpli
- The real form on the organisation's site: you press Submit there, never Arpli.
- Your own Claude or ChatGPT: only in D4 (S2).

---

### Today's code against this map

| Place | Today in the code | In this map |
|---|---|---|
| P1 First run | four onboarding screens | reshaped: material first |
| P2 Home | opens the last section visited (Profile by default) | open until S1 |
| P3 Bucket | "Profile" | reshaped; its label is set in step 5 |
| P4 Applications | two sections, "Opportunities" and "Applications" | one place (the choice below) |
| P5, P6 One application, answer a question | application workspace with drafts per question and versions | extended |
| P7 New from your sources | none | new (Should) |
| P8 Settings | exists | extended |
| P9 to P11 Chrome | none | new |
| P12 Reminder (Mac and email) | none | new |
| P13 Menu bar | none | new |
| Sandbox | a developer test page | not part of the product |

### The one choice in this part

**Saved opportunities and applications: one place or two?** Today they are two sections.

**Owner decision (2026-11-03): yes, one place.**

**Recommendation: one place, "Applications", with "Saved" as its first stage.**
- One list of deadlines. M6 groups everything by deadline; a second list would split what's due across two places.
- Saving from Chrome (M2) lands where you already track, so nothing gets lost between the two.
- The data already supports it (the status "discovered"), so only the screens change, not the engine.
- The cost: saved items you never apply to sit in the list. "Not for me" (archive) keeps it clean.

### Open questions from this part
- ~~Does Arpli need a small Mac menu bar presence?~~ **Yes** (owner, 2026-11-03) → P13.
- ~~Arpli can't see the Submit press on another site.~~ **Answered** (owner idea plus recommendation, 2026-11-03): in the built-in browser (D2 variant) Arpli sees it directly. In Chrome, the extension notices the press and the confirmation page, then asks for one click to confirm; "I've sent it" stays as the fallback (P10). Confidence Med: some sites send the form without a page change, so the confirmation can be missed; that is why the person always confirms.
- What the bucket is called on screen ("bucket", "Profile" or something else) is a step 5 label (owner: fine).
- **How do email reminders get sent?** Arpli has no server and no account, so there are three ways:

| Way | How it works | Works when the Mac is closed? | What leaves the Mac |
|---|---|---|---|
| **A. Through your calendar** | Arpli adds each application not yet sent to your Google Calendar and keeps it up to date (what's left, the deadline); Google sends the email and the phone alert | yes | application names, deadlines and progress, to your own calendar, after you agree once |
| B. From your own email, to yourself | you connect Gmail or Outlook; Arpli sends the reminder from your account | no, only when the Mac is on and awake | the reminder, through your own mail |
| C. An Arpli email service | Arpli's own server emails you | yes | your email address and deadlines, kept on Arpli's server, which breaks "no cloud account" |

  **Recommendation: A.** It reaches you exactly when a Mac notification can't: laptop closed, you're out. There is no Arpli server, so the local-first promise holds, and you see what goes to your calendar before agreeing. The costs: it needs a Google connection (see the idea below), progress in the event updates only while the Mac is on, and Outlook users wait. Apple Calendar could follow for alerts on the iPhone. That Google Calendar can send email alerts for events Arpli creates is to be confirmed in an engineering spike.
  **Scope:** this adds to O7 (a Must), so it counts in the Must re-check after Batch 1 (the G2 condition).
  **Owner's note (2026-11-03):** Arpli may need to run accounts as part of the business, to upsell and to notify. That would make way C possible, and it changes an approved decision: "no cloud account or sync in v1" is a Frame no-go, and "no account" is part of bet 3 in the product strategy. **The email way waits for the account decision** (see design-state, open questions).

### Ideas raised during this review

**Connect your tools: Google, Fathom, Notion and the like** (owner, 2026-11-03, raised as a thought, not yet a decision)
- **Two uses.** (1) Material in: past essays from Google Docs, notes from Notion, what you said about your work on recorded calls (Fathom), poured into the bucket. This fits S3 and O1 ("pour in what you have"). (2) Reaching you away from the Mac: Google Calendar and Gmail for reminders (way A above).
- **How it's built.** MCP is one way to connect these tools; the engineer picks the way for each tool. D4 uses MCP the other way round: your own Claude or ChatGPT reads your bucket.
- **What to watch.** Recorded calls hold other people's words and details. Only the person's own words should go into the bucket (UKRI warns against putting others' personal data into AI tools; `01-preplanning.md` section 10). Every connection says what it reads and where it goes, and can be removed.
- **Where it fits.** Not in the v1 scope today. The calendar part goes with the reminders choice. "Material in from your tools" would be a new opportunity (O13) for the product lead to write up. Recommendation: a Could for v1, starting with Google Docs, because past essays often sit there (Frame, switching cost 2, Low confidence). Decide it at the Must re-check after Batch 1.
- **Update (owner, 2026-11-09, part 2 review):** the email part is now in v1: Arpli spots replies and confirmations in your email (F2 R6). How it connects (Gmail, Outlook, or Apple Mail on the Mac) is for an engineering spike. **First way to try (owner, 2026-11-09): the Gmail connection the person already has in their own Claude**, so Arpli needs no Google approval and holds no email login. Conditions: only for people who use Claude and have connected Gmail there (others need another way, likely Apple Mail); Arpli says in one line that email is read by Claude online before it's turned on; and Arpli allows only searching and reading, never sending or deleting. Reading Gmail from an app needs Google's approval, which for a public app includes a yearly security review that can cost money; any cost goes to DEE-88.

**Bring in what you already wrote with ChatGPT or Claude** (from `07-reference-t3code.md` A7, 2026-11-09; an idea, not yet a decision)
- Arpli reads a ChatGPT or Claude data export and suggests your own answers and stories from it as bucket lines, each accepted one by one (M5). Past essays often live in old ChatGPT chats (Frame, switching cost 2).
- Same caution as above: only your own words go in, and the export stays on this Mac.
- For the product lead, together with O13.

**Owner review of part 1 (2026-11-03):** the merge is approved. Added: reminders by Mac notification and email, covering every application not yet sent (saved, pinned, started); pin; the menu bar (P13); knowing an application was sent. Raised: accounts, now a working direction (on your Mac first, account optional, free first) with a product note to come (DEE-88); connecting other tools, logged as an idea.
**Owner decision (2026-11-09): all six changes from T3 Code taken** (`07-reference-t3code.md`): Applications sort by who needs whom (P4) · undo instead of "are you sure?", with Snooze and Wake (rules, P4, P5) · AI work in plain words with time, and Stop (rules, P6, F1) · which AI writes and the help level next to Draft (P6) · the AI on this Mac card, and never switching AI on its own (rules, P1, P8) · reminders titled by type, with a count on the Dock and menu bar (P12, P13).

---

## Part 2 · Flows

**How each flow is written** (HCD manual ch. 6 and ch. 12, Notion, opened 2026-11-03): the outcome first, then the entry point, then the critical path (a step you can skip doesn't belong on it), the first win, what brings people here (inside: a feeling or need; outside: a notification, a link), and friction, found by walking through as a tired, first-time user who makes mistakes ("anything that doesn't have to be there is friction"). Part 3 covers what happens when a step fails.
**Reminders in these flows** come as a Mac notification, through the menu bar, and by email. With no cloud budget for now, email in v1 would come through the person's own Google Calendar (way A); the account (DEE-88) may change that later.

### F1 · First time

**Outcome:** a first draft that sounds like you, built from your own material, for a real question, in your first session (KR1).
**Entry:** you open Arpli for the first time after installing it. "First time" means there is no bucket yet, whatever the app remembers (the DEE-74 bug; part 3).
**What brings people here (ASSUMPTION, from the personas, not checked with people):** inside, a deadline coming and a blank page late at night; outside, a friend's link or a post about Arpli.

**Critical path**
1. **Start with what you have** (the welcome is this screen, not a page before it): drop a CV. Other ways in: a LinkedIn export, a link, typed lines, or talk.
   Arpli reads it in the background while you go on.
2. **Alongside:** "Claude is on this Mac. Use it?", already selected, with one line on where your text goes → Use it.
3. **Your bucket appears** in your own lines, sorting itself (titles, tags) → "Looks right". Fixing is optional now; everything stays editable.
4. **"What are you applying for?"** → paste a link or the text of an opportunity → saved first (Applications, "Saved"); Arpli reads its questions.
   Nothing in mind tonight → try a common question instead ("Tell us about yourself"); the draft is kept as a past answer (owner, 2026-11-09).
5. **Pick a question** → Answer a question [S2]: the bucket items a draft would use → Draft. On the very first draft they are folded into one line you can open ("Using 4 things from your bucket"); after that, the full numbered list (owner, 2026-11-09).
   Bucket too thin → one or two short questions first, kept in the bucket (M3).
6. **Drafting is said in words, with time, and Stop** ("Drafting · 8s") → **the draft arrives** beside your own (empty) text, with numbered marks to your material and "check this" on anything it can't trace.
7. **First win, with the voice check** (owner, 2026-11-09): "Does this sound like you?" → yes → Insert, or Copy. Not quite → say what's off in your own words ("too formal", "I'd never say that") → a new draft, and what you said tunes your voice guide in the bucket. One or two rounds.
8. **Offered, not forced:** "Use Arpli on the real form" → get the Chrome extension (with a picture of how to pin it) → pair → done. Or "Later".

**Taken off the critical path** (each can be skipped, so none of them blocks the first draft): reviewing every imported line · reminders · the extension · tags · settings · the account (offered only when someone turns on something that needs it).
**Count:** about seven presses from opening Arpli to a first draft, plus reading time. The prototype should try to cut this.

**Friction walk-through (a tired first-timer at 11 pm)**
- No CV at hand, or it's out of date → typing or talking a few lines works just as well.
- Doesn't know which AI they have, or has none → part 3; the cheap-AI question in design-state is the long-term answer.
- "Where does my text go?" → said in one line at the moment it's sent; "it stays on this Mac" when the AI is local.
- No opportunity in mind → the common-question path.
- The first draft sounds generic → the faithful / balanced / expressive dial and "where did this come from?". Whether drafts sound like the person is the riskiest assumption (KR3).
- The download itself: macOS warns before opening an app that isn't signed and notarised by Apple. See the open questions.

**Pre-mortem: why someone never reaches a first draft**
no AI they can connect · thin material, and they skip the questions · fear at the AI step · no question in mind, so they leave it "for later" · a generic first draft, so they stop trusting it · the macOS warning at install.

### F2 · Coming back

Each return is short. The reasons come from the moments of truth (M2 to M7) and your notes on reminders.

**R1 · "I found this"** (M2)
- **Entry:** a page or post in Chrome.
- **Path:** click the Arpli button → saved → the panel shows title, organisation, deadline and questions; no deadline → it asks for one → done. Reminders are on, because nothing has been sent yet.
- **Win:** saved in one click, with its deadline known.
- **Branches:** the page is the form itself → Start applying (F3) · LinkedIn or Indeed → paste-in · found on the phone or in WhatsApp → paste the link into Applications later (phone capture needs the account, so it comes later).

**R2 · A reminder arrives**
- **Entry:** "2 of 5 answers to go. Due Friday 17:00 (London)." as a Mac notification, an email, or in the menu bar.
- **Path:** click → One application, opened at the next question not yet answered → answer it [S2] → mark ready → when all are ready, open the form in Chrome → F3.
- **Win:** you pick up exactly where you left off.
- **Branches:** no longer applying → "Not for me" (archive), and its reminders stop · not this week → Snooze, and it comes back on the day you pick · already sent it somewhere else → "I've sent it".

**R3 · A new question that looks like an old one** (M7)
- **Entry:** inside Answer a question.
- **Path:** past answers that look similar appear quietly under the question → use as is · adjust lightly (changes inline) · rework (side by side) → the gentle warning if nearly the same words are going to the same kind of programme.
- **Win:** a fitting answer in minutes, still in your words. This is what makes each application faster than the last (O10).

**R4 · Something new happened** (M5)
- **Entry:** you just won something, finished a project, or had a thought after an interview.
- **Path:** open Arpli, or Add from the menu bar (owner, 2026-11-09; placed in step 5) → voice or a note → kept as your words, with a title and tags.
- **Win:** in the bucket in seconds, and findable the next time a question needs it.

**R5 · New from your sources** (O12, Should)
- **Entry:** "3 new" in the menu bar or on Home.
- **Path:** New from your sources → scan, with deadlines → save one → Applications, "Saved", reminders on.
- **Win:** an opportunity found without searching.

**R6 · Heard back**
- **Entry:** an email from the organisation, outside Arpli.
- **Path:** open the application → record the outcome. Its answers stay in the bucket for next time.
- **In v1, Arpli spots the reply for you** (owner, 2026-11-09): with your email connected, Arpli notices a reply from an organisation you applied to and suggests the outcome ("Looks like a reply from Acme. Mark it as not successful?") → one click. It never changes a status on its own. It reads only messages that match your applications and keeps nothing else.
- The same email connection also finds the confirmation email for "Not sure it went through" (P10) and the codes a form sends you.
- **Win:** an honest record, and answers ready to reuse.

### F3 · The first slice: one Greenhouse application, start to finish

The critical path that has to work (`02-opportunity.md` section 9).
**Outcome:** the application shows as "Submitted" in Applications, and nothing in it was invented.
**Before it starts:** F1 is done (a bucket and an AI) and the extension is installed and paired.

1. Open a Greenhouse job in Chrome. Often the form sits inside the company's own site.
2. Click Arpli → saved; the questions come from Greenhouse's public data, the most reliable way to read them (`01-preplanning.md` section 10).
3. Start applying → the Form panel names the page and the form it is reading, and how many questions it found.
4. Fill standard fields in one press, CV included → the panel says what it filled and lists what it skipped or couldn't read. Attestation, consent and demographic fields stay untouched unless you say yes to each one.
5. The first written answer → [S2] → a draft with "check this" on → read it → Fill this answer, or Copy.
6. Repeat for each written answer, one at a time.
7. "This is what you're sending", and a nudge to look over the form.
8. You press Submit on the site. Solving a reCAPTCHA is yours to do; Arpli never touches it.
9. The panel reads the page after the click → a confirmation → "Looks sent. Mark it as submitted?" → yes → "Submitted" in Applications. Its reminders stop, and its answers are kept in the bucket. No confirmation it can be sure of → "Not sure it went through", in Needs you.

**Win:** submitted in one sitting, every claim traceable.
**Split:** step 5 is S2. D1 drafts in the panel; D2 in the app or the built-in browser; D3 gathers the story first; D4 drafts in your own Claude or ChatGPT, and the answer comes back to the panel.
**Friction:** the form inside another site's page · custom dropdowns (Copy is the fallback) · word or character limits · the reCAPTCHA.

### F4 · The other two journeys, kept short

HCD ch. 6 asks for four journeys when the work covers the whole product: discovery, onboarding (F1), the regular returns (F2, F3) and the long run.
- **Discovery:** someone hears of Arpli from a friend, a post or GitHub, and installs it. The download page is outside this map; it has to say plainly that Arpli is free, open source, stays on your Mac, and which AI it works with. This goes to Release.
- **The long run:** when the season ends (the job, the place, the grant), Arpli goes quiet. Reminders stop, and the bucket keeps every story and answer for the next round. Coming back months later, nothing has to be rebuilt. Emails about Arpli itself only go to people who said yes to them separately (DEE-88).

### The one choice in this part

**The Chrome extension: before or after the first draft?**
**Owner decision (2026-11-09): after the first draft.**
**Recommendation: after the first win** (F1 step 8), offered and never forced.
- Installing, pinning and pairing is three more things to do before anything useful happens. After a good first draft, people have a reason to do them.
- The first win needs no form: a pasted link or a common question is enough.
- The cost: someone who came with a form open in Chrome waits a few minutes longer for the panel. D1 (next to the form) may still argue for "before"; that is part of S2.

### Open questions from this part
- **The macOS warning at install.** An app downloaded from the web opens without a warning only if it is signed and notarised, which needs a paid Apple Developer membership. Without it, people have to allow Arpli in System Settings, which is real friction for the person with the least tech confidence. This matters for Release and for KR1, and it costs money (US$99 a year); it goes to DEE-88. **Owner decision (2026-11-09): free for the 20 testers**, with a short picture guide to the one-time "Open Anyway" step in System Settings → Privacy & Security; pay before the public release.
- ~~**The common question** for people with nothing in mind: fallback, or always a real opportunity?~~ **Fallback** (owner, 2026-11-09), F1 step 4.

**Owner review of part 2 (2026-11-09):** kept, one item at a time, as good enough for the first build; each part gets reworked hands-on once the prototypes exist. Decided: the draft in the first session is the goal; CV first, no welcome page; the found AI pre-selected, with "Not now"; one "Looks right" press; the common question as the fallback; the first draft's sources folded into one line; the extension offered after the first draft; Add in the menu bar; **Arpli spots replies and confirmations in your email in v1** (first way to try: the Gmail connection in the person's own Claude, read-only); free for the testers, with a guide to the macOS "Open Anyway" step. F3, the Greenhouse slice, kept as written; the owner gives thoughts once the prototypes are built.

---

## Part 3 · When things go wrong

**How each one is written:** when it happens · what you see (working words; the final copy is set in step 5 and the specs) · what's kept · the ways forward.
**Method (Notion, DESIGN OS, opened 2026-11-09):** "Design Error Recovery Paths at Every Failure Point" (say what happened, keep the person's input, offer a specific next action; never a bare "Something went wrong"; for batches, say which parts worked and which didn't) · "Error Handling and Recovery Patterns" (problem, cause, solution; technical detail folded away; never fail silently) · "Design Every Interactive State" · "Transparency About AI Limitations" (say when to check; never present AI output as certain without a source) · "Human-in-the-Loop" and "Agent Status & Activity" (say what it's doing and for how long; easy to stop) · "Framework: Swiss Cheese Model" (several imperfect layers; list each layer's holes). Voice: the error register in `docs/brand/tone-of-voice.md` ("That didn't send. Your draft is saved. Try again in a moment."). References: jev-job-search (`06`, rows 1, 5, 6, 8, 10, 12, 13, 14) and T3 Code (`07`, A9, A10, B3, B7, B9, B11, B14).

**Rules for every failure** (they add to the rules for every place in part 1)
- **Your words are never lost.** What you typed, drafted or poured in is kept before any error shows, and stays where it was.
- **Each message says three things:** what happened, what's safe, and one next step. No codes on screen; the technical detail sits behind "Details", for reporting a problem.
- **Nothing fails silently,** and an ongoing problem is one line that updates, not a pile of messages (T3 B7).
- **What can work keeps working.** One broken part (the AI, the internet, the extension) never locks the rest: the bucket, Applications, writing yourself and Copy always work.
- **Anything that counts is settled by you:** sent or not, the outcome, a fact that can't be traced, a field that speaks for you. Arpli suggests; it never decides on a guess.
- **Unknown means skipped, never guessed.** A field, a deadline or a reply Arpli isn't sure about is left empty and asks.

### Getting set up

**E1 · No bucket, but the app thinks you've been here before** (DEE-74)
- When: the app remembers a finished first run, but there's no bucket (an earlier run, a reset, the data moved).
- The fix: "first time" is decided by the bucket, not by a remembered flag. No bucket → the first run, at "Start with what you have". An AI already connected is kept, and that step is skipped.
- A bucket but no AI → Home, with "Connect an AI to start drafting" in Needs you. Not the first run again.
- The data folder can't be found: "Your bucket isn't where it was on this Mac." · Find it · Start fresh. Never starts fresh on its own.

**E2 · No AI on this Mac**
- The AI on this Mac card shows "not found", with ways to get one, simplest first: sign in with ChatGPT · a model that runs on this Mac (slower, a big download) · a key, for people who have one. Which ways exist is for the engineer's spike (Frame found ChatGPT sign-in and local models allowed).
- Not now → everything except drafting works: the bucket (kept as you gave it, titled later), Applications, reminders, writing your own answers, Copy and Fill. Names and numbers in what you write are still checked, because that check is code, not AI.
- One line in Needs you, "Connect an AI to start drafting". Not a nag on every screen.
- D4 needs no AI on the Mac (your own Claude or ChatGPT writes); the other directions show this state. The long-term answer is the cheap-AI question in design-state.

**E3 · The AI needs you: signed out, too old, not set up**
- The card says it in words, with one fixing action: "Claude isn't signed in on this Mac. Sign in" · "This version of Claude Code is too old for Arpli. Update", with a short guide. Never a terminal.
- Found in the middle of a task → that work waits ("Waiting for you to sign in to Claude"), shows in Needs you, and picks up after. The card checks again when you come back to Arpli (T3 B9); checking never starts anything.

**E4 · A file that can't be read**
- A scan, a photo of a page, a locked PDF: "This file has no text that can be read. It may be a scan." · Paste the text · Talk it through · Try another file. The file stays in the bucket as a file either way.
- Partly read: what was found is shown, and the pages that couldn't be read are named.

**E5 · The microphone, or a recording that didn't become words**
- Microphone not allowed: "Your Mac isn't letting Arpli use the microphone." · Allow it (a picture guide to System Settings) · Type instead, right there. Checked again when you come back.
- The words didn't come through: the recording is kept and plays · Try again · Type over it.

### While the AI works

**E6 · Your AI is out of usage, or can't be reached** (the part 1 rule: wait, never switch)
- Out of usage: "Claude has reached its usage limit. It resets at 14:00, and your draft picks up then." With no reset time: it tries again on its own every so often and says when it last tried. (Whether Claude Code and ChatGPT report a reset time is for the spike.)
- Can't be reached: "Claude can't be reached right now. Your draft goes as soon as it's back."
- What waits: only the drafts you asked for, each shown as "Waiting for Claude · back at 14:00" in the Arpli is working group, with Cancel. Nothing else stops.
- Your ways out: write it yourself now, or **Use another AI for this one**, only if you've connected another, only as your choice for that draft, with where the text goes said. Never kept as a switch.

**E7 · Slow, stopped, empty or declined**
- Slow: said with time ("Drafting · 24s, usually about 10s"), with Stop.
- Stop → "Stopping" → stopped. What had arrived is kept as a version marked "stopped early". If it won't stop: "This is taking longer to stop." · Force stop (T3 B3). If that fails too, it says so.
- Empty or cut off: "That draft came back empty. Your text is as you left it." · Try again.
- The AI declined to write it: said plainly in our words (its own reason under Details) · Write it yourself · Try again with fewer bucket items.

**E8 · The bucket is thin** (M3: ask first)
- Before drafting: one or two short questions, "1 of 2", with Skip and draft anyway (T3 B14). Your answers go into the bucket.
- Skipped, or still thin: a gap is never filled with something invented. It shows as a marked blank, "[the result, as a number]", for you to fill.
- Nothing in the bucket fits at all: no draft. "Your bucket has nothing on this yet." · Answer two questions · Write it yourself · Add to your bucket.

**E9 · Check this: claims that can't be traced**
- Two layers. Names and numbers are checked in code against the bucket: certain (jev row 5). Claims in plain words, and praise of the organisation, are checked by the AI and marked "may not be in your bucket": less certain, so the words say so.
- Each mark: Fix · Remove · **It's true, add it to my bucket** (S3).
- Many marks (the threshold is set in the spec): "Much of this isn't in your bucket yet." · Try faithful · Answer a question first.
- If the check itself couldn't run, the draft says "Not checked yet", never looks checked.
- Never blocks Insert or Fill, but anything still marked is listed in "This is what you're sending" (Swiss cheese, below).

**E10 · The draft slips out of your voice**
- Banned phrasing, dashes as punctuation, exclamation marks (the tone-of-voice list; jev row 6) are checked in code and rewritten once before you see the draft. If one still slips through, it's marked "doesn't sound like you", the same way as check this.
- Only style is fixed quietly. Facts are never rewritten without showing you (M3: claims are shown, not silently retried).

**E11 · Over the limit**
- The count is always there, in the form's own unit (words or characters). Over: "32 words over." · Tighten (a new version) · Edit it yourself.
- Never cut off silently, and never filled into a form that would cut it off.

**E12 · The programme's AI rules**
- A stated rule sets where the help level starts (P5), and stays next to Draft, quoted, with its link: "This programme asks for your own writing. You draft, Arpli refines."
- You can change the level; the rule stays in view. It's your application and your call.

**E13 · Nearly the same words again, or a past answer that's out of date** (M7)
- Nearly the same words to the same kind of programme: the gentle warning before you use it · Adjust lightly · Rework · Use anyway.
- A past answer built on a fact you've since changed: "Written before you updated your bucket", with what changed (jev row 8). It's never offered "as is" without that line.

### Bringing an opportunity in

**E14 · A page that can't be read, or one saved twice**
- Saved first anyway (M2): the link, the page title, the date. Then: "This page couldn't be read." · Paste the text of the opportunity · Open the page. It shows in Needs you as "Missing its details".
- Partly read: what was found is filled in; the rest is empty and asks.
- Saved before: "You saved this on 3 Nov." · Open it. No second copy.

**E15 · No deadline, or one you can't be sure of**
- None found: the panel asks (P9). Left empty: it sits under "No deadline", and reminders wait until there is one, which it says.
- No time zone: "Deadline 17:00. Whose time?" · Yours (Lagos) · The organisation's (London). Shown in both once known.
- "Rolling" or "until filled": kept as those words, not a made-up date, with a reminder in a week you can change.

**E16 · LinkedIn and Indeed**
- The panel says why, once: "LinkedIn doesn't allow tools to read or fill its forms. Your answers are here to copy." · Paste the job's text to save it · Copy.
- Nothing is read on those sites, so nothing can get your account in trouble (Frame, harm 8).

**E17 · A source that can't be checked, or a posting that's gone**
- A source that keeps failing: "Not checked since 3 Nov. The page has changed." · Try again · Remove · Paste in instead (P7).
- A posting taken down after you saved it: "This page is gone. Your drafts are kept." · Not for me · Keep it.

### On the real form

**E18 · The extension can't reach Arpli**
- Not paired: "Pair with Arpli on this Mac" (P11).
- Arpli isn't open: "Arpli isn't open on this Mac." · Open Arpli. Save still works: the page waits in the extension and lands in Applications when Arpli opens. Fill and drafting need Arpli.
- Shown as a dot and a word: Paired · Reconnecting · Arpli isn't open (T3 B11).

**E19 · A form that can't be read**
- Not at all: "The questions on this page couldn't be read." · Paste the questions · Copy answers from Arpli. Nothing is filled.
- Inside another site's page: the extension asks once for that site ("Allow Arpli on boards.greenhouse.io").
- Partly: what was found is listed, with "Missing a question? Add it."
- Several pages (Workday): read again on each page, "Page 2 of 4 · 6 fields". Fill never presses Next or Submit.
- Changed since you saved it: "This form has 1 new question since you saved it." It's added to the application.

**E20 · A field that didn't take** (jev row 1)
- After a fill, each field is read back from the page and gets one of three states: **on the form** · **left empty** · **didn't take** (the page shows something else).
- Didn't take → Copy, right there, for you to paste · Undo per field. Custom dropdowns and editors fall back to Copy (F3).
- Read back means "on the page", not "right" (jev's own review found 7 wrong answers in about 500). Your look over the form stays the last check.

**E21 · A site that saves as you type**
- Before the first fill on such a site (Ashby is known to): "This site saves what's typed before you press Submit, so the organisation may see an unsent draft." · Fill · Not yet (jev row 12).

**E22 · Fields Arpli never fills, and fields that need your yes** (Swiss cheese layer 4, with jev row 13 added; see the one choice below)
- Never, whatever is in your bucket: a signature (your name typed under an agreement), picking an interview or test slot, other people's details (referees), cookie banners, "Apply with LinkedIn" buttons, marketing boxes.
- Only with your yes: attestations ("I certify…"), consent to terms, demographic questions, right to work and visa, criminal record and other history questions, pay.
- The panel lists these as "Yours to fill", so none get missed.

**E23 · A human check: robot test, emailed code, sign-in**
- Robot check: "This form wants a robot check. That one's yours." Arpli waits and picks up after. It never touches it.
- Emailed code: "The form sent a code to your email." · Open my mail at the code (jev row 10). With your email connected, the code is shown for you to copy; you type it. (Greenhouse asked for a code on 7 of 13 forms in jev's run.)
- Sign in or make an account (Workday, Submittable): "This site wants you to sign in first." Arpli never makes accounts for you; it reads the form again once you're in.

**E24 · After Submit: the form is still there, or shows errors**
- The site lists errors, or the form comes back: "The form is still showing. It may not have sent." The site's own error lines are listed in the panel when they can be read. It stays "Ready to send".
- Neither a confirmation nor the form: "Not sure it went through" (E25).

**E25 · Not sure it went through** (P10)
- Settled by: a confirmation page · "I've sent it" · a confirmation email · a reply.
- Or **It didn't go through** → back to "Ready to send", every answer kept, reminders on again.
- Never filled again on its own. Unsettled after a day: one reminder, titled "Not sure it went through". Deadline close: it goes to the top of Needs you, "Check before Friday 17:00".

### After it's sent, and over time

**E26 · A missed deadline**
- The deadline passes and it wasn't sent: once, in Needs you, "The deadline for Acme was yesterday at 17:00 (London)." · It's still open: change the date · Send it anyway (some take late ones) · Let it go (Not for me, with Undo).
- Never moved or deleted on its own. Its answers stay in the bucket; its reminders stop.

**E27 · Email not connected, a wrong match, or a reply that isn't clear**
- Not connected: wherever email would help (not sure it went through, a code, a reply), Arpli suggests you look: "Search your email for Acme", which opens your mail at that search.
- Each suggestion shows the email's sender, subject and date, so a wrong match is easy to spot. Not this application → ignored; nothing had changed.
- A reply that isn't clear ("we got it", a survey): kept as "a reply", no outcome suggested. Nothing in an email is taken as an instruction (jev row 14).
- The connection stops working (signed out of Claude, Gmail removed there): one line in Needs you and in Settings. Spotting pauses; nothing else changes.

**E28 · A reminder that didn't arrive**
- The Mac was asleep: on waking, missed reminders come once, together ("While your Mac was asleep: 2 due this week").
- Mac notifications are off for Arpli: the menu bar count and Needs you still work; Settings says "Mac notifications are off" · Allow.
- Email reminders not set up: Settings says so plainly, so nobody counts on an email that won't come.

### Arpli itself

**E29 · Part of Arpli stopped, or couldn't save**
- The part that works in the background stops: it restarts once, quietly. If it stops again: "Part of Arpli stopped. What you were typing is still here." · Restart Arpli · Details.
- Couldn't save (the Mac is full): "This couldn't be saved. Your Mac is out of space." The text stays on screen · Try again. Nothing is thrown away.

**E30 · Offline**
- One line, once: "You're offline. Everything on this Mac still works."
- Works offline: the bucket, Applications, writing, a model that runs on this Mac. Waits for the internet, each said where it happens: drafting with an online AI (E6), reading a link, checking sources, email. It all goes on its own when you're back.

**E31 · The app and the extension out of step after an update**
- "The Chrome extension needs an update to work with this version of Arpli." · Update. Save and Copy keep working meanwhile.

### The Swiss cheese layers, updated

Two steps carry the most risk: filling a real form, and marking an application sent. Each has several layers, so one hole doesn't reach the person (Notion, "Framework: Swiss Cheese Model": list each layer's holes).

**Filling a real form**

| # | Layer | What it catches | Known hole |
|---|---|---|---|
| 1 | You press Submit, never Arpli | a send you didn't mean | a tired person presses without looking |
| 2 | The programme's AI rules shown; the help level starts there (E12) | breaking an AI rule | rules that aren't on the form |
| 3 | Every claim traced; check this (E9) | invented facts | the AI check can miss a claim in plain words |
| 4 | What goes in each field, shown before filling | wrong data | a long list gets skimmed |
| 5 | Fields never filled, and fields only with your yes (E22); unknown fields skipped, never guessed | signing or speaking for you | a sensitive field with an odd label |
| 6 | Read back after filling (E20) | a fill that didn't take | "on the page" isn't "right" |
| 7 | "This is what you're sending", built from what the page shows, listing anything still marked "check this" and any required field left empty | whatever slipped past 1 to 6 | skimmed under a deadline |
| 8 | Undo per field | a wrong fill you notice | nothing undoes a send |

**Marking it sent**

| # | Layer | Known hole |
|---|---|---|
| 1 | Read the page after the click | some sites send without changing the page |
| 2 | You confirm with one click; never marked sent on a guess | a quick click |
| 3 | "Not sure it went through", kept until it's settled (E25) | ignored |
| 4 | The confirmation email, or a reply (E27) | email not connected |
| 5 | Reminders keep running until it's settled | notifications off (E28) |

### AI interaction notes, one per AI moment

Asked for by the AI overlay. "In the loop": nothing happens until you say yes. "On the loop": it's done for you, and you can see and correct it. Every moment starts at low autonomy: nothing reaches the outside world without your press.

| AI moment | In or on the loop | How sure it shows | Status in words | Correct or undo | When it fails |
|---|---|---|---|---|---|
| Reading a CV or file (P3a) | in: "Looks right", or fix lines | your own lines; what it couldn't place is listed | "Reading your CV · 6s" | edit or delete any line | E4 |
| Titles and tags (P3) | on: done quietly | none needed | none | edit; your edit is never overwritten | left untitled, words kept |
| Highlights from a ramble (P3a) | in: accepted one by one | none needed | "Picking highlights · 5s" | skip any | the whole transcript is kept |
| Reading the opportunity (P5, P9) | on: saved first, checked after | anything unsure is left empty and asks | "Reading the page · 4s" | fix any field | E14, E15 |
| Reading the form's questions (P10) | on | how many found; what's missing | "Reading the form · 3s" | add a missing question | E19 |
| Drafting (P6) | in: nothing is used without you | numbered sources for each sentence | "Drafting 2 of 5 · 12s", with Stop | versions; insert and replace kept apart | E6 to E11 |
| Check this (P6) | in | certain for names and numbers; "may not be in your bucket" for the rest | "Not checked yet" if it couldn't run | fix · remove · it's true | E9 |
| Tuning your voice guide (F1) | in: from what you said was off | none needed | none | read and edit the guide in the bucket | the guide stays as it was |
| Similar past answers, and the reuse warning (P6) | on: quiet suggestions | none needed | none | ignore | nothing shows; no harm done |
| Reading the page after Submit (P10) | in: you confirm | "Looks sent", never "Sent" | none | It didn't go through | E24, E25 |
| Spotting replies and confirmations (R6) | in: one click to accept | sender, subject and date shown | none | Not this application | E27 |
| Reading new listings (P7) | on | when each source was last checked | "Checked 10 min ago" | dismiss | E17 |

### Today's code against this part

| Failure | Today in the code | In this part |
|---|---|---|
| No bucket, first run done (DEE-74) | the start page trusts a remembered flag | the bucket decides (E1) |
| AI errors | the technical message reaches the screen ("AI returned an empty draft") | what happened, what's safe, one next step; detail under Details |
| Out of usage | not recognised; the draft just fails | waits and says when it's back (E6) |
| Switching AI | never switches on its own | kept as a rule |
| Over the limit | the limit is asked for in the instructions to the AI; the engine reports whether it fits | the count in the form's unit, and Tighten (E11) |
| A link that can't be read | a plain page fetch, which fails on Greenhouse, Ashby and LinkedIn | saved first, then paste-in (E14) |
| Confirming | browser pop-ups (`alert()`, `confirm()`) | undo, and the app's own confirm for what can't be undone |

### The one choice in this part

**Fields that speak for you: a yes on every form, or once through your standing answers?**
Frame's rule (Swiss cheese layer 4) says attestation, consent, demographic, visa, criminal-record and pay fields are never touched without a yes for that field. Since then, standing answers (P3, from jev) let you answer pay, right to work and history questions once. The two need to fit together (flagged in `06-reference-jev.md`, row 7).

| Way | How it works | Cost |
|---|---|---|
| A. A yes on each field, every form | the safest on paper | tiring by the tenth form, and people start pressing yes without reading, which is a hole in the layer |
| B. Standing answers fill them with the standard fields | the fastest | one out-of-date answer goes onto every form |
| **C. Split by kind** | **Facts about you** (pay, notice period, how you heard, right to work per country, history questions) come from standing answers, are shown by name in the list before filling ("Right to work in the UK: yes"), and fill with the standard fields. **Anything that signs or agrees for you** (attestations, consent to terms) and anything about other people: never from standing answers, a yes on that field each time, or yours to do. **Demographic questions:** filled only if you set a standing answer yourself; Arpli never suggests one | one more distinction to explain, and the list before filling has to name each fact |

**Recommendation: C.** The yes stays meaningful where it binds you, and you don't repeat facts you've already stated. An out-of-date fact gets fixed once, in the bucket, and shows by name before every fill.
**Owner decision (2026-11-09): C**, as part of keeping part 3 as written.

### Open questions from this part
- Do Claude Code and ChatGPT report when usage resets? It decides the words in E6. For the engineer's spike.
- ~~Changes to parts 1 and 2 once this part is approved~~ **Applied** (2026-11-09): the part 1 rule on the AI you chose (E6), P3 standing answers (the one choice), P4 status words ("deadline passed", "waiting for your AI"; step 5 sets the words), P10 read-back states and "Yours to fill".

**Owner review of part 3 (2026-11-09):** E1 to E9 reviewed one item at a time and kept, including the addition in E6 ("Use another AI for this one", your choice for one draft, never kept as a switch). Then **everything else kept as written** (E10 to E31, the Swiss cheese layers, the AI interaction notes, and way C for the one choice): the owner will rate the experience hands-on once it is built.

---
**Handoff (parts 1 to 3)**
- Output: `design/05-journey.md`
- Status: parts 1, 2 and 3 approved by the owner (part 3 on 2026-11-09); DEE-85 done
- Confidence: Med. Built on the approved decisions, the forms research, two reference apps read in their code, and the Notion recovery and AI-status practices; nothing tested with people yet. Copy is working words.
- Next: the UX elements by job step, to drill into one by one (owner, 2026-11-09); then the screen map and principles (DEE-86)

