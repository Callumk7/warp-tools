ALTER TABLE "profile" DROP CONSTRAINT "profile_email_unique";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "name";