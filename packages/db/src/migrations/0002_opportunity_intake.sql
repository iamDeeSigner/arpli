-- Phase 2 — Opportunity intake and parser.
--
-- Reshapes `opportunities` to match the intake data model: adds the
-- `questions` / `tags` JSON columns and an `updated_at` timestamp, drops the
-- unused `requirements`, `word_limits`, `raw_text` columns, and switches
-- `status` from (open|closed|archived) default 'open' to (active|archived)
-- default 'active'. SQLite cannot ALTER columns in place, so the migration
-- rebuilds the table using the standard "new table + swap" pattern.
--
-- `applications` and `application_drafts` carry FK references to
-- `opportunities(id)`. We `PRAGMA defer_foreign_keys = ON` for the duration
-- of the migration so a mid-swap state does not violate FK — SQLite
-- re-checks on COMMIT, by which point the renamed table exists.

PRAGMA defer_foreign_keys = ON;
--> statement-breakpoint
CREATE TABLE `opportunities_new` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`organization` text,
	`url` text,
	`deadline` text,
	`eligibility` text,
	`questions` text,
	`description` text,
	`tags` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `opportunities_new` (
	`id`, `title`, `type`, `organization`, `url`, `deadline`, `eligibility`,
	`description`, `status`, `created_at`, `updated_at`
)
SELECT
	`id`, `title`, `type`, `organization`, `url`, `deadline`, `eligibility`,
	`description`,
	CASE WHEN `status` = 'archived' THEN 'archived' ELSE 'active' END,
	`created_at`, `created_at`
FROM `opportunities`;
--> statement-breakpoint
DROP TABLE `opportunities`;
--> statement-breakpoint
ALTER TABLE `opportunities_new` RENAME TO `opportunities`;
