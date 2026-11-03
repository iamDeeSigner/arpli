# Explore · step 1: patterns

**Date:** 2026-11-03 · **Moments:** M1 to M6 from `02-opportunity.md`, plus M7 (reuse and adapt), which the owner added during this step.
**Sources used:** Mobbin screen and flow search (web first; one iOS flow, flagged) · Eagle "My Inspiration" library (AI search; the app was running, 32,861 items) · read first: `design/02-opportunity.md`, `docs/brand/tone-of-voice.md` · skill: Mobbin UI research.
**How to review:** the owner reviews each moment with keep / change / add / cut.

**Reading the tables.** Each row takes the logic of a screen, not its look or identity. "Lenses" rates five audit lenses: consistency, visibility, learnability, predictability, feedback. "+" means the screen does it well, "-" means it is weak there. Lenses not named were unremarkable. "web" means a desktop browser screen on Mobbin.

**About Eagle.** Eagle answered every search. Most matches were concept shots posted on X, with low match scores. Three that fit are listed as side notes under M3 and M6, marked as concepts rather than shipped products. Nothing usable came back for M1, M2, M4, M5 or M7.

---

## M1 First run

From install to a first useful result.

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Polywork | Onboarding: paste a LinkedIn URL, pick skills, land in a prefilled page editor | [flow](https://mobbin.com/flows/a2c8ab21-a49d-4f75-ad79-f33ed93f931d) | Start from something the person already has, then land straight in an editable result instead of a blank form. A "How do I find my LinkedIn URL?" link sits under the field, and Skip is always there. | The error reads "Oops, something went wrong". Reading a LinkedIn profile from its URL is not open to Arpli (02, section 9b). | visibility+, learnability+, feedback- | web |
| Remote | Upload your resume step | [screen](https://mobbin.com/screens/2bc7a468-860a-4ca1-8843-b7cc9c5f5bd2) | Says where the data goes at the moment of upload: "Some of your data will be shared with OpenAI", with a privacy link. Offers a route for people without a CV file ("save your LinkedIn profile as PDF"). Skip is always there. | "in a snap" is hype for a step that may take a while. | visibility+, predictability+, learnability+ | web |
| Adaline | Onboarding: a 4-step form beside a live preview, then a "get started" checklist | [flow](https://mobbin.com/flows/3654ad7c-1f46-4e8c-82ff-4bacf066dd57) | The preview on the right fills in as the person types, so each answer visibly builds something. The checklist's first task is "Run your first prompt": choose a model, write, run, with the hint "You may need to create a provider if you don't have one". | Asks team size and "how did you hear about us" before any value. | feedback+, visibility+, learnability+, consistency+ | web |
| Retool | AI settings: a managed default already on, own providers listed below | [screen](https://mobbin.com/screens/fb50d9b9-96bc-4f79-ad46-c19672f1552c) | A working default is "Enabled" from the start. Other providers are a second, optional list with "Set up" on each row. A short "How it works" box names the default provider in three bullets. | Changing provider means pasting an API key, which Arpli's no-key rule rules out. | visibility+, predictability+, consistency+ | web |
| Matter | Guided setup: "Set up link saving", "Pin the extension", "Read on the go" | [flow](https://mobbin.com/flows/19d59829-9b91-4c18-a504-1d0f97f2ee93) | Installing the browser extension is a step inside first run, with a picture of exactly where to click in Chrome and an "I've pinned it" button. Every step has Skip. | | learnability+, visibility+, predictability+ | web |
| Linktree | Generating a bio with AI during onboarding | [flow](https://mobbin.com/flows/58dc18c7-43c1-4d0e-940b-96331caa6862) | AI is an optional button inside the field ("Write my bio"). It shows a writing state, then offers "Try again" and "Reset" back to the person's own text. The character count stays visible (66/80). | The result is generic and uses emoji ("Bringing ideas to life!"), the opposite of "sounds like me". | feedback+, predictability+, consistency+ | web |

**What this suggests for Arpli**
- Import could open first run, followed straight away by an editable view of what came in (Polywork, Adaline). The first useful result could be "here is your bucket", even before AI is connected.
- The "where your text goes" line could sit next to each action that sends text, as Remote does at upload, not only in settings.
- An AI path that works by default, with other providers as an optional list, is one way to keep "no keys" true (Retool). Which default to offer is the owner's call.
- Pinning the extension could be its own first-run step with a picture of the Chrome menu (Matter).

**AI moment.** Remote names the outside service in plain words at the moment data leaves. Linktree labels the field "Powered by AI" and keeps Reset next to Try again, so the person can always get back to their own words. Polywork shows a small "AI" tag on the editor sections where AI can help. None of the M1 references shows confidence or a "not sure" state.

**Owner review (2026-11-03): keep.** All five suggestions kept: start from what you have and land in an editable bucket; say where text goes at the moment it is sent; pre-select the AI found on the Mac, others optional, no keys; pinning the extension as its own step with a picture; always a way back to your own words. **Order: material first.** AI connects alongside, and the bucket sorts itself once AI is ready.

---

## M2 Saving something you found

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Savee | Browser extension panel: "Select your saves" | [screen](https://mobbin.com/screens/76d0a187-3c7b-4484-8a48-d0daf6091f35) | The extension shows what it found on the page and lets the person pick before saving. Two clear actions: "Save it", and "Screenshot" as a fallback. | Seen only on a marketing page, so the real panel states (saving, saved, failed) are not visible. | visibility+, predictability+ | web |
| folk | Chrome extension intro during onboarding | [screen](https://mobbin.com/screens/5e18aa68-462a-4cf7-a26b-dfd04b048ede) | The panel says "New contacts detected" and offers one action, "Add all to folk". "Download later" lets people skip without pressure. | Shows the extension reading LinkedIn, which Arpli can't do (02, section 9b). | learnability+, visibility+ | web |
| Dub | Link preview editor | [screen](https://mobbin.com/screens/e2c543ca-1008-4900-ba35-8079d7d7e8af) | Shows what was pulled from a link (image, title, description) as editable fields with counters and "Reset to default". The pulled values are a draft the person can correct. | | predictability+, feedback+, consistency+ | web |
| Glassdoor | Saving a job | [flow](https://mobbin.com/flows/2eef1381-cacf-4d36-b1cb-75866411d8e7) | One press on the bookmark. The toast says where it went ("saved in Your Activity on the Jobs page") and offers "View". | | feedback+, consistency+ | web |
| Mistral AI | Index a webpage | [screen](https://mobbin.com/screens/70c79169-1ce8-4d88-91a9-89c697880911) | A paste-a-link fallback with a check or error icon on each link and a helper line ("No need to include https://"). | | feedback+, learnability+ | web |
| Clay | Tracking companies for new job postings | [flow](https://mobbin.com/flows/d8b56a49-30df-404c-8bd9-7a1c9451ed54) | Watching a source is set up in steps: what to watch, how often, a preview of sample results. Afterwards a status line reads "Last checked for changes on 03/31", next to an on/off switch. | Shows credit costs per run. Built for sales teams, so it is dense. | visibility+, predictability+, feedback+ | web |

**What this suggests for Arpli**
- The capture panel could show what it pulled out (title, deadline, questions) as editable fields before saving, so a wrong deadline is caught at capture (Dub, Savee).
- The saved message could name where the item went and link to it, in one short line (Glassdoor).
- For LinkedIn and X, where the page isn't read and the person pastes text, the fallback could check each pasted link or block as it goes in (Mistral).
- "Watch my sources" (O12) could follow Clay's order: what, how often, a preview, then "last checked" on each source.

**Owner review (2026-11-03): keep.** All four suggestions kept. **Order: save first, check after.** One click saves; the panel then shows title, organisation, deadline and questions as editable fields. If no deadline is found, the panel says so and asks for one. Saving, saved and failed states are ours to design (no clipper reference found).

---

## M3 Facing a question

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Gemini Notebook | Sources panel and an answer with numbered citations | [screen](https://mobbin.com/screens/b102da47-7fa9-4356-8b85-493a5eab06e7) | The person ticks which sources the answer may use. Each sentence carries a small number that points back to one of them, and the input shows "8 sources". Close to "built only from your own material". | | visibility+, predictability+, consistency+, feedback+ | web |
| Glassdoor | AI fit check from your resume and the job description | [flow](https://mobbin.com/flows/3b4c2279-6620-41e0-a69d-68c50761ee91) | Names its inputs ("From your resume and the job description"), keeps a "Sources" fold under each answer, and asks the person to confirm a fact before going on ("Is this the right role for you?"), with quick-reply chips. | Overconfident wording ("aligns perfectly"). | predictability+, visibility+, feedback+ | web |
| Grammarly | Review suggestions panel | [screen](https://mobbin.com/screens/82d0d01f-8aa2-4fe4-a658-1498c92fb1ae) | Each change is one card: the original struck through, the proposed word, a choice between two words, then Accept or Dismiss. The person decides every change. | An "Overall score" turns writing into a grade. | consistency+, predictability+, feedback+, learnability+ | web |
| Confluence | AI "change tone" result box | [screen](https://mobbin.com/screens/048344a5-3f3c-4740-b41f-c8ca1e34b23f) | The draft stays in a box until the person picks "Insert below" (keeps the original) or "Replace". "Refine" and "Discard" sit beside them. A footer says "Uses AI. Verify results." | The "professional" tone made the text stiffer and less like a person ("delineates"). | predictability+, visibility+ | web |
| Workable | Generating a job description with AI | [flow](https://mobbin.com/flows/6d3aca22-72c6-471f-9570-c74d190f2649) | After a draft, a hint names what would improve it ("Add company description and industry to generate more precise results"). A counter checks the length rule ("Minimum 700 characters. 2463 characters used"). | The draft is long and generic. | feedback+, learnability+, visibility+ | web |
| ClickUp | Write with AI prompt | [screen](https://mobbin.com/screens/8ec8b6d4-6371-4a9c-9542-4710e9fd01eb) | Two plain dials sit under the prompt, "Default tone" and "Medium creativity", set before drafting. Close to Arpli's faithful / balanced / expressive dial. | The values are vague ("Medium") and don't say what changes. | visibility+, predictability- | web |

Eagle side notes (concept shots from X, not shipped products):
- An AI email-drafting concept asks a question before writing: "Would you like me to make this more formal ... or more casual ...?" ([source](https://x.com/tranmautritam/status/1966909489845858325/photo/1), Eagle item MIH4TA4PMACP7).
- An AI advisor panel states its scope: "Agent can access: No items have been selected. The entire knowledge base will be searched. Click to select" ([source](https://x.com/alexgilev/status/2010553630219211084/photo/1), Eagle item MKPJIMI0RM55O).

**What this suggests for Arpli**
- Each drafted answer could show which bucket items it used, as numbered marks the person can open, and let them untick an item before drafting (Gemini Notebook; the Eagle advisor concept).
- Drafts could arrive beside the person's own text, with "insert" and "replace" as separate choices, so nothing they wrote is lost (Confluence).
- When the bucket is thin for a question, a hint could name what to add, as Workable asks for a company description, instead of padding the draft.
- The real form's word or character limit could sit under every draft (Workable).

**Owner review (2026-11-03): keep, with two additions.** Kept: numbered marks to the bucket items a draft used, untick before drafting; the draft arrives beside your own text with insert and replace as separate choices; the form's limit under every draft. Added: "check this" sits on the exact claim that can't be traced to the bucket, never a general footer (ours to design); the faithful / balanced / expressive dial uses plain labels that say what changes. **When the bucket is thin: ask first.** Arpli asks one or two short questions, then drafts; the answers are kept in the bucket for reuse. The story-interview prototype (D3) shows how far to take this.

**AI moment.** Gemini Notebook shows sources sentence by sentence. Glassdoor shows sources per answer and stops to ask when a fact about the person is unclear. Confluence, and Remote ([screen](https://mobbin.com/screens/44344cb5-9817-4d0e-b696-e8ba936b2f82): "Remote AI may produce inaccurate information", with "Try again" and "Use this"), use a general footer rather than a flag on the line in question. Mural ([screen](https://mobbin.com/screens/9e283d2c-0f7b-450c-b374-654aa8fb7f12)) writes "I have generated 5 product ideas ... Please verify", which puts the machine in the author's seat; the tone guide rules this out. Databricks ([screen](https://mobbin.com/screens/76636fc9-3d0b-42a2-9553-b4ea2e0a2641)) labels text "AI Suggested Description" until the person presses Accept or Edit. No reference flags a single claim as "check this" or shows a "not sure" state at sentence level.

---

## M4 Filling a real form

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Workable | Applying for a job: overview, resume autofill, review, submitted | [flow](https://mobbin.com/flows/76f8fb62-a63f-4c57-8d11-842af8ef3d7c) | After autofill a banner asks the person to "review the information we have filled in below". Each section has its own "Clear". The confirmation says a copy goes to the applicant's email. | This is the site's own autofill, not a helper on top of another site. "Autofill completed!" uses an exclamation mark. | feedback+, predictability+, visibility+ | web |
| Semrush | AI chat side panel next to an editor | [screen](https://mobbin.com/screens/b49a82b8-6a1c-476a-a8e3-95626a2e96c5) | Text stays in the side panel until the person picks "Copy text" or "Paste at editor cursor". Copy is always one of the two. | | predictability+, consistency+ | web |
| Fabric | AI side panel with a context chip | [screen](https://mobbin.com/screens/9b66e650-9685-46e2-bbea-31d947022c73) | The input shows what the panel is looking at ("Current file + 1 item"), so the person knows what the AI can see. | | visibility+, predictability+ | web |
| Behance | Apply with your Behance profile | [screen](https://mobbin.com/screens/1792ac5c-49d9-4839-b6a0-965ccb2dfd06) | Before submitting, the dialog shows exactly what will be sent: a profile preview on the left, an editable message on the right, then one "Submit Application" button. | The prefilled message is generic. | visibility+, predictability+ | web |
| Rakuten | Setting up autofill | [flow](https://mobbin.com/flows/73ae3eec-db88-4ec6-93ad-ac3ae8512510) | The details behind autofill are a short list by type (personal, contact, addresses, cards), each editable, with "Learn how we keep your data safe" on every screen. | | consistency+, visibility+ | mobile only |

**What this suggests for Arpli**
- After a Fill, the side panel could say what it filled and ask the person to look it over before Submit (Workable).
- Every drafted answer in the panel could keep Copy next to Fill, so a field that can't be filled still takes one press (Semrush).
- The panel could name the page and form it is reading at the top, so a mismatch is easy to spot (Fabric).
- A last "this is what you are sending" view is worth testing against the extra step it adds (Behance).

**Owner review (2026-11-03): keep, with one addition.** Kept: the panel names the page and form it is reading; Copy always next to Fill; after filling, the panel says what it filled and asks the person to look over the form before Submit; a final "this is what you're sending" view, tested in the prototype. Added: fields Arpli couldn't read or skipped are listed plainly (ours to design). **Filling: standard fields together, answers one by one.** One press fills name, email, phone, links and CV; each written answer is filled on its own after the person has read it.

**AI moment.** Workable reports what was filled and hands the check to the person. Semrush never writes into the page without a press. Fabric shows the AI's context. None of them shows which fields were not understood or were skipped; that state was not found.

---

## M5 Adding to your bucket

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Delphi | Add knowledge picker | [screen](https://mobbin.com/screens/be47c4f3-c583-42dd-aa9e-ba00d7cbc670) | One entry for every kind of input (file, quick note, Q&A, URL, video, podcast) plus "Drag and drop anything". A failed item says why ("No speech detected in audio"). A toast confirms "Added to your mind". | The "training your mind" framing. | consistency+, feedback+, learnability+ | web |
| Voicenotes | Voice notes list with Record | [screen](https://mobbin.com/screens/65c37ba9-b052-450f-9fc8-273e3af7e5a5) | Each note keeps the audio, the transcript and tags together. Record sits at the bottom of the view. The cleanup instruction says to "preserve the original meaning", and the page says "All notes stay private by default". | | visibility+, consistency+, predictability+ | web |
| Mistral AI | Memories list | [screen](https://mobbin.com/screens/b2c011be-a7e2-4b9d-a63b-86908762ef26) | Everything the assistant keeps about the person is a plain, dated list of statements, with a "Type to add a new memory" field at the top and Import. Each item can be edited ([edit dialog](https://mobbin.com/screens/a9e9be74-1c75-4d11-b215-824efa2b9738)). | The items are written in the assistant's words, not the person's. | visibility+, predictability+, feedback+ | web |
| Dovetail | Suggested highlights on interview text | [screen](https://mobbin.com/screens/0d5151ab-6ade-47f5-8b03-024571200782) | The AI marks passages in the person's own words instead of rewriting them. Each suggestion can be accepted, tagged or rejected, one by one or all at once. | | predictability+, feedback+, consistency+ | web |
| Calendly | Import: "What should we do with duplicates?" | [screen](https://mobbin.com/screens/13df76e6-5cfa-426a-bb79-c65a8117153e) | When an import overlaps with what is already there, three choices are spelled out (merge, skip, override), with one marked "Recommended". | | predictability+, learnability+ | web |
| Emergent | Memory: name and personality | [screen](https://mobbin.com/screens/81c96d36-ca15-4787-a22b-1ab7830e03b8) | A short "personality" list ("kind", "straight to the point") that the person writes and edits, saved to shape later answers. | | visibility+ | web |

**What this suggests for Arpli**
- One "add" entry that takes a file, a link, a note or a voice ramble, with drop anywhere, could keep capture to a few seconds (Delphi).
- Voice items could keep the recording and the transcript together, so the person can check a claim against what they actually said (Voicenotes).
- A story ramble could become suggested highlights of the person's own sentences, accepted one by one before anything is rewritten (Dovetail). This links to O3, the story interview.
- Importing a second CV into an existing bucket needs a clear duplicates choice (Calendly).

**Owner review (2026-11-03): keep.** All suggestions kept: one "add" for file, link, note or voice, with drop anywhere; voice entries keep the recording with the transcript; a ramble becomes suggested highlights of the person's own sentences, accepted one by one; a second CV import asks what to do with overlaps, one choice recommended; everything Arpli knows is one plain, editable list. **The bucket holds the person's own words as they are.** Arpli adds only a short title and tags for finding things; no rewritten summaries.

---

## M6 Keeping track

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Mercor | Applications list | [screen](https://mobbin.com/screens/1ac1f719-f20f-4666-9a42-d32cf7013008) | A list, not a board. In-progress applications show "3 of 5 steps completed" and a start date. "Submitted applications (6)" folds below with submit dates. Tabs for Applications, Saved and Offers carry counts. | | visibility+, consistency+, predictability+ | web |
| Peerlist | Jobs: Jobs, Saved and Applied tabs | [flow](https://mobbin.com/flows/54d9cafd-49c2-4c06-9054-303e432b7641) | Three plain tabs match the person's stages. The empty Saved tab is calm and says what to do: "You haven't saved any jobs yet. Take your time ...". | The empty-state line ends with an emoticon. | learnability+, consistency+ | web |
| HoneyBook | Projects board with a sample card | [screen](https://mobbin.com/screens/20ce2564-980f-4d8e-baa0-8e99b794c323) | Columns carry counts. A card marked "[Sample]" shows what a filled card looks like, so the empty board teaches itself. | Column names are business stages, not the person's words. | learnability+, visibility+ | web |
| Jobber | Schedule grouped by time | [screen](https://mobbin.com/screens/b46a69ca-3ff1-4bad-81cd-fe9ca82f75d4) | Groups: Unscheduled, Overdue, Today, Tomorrow, This week. Items with no date have their own place instead of disappearing. | | predictability+, visibility+ | web |
| Trello | Due date with a reminder | [screen](https://mobbin.com/screens/f73fecb8-2b9b-484e-b337-041373054803) | The reminder is set in the same place as the date, relative to it ("1 Day before"), from a short list. | Minute options (5, 10, 15 minutes before) are noise for application deadlines. | consistency+, predictability+ | web |
| Unity | Bookmark with a reminder | [screen](https://mobbin.com/screens/9a1acb9a-2ce5-45ab-becc-91c5af7a8a7e) | Confirms in one sentence when the reminder will arrive ("will be sent today at 6:00 pm"). Presets show the real time beside the label ("Tomorrow, Tue 8:00 am"). | | feedback+, predictability+ | web |

Eagle side note (concept shot from X, not a shipped product): an "Urgent tasks" list shows the time since the last action under each follow-up ("link sent 24h ago, no booking") ([source](https://x.com/nickbakeddesign/status/1953264852258177402/photo/1), Eagle item MEI6NGBZW2UQX).

**What this suggests for Arpli**
- A list split into "in progress" and "submitted", with steps done per application, may suit a handful of live applications better than a board (Mercor). A board is the alternative to test.
- Deadlines could group as no date, overdue, this week and later, with "no deadline" kept visible (Jobber).
- Each reminder could be set relative to the deadline and confirm in one sentence when it will arrive (Trello, Unity).
- Overdue items need a calm treatment. ClickUp's inbox ([screen](https://mobbin.com/screens/bc8a4bb6-6f82-4001-a0d4-4ffa237149fd)) repeats "Task is overdue" in red down the page, which would break the Steady voice.

**Owner review (2026-11-03): keep, with a change.** Kept: progress shown per application ("3 of 5 answers drafted") with submitted ones below; deadlines grouped as overdue, this week, later and no deadline; reminders set next to the deadline, relative to it, confirmed in one sentence with the real time, arriving as Mac notifications; calm overdue treatment; empty states that say what to do or show a sample; adding an application sent elsewhere in a few seconds. **Changed: the person can switch between a list and a board.** The list, sorted by deadline, is the default; the board has columns per stage.

---

## M7 Reusing and adapting what you've written before

Added by the owner during this step: take answers and stories written for one application and adapt them for another, with a light touch or a bigger rework.

| Product | Screen or flow | Link | What to take | What to avoid | Lenses | Platform |
|---|---|---|---|---|---|---|
| Semrush | Review your content: original and new side by side | [screen](https://mobbin.com/screens/ed82aafc-c4dc-442d-87fc-359f7347f940) | Original on the left, new on the right, changes marked in both. Two equal exits: "Keep original version" and "Continue with new version". | Adds a "content score" against an industry average. | visibility+, predictability+, feedback+ | web |
| Langdock | Inline edit in a canvas | [screen](https://mobbin.com/screens/879416cc-ee0b-42c9-999b-3f829c041b12) | The change shows inside the text: removed words in red, new words in green, with a tick and a cross on each change. Suits small adaptations. | | visibility+, predictability+, feedback+ | web |
| Plain | Snippets inside a reply, with similar threads | [screen](https://mobbin.com/screens/4466bdeb-e7c0-4953-8a92-bd9e11afe69b) | Saved text is picked from inside the composer. A placeholder such as `{{tracking_link}}` marks the part that must change each time. The side panel lists "Similar threads (2)". | | consistency+, learnability+ | web |
| Gorgias | Suggested macros under the reply box | [screen](https://mobbin.com/screens/6131548f-fab0-4442-b26f-511d6db9e43c) | Relevant saved answers appear as chips under the field ("Suggested macros") and can be searched by name, tag or body. | | visibility+, learnability+ | web |
| Superhuman Mail | Snippets list with usage | [screen](https://mobbin.com/screens/7cfbd651-0716-4d32-838b-d5b25836ad34) | Each saved snippet shows how often it was sent and when it was last sent. | Open and reply rates mean nothing for applications. | visibility+ | web |
| Grammarly | Plagiarism and AI text check | [screen](https://mobbin.com/screens/c07a37f6-4102-4c74-8ac4-b5dba33619e2) | Underlines the passage that matches a source, names the source, and sums it up ("6% of your text matches external sources"; "We didn't detect common AI text patterns"). | Checks against the web and academic databases only, not against the person's own past answers. | visibility+, feedback+ | web |

Also seen: Air ([screen](https://mobbin.com/screens/ac2d76ce-872c-4bfc-959f-38c97719f1c1)) asks "Stack as new version" or "Upload as separate item" when a file already exists. Snowflake ([screen](https://mobbin.com/screens/87a5cccb-7753-4fa7-9055-5dc353f26380)) lists past versions with "Compare with current version". Cake Equity ([screen](https://mobbin.com/screens/a1cf0641-eb04-47ab-baa5-6df14b0be908)) colours each variable in a template so the parts to change stand out.

**What this suggests for Arpli**
- A past answer could be offered under the new question as a chip ("you wrote something similar for X"), rather than inserted on its own (Gorgias, Plain).
- An adapted answer could open side by side with the original, changes marked, with "keep the original" and "use the new one" as equal choices (Semrush), or inline for a light touch (Langdock).
- Each story could show where and when it was used, which also tells the person when the same words are about to go to the same funder twice (Superhuman).
- A similarity check against the person's own past answers, in the spirit of Grammarly's external check, could warn before a programme that checks for "patterns of similarity" sees near-identical text. No reference does this against one's own history.

**AI moment.** Semrush and Langdock show exactly what the AI changed and let the person accept each change. Featurebase ([screen](https://mobbin.com/screens/b77f1847-fa3a-48c8-a46f-96cf53abea6f)) offers a draft "in your tone and style" from a knowledge base, but the screen doesn't show which past replies it drew on. Grammarly is the only reference that reports how much of a text matches something else.

**Owner review (2026-11-03): keep.** All five kept: a past answer offered under the new question as a quiet suggestion, never inserted on its own; three ways to reuse (use as is, adjust lightly with changes shown inline, rework side by side with equal "keep the original" and "use the new one" choices); the parts that must change (organisation, programme name) highlighted; each answer shows where and when it was used; a gentle warning before nearly the same words go to the same kind of programme (ours to design). **Past answers appear automatically,** as a quiet suggestion that is easy to ignore.

---

## Gaps

- **M4 filling a real form is the thinnest.** Mobbin has no browser-extension side panels over another site, no in-page Grammarly, and no password-manager dropdown on a form field. The password-manager search returned one NordPass vault screen, and the only autofill flow found is iOS (Rakuten). The references are in-app side panels and a site's own autofill. A hands-on look at real Chrome extensions would fill this; these tools can't do it.
- **M2 has no real web clipper.** Notion Web Clipper, Pocket, Raindrop, Simplify and Huntr did not come up. Extensions appear only on marketing or onboarding screens (Savee, folk, Matter), so their saving, saved and failed states were not seen.
- **M6 has no job trackers.** A search for Huntr returned other apps. The references come from CRMs, task apps and two job sites (Mercor, Peerlist).
- **M3 has no claim-level flags.** Products warn with a general footer ("Verify results", "may produce inaccurate information"). None flags one claim as "check this" or shows a "not sure" state on a line. Gemini Notebook's citations come closest.
- **M7 has no warning about reusing your own words.** Grammarly checks against outside sources only. No product compares a new answer with the person's own past answers, or warns that a programme may check for similarity.
- **Eagle.** The library answered every search, but matches were mostly concept shots from X with low match scores. Three are used as side notes (M3, M6). None fit M1, M2, M4, M5 or M7.
- **Platform.** Almost everything is desktop web. Mobbin's search covers iOS and web only, so native Mac conventions (menu bar, system notifications for reminders) are not covered here.

---

## Step 1 decisions (owner, 2026-11-03)

| Moment | Decision inside the moment |
|---|---|
| M1 First run | Material first; AI connects alongside and the bucket sorts itself once AI is ready |
| M2 Saving | Save first, check after; ask for a deadline when none is found |
| M3 Facing a question | When the bucket is thin, ask one or two short questions first; answers are kept in the bucket |
| M4 Filling a form | Standard fields filled together; written answers one by one, after reading |
| M5 Bucket | The person's own words kept as they are; Arpli adds only a title and tags |
| M6 Keeping track | List and board, switchable; the list sorted by deadline is the default |
| M7 Reuse | Past answers suggested automatically, quietly, never inserted on their own |

**Ours to design (no reference found):** the extension panel on top of another site's form, fields Arpli couldn't read, "check this" on a single claim, the warning on reusing your own words, the clipper's saving / saved / failed states, native Mac conventions.

---
**Handoff**
- Output: `design/04-explore.md` (Explore step 1: patterns)
- Status: approved by the owner, moment by moment, 2026-11-03
- Confidence: High that the references exist (each one came from a Mobbin search result); Med on fit, since M4 and the Mac have thin references
- Next: Explore steps 2 to 4, the whole journey and flows (DEE-85 / `arpli-rln.9`), built on these decisions
