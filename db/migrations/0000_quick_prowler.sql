CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text,
	`user_id` integer,
	`created_at` text,
	`updated_at` text,
	`expires_at` text,
	`status` text DEFAULT 'pending'
);
