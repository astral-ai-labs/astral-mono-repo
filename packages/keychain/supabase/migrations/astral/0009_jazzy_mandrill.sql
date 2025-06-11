CREATE TYPE "public"."tier" AS ENUM('free', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5');--> statement-breakpoint
ALTER TABLE "plan_rate_limits" RENAME TO "tier_rate_limits";--> statement-breakpoint
ALTER TABLE "tier_rate_limits" RENAME COLUMN "plan_id" TO "tier";--> statement-breakpoint
DROP INDEX "ux_plan_metric_granularity";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "tier" "tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "tier" "tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_tier_metric_granularity" ON "tier_rate_limits" USING btree ("tier","metric","granularity");--> statement-breakpoint
ALTER POLICY "Plan limits are readable by anyone" ON "tier_rate_limits" RENAME TO "Tier limits are readable by anyone";