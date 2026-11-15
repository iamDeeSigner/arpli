# Memory · Arpli
One entry per stage. Newest at the bottom.

## 2026-11-02 · Intake
- Learned: Arpli has a working engine (profile, opportunity parsing, per-question drafting with versions, 13 AI providers) but a new user cannot reach it. Onboarding saves nothing, and no screen creates a profile or connects an AI provider. URL intake uses a plain page fetch, which the activation doc itself says fails on Ashby, Greenhouse and LinkedIn.
- Learned: the brand docs (warm amber, Fraunces, 120/220/360 ms) are not in the code; the code still uses Intent's look.
- Learned: the docs disagree on whether the extension fills forms (roadmap: never; activation model: likely by default).
- Taste / design system changes: Taste.md and DesignSystem.md created. v1 stays on the current Intent system; brand docs are the polish target.
- Decisions: deep depth; not the test project; AI-build with Claude developing; experience before polish; no new interviews, because the user considers the problem known (risk logged in design-state.md).

## 2026-11-02 · Frame (done, G1 pending)
- Learned: many admissions and research-grant bodies restrict AI-written answers (UCAS, Brown, UKRI, NIH); Anthropic's own job form says "create your first draft yourself, then use Claude to refine it". Arpli needs an AI help level per opportunity, including "you draft, Arpli refines".
- Learned: no-key AI is clean for "Continue with ChatGPT" (open-source local apps) and local models; reusing a Claude Code login is grey (opt-in, confirm with Anthropic); Gemini/Antigravity reuse is banned.
- Learned: the extension in the person's own Chrome is the strongest base for reading and filling; the built-in browser hits Google sign-in and Cloudflare limits; LinkedIn and Indeed Apply forbid automation.
- Decisions: riskiest assumption = the core promise (true, sounds like me, acceptable to submit); test it first with the "sounds like me" check, alongside a 10-form check.

## 2026-11-02 · Prioritize (G2: GO)
- Learned: scoring puts cheap pieces (tracker, capture) on top; the core (true drafts, form companion) needs overrides because it is the bigger build. Effort can't be sized in weeks until Batch 1 shows build speed.
- Decisions: bet = "a bucket that writes like you, on real forms"; first slice = one real Greenhouse application end to end; cover letter and CV as Should, pitch summary as Could, decks out; the radical "no AI of its own" option and the story interview become prototype directions; "watch my sources" joins v1 as a Should (owner, G2).
- Learned: "suggestions" was ambiguous (answers or opportunities). Always say which: "answer suggestions" or "opportunity suggestions".

## 2026-11-02 · Explore (foundation)
- Learned: Arpli can draft through the owner's own Claude Code (Max) with tools, MCP, settings, skills and sessions off, in an empty temp folder: about 5 s per answer. Detection reports "found, signed in, plan" without the email.
- Learned: on the owner's 64 GB M1 Max, gpt-oss:120b (66 GB) is unusable (210 s for five words); llama3 8B answers in about 8 s, true to the profile but with stock phrases the voice rules ban. Cheap AI for people without subscriptions needs a better small writing model; that is evidence for the parked "cheap AI" question.
- Learned: in the first live draft, Claude (Opus) invented praise for the company ("Test Co's work sits exactly where...") and used an em dash. The fact guard and house-style checks are needed from day one.
- Decisions: Node 24 pinned (.nvmrc); draft versions now sort by version number, not by timestamp.

## 2026-11-03 · Ways of working
- Learned: building onboarding before designing it broke the owner's own order (product, then design, then engineering) and shipped things that didn't work. The fix is a loop with two owner gates (Ready to build, Done), one spec per feature, and screen tests.
- Learned: the owner wants the real product, not throwaway prototypes; Design Studio is only for trying interaction patterns. Arpli's app is Svelte and Design Studio is React, so decisions move across, code doesn't.
- Decisions: one Arpli folder (`~/Developer/arpli`, with `references/` and `studio/` ignored by git); four saved team roles; Linear project Arpli v1 as the owner's board, linked from beads by external ref (no automatic sync yet); one session per piece of work.
- Decisions: product progress restarts (nothing built so far counts until it passes the loop), but engineering builds on top of the existing code, extending or reshaping it; no rewrite from zero.
- Learned: plain job autofill is crowded and free (Simplify, Huntr); the open ground is one private, open-source bucket across every opportunity type, with drafts that sound like the person and trace back to their material.
- Learned: Dossier (AGPL-3.0) solves "never invent" with a fact guard (names, numbers, credentials checked against the profile, flagged "check this") and reaches Claude without API keys through an MCP connector or a pre-filled claude.ai chat. Borrow ideas only, not code.
- Decisions: owner is user #1; working success targets, batches and top three accepted.
- Decisions: reusing and adapting past answers (O10) is a v1 Must (owner, 2026-11-03). The bucket keeps every answer with the story it tells; new questions that resemble old ones offer use as is, adjust lightly or rework; near-verbatim reuse for the same kind of programme gets a gentle warning. A seventh moment (M7, reusing what you've written) was added to the Explore pattern research.
- Decisions: the one-page product strategy is approved, vision line included (owner, 2026-11-03). Every feature now traces to a job step in its product map.
- Learned: the Must list is now seven items (O6, O1, O2, O4, O5, O7, O10). The G2 condition to re-check the Must list size after Batch 1 matters more now.

## 2026-11-03 · Explore step 1 (patterns)
- Learned: Mobbin covers in-app patterns well but has no browser extension working on top of another site's form, no web clipper states, no claim-level "check this", and nothing that warns about reusing your own words. Those are Arpli's own to design, and the prototypes carry more weight there.
- Learned: the owner decides fastest when each moment ends with one clear choice and a recommendation. Seven moments were reviewed in one sitting this way.
- Decisions: one per moment (see the table at the end of `04-explore.md`). The owner added one change: the tracker switches between list and board, with the list as default.

## 2026-11-09 · Reference: jev-job-search (during Explore steps 2 to 4)
- Learned: the closest existing product to Arpli is open source and MIT (`references/jev-job-search`). Its strongest ideas for us: read every value back from the page before Submit; read the page after the click to know it was sent, and keep a "not sure it went through" state; one "Needs you" list; a voice check in the first run; standing answers set once.
- Learned: its fact check is cheap code (numbers and capitalised names must be in the profile). It can't catch invented claims in plain words or praise of the organisation, so Arpli's "check this" still needs a claim-level layer.
- Learned: its author left an extension-driven approach for a separate Chrome window Arpli-style tools can control, for speed. That raises the stakes of S2.
- Learned: only 1 answer in 8 was reusable word for word across companies in its test; "adjust lightly" and "rework" matter more for O10 than "use as is".


## 2026-11-09 · Reference: T3 Code (during Explore steps 2 to 4)
- Learned: T3 Code (MIT, `references/t3code`) already solves "use the AI people already have" at scale: it finds the AI tools on the machine, shows each in one of six states (checking, disabled, install, attention, sign in, ready), and its rule is that checking never starts anything.
- Learned: its strongest patterns for Arpli are about attention: a list that sorts by who needs whom (Working folded, Settled on a counted shelf), status in plain words with time, undo for five seconds instead of "are you sure?", and "a one-way door is a bug".
- Learned: it never switches to another provider on its own when the chosen one is offline; it waits. The same rule fits "where your text goes".
- Learned: it sends usage data by default; Arpli stays opt-in.
- Decision: the owner took all six proposed changes in one reply (2026-11-09). Applied to `05-journey.md` as a short "Rules for every place" block (way out and undo, AI status with time and Stop, never switch AI) plus edits to P1, P4, P5, P6, P8, P12, P13, F1 and R2; two lines added to Taste.

## 2026-11-09 · Explore steps 2 to 4, part 2 review (flows)
- Learned: the owner reviews fastest one item at a time, each with a recommendation and one light question. 26 items went in one sitting.
- Learned: the owner treats the journey as good enough for the first build; each part is reworked hands-on once the prototypes exist. Keep items short and don't reopen settled points.
- Decision: Arpli spots replies and confirmations in your email in v1. The owner's idea for how: the Gmail connection in the person's own Claude (no Google approval, read-only). It widens the open question to Anthropic about running the person's Claude.
- Decision: no paid Apple membership for the testers (no funds now); a picture guide to "Open Anyway" instead.

## 2026-11-09 · Explore steps 2 to 4, part 3 (when things go wrong) · steps 2 to 4 done
- Learned: today's code shows AI failures as raw technical messages ("AI returned an empty draft") and doesn't recognise a usage limit; it already never switches AI on its own. Most of part 3 is new work, not a reshape.
- Learned: the riskiest failures are the quiet ones: a check that didn't run looking like a pass, a "Submitted" on a guess, a field filled with a guess. Part 3's rule for all three: unknown means skipped and said, never guessed.
- Learned: once the failures were written plainly, the owner kept E10 to E31 without item review. They want to judge them hands-on in the build, not on paper.
- Decisions: "Use another AI for this one" as the person's own choice when theirs is out of usage (never kept as a switch); fields that speak for you are split by kind (facts from standing answers, shown by name; signing or agreeing needs a yes each time).
- Next way of working: the owner wants the experience broken into granular UX elements by job step, drilled into one at a time (Explore step 6, first part of DEE-86).

## 2026-11-09 · Explore step 6, UX elements by job step (map written, drilling next)
- Learned: laying the journey across the job steps shows a gap the flows hid. Organise ("understand what each question is really asking") has no element at all; the product map gives that step only reading the questions and the help level. It is the floor user's need (Ada). Logged as U19, level not set.
- Learned: two v1 pieces have no place in the journey yet: documents (cover letter and CV, a Should) and the 1 to 5 "sounds like me" rating KR3 depends on.
- Learned: Plan, Check and Adjust have nothing on the first slice. Fine for the slice, but the drilling should give them real attention when it reaches them.
- Decisions: none yet. Drill order puts the bet first (draft, voice, check this, sources), then real forms, then KR1, then KR2.
- Decision (owner, 2026-11-09): documents (cover letter, CV, pitch summary) get planned and built in v1, tracked as DEE-89 / `arpli-95z`. When the owner says a v1 piece has to be planned and built, give it its own tracked work right away.
- Decisions (owner, 2026-11-09, asked one by one): documents are a Must, every kind and every common format, with their own place and a place in each application (decks kept and attached, not made); U19 a Must inside drafting; the KR3 rating after "Submitted" for everyone, shared only with a yes; a second slice across Plan, Check and Adjust.
- Learned: the owner thinks of documents far wider than "cover letter and CV": anything an application might ask for, in any format. When a scope answer comes back wider than the option offered, record the wider version and ask only about the one piece it reopens (here, decks).
- Learned: the owner wants clarifications raised one question at a time, each with a recommendation, not as a list.
- Drilling #1 to #10 (owner, 2026-11-09): the owner kept every recommendation, one question at a time. Main lines: the whole draft arrives at once; one kind of mark, about truth; sources as footnote numbers in the draft, gone after Insert; the voice guide as plain lines plus examples; ask first when nothing matches specifically; reuse shows up to two answers by meaning; general readings labelled and said with "usually".
- Learned (process): I twice gave a wrong source for a reason while drilling (a meter "avoided in step 1"; Taste "ruling out repainting"). Check the source before naming it in a question; when caught, correct it in the card and tell the owner.
- Drilling #11 to #16, real forms (owner, 2026-11-09): all recommendations kept. Main lines: panel and page point to each other; standard fields as one folded line with the costly values shown; only problems marked on the page; Fill always from the panel; Arpli never ticks a checkbox or anything that speaks for you; "Before you press Submit" shows only what needs a look; steady lines after Submitted, no confetti.
- Drilling #17 and #18, documents (owner, 2026-11-09): documents come in when spotted on the form or page, or added; make, pick or drop a file; every check answers get; a tailored CV picks and orders your own lines, rewording only as one-at-a-time suggestions; Arpli writes about-you documents and never writes writing samples or official papers; a reused document is copied only once you change it; PDF by default, the form's choice wins.
- Drilling #19 to #26, first draft (owner, 2026-11-09): all recommendations kept. Main lines: no AI found, the order is yours, then on this Mac, then a key; "where your text goes" names the company and account and links their policy; start at "Arpli drafts from your words", not asked; the AI shown next to Draft every time; waiting drafts go on their own with one notice; Save shows "Saved" at once and asks only for a missing deadline; the extension re-offered only when it would help; the download page promises nothing unproven.
- Drilling #27 to #32, the second application (owner, 2026-11-09): all recommendations kept. Main lines: Arpli never judges fit or eligibility, it quotes and the person decides; a readiness hint is framed as work ahead; no time estimates without data; Pin is a mark, not a stage; the application's own list is the checklist; one version list labelled by who; an interview is a new stage (data change needed); "What you sent" instead of interview coaching.
- Drilling #33 to #47 (owner, 2026-11-09): all recommendations kept. Main lines: the board's columns are stages; Needs you items clear themselves when done, with Later and Got it; one reminder notification a day, urgent ones alone; questions keep five states plus word flags; standing answers asked the first time a form needs them; voice turned into text on this Mac; "save what's new" asks once per answer and remembers skips; a no gets one steady line; only finished answers become past answers; the menu bar Add is a small box; starting with the Mac is asked after the first reminder.
- Learned (process): a long drill works when each question stands alone, leads with a recommendation, and cites something already decided. The owner kept all 126 recommendations; what moved them was consistency (the same pattern reused: one change at a time, quote don't paraphrase, never judge fit, say what was checked).
- Learned (process): check facts before putting them in a question. Three slips caught and corrected this session: a misattributed reason (meter, repainting), Grammarly "kept" when it was only noted, and Overleaf tied to Markdown instead of LaTeX.

## 2026-11-09 · Explore steps 5 and 7, screen map and principles · DEE-86 done
- Learned: the screen map was mostly already decided by the journey and drilling; only names and grouping were left (About you, four sidebar items, six stages). Drilling first made the map quick.
- Learned: the principles came straight out of patterns the owner kept choosing while drilling, so each could be tested against a real decision. The owner kept all five, as ranked.
- Decisions: About you · sidebar Applications, About you, Documents, Settings (Sources inside Applications) · stages Saved, Started, Ready to send, Submitted, Interview, Outcome · principles 1 Your words, or nothing; 2 You decide, Arpli never judges you; 3 Say what you checked, not what you guess; 4 Steady at 11 pm; 5 Every application makes the next one easier.
- Next: the four directions (DEE-79 to DEE-82), each judged against the principles.

## 2026-11-09 · Explore step 8, the four directions (written and approved; prototypes next)
- Decisions: D1 Next to the form · D2 About you as home · D3 Story interview · D4 No AI of its own, all kept as written; each changes only S1, S2 and S3, everything else is fixed by the drilled decisions. D2's Chrome window gets an engineering check first (DEE-90). Material: what's on this Mac plus one real opportunity the owner would apply to now.
- Learned: with 126 decisions fixed, the directions only had to differ where the journey split, which made a fair comparison easy to set up: same moment, same material, same question.
- Next: the owner's opportunity link, then the prototypes in a Design Studio chat (its own workspace), then critique and choose (DEE-83).


## 2026-11-15 · Pause and go back to people: deep online research on applicants' jobs · DEE-91
- Learned (process): the owner works best from the whole idea, human centred: users and their jobs first (functional, emotional, social), then design to answer all of it. We had skipped research on 2 Nov, treated features as "jobs", left out the emotional and social side, and gone wide on solutions (patterns, 47 UX elements, screen map, directions) at once. The owner noticed before I did; check the foundation before going deep on solutions.
- Done: six parallel research threads (students and scholarships, job seekers, founders, researchers, feelings and self-presentation, today's tools and switching), public signals only, quoted and linked; notes in `inputs/research_notes/Applicant jobs to be done/`, report in `inputs/reports/Applicant jobs to be done.md`.
- Learned (evidence): one shared core job across all four groups: retell one true story about yourself, many times, in each gatekeeper's format, against falling odds and with little feedback. Worst pains: repetition, silence, the blank page. Feelings: "is my ordinary record enough?", fear of a wasted year, fear of being judged a cheat or "AI" even when honest. Today: a general AI chat, a spreadsheet that breaks at 15 to 50 applications, a folder of old answers, a few scarce people. AI rules differ by programme. Second-language writers, people with little on paper and Nigerian applicants carry the heaviest load, and the evidence on them is thinnest.
- Watch: most usage numbers come from companies that sell related tools; Reddit leans US; Nigeria and Africa evidence is thin. All of it is Low to Med until real applicants confirm it.
- Next: turn the report into the people-and-jobs foundation, reviewed with the owner one part at a time; then rank needs and check the 126 decisions against the jobs.

## 2026-11-15 · Synthesize (stage 3), drafted; theme review next
- Done: every cited finding in the six notes tagged (1,468 rows, quotes checked word for word), each note sorted on its own, then merged into ten ranked themes in `12-synthesis.md`, with the job map, outcome statements, journey, moments of truth, failure taxonomy and 18 HMWs.
- Learned (evidence): the two strongest cross-cutting themes were not in our picture on 2 Nov: honest applicants can be read as cheats (detectors, reviewers and rules each do it), and the people with least help carry most risk. Both are where the evidence is thinnest.
- Learned (evidence): what people want is "a fair hearing" more than "convincing"; reviewers now discount polish, and what survives is specific, checkable and defensible in person.
- Learned (process): sorting each note on its own before comparing kept the first notes from shaping the themes; keyword counts are good for checking presence, not for frequency.
- Watch: theme 10 (no second bill, no data scare) echoes decisions already made and has the thinnest evidence; don't lean on it.
- Next: the owner reviews the themes one at a time, then four decisions (themes, core job wording, personas, top HMWs), then Prioritize.

## 2026-11-15 · Synthesize, owner's review: themes, core job, HMWs decided; personas next
- Decided: themes 1 and 3 to 10 kept in order; theme 2 (honest applicants read as cheats) set aside as a design driver, evidence kept; theme 8 drops the detector part; theme 10 reworded ("don't charge for AI twice, no billing surprises, ask before connecting anything"). The core job stays "present my real experience convincingly for a specific opportunity". All HMWs carried; eight priority (H8, H6, H1, H9, H14, H13, H18, H12). Personas to be recreated around behaviour types.
- Learned (owner's direction, in `12-synthesis.md`): the aim is easier, faster, better chances, and an easier next time when results don't come. Every answer feeds a knowledge bank and later answers are repackaged from it, essays included ("the whole point"). Write in the applicant's voice and learn it. A starting point for every question. Turn experience into evidence. Track through the person's email and learn what works. An AI is required; no plan means a guided free local model. Connections Arpli needs are fine if asked for and explained. Pricing later: a free core, paid features for heavy use, no billing surprises (to test).
- Learned (process): the owner answers best through the question dialog, one question at a time, with a recommendation; their answers often add direction beyond the question, so record it in its own section, not only as a keep/cut. When a research proposal (the "fair hearing" core job) moves away from the approved vision line, the owner keeps the vision line; carry the research points as context.
- Watch: the free local model has to run on an ordinary computer (the one tested needs a powerful Mac); reading email needs clear consent; "what works" needs enough replies to mean anything; whatever is filled in must come from the person's own record (theme 1).
- Next: recreate the personas (plan in `design-state.md`), review them one at a time, close Synthesize, then Prioritize.

## 2026-11-15 · Synthesize, personas recreated (owner's review next)
- Done: `13-personas.md`. Four readers measured the same ten behaviours in each group's rows; clusters merged by behaviour, not group. Five ways of applying: Ada (funded-study campaign, recommended primary), Sam (volume job seeker), Maya (small-awards grinder), Emeka (programme-chasing founder), Ngozi (fellowship chaser on a contract). Six conditions shown on them instead of as people: second language, little on paper, Nigeria or Africa, applying again, changing direction (Tunde), no one to ask.
- Learned (evidence): people differ more by how they apply (how often, what rides on it, what they write, who helps, which rules) than by group. Scholarship applicants split in two: one big funded-study campaign vs many small awards. Career changers aren't their own way of applying; they apply like others with a harder story. AI use is a stance that moves: silence pushes careful people toward sending blind.
- Learned (evidence): professional and nonprofit grant writers have the most developed reuse habit in the data (a master doc at several word counts), but they present an organisation, not themselves. Left for the owner to decide.
- Learned (process): readers working in parallel on the same variable list made the groups comparable; every quote then rechecked against the tag files caught two capitalisation slips. Don't put quote marks around a paraphrase, even of a Notion page.
- Watch: the earlier personas' device, night-time and eyesight details were never evidenced; the research has nothing on device, time of day, age or ability. Recruit for them in Test rather than invent them.
- Watch: the recommended primary (Ada) is not the person the first slice was built around (a Greenhouse job form, Sam's world). Look at it again when the bet is re-checked in Prioritize.
- Next: the owner reviews the personas one at a time, then close Synthesize, then Prioritize.

## 2026-11-15 · Synthesize, personas reviewed · Synthesize done
- Decided: Ada, Sam, Maya, Emeka and Ngozi kept as written; Tunde brought back as a sixth persona on weaker evidence, with "changing direction" still a condition on Sam and Ada; all six conditions kept; grant writers noted as a later audience; no primary persona until Prioritize has scored outcomes for each one; the brand personas file merged (rewritten from the new set as the brand and voice view).
- Learned (process): the owner keeps a persona the evidence calls weak when its story is distinct enough to design for (Tunde). Offer "bring it back, marked weaker" as an option rather than only "condition or cut".
- Learned (process): the owner prefers to choose the primary persona from scored outcomes, not from an argument. Bring the scoring before the pick.
- Learned (owner's view): many people put company or client information into AI whatever the policy says (it matches FO-176 and TO-201). Don't treat confidentiality rules as a barrier people actually respect; design for knowing where material goes.
- Learned (process): merging the brand file meant dropping its invented "says out loud" lines, inner monologues and device/night/eyesight details, and replacing them with real quotes. Tone notes that judged the person (a founder's "weak metric") were dropped for principle 2.
- Decided (owner, end of session): the four direction prototypes are dropped for a fresh approach (not yet described). DEE-91 Done; DEE-79 to DEE-83 and DEE-90 Canceled; Prioritize is DEE-92 / `arpli-2nm`.
- Learned (owner's rule for Prioritize): "we are doing everything. one by one. but we are sure taking everything into account." Prioritize orders the work and never cuts it.
- Next: Prioritize, in a new session. Ask early what the fresh approach is.

## 2026-11-15 · Prioritize again, reshaped: the way of working and the experience in chunks · DEE-92
- Decided (owner): product thinking, design and build run side by side on the real product, across several tools; the owner leads which tools each piece uses (Mobbin, Paper for directions and UI ideas, Figma for clean-up and polish, Twombly to compare, Agentation for live-build feedback, Design Studio for clickable samples). Plumbing can be built ahead; an experience chunk is seen and compared before its approach is picked. `14-ways-of-working.md`.
- Decided (owner): no scoring and no primary persona ("lets just build what gets our jobs done"). The experience is broken into 15 sizeable chunks built from the job map, its outcomes and the themes; the six personas and six conditions are checked inside every chunk instead. Work order: each chunk builds on the ones before (the knowledge bank first, Getting started 13th, once the first draft it leads to exists). `15-experience-chunks.md`.
- Learned (process): the owner asked "why do we need to score?". When nothing is cut, scoring has no job; ordering by what builds on what does. Explain the reason for a method step before running it.
- Learned (process): the owner wants each piece of work to build on the last and to be simple to go back and change. Keep each decision in one place (the chunk's spec), list what each chunk builds on and feeds, and log later changes with a date.
- Learned (method): the HCD manual's next chapter after prioritising is story mapping and user journeys (opened in Notion); the chunks are that, with the job map as the backbone.
- Watch: Agentation's official toolbar is React only and the app is Svelte 5; its set-up is asked when the first chunk is built. The free local model must run on a modest computer.
- Next: chunk 1, About you: the knowledge bank, in a new session.
