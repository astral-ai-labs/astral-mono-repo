CREATE TABLE "request_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_profile_id" uuid,
	"owner_organization_id" uuid,
	"actor_profile_id" uuid NOT NULL,
	"actor_organization_id" uuid,
	"actor_membership_id" uuid,
	"actor_role" varchar(32),
	"provider_name" varchar(32) NOT NULL,
	"resource_type" varchar(32) NOT NULL,
	"resource_subtype" varchar(32),
	"model" varchar(80) NOT NULL,
	"raw_request" jsonb NOT NULL,
	"response_id" text NOT NULL,
	"rate_limits" jsonb,
	"raw_response" jsonb NOT NULL,
	"content" jsonb,
	"usage" jsonb NOT NULL,
	"cost" jsonb,
	"latency_ms" double precision NOT NULL,
	"log_status" varchar(16) DEFAULT 'success' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_logs_created_at" ON "request_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_provider_time" ON "request_logs" USING btree ("provider_name","created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_owner_project_time" ON "request_logs" USING btree ("owner_profile_id","owner_organization_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_actor_time" ON "request_logs" USING btree ("actor_profile_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_status_time" ON "request_logs" USING btree ("log_status","created_at");