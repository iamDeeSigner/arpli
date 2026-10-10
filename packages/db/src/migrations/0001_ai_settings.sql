CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_providers` (
	`kind` text PRIMARY KEY NOT NULL,
	`tier` text NOT NULL,
	`model` text NOT NULL,
	`api_key` text,
	`base_url` text,
	`is_active` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
