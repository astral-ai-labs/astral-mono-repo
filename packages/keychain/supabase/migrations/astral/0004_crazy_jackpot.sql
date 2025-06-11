ALTER TABLE "organizations" ALTER COLUMN "credit_balance" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "credit_balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "credit_balance" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "credit_balance" SET DEFAULT '0';