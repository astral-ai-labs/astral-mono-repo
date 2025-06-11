ALTER TABLE "api_keys" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "revoked_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "credit_ledger" ALTER COLUMN "recorded_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "credit_ledger" ALTER COLUMN "recorded_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organization_members" ALTER COLUMN "joined_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_members" ALTER COLUMN "joined_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "credit_balance_updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "credit_balance_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "credit_balance_updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "credit_balance_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "archived_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "period_start" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "period_start" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "usage_counters" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "usage_records" ALTER COLUMN "recorded_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "usage_records" ALTER COLUMN "recorded_at" SET DEFAULT now();