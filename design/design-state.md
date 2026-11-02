# Arpli

**Track:** custom route, based on T1 New idea, with new primary research skipped (see Decisions) · **Depth:** deep · **AI overlay:** on
**Started:** 2026-11-02 · **Last updated:** 2026-11-02
**Build path:** AI-build. Claude develops working screens on the current design system (the Intent UI kit and tokens in `apps/desktop`). How things work comes first; visual and interaction polish comes later.
**Product / user:** a local-first Mac app plus a Chrome extension that helps people apply for opportunities (jobs, internships, scholarships, fellowships, grants, accelerators, pitch competitions), from bringing an opportunity in, to drafting, to submitting and tracking · students, founders, researchers, job seekers
**Done looks like:** a `.dmg` the user installs on their Mac, a working Chrome extension, and the user plus about 20 real applicants using Arpli to apply to and track real opportunities.
**Appetite:** to confirm (hours per week and target date)
**Riskiest assumption:** to pick in Frame. Candidates: (a) non-technical applicants will connect an AI model themselves; (b) Arpli can read real application forms well enough to be worth using.

## Route
Frame → **G1** → Choose the bet (v1 scope) → **G2** → Explore (how it works) → Build a working prototype → Test with 3 to 5 of the 20 → **G3** → Spec → Build v1 → Polish & QA (brand docs applied here) → Release (`.dmg` + extension) → Measure with the 20 → **What next?**

## Modules
| Module | Status | Output | Notes |
|---|---|---|---|
| Intake | done | this file | 2026-11-02 |
| Frame | done (G1: GO with edits) | 01-preplanning.md | built from existing docs, the code read, three desk-research threads and the Dossier reference; no new interviews |
| Research plan · Collect · Synthesize | skipped | — | user decision; existing docs used as evidence and labelled as assumptions |
| Prioritize (v1 scope) | done (G2: GO) | 02-opportunity.md | bet: "a bucket that writes like you, on real forms" |
| Explore (how it works) | next | numbered when produced | flows, system map, breadboards, error paths; directions as coded prototypes; screens stay loose |
| Build prototype | todo | code in `apps/` | on the current design system |
| Test | todo | numbered when produced | 3 to 5 of the 20 real applicants, plus an AI model check on real forms |
| Spec | todo | numbered when produced | |
| Figma | todo | Figma file | user will set up the file; `Arpli.pen` is empty |
| Build v1 | todo | code | |
| Polish & QA | todo | numbered when produced | apply `docs/brand` (colour, type, motion, voice) |
| Release | todo | `.dmg` + Chrome extension | added for this project; not a standard Design OS module |
| Measure | todo | numbered when produced | with the 20 applicants |

## Gates
| Gate | Date | Decision | Reason |
|---|---|---|---|
| G1 Worth it? | 2026-11-02 | GO with edits | open ground found (cross-type, local, open source, "sounds like me"); the five edits in 01-preplanning.md section 16 accepted as written |
| G2 Which bet? | 2026-11-02 | GO | bet "a bucket that writes like you, on real forms"; condition: re-check the Must list size after the Batch 1 prototypes; "watch my sources" added to v1 as a Should |
| G3 Build it? | | | |
| Ready for build? | | | |
| Ready to release? | | | |
| What next? | | | |

## Evidence in hand
- `docs/design/`: product roadmap (12 epics), jobs to be done (10), activation model (4 triggers), design journal, design roadmap, test forms corpus (20 form types)
- `docs/brand/`: personas (Ada, Emeka, Ngozi, Tunde), tone of voice, colour, typography, motion
- Code read of the whole repo on 2026-11-02 (findings go into 01-preplanning.md under "What already exists")
- No interviews, analytics or user feedback yet

## Decisions
- 2026-11-02 · Run Arpli as a Design OS project at deep depth · user wants a full product lifecycle · user
- 2026-11-02 · Arpli is not the Design OS test project · user
- 2026-11-02 · Done = `.dmg` on the user's Mac + working Chrome extension + about 20 real applicants applying and tracking with it · user
- 2026-11-02 · Build path AI-build: Claude develops; reuse the current design system (Intent UI kit and tokens) · experience first, polish later · user
- 2026-11-02 · Skip new primary research (interviews, surveys); use the existing docs as evidence · user says the problem is known · user. Risk noted: personas and jobs to be done have not been checked with real people, so claims built on them stay Low or Med confidence until the Test stage puts working software in front of real applicants.
- 2026-11-02 · Visual and interaction polish moves to Polish & QA; `docs/brand` is the polish direction, not the v1 build target · user
- 2026-11-02 · Project files live in `design/`; `CLAUDE.md` and `AGENTS.md` at the repo root · keeps them next to the code so Claude and Cursor both read them · Claude (low stakes)
- 2026-11-02 · Success targets (KR1 to KR3), the three 6-week batches and the "only three things" list accepted as working versions; may be improved later · owner · user
- 2026-11-02 · The owner is one of the users (user #1); the other testers are recruited when Test starts · owner · user. Watch for false consensus: the owner's own needs are one data point, not the whole audience.

- 2026-11-02 · Dossier (github.com/AienTech/dossier, AGPL-3.0) is used as a reference for ideas only; no code is copied, so Arpli's licence stays open · protects the open-source licence choice · Claude (low stakes, reversible)
- 2026-11-02 · Reference repos kept in `~/Developer/arpli-references/` (dossier, beads), outside the Arpli repo · owner asked to keep the code; outside the repo so nothing gets committed by accident · owner + Claude
- 2026-11-02 · We are designing and building the actual product, not throwaway prototypes; prototypes only for trying interaction patterns (Design Studio). Work across product, design and engineering must be tracked so it's always clear what is built and what isn't · owner
- 2026-11-02 · Process correction: nothing is built until its design and spec are approved by the owner (Claude built onboarding before designing it) · owner + Claude
- 2026-11-02 · One folder for everything Arpli: `~/Developer/arpli`. References moved to `references/`, Design Studio installed in `studio/`; both ignored by git, lint and type checks. App data stays in `~/.arpli/` · owner
- 2026-11-03 · Operating model adopted: one loop per piece of work (product → design → owner approves → build with tests → QA → owner approves); one spec per feature in `design/specs/`; four saved team roles in `.claude/agents/` (product-lead, product-designer, engineer, qa-reviewer); one branch and pull request per piece of work; one session per piece of work · owner
- 2026-11-03 · Leftover copies moved to the Trash (not deleted): three old feature worktrees, the duplicate `~/arpli` clone, Kilo's copies, the old Design Studio 0.1.2 and two Claude test leftovers. None held unique work; feature branches remain in git and on GitHub · owner
- 2026-11-02 · Beads adopted as the build team's task tracker from Prioritize onward · owner installed it (bd 1.3.2); Claude connected it with `bd init --skip-agents --skip-hooks --prefix arpli`. `bd init` committed on its own (951a1df, which also swept in CLAUDE.md and AGENTS.md); undone, then the owner allowed beads to commit its own files, so the setup commit was redone with beads files only (5baa86e). Sync remote is set to the GitHub repo. Git hooks installed by the owner (`bd hooks install --beads`, after Claude's attempt was blocked by permissions); watch the first push for task data going to GitHub · owner + Claude

- 2026-11-02 · The v1 bet is "a bucket that writes like you, on real forms", and the first slice is one real Greenhouse application from CV import to Submitted · owner
- 2026-11-02 · Documents in v1: tailored cover letter and CV (PDF) as Should; one-page pitch summary as Could; full pitch decks out of v1 · owner
- 2026-11-02 · The radical option (Arpli with no AI of its own: bucket + form filler, drafting inside the person's Claude or ChatGPT via connector or hand-off) becomes one prototype direction in Explore · owner
- 2026-11-02 · Story interview (H3) stays a Could for v1 and becomes one prototype direction in Explore; it moves up if the prototypes favour it · owner
- 2026-11-02 · ~~Opportunity suggestions move into v1~~ Corrected the same day: the owner meant answer suggestions (already the core, O2). Arpli finding opportunities on its own goes back to v2, and the Frame no-go stands · owner
- 2026-11-02 · New in v1 as a Should: **watch my sources** (O12). The person adds links to job boards and opportunity sites they choose; Arpli checks them regularly while the Mac is on and shows what's new with deadlines; one click saves an item as an opportunity · owner confirmed this description
- 2026-11-02 · Explore plan approved: four directions as loose coded prototypes (D1 next to the form, D2 bucket as home with a built-in browser variant, D3 story interview, D4 no AI of its own), with real AI on the owner's material; foundation plumbing first · owner
- 2026-11-02 · Prototypes use both the owner's Claude Code (Max) and the local Ollama model (gpt-oss:120b), for comparison · owner
- 2026-11-02 · Beads anonymous usage metrics stay on (command names, version, OS; no task content) · owner

## Assumptions to verify
- The personas reflect who will really use Arpli · the 20 applicants in Test · Test
- The testers have Macs and use Chrome · make it a recruiting criterion · Test (recruiting)
- Testers span students, job seekers, founders and researchers · set a mix in the recruiting criteria before Test · Test (recruiting)
- The sources people want to watch can be checked legally and reliably · desk research done 2026-11-02: yes for Greenhouse, Lever and Ashby boards and RSS/Atom feeds; no for LinkedIn, Indeed, X and job-board search pages (copy-in fallback) · see 02-opportunity.md 9b
- Applicants can and will set up an AI model or key · prototype test · Test
- Arpli can read real forms (Greenhouse, Ashby, Workday, Google Forms, Typeform) · AI model check on the forms corpus · Test

## Open questions
- How can Arpli give people without a Claude or ChatGPT subscription cheap or free AI that is good enough? (candidates: local models, free tiers, Apple's on-device model; the Ollama comparison in Explore is the first evidence) · owner wants this as its own effort · after Explore
- Arpli's own open-source licence (MIT, Apache-2.0, AGPL-3.0…) · owner · before Release
- Is it fine for Arpli to run a person's own signed-in Claude Code (tools off) on their behalf? Ask Anthropic in writing before making it a headline feature · owner, Anthropic · before Release
- Frame intake questions sent to the user on 2026-11-02 (who the 20 are, first group, appetite, AI setup, where the work happens, filling vs capturing, what Arpli helps with on a form, discovery, tracking, money) · user

## Next action
Ways of working are being set up (beads epic `arpli-cms`). Done: one Arpli folder, Design Studio in `studio/`, work saved to GitHub (PR #19, stacked on #18), team roles and spec template. Linear is set up: project **Arpli v1** (https://linear.app/deesigner/project/arpli-v1-8cddeacddbca), issues DEE-64 to DEE-84, each linked from its beads task, in three batch milestones (targets 13 Dec, 24 Jan, 7 Mar); this week is cycle 12 (2 to 9 Nov). Next, in a fresh session: (1) go through, one by one, what didn't work for the owner in the last build, logging each as a bug in beads and Linear; (2) automatic screen tests covering them (`arpli-cms.2` / DEE-76); (3) back to Explore, where every feature runs the loop with a spec in `design/specs/`. Nothing gets built without an approved design and spec.
