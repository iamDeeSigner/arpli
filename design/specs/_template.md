# Spec · [feature name]

**Status:** Draft → Product approved → Design approved (Ready to build) → Built → QA passed → Done
**Owner decisions:** [date · what was approved]
**Tracking:** beads `[arpli-…]` · Linear `[ARP-…]`
**Links:** opportunity in `design/02-opportunity.md` · references · Design Studio or Pencil exploration · pull request

Copy this file to `design/specs/NN-feature-name.md`. Sections stay empty until there is a real answer; unknowns are marked ASSUMPTION.

---

## 1. Product (product lead)

**Problem:** [Users] face [X] when trying to [Y], causing [Z].
**Who it's for:** [group, moment, stakes]
**Job story:** When [situation], I want to [motivation], so I can [outcome].

**The user needs to…**
- …

**The system needs to…**
- …

**Must not:**
- …

**Success:** [how we'll know it worked: one or two signals, tied to KR1 to KR3]

**Done means…** (each line checkable by the QA reviewer)
- [ ] …

## 2. Design (product designer)

**References:** [3 to 6 real screens per key moment, with what to take from each]

**Flows**
- First time: …
- Returning: …
- Errors and edges: empty · loading · offline · AI unavailable · AI unsure · permission denied · …

**Screens and states**
| Screen | Built from (existing components) | States (empty, loading, populated, hover, focus, active, selected, disabled, error, success, or N/A) |
|---|---|---|

**Copy** (final, on-voice, every visible string)
| Where | Text |
|---|---|

**AI moments:** what the AI does · how sure it is · what the person sees when it is unsure or wrong · how they correct it · where their text goes

**Accessibility:** focus order · labels · keyboard · never colour alone · reduced motion

**Design-system gaps:** [missing components or tokens; never invented]

## 3. Engineering (engineer)

**Approach:** [what changes in the engine, data, app, extension]
**Data:** [new fields or tables, migrations]
**Privacy and safety:** [what leaves the Mac and to whom; untrusted input handling]
**Tests:** [engine tests · UI tests · the real flow to run]
**Risks and open questions:** …

## 4. QA (qa-reviewer)

**Result:** [date · ready for the owner / back to the engineer]
| Finding | Severity | Where | Expected vs actual | Status |
|---|---|---|---|---|
