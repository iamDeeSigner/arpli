# How we work: product, design and build side by side

**Status:** agreed in principle, 2026-11-15 (see Decisions) · the tool map is a menu the owner picks from, chunk by chunk
**Replaces:** the step after Prioritize that used to be the four direction prototypes (D1 to D4, dropped 15 Nov; `11-directions.md` kept as a record)

## The owner's direction (15 Nov, in their words)

> "we are designing, building and doing product thinking at the same time. the point is these might happen in different and multiple tools. so we figuring out what those might be would help us out. so for instance, I might want to sample interaction ideas, maybe like 4 or 5, what tool handles that, also, maybe I want to do UI polish, or I want to check out 4 design direction on a flow or something. I like paper for trying out different UI ideas, but I prefer Figma to do UI and visual polish, so we would be using all, there is also Twombly or so, and then agentation to give feedback from the live build, so we sort of need all of this, but yeah we are working on the actual product and improving as we progress."

## The idea

- There is one product, the real app in `apps/desktop`, and it gets better as we go. No throwaway direction prototypes.
- Product thinking, design and building run at the same time, usually on different pieces of work (one being thought through, one in design, one in build) and sometimes on the same piece at different depths (built plainly, then refined).
- Each kind of design work has a tool that suits it. A piece of work only uses the tools it needs.
- **The `.md` files stay the source of truth.** Whatever is decided in Paper, Design Studio, Twombly, Figma or from live-build feedback is written back into that piece's spec in `design/specs/`. Figma and the canvases are where we look and decide, not where decisions live.

## Tool map, by kind of work (draft)

| # | Kind of work | When it's used | Tool | What comes out | Written back to |
|---|---|---|---|---|---|
| T1 | Product thinking: what and why, "done means", the order of work | always | the `.md` files in `design/`, Linear, beads | the Product part of a spec | `design/specs/` |
| T2 | References: how other products do it | before sampling or directions | Mobbin (connected) · Eagle, your reference library (installed; connects when the app is open) | a few references per moment | the spec's Design part |
| T3 | **Sample interaction ideas**: 4 or 5 ways one interaction could work, clickable, with states | when how something behaves is unsure (a panel, a review step, a drag, an undo) | **Design Studio** (`studio/`): clickable prototypes with states and sample data, made for comparing approaches | 4 or 5 working variants | the pick and why, in the spec |
| T4 | **Compare and comment side by side** | after T3, or to see built screens together | **Twombly** (already holds the 9 screens built before 3 Nov) | the chosen option, with comments | the spec |
| T5 | **Try UI ideas and design directions on a flow**: layout, hierarchy, look, 3 or 4 directions across the screens of one flow | when how a screen or flow looks is open | **Paper** (your preference for trying UI ideas; installed; connects when the app is open) | 3 or 4 directions per flow | the pick, in the spec |
| T6 | **UI and visual polish** | once a screen works in the build | **Figma** (your preference for polish; connected) | polished screens and tokens | `DesignSystem.md`, then the code, matched 1:1 |
| T7 | **Feedback on the live build**: point at something in the running app and say what's wrong | any time something is built | **Agentation** (not set up yet; see question Q3) | notes pinned to real elements, read by Claude | a fix, or a beads issue |
| T8 | Build | once a spec is "Ready to build" (see question Q1) | the real app, the engineer, with tests | a working piece of v1 | a pull request |

**Also on hand, not in the map unless you want them:** CSS Studio (edit spacing and colour on the running app and have it saved to the code; connected), Inflight (share a build and collect comments from other people, useful when testers arrive; connected), Pencil (`Arpli.pen`, empty) and Penpot (both connected; they overlap with Paper).

## Facts checked for this draft (15 Nov)

- Paper, Figma and Eagle are installed on this Mac. Paper and Eagle didn't connect today, most likely because the apps were closed.
- Design Studio is installed in `studio/`. Its own description: "Turn ideas into interactive prototypes", with "Wireframes and alternatives. Start with a rough layout, compare approaches, and refine the one you choose" (`studio/README.md`).
- Twombly lays out design explorations side by side on a shared canvas, with comments. Arpli already has a local canvas, "Arpli main screens".
- **Agentation:** the official toolbar is a React component ("React 18+") with a helper (`agentation-mcp`) that lets Claude read the notes directly. Licence: PolyForm Shield 1.0.0, not an open-source licence. Source: [github.com/benjitaylor/agentation](https://github.com/benjitaylor/agentation). Arpli's app is Svelte 5 with SvelteKit, not React. A separate Svelte rebuild, annotaKit (MIT), exists, but its link to Claude is still listed as planned ([sveltethemes.dev/nodestarQ/annotaKit](https://sveltethemes.dev/nodestarQ/annotaKit)).

## Questions for the owner (one at a time)

- **Q1 · Does "nothing is built before its spec is Ready to build" stay?** Recommended: yes, for each piece. "At the same time" means different pieces at different stages, plus refining what's built. Exploring in Design Studio, Paper and Twombly is never product code, so it can happen any time.
- **Q2 · The tool map, row by row** (T3 to T7 are the new ones; T1, T2 and T8 are how we already work).
- **Q3 · How Agentation is set up.** Recommended: the official toolbar, loaded only while developing (React added for development only, never shipped in Arpli, so Arpli's own licence isn't affected), plus its helper so Claude reads your notes directly.
- **Q4 · How Prioritize shows this.** Recommended: each piece in the ordered list says which tools it needs (for example "sample the interaction in Design Studio first", "directions in Paper", "polish in Figma"), and the list runs in three staggered lanes: being thought through, in design, in build.

## Decisions

- **Q1 · The build rule (owner, 15 Nov): it depends on the piece, and Claude follows the owner's lead.**
  - **Plumbing** (engine, data, AI connections, importers, nothing to see) can be built ahead of the screens.
  - **Experience pieces:** the owner wants to see the UI, the flow and how things work, and to try different directions before an approach is picked, sometimes as actual built prototypes. The owner says what happens next as we go. Example, onboarding: a proper Mobbin research first, then design directions in Paper, the owner decides, tweaks, then maybe a clean-up in Figma and the UI imported back into the app.
  - **What the owner needs most:** the experience broken into **sizeable chunks**, so each chunk is thought through until the product is well thought out on all its ramifications.
  - In practice: no experience piece gets its final build before the owner has picked its approach; directions may be built as prototypes in the real app when the owner asks; the picked approach is written into the spec, which stays the source of truth.
- **Q2 · The tool map (settled by the Q1 answer):** kept as a **menu, not a fixed pipeline**. The owner picks the tools for each chunk; Claude may suggest a sequence. Known preferences: Mobbin research first, Paper for directions and UI ideas, Figma for clean-up and polish, then the UI brought back into the app; Twombly to compare; Agentation for live-build feedback.
- **Q3 · Agentation set-up:** asked when the first experience chunk is built, since there's nothing live to give feedback on before then.
- **Q4 · How Prioritize shows this (settled by the Q1 answer):** Prioritize's main output becomes the experience broken into sizeable chunks, put in order (nothing cut), each with the outcomes it serves, the drilled decisions it already holds and the open questions to think through.

---
**Handoff**
- Output: `design/14-ways-of-working.md`
- Status: agreed in principle (15 Nov): Q1, Q2 and Q4 settled by the owner's answer; Q3 waits for the first built chunk
- Next: Prioritize (DEE-92), reshaped around sizeable experience chunks
- Note: this is Arpli's way of working only. Design OS itself is not changed (build freeze).
