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
