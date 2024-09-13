ALTER TABLE "scholarship" ADD COLUMN "select admin" text DEFAULT 'null';--> statement-breakpoint
ALTER TABLE "scholarship" DROP COLUMN IF EXISTS "selecting admin";