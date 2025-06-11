CREATE TYPE "public"."api_key_status" AS ENUM('active', 'revoked');--> statement-breakpoint
ALTER TYPE "public"."rate_metric" ADD VALUE 'api_requests';--> statement-breakpoint
ALTER TYPE "public"."rate_metric" ADD VALUE 'api_tokens';--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "status" "api_key_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "usage_records" ADD COLUMN "granularity" "granularity" NOT NULL;