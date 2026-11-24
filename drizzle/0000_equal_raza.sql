CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`find_id` text NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`find_id`) REFERENCES `finds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `one_vote_per_user` ON `feedback` (`find_id`,`owner`,`kind`);--> statement-breakpoint
CREATE TABLE `finds` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`item` text NOT NULL,
	`form` text NOT NULL,
	`store` text NOT NULL,
	`address` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`price` text NOT NULL,
	`note` text NOT NULL,
	`seen` text NOT NULL,
	`created` text NOT NULL,
	`hidden` integer DEFAULT 0 NOT NULL
);
