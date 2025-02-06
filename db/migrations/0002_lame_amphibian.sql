PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text,
	`user_id` integer,
	`created_at` text,
	`updated_at` text,
	`expires_at` text,
	`status` text DEFAULT 'pending'
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "token", "user_id", "created_at", "updated_at", "expires_at", "status") SELECT "id", "token", "user_id", "created_at", "updated_at", "expires_at", "status" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;