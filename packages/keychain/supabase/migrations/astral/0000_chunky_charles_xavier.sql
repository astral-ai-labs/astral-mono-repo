CREATE TYPE "public"."account_type" AS ENUM('individual', 'org_member');--> statement-breakpoint
CREATE TYPE "public"."credit_ledger_reason" AS ENUM('purchase', 'refund', 'add', 'auto_refill', 'bonus', 'other');--> statement-breakpoint
CREATE TYPE "public"."granularity" AS ENUM('minute', 'hour', 'day', 'month', 'all_time');--> statement-breakpoint
CREATE TYPE "public"."organization_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('individual', 'organization');--> statement-breakpoint
CREATE TYPE "public"."rate_metric" AS ENUM('playground_total_requests');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"prefix" varchar(10) NOT NULL,
	"hash" text NOT NULL,
	"description" text,
	"expires_at" timestamp,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"revoked_by" uuid
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "credit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"organization_id" uuid,
	"delta" bigint NOT NULL,
	"balance" bigint NOT NULL,
	"reason" "credit_ledger_reason" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "check_credit_one_owner" CHECK (
            (profile_id IS NOT NULL AND organization_id IS NULL)
            OR 
            (profile_id IS NULL AND organization_id IS NOT NULL)
          ),
	CONSTRAINT "chk_credit_balance_nonnegative" CHECK (balance >= 0)
);
--> statement-breakpoint
ALTER TABLE "credit_ledger" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organization_members" (
	"organization_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role" "organization_role" DEFAULT 'member' NOT NULL,
	"invited_by" uuid,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"logo_url" text,
	"active_plan_id" uuid DEFAULT NULL,
	"credit_balance" integer DEFAULT 0 NOT NULL,
	"credit_balance_updated_at" timestamp DEFAULT now() NOT NULL,
	"credit_auto_refill_enabled" boolean DEFAULT false NOT NULL,
	"credit_auto_refill_amount" integer DEFAULT 0 NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"stripe_active_plan" varchar(50),
	"stripe_plan_status" varchar(20),
	"description" text,
	"website" varchar(200),
	"contact_email" text,
	"phone" varchar(20),
	"address" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan_rate_limits" (
	"plan_id" uuid NOT NULL,
	"metric" "rate_metric" NOT NULL,
	"value" bigint NOT NULL,
	"granularity" "granularity" DEFAULT 'all_time' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan_rate_limits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "plan_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"currently_available" boolean DEFAULT true NOT NULL,
	"features" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"account_type" "account_type" DEFAULT 'individual' NOT NULL,
	"active_plan_id" uuid DEFAULT NULL,
	"credit_balance" integer DEFAULT 0 NOT NULL,
	"credit_balance_updated_at" timestamp DEFAULT now() NOT NULL,
	"credit_auto_refill_enabled" boolean DEFAULT false NOT NULL,
	"credit_auto_refill_amount" integer DEFAULT 0 NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"stripe_active_plan" varchar(50),
	"stripe_plan_status" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid DEFAULT NULL,
	"organization_id" uuid DEFAULT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"description" text,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "check_project_owner" CHECK (
          (profile_id IS NOT NULL AND organization_id IS NULL)
          OR 
          (profile_id IS NULL AND organization_id IS NOT NULL)
        )
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "usage_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"organization_id" uuid,
	"project_id" uuid,
	"metric" "rate_metric" NOT NULL,
	"granularity" "granularity" NOT NULL,
	"period_start" timestamp DEFAULT now() NOT NULL,
	"quantity" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_usage_counters_one_owner" CHECK (
      (
        (profile_id    IS NOT NULL)::int
      + (organization_id IS NOT NULL)::int
      + (project_id    IS NOT NULL)::int
      ) = 1
    )
);
--> statement-breakpoint
ALTER TABLE "usage_counters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "usage_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"organization_id" uuid,
	"project_id" uuid,
	"api_key_id" uuid DEFAULT NULL,
	"metric" "rate_metric" NOT NULL,
	"quantity" bigint NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_usage_records_one_owner" CHECK (
          (
            (profile_id     IS NOT NULL)::int
          + (organization_id IS NOT NULL)::int
          + (project_id     IS NOT NULL)::int
          ) = 1
        )
);
--> statement-breakpoint
ALTER TABLE "usage_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_revoked_by_profiles_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_invited_by_profiles_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_active_plan_id_plans_id_fk" FOREIGN KEY ("active_plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_rate_limits" ADD CONSTRAINT "plan_rate_limits_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_active_plan_id_plans_id_fk" FOREIGN KEY ("active_plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_api_keys_prefix" ON "api_keys" USING btree ("prefix");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_api_keys_hash" ON "api_keys" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "idx_api_keys_project" ON "api_keys" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_profile" ON "credit_ledger" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_org" ON "credit_ledger" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_time" ON "credit_ledger" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_reason" ON "credit_ledger" USING btree ("reason");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_profile_time" ON "credit_ledger" USING btree ("profile_id","recorded_at");--> statement-breakpoint
CREATE INDEX "idx_credit_ledger_org_time" ON "credit_ledger" USING btree ("organization_id","recorded_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_org_members_unique" ON "organization_members" USING btree ("organization_id","profile_id");--> statement-breakpoint
CREATE INDEX "idx_org_members_profile" ON "organization_members" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_orgs_slug" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_orgs_active_plan" ON "organizations" USING btree ("active_plan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_plan_metric_granularity" ON "plan_rate_limits" USING btree ("plan_id","metric","granularity");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_plan_type_name" ON "plans" USING btree ("type","name");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_profiles_email" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_profiles_active_plan" ON "profiles" USING btree ("active_plan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_projects_owner_slug" ON "projects" USING btree ("profile_id","organization_id","slug");--> statement-breakpoint
CREATE INDEX "idx_projects_profile" ON "projects" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_projects_organization" ON "projects" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_usage_counters_bucket" ON "usage_counters" USING btree ("profile_id","organization_id","project_id","metric","granularity","period_start");--> statement-breakpoint
CREATE INDEX "idx_usage_counters_profile" ON "usage_counters" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_usage_counters_org" ON "usage_counters" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_usage_counters_project" ON "usage_counters" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_usage_counters_time" ON "usage_counters" USING btree ("period_start");--> statement-breakpoint
CREATE INDEX "idx_usage_records_profile" ON "usage_records" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_usage_records_org" ON "usage_records" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_usage_records_project" ON "usage_records" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_usage_records_metric" ON "usage_records" USING btree ("metric");--> statement-breakpoint
CREATE INDEX "idx_usage_records_time" ON "usage_records" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "idx_usage_records_proj_metric_time" ON "usage_records" USING btree ("project_id","metric","recorded_at");--> statement-breakpoint
CREATE POLICY "API Keys are visible to a project's owner or the organization's members" ON "api_keys" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      EXISTS (
        SELECT 1
        FROM projects
        WHERE projects.id = api_keys.project_id
          AND (
            projects.profile_id = auth.uid()
            OR (
              projects.organization_id IN (
                SELECT organization_id
                FROM organization_members
                WHERE profile_id = auth.uid()
              )
            )
          )
      )
    );--> statement-breakpoint
CREATE POLICY "API Keys are manageable by a project's owner or the organization's admins" ON "api_keys" AS PERMISSIVE FOR ALL TO "authenticated" USING (
      EXISTS (
        SELECT 1
        FROM projects
        WHERE projects.id = api_keys.project_id
          AND (
            projects.profile_id = auth.uid()
            OR (
              projects.organization_id IN (
                SELECT organization_id
                FROM organization_members
                WHERE profile_id = auth.uid()
                  AND role = 'admin'
              )
            )
          )
      )
    );--> statement-breakpoint
CREATE POLICY "Credit Ledger is visible to the individual or org. members" ON "credit_ledger" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      profile_id = auth.uid()
      OR
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE profile_id = auth.uid()
      )
    );--> statement-breakpoint
CREATE POLICY "Organization Members: Organization members are visible to org peers" ON "organization_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE profile_id = auth.uid()
      )
    );--> statement-breakpoint
CREATE POLICY "Organization Members: Organization admins can manage org members (add, update, delete)" ON "organization_members" AS PERMISSIVE FOR ALL TO "authenticated" USING (
      organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE profile_id = auth.uid()
          AND role = 'admin'
      )
    );--> statement-breakpoint
CREATE POLICY "Orgs are visible to both the creator of the org and its members." ON "organizations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      created_by = auth.uid()
      OR id IN (
        SELECT organization_id
        FROM organization_members
        WHERE profile_id = auth.uid()
      )
    );--> statement-breakpoint
CREATE POLICY "Only the creator can update or delete the org." ON "organizations" AS PERMISSIVE FOR ALL TO "authenticated" USING (created_by = auth.uid());--> statement-breakpoint
CREATE POLICY "Plan limits are readable by anyone" ON "plan_rate_limits" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Plans are readable by anyone" ON "plans" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Select your own profile or your organization's members." ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      auth.uid() = id
      OR
      (
        account_type = 'org_member'
        AND id IN (
          SELECT profile_id
          FROM organization_members
          WHERE organization_id IN (
            SELECT organization_id
            FROM organization_members
            WHERE profile_id = auth.uid()
          )
        )
      )
    );--> statement-breakpoint
CREATE POLICY "Update your own profile. Not allowed to update org-only members." ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = id) WITH CHECK (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "Projects are visible to an organization's owners/creator or its members" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      (profile_id = auth.uid())
      OR
      (
        organization_id IN (
          SELECT organization_id
          FROM organization_members
          WHERE profile_id = auth.uid()
        )
      )
    );--> statement-breakpoint
CREATE POLICY "Projects are manageable by an organization's owner/creator or its admins" ON "projects" AS PERMISSIVE FOR ALL TO "authenticated" USING (
      (profile_id = auth.uid())
      OR
      (
        organization_id IN (
          SELECT organization_id
          FROM organization_members
          WHERE profile_id = auth.uid()
            AND role = 'admin'
        )
      )
    );--> statement-breakpoint
CREATE POLICY "Usage Counters are visible to the individual or org. members" ON "usage_counters" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      profile_id = auth.uid()
      OR
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE profile_id = auth.uid()
      )
      OR
      project_id IN (
        SELECT id FROM projects
        WHERE
          profile_id = auth.uid()
          OR organization_id IN (
            SELECT organization_id FROM organization_members
            WHERE profile_id = auth.uid()
          )
      )
    );--> statement-breakpoint
CREATE POLICY "Usage records are visible to individual or org. members" ON "usage_records" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      profile_id = auth.uid()
      OR
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE profile_id = auth.uid()
      )
      OR
      project_id IN (
        SELECT id FROM projects
        WHERE
          profile_id = auth.uid()
          OR organization_id IN (
            SELECT organization_id FROM organization_members
            WHERE profile_id = auth.uid()
          )
      )
    );