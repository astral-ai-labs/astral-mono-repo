ALTER TYPE "public"."tier" ADD VALUE 'custom';--> statement-breakpoint
ALTER TABLE "tier_rate_limits" RENAME COLUMN "tier" TO "plan_id";--> statement-breakpoint
DROP INDEX "ux_tier_metric_granularity";--> statement-breakpoint
ALTER TABLE "tier_rate_limits" ADD CONSTRAINT "tier_rate_limits_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_plan_metric_granularity" ON "tier_rate_limits" USING btree ("plan_id","metric","granularity");--> statement-breakpoint
ALTER POLICY "Tier limits are readable by anyone" ON "tier_rate_limits" RENAME TO "Plan limits are readable by anyone";