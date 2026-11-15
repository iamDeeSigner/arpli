# 07 · Reference: T3 Code · what Arpli can take

**Date:** 2026-11-09 · **Shared by:** the owner ("I even like some of their design patterns") · **Repo:** github.com/pingdotgg/t3code (last commit 2026-11-09) · **Cloned to:** `references/t3code` (ignored by git; read only, nothing run; 564 MB, about 32,000 files)
**Licence: MIT** ("Copyright (c) 2026 T3 Tools Inc."). Code may be reused if the notice is kept, the same rule as beads and jev-job-search.
**Read:** README, `AGENTS.md`, the welcome wizard, providers, permission modes, sidebar, usage, voice input, devices, background service, telemetry, triage and remote-access user docs, the provider constraints doc, parts of the provider code, and the marketing screenshot of the desktop app (`apps/marketing/src/assets/app-desktop.webp`). The web app's interface code was swept by a helper; its findings are in section B, each with its file.
**Confidence:** High that each pattern exists (read in docs or code). We have one screenshot and no running app, so how things feel in use is not checked.

---

## What it is, in one paragraph

A desktop app (Electron), web app and phone app for people who run coding agents all day. It works with the AI subscriptions people already have (Claude Code, Codex, Cursor and others): "If they're set up on your computer, T3 Code can control them." It is free, open source, and its makers say it has over 500,000 users. It is a different job from Arpli's, but it solves several of our problems at scale: using AI people already have, showing AI work in progress calmly, a list of things in different states, a first-run setup, and pairing other devices.

**The look** (from the screenshot): dark, quiet and typographic. A sidebar of conversations, each with a small project badge, a title, a time ("7m", "2h") and a status in words ("Done", "Waiting 18s"). Below the list, two folded sections with counts: "Working 1" and "Settled 43". The main panel shows a short summary line ("Worked for 20s"), a live line ("Waiting on 4 subagents ... Stop"), and one input at the bottom ("Ask anything. @ files, $ skills, / commands") with the AI in use shown on a chip ("Opus 5.5 High"). No decoration; status is carried by words and time.

---

## A. Patterns from the docs and the screenshot

Ranked by how much each would help Arpli.

| # | What T3 Code does | Where it helps Arpli | Take |
|---|---|---|---|
| A1 | **A list that sorts itself by who needs whom.** Conversations where the AI is working fold into a collapsed **Working** section; one "returns to the top of the active list when it finishes, fails, or needs an approval or answer". The active list is ordered "by when each thread last came back to you". Finished work goes to **Settled**, folded, with a count. (`docs/user/thread-sidebar.md`, screenshot) | **P4 Applications and Needs you.** Applications where Arpli is busy (drafting several answers, reading a form, checking a source) fold into "Working"; each comes back to the top when it needs you. Submitted and closed ones fold into a counted shelf, like "Settled 43". This fits M6 (list by deadline) as the order inside each part. | idea |
| A2 | **Every way in has a way out, and undo instead of "are you sure?".** Pin and unpin, settle and un-settle, snooze and wake, archive and restore. Each change shows a notification with **Undo** for five seconds. Their rule for contributors: "If you added a way in, add the way out and the way to see it ... A one-way door is a bug." (`thread-sidebar.md`, `AGENTS.md`) | **P4, P5 and everywhere.** "Not for me" needs "bring it back"; add **Snooze** ("remind me next week") with **Wake**; undo for a few seconds rather than a confirm dialog for anything that can be undone. Confirm dialogs stay for what can't (delete everything). | idea |
| A3 | **Status in plain words, with time, and never a lying spinner.** "Waiting 18s", "Worked for 20s", "4 working", "Done". Their rule: "Our users ... notice a dropped frame, a lying spinner, and a stale label. No continuously repainting animations." (screenshot, `AGENTS.md`) | **Every AI moment** (the AI overlay asks for named status states) and our Taste ("no spinning spinners, no pulsing dots"). Arpli says what it is doing and for how long: "Reading the form · 4s", "Drafting 2 of 5 answers", "Drafted in 12s". | idea |
| A4 | **The AI in use, shown where you use it.** A chip next to the send button names the model and its effort. A thread on a non-default permission mode shows the mode next to the model. (screenshot, `permission-modes.md`) | **P6 Answer a question.** Next to Draft: which AI writes ("Claude on this Mac") and the help level for this opportunity. It is "where your text goes" at the moment of use (M1), and the AI help level made visible. | idea |
| A5 | **Levels of permission, chosen per conversation, with a default in Settings.** Supervised · Auto-accept edits · Auto · Full access. An administrator can cap the levels. (`permission-modes.md`) | **O2 AI help levels** (fields only · you draft, Arpli refines · Arpli drafts from your words) work the same way: set per opportunity, default in Settings, shown at the point of use. Also the natural home for the owner's "Send it for me" idea after v1: one more level, off by default. | idea |
| A6 | **First-run setup as steps you can leave and come back to.** A progress bar; go back to any step; close setup and do the rest later from Settings or by reopening it. It checks for the AI tools on the machine and, when one is missing or signed out, offers one action that fixes it. It never replaces settings it can't read with defaults; it says "Could not read settings" with **Retry**. (`docs/user/welcome-wizard.md`) | **F1 First time and P1.** Steps with a way back and "later"; one fixing action per missing piece; honest failure words. For our audience the fix can't be "a terminal with the command ready"; it has to be a button or a short guide. | idea |
| A7 | **It imports what you already did with your AI.** Setup finds the folders where Claude Code and Codex were used and offers to bring in recent conversations, best effort, with clear limits. (`welcome-wizard.md`) | **O1 "pour in what you have"** and Frame's switching cost 2: past essays often sit "in Docs and old ChatGPT chats". Arpli could offer to read a ChatGPT data export, or past Claude conversations, and suggest the person's own answers and stories from them, each accepted one by one (M5). New idea; for the product lead. | idea |
| A8 | **Checking never has side effects.** "Setup must not happen as a health-check side effect": checking whether a provider is there must not open a session, start MCP servers, run hooks or launch a sign-in browser. Opening a panel "does not download or start anything". (`docs/internals/providers.md`, `devices.md`) | **O6 first run** and the engineer's detection of Claude Code and ChatGPT on the Mac. Looking must never start anything. A rule for the spec. | idea |
| A9 | **Where data goes is chosen once, and never quietly changed.** Voice: "Nothing is sent until you choose one ... If the chosen environment goes offline, voice input waits for it. T3 Code never substitutes another environment." (`docs/user/voice-input.md`) | **Part 3, AI unavailable.** If your chosen AI is offline or out of usage, Arpli waits and says so; it never switches to another AI on its own, because that would send your words somewhere you didn't choose. | idea |
| A10 | **Honest AI limits.** When a subscription runs out mid-task, the conversation "shows which limit was reached and the remaining wait when Claude provides a reset time". A Usage page shows use per AI, clearly labelled as an estimate and "not your subscription bill". (`providers-claude.md`, `usage.md`) | **Part 3**: "Your Claude plan has hit its limit. It resets at 14:00." with "wait" or "switch AI" as the person's choice. | idea |
| A11 | **Pairing with a one-time link or code, remembered after.** "Pairing authorizes that device for future connections. Use a fresh one-time link" for each new device. (`docs/user/remote-access.md`) | **P11 Pair** (the Chrome extension with the Mac app): a one-time code, remembered after, "pair again" in Settings. Confirms our plan. | idea |
| A12 | **Report a problem with your own AI.** "Triage an issue" opens a conversation where the person's own agent reads the logs, checks known issues and helps write a good GitHub issue. "It asks before it applies a fix or posts anything." (`docs/user/triage.md`) | **Open source support, after v1.** "Report a problem" that drafts an issue with personal details stripped, and asks before posting. | idea |
| A13 | **Runs in the background, and removing it keeps your data.** A background service keeps T3 Code running with no window; "Uninstalling the service leaves your projects, threads, and settings intact." (`background-service.md`) | **P13 menu bar**, reminders and source checks while no window is open. | idea |

**One thing not to copy:** product usage data is **on by default** and turned off through a setting in the shell profile (`telemetry.md`). Arpli's rule is opt-in. Their list of what is never included ("prompts, responses, file contents, authentication tokens ...") is still a good model for how we say it.

---

## B. Interface patterns from the code

From a helper's read of `apps/web/src` (paths below are under it). Spot-checked against the source: the status order, the AI connection states, the Stop stages, the undo notice and the quoted copy all match. Picked for Arpli; code-editor features left out.

| # | What T3 Code does | Where it helps Arpli |
|---|---|---|
| B1 | **One status per item, picked in a fixed order:** "Pending Approval", "Awaiting Input", "Working" (the only one that pulses), "Connecting", "Waiting", "Failed", "Plan Ready", "Completed". "Failed" and "Completed" show only until the person has seen them. A coloured dot plus a word, never colour alone. (`components/Sidebar.logic.ts`, `components/ThreadStatusIndicators.tsx`) | **P4 Applications**: one status word per row, in a fixed order of who needs whom. A working order: needs you · not sure it went through · Arpli is working · due soon · drafting · ready to send · submitted. Done states fade once seen. |
| B2 | **Asking before acting:** two main buttons ("Decline", "Approve"); rarer choices ("Always allow this session") behind "More approval options"; a risky choice carries a warning icon and tooltip. Each kind of request has its own label. (`components/chat/ComposerPendingApprovalActions.tsx`) | **P10, the per-field yes** for attestations, consent and other sensitive fields: "Fill" and "Skip" up front, "Always use this answer" behind "More". |
| B3 | **Stopping in stages:** Stop → "Stopping" with a timer → "Agent not responding to Stop: It may be short on memory. Force stop kills its processes." → **Force stop** → if that fails, a toast says so. (`components/chat/ThreadActivityBanners.tsx`) | **P6 drafting**: Stop is always there while Arpli drafts, and every stage after it says what is true. |
| B4 | **Progress that is cheap and spoken.** "Working for 0:12" ticks without redrawing the screen; a polite screen-reader message announces "Needs approval", "Needs your input", "Done", "Failed", "Stopped". (`lib/tickTextContent.ts`, `components/chat/threadActivityAnnouncement.ts`) | **Every AI moment**, and our accessibility pass: status changes are announced, not only shown. |
| B5 | **Undo, five seconds, with ⌘Z** ("Archived 3 threads", "⌘Z to undo") instead of a confirm dialog. (`hooks/showThreadUndoNotice.ts`) | Same as A2. |
| B6 | **No browser pop-ups.** Real confirmations use the app's own dialog, queued one at a time; lighter ones use a two-click button that disarms after 3 seconds, on Esc or on a click elsewhere. (`confirmDialog.ts`, `components/pullRequest/useInlineActionConfirm.ts`) | Our DesignSystem rule (no `alert()` or `confirm()`), plus the two-click button for middle-risk actions such as "Remove this source". |
| B7 | **Toasts that respect attention:** their timer runs only while the window is in front; an ongoing problem is one toast that updates ("Some requests are slow") rather than a pile. (`components/ui/toast.tsx`) | **Part 3**: a slow AI or a dropped connection is one updating line, not a stack of errors. |
| B8 | **Finding the AI already on the machine, in six states:** checking · disabled · install · attention · sign in · ready. Lines such as "Checking provider status", "Not found", "Not authenticated", "Needs attention", "Authenticated · Max", and version warnings ("Update available", "Unsupported version"). When ready: "Ready to code." (`onboarding/providerReadiness.logic.ts`, `components/onboarding/WelcomeWizard.tsx`) | **P1 and O6**: the same six states for "the AI on this Mac", in our voice ("Claude is on this Mac and signed in (Max)", "ChatGPT isn't signed in yet", "Sign in"). Their fix opens a terminal with the command typed; ours must be a button or a short guide. |
| B9 | **A checklist for Mac permissions:** each row has "Allow", which becomes "Allowed" with a tick; the status is checked again when the window comes back into focus, so it updates after the person returns from System Settings. (`components/permissions/PermissionChecklist.tsx`) | **P1**: notifications (reminders) and the microphone (voice notes). Re-checking on return is the detail to keep. Unlike theirs, our Continue never waits on an optional permission: "Not now" is always there. |
| B10 | **Empty states in three sizes** (compact, default, hero), each naming the next step: "Pick a thread to continue", "What should we work on? Add a project to start your first thread." (`components/ui/empty.tsx`) | **Every list in Arpli**, and our Taste rule: empty states invite a specific next step. |
| B11 | **Connection shown as a dot and a word:** green connected, amber connecting, red error, with "Reconnecting: (reason)" or "Offline". (`components/ConnectionStatusDot.tsx`) | **The engine and the extension**: "Paired", "Reconnecting", "Arpli's engine isn't running" (part 3). |
| B12 | **Snooze with presets** and a custom time ("Choose a valid date and time in the future."); settle and wake. (`components/Sidebar.snooze.ts`, `components/CustomSnoozeDialog.tsx`) | **P4/P5 Snooze** (A2). |
| B13 | **Notifications by type,** each with its own title and an "Open" action: "Thread completed", "Approval needed", "Usage limit reached", "Thread failed", "Input needed". Modes: Off · Notifications only · Sound only · Notifications with sound. A count badge on the Dock, capped at "9+". (`threadNotifications.ts`) | **P12 Reminders and P13 menu bar**: titled by type ("Due in 2 days", "Needs you", "Not sure it went through"), with "Open"; the Dock and menu bar show how many things need you. |
| B14 | **Questions from the AI, in a small panel** with a count ("1/2") and "Dismiss question without answering". (`components/chat/ComposerPendingUserInputPanel.tsx`) | **M3, ask first when the bucket is thin**: "1 of 2" with "Skip and draft anyway". |
| B15 | **Settings that are easy to undo:** search; "Reset to default" appears only on a setting you changed; "Restore default settings?" lists exactly what will reset; text saves when you leave the field. (`components/settings/settingsLayout.tsx`, `components/ui/draft-input.tsx`) | **P8 Settings.** |
| B16 | **A command palette (⌘K)** grouped into Suggestions, Threads, Projects, Settings, In messages, Actions; ">" narrows to actions. (`components/CommandPalette.tsx`) | **Later, for heavy users**: jump to an application, a bucket item or an action ("Add to bucket"). Not a v1 need. |
| B17 | **Layout:** a resizable sidebar that remembers its width and always leaves 640 px for the main area; a right panel that becomes a pop-over below 980 px; a tab that can't be used yet says why ("Side chats start after the first message."); panel animation is off by default and off under reduced motion. (`components/threadSidebarWidth.ts`, `rightPanelLayout.ts`, `components/RightPanelTabs.tsx`) | **The Mac app shell (step 5)**. |
| B18 | **Tokens and accessibility:** colour roles with matching text and surface variants for success, warning, error and info; a **contrast slider** that pushes text and borders toward black or white; support for forced colours and reduced motion; animations that step through a few frames instead of repainting. (`index.css`, `appearanceContrast.ts`) | **Polish & QA**: the contrast slider is a cheap, real help for low vision and tired eyes late at night (our floor user). |
| B19 | **One name per action:** a command's label, tooltip, menu wording and accessible name must describe the same action on the same thing. (`docs/internals/consistency-action-names.md`) | **Voice and copy**: a rule for our specs. |

---

## Proposed changes for Arpli (for the owner)

1. **Applications sort by who needs whom.** Needs you at the top, "Arpli is working" folded with a count, finished ones on a counted shelf; one status word per application, in a fixed order. (A1, B1)
2. **Undo instead of "are you sure?",** and every way in has a way out: "Not for me" and "Bring it back", **Snooze** and **Wake**. Confirm dialogs only for what can't be undone. (A2, B5, B6, B12)
3. **AI work in plain words with time,** Stop always there, nothing that spins without saying what it's doing. (A3, B3, B4)
4. **Which AI writes, and the help level, shown next to Draft.** (A4, A5)
5. **"The AI on this Mac" card with clear states** (checking, not found, sign in, needs attention, ready "Signed in · Max"). Checking never starts anything; if your chosen AI is unavailable or out of usage, Arpli waits and says when it's back, and never switches to another AI on its own. (A8 to A10, B8)
6. **Reminders titled by type, with "Open",** and a count of what needs you on the Dock and the menu bar. (B13)

**Owner decision (2026-11-09): all six taken.** Applied to `05-journey.md` (part 1 rules, P1, P4, P5, P6, P8, P12, P13; F1 step 6; R2) and to `Taste.md`.

**A new idea for the product lead (not a change to the map):** bring in what you already wrote with ChatGPT or Claude, from a data export, as suggested lines for the bucket, accepted one by one (A7).

---

## Rules from their AGENTS.md worth keeping

- "Fight for the smallest model that makes the correct behavior unsurprising." Fight scope creep.
- "Hit every surface": a thing you can do from the main view is usually also reachable from Settings, the command palette and a shortcut.
- "UI components own their look. Pick a variant or size; do not restyle one with className." Our DesignSystem.md says the same in other words.
- No continuously repainting animations; no lying spinners; no stale labels.

---
**Handoff**
- Output: `design/07-reference-t3code.md`
- Status: reviewed (owner, 2026-11-09: all six changes taken; the import idea logged in `05-journey.md`, ideas)
- Confidence: High on the patterns (docs and code, spot-checked); how they feel in use is not checked (one screenshot, no running app)
- Next: the part 2 review of `05-journey.md`
