ALTER TABLE "plans" ALTER COLUMN "features" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "starting_credit" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "monthly_credit" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "tier" "tier_enum" DEFAULT 'free' NOT NULL;--> statement-breakpoint
