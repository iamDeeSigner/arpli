-- Phase 2 — Application question answering (core drafting engine).
--
-- Extends `application_drafts` with:
--   * `question_id` — stable reference to the `OpportunityQuestion.id` the
--     draft is answering. Nullable because free-form drafts (user adds a
--     question that is not in the opportunity) are allowed. Grouping drafts
--     into versions keys off this column when present, falling back to
--     `question_text` otherwise.
--   * `tone` — optional free-form tone label the user asked for ("concise",
--     "warm", "formal"...), persisted so a regenerate can reuse it.
--   * `instructions` — optional free-form instruction the user attached to
--     this particular revision ("shorter", "lead with the ARPA project").
--
-- SQLite ADD COLUMN is in-place and backward-compatible: existing rows get
-- NULL for the new columns.

ALTER TABLE `application_drafts` ADD COLUMN `question_id` text;
--> statement-breakpoint
ALTER TABLE `application_drafts` ADD COLUMN `tone` text;
--> statement-breakpoint
ALTER TABLE `application_drafts` ADD COLUMN `instructions` text;
