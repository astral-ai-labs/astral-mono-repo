/*-----------------------------------------------
* ASTRAL SCHEMA
*-----------------------------------------------*/
import { pgEnum, pgTable, uuid, varchar, timestamp, text, foreignKey, pgPolicy, uniqueIndex, index, check, jsonb, integer, boolean, bigint, decimal } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

//   Import policies
import { profilesSelectOwnOrOrgPeers, profilesUpdateOwn, orgsSelectCreatorOrMembers, orgsManageByCreator, membersManageByOrgAdmins, membersSelectOrgPeers, projectsSelectOwnerOrOrgPeers, projectsManageByOwnerOrOrgAdmins, apiKeysSelectVisible, apiKeysManageByOwnerOrOrgAdmins, usageRecordsAndCountersSelectVisible, creditLedgerSelectVisible } from "./policies";
import { sql } from "drizzle-orm";

/*-----------------------------------------------
 * ENUMS
 *-----------------------------------------------*/
export const accountTypeEnum = pgEnum("account_type", ["individual", "org_member"]);

export const organizationRoleEnum = pgEnum("organization_role", ["admin", "member"]);
export const planTypeEnum = pgEnum("plan_type", ["individual", "organization"]);
export const tierEnum = pgEnum("tier_enum", ["free", "tier1", "tier2", "tier3", "tier4", "tier5", "custom"]);
/*  Rate-limit support  */
export const rateMetricEnum = pgEnum("rate_metric", ["playground_total_requests", "api_requests", "api_tokens"]);
export const granularityEnum = pgEnum("granularity", ["minute", "hour", "day", "month", "all_time"]);
export const creditLedgerReasonEnum = pgEnum("credit_ledger_reason", ["purchase", "refund", "add", "auto_refill", "bonus", "other"]);
export const apiKeyStatusEnum = pgEnum("api_key_status", ["active", "revoked"]);
/*-----------------------------------------------

  
/*-----------------------------------------------
* PROFILES
* One row per Supabase auth.user
*-----------------------------------------------*/
export const profiles = pgTable(
  "profiles",
  {
    // Basic info
    id: uuid("id").primaryKey().notNull(),
    email: text("email").notNull(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    avatar_url: text("avatar_url"),

    // Account type
    account_type: accountTypeEnum("account_type").notNull().default("individual"),
    completed_quickstart: boolean("completed_quickstart").default(false).notNull(),

    // Tier
    tier: tierEnum("tier").notNull().default("free"),

    // Plan
    active_plan_id: uuid("active_plan_id")
      .references(() => plans.id)
      .default(sql`NULL`),

    // Credit Related Info
    // TODO: add this
    credit_balance: decimal("credit_balance", { precision: 12, scale: 2 }).default("0").notNull(),
    credit_balance_updated_at: timestamp("credit_balance_updated_at", { withTimezone: true }).defaultNow().notNull(),
    credit_auto_refill_enabled: boolean("credit_auto_refill_enabled").default(false).notNull(),
    credit_auto_refill_amount: integer("credit_auto_refill_amount").default(0).notNull(),

    // Stripe.
    // TODO: add this
    stripe_customer_id: varchar("stripe_customer_id", { length: 255 }),
    stripe_subscription_id: varchar("stripe_subscription_id", { length: 255 }),
    stripe_active_plan: varchar("stripe_active_plan", { length: 50 }),
    stripe_plan_status: varchar("stripe_plan_status", { length: 20 }),

    // Timestamps
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
    }).onDelete("cascade"),


    // Indexes
    uniqueIndex("ux_profiles_email").on(table.email),
    index("idx_profiles_active_plan").on(table.active_plan_id),

    pgPolicy("Select your own profile or your organization's members.", profilesSelectOwnOrOrgPeers()),
    pgPolicy("Update your own profile. Not allowed to update org-only members.", profilesUpdateOwn()),
  ]
);

/*-----------------------------------------------
 * ORGANIZATIONS (Teams)
 *-----------------------------------------------*/
export const organizations = pgTable(
  "organizations",
  {
    // Basic info
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull(),
    logo_url: text("logo_url"),

    // Plan
    active_plan_id: uuid("active_plan_id")
      .references(() => plans.id)
      .default(sql`NULL`),

    // Tier
    tier: tierEnum("tier").notNull().default("free"),

    // Credit Related Info
    // TODO: add this
    credit_balance: decimal("credit_balance", { precision: 12, scale: 2 }).default("0").notNull(),
    credit_balance_updated_at: timestamp("credit_balance_updated_at", { withTimezone: true }).defaultNow().notNull(),
    credit_auto_refill_enabled: boolean("credit_auto_refill_enabled").default(false).notNull(),
    credit_auto_refill_amount: integer("credit_auto_refill_amount").default(0).notNull(),

    // Stripe.
    stripe_customer_id: varchar("stripe_customer_id", { length: 255 }),
    stripe_subscription_id: varchar("stripe_subscription_id", { length: 255 }),
    stripe_active_plan: varchar("stripe_active_plan", { length: 50 }),
    stripe_plan_status: varchar("stripe_plan_status", { length: 20 }),

    // extras
    description: text("description"),
    website: varchar("website", { length: 200 }),
    contact_email: text("contact_email"),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),

    // relationships

    created_by: uuid("created_by")
      .references(() => profiles.id, { onDelete: "set null" })
      .notNull(),

    // timestamps

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [

    
    // Indexes
    uniqueIndex("ux_orgs_slug").on(table.slug),
    index("idx_orgs_active_plan").on(table.active_plan_id),

    // Policies
    pgPolicy("Orgs are visible to both the creator of the org and its members.", orgsSelectCreatorOrMembers()),
    pgPolicy("Only the creator can update or delete the org.", orgsManageByCreator()),
  ]
);

/*-----------------------------------------------
 * ORGANIZATION_MEMBERS
 * link profiles ↔ organizations
 *-----------------------------------------------*/
export const organizationMembers = pgTable(
  "organization_members",
  {
    organization_id: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    profile_id: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),

    role: organizationRoleEnum("role").notNull().default("member"),
    invited_by: uuid("invited_by").references(() => profiles.id),
    joined_at: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("ux_org_members_unique").on(table.organization_id, table.profile_id), index("idx_org_members_profile").on(table.profile_id), pgPolicy("Organization Members: Organization members are visible to org peers", membersSelectOrgPeers()), pgPolicy("Organization Members: Organization admins can manage org members (add, update, delete)", membersManageByOrgAdmins())]
);

/*-----------------------------------------------
 * PROJECTS (Unified)
 * Owned by a profile _or_ an organization
 * Supports soft-delete via `archived_at`
 *-----------------------------------------------*/
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    profile_id: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "set null" })
      .default(sql`NULL`), // must be null if org-owned
    organization_id: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "set null" })
      .default(sql`NULL`),

    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull(),
    description: text("description"),

    // Allows for archiving projects
    archived_at: timestamp("archived_at", { withTimezone: true }),

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Exactly one owner must be set
    check(
      "check_project_owner",
      sql`
          (profile_id IS NOT NULL AND organization_id IS NULL)
          OR 
          (profile_id IS NULL AND organization_id IS NOT NULL)
        `
    ),

    // unique slug per owner
    uniqueIndex("ux_projects_owner_slug").on(table.profile_id, table.organization_id, table.slug),

    // new: heavy-lookup indexes
    index("idx_projects_profile").on(table.profile_id),
    index("idx_projects_organization").on(table.organization_id),

    // RLS
    pgPolicy("Projects are visible to an organization's owners/creator or its members", projectsSelectOwnerOrOrgPeers()),
    pgPolicy("Projects are manageable by an organization's owner/creator or its admins", projectsManageByOwnerOrOrgAdmins()),
  ]
);

/*-----------------------------------------------
 * API KEYS (Unified)
 * Linked to projects (cascade on hard-delete)
 *-----------------------------------------------*/
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    project_id: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    status: apiKeyStatusEnum("status").notNull().default("active"),
    prefix: varchar("prefix", { length: 15 }).notNull(),
    hash: text("hash").notNull(),

    // optional metadata
    description: text("description"),
    expires_at: timestamp("expires_at", { withTimezone: true }),

    created_by: uuid("created_by")
      .references(() => profiles.id)
      .notNull(),

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    revoked_at: timestamp("revoked_at", { withTimezone: true }),
    revoked_by: uuid("revoked_by").references(() => profiles.id),
  },
  (table) => [
    uniqueIndex("ux_api_keys_prefix").on(table.prefix),
    uniqueIndex("ux_api_keys_hash").on(table.hash),
    index("idx_api_keys_project").on(table.project_id),
    pgPolicy("API Keys are visible to a project's owner or the organization's members", apiKeysSelectVisible()),
    pgPolicy("API Keys are manageable by a project's owner or the organization's admins", apiKeysManageByOwnerOrOrgAdmins()),
  ]
);

/*-----------------------------------------------
 * PLANS
 * These are the plans that are available to users.
 *-----------------------------------------------*/
export const plans = pgTable(
  "plans",
  {
    // Basic info
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),

    // Type and is Default
    type: planTypeEnum("type").notNull(), // who can pick it
    is_default: boolean("is_default").default(false).notNull(), // is this the default plan for the type

    // Move these from features to dedicated columns
    starting_credit: decimal("starting_credit", { precision: 12, scale: 2 }).default("0").notNull(),
    monthly_credit: decimal("monthly_credit", { precision: 12, scale: 2 }).default("0"),
    tier: tierEnum("tier").notNull().default("free"),
    
    // Keep features for truly optional properties
    features: jsonb("features").default(sql`'{}'::jsonb`),

    // Timestamps
    currently_available: boolean("currently_available").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("ux_plan_type_name").on(t.type, t.name),
    // Add constraint for single default plan per type
    uniqueIndex("ux_default_plan_by_type").on(t.type).where(sql`is_default = true`),

    pgPolicy("Plans are readable by anyone", {
      for: "select",
      to: "anon",
      using: sql`true`,
    }),
  ]
);

/*-----------------------------------------------
 * PLAN RATE LIMITS
 * These are the rate limits for each plan.
 *-----------------------------------------------*/
export const planRateLimits = pgTable(
  "tier_rate_limits",
  {
    plan_id: uuid("plan_id")
      .references(() => plans.id)
      .notNull(),

    metric: rateMetricEnum("metric").notNull(),
    value: bigint("value", { mode: "number" }).notNull(), // 0 = unlimited
    granularity: granularityEnum("granularity").default("all_time").notNull(),
  },
  (t) => [
    // Indexes
    uniqueIndex("ux_plan_metric_granularity").on(t.plan_id, t.metric, t.granularity),

    pgPolicy("Plan limits are readable by anyone", {
      for: "select",
      to: "anon",
      using: sql`true`,
    }),
  ]
);

/*-----------------------------------------------
 * USAGE_RECORDS
 * Immutable log of each usage event
 * Usage is tied to either a profile, organization, or project
 *-----------------------------------------------*/
export const usageRecords = pgTable(
  "usage_records",
  {
    // Basic info and identifiers
    id: uuid("id").primaryKey().defaultRandom(),
    profile_id: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
    organization_id: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    project_id: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),

    // optional link to the key used
    api_key_id: uuid("api_key_id")
      .references(() => apiKeys.id, { onDelete: "set null" })
      .default(sql`NULL`),

    // Usage info
    metric: rateMetricEnum("metric").notNull(), // e.g. "playground_total_requests"
    granularity: granularityEnum("granularity").notNull(), // e.g. "minute", "hour", "day", "month", "all_time"
    quantity: bigint("quantity", { mode: "number" }).notNull(), // switch to bigint for high-throughput
    recorded_at: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(), // when the usage was recorded
  },
  (t) => [
    // Exactly one owner must be set
    check(
      "chk_usage_records_one_owner",
      sql`
          (
            (profile_id     IS NOT NULL)::int
          + (organization_id IS NOT NULL)::int
          + (project_id     IS NOT NULL)::int
          ) = 1
        `
    ),

    // Single-column indexes for ad-hoc lookups
    index("idx_usage_records_profile").on(t.profile_id),
    index("idx_usage_records_org").on(t.organization_id),
    index("idx_usage_records_project").on(t.project_id),
    index("idx_usage_records_metric").on(t.metric),
    index("idx_usage_records_time").on(t.recorded_at),

    // Composite index for common rate-limit queries
    index("idx_usage_records_proj_metric_time").on(t.project_id, t.metric, t.recorded_at),

    // RLS: owners or their org members can read logs
    pgPolicy("Usage records are visible to individual or org. members", usageRecordsAndCountersSelectVisible()),
  ]
);

/*-----------------------------------------------
 * USAGE_COUNTERS
 * Time-bucketed counters for fast rate-limit checks
 *-----------------------------------------------*/
export const usageCounters = pgTable(
  "usage_counters",
  {
    // Basic info and identifiers
    id: uuid("id").primaryKey().defaultRandom(),
    profile_id: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
    organization_id: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    project_id: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),

    // Usage info
    metric: rateMetricEnum("metric").notNull(),
    granularity: granularityEnum("granularity").notNull(), // 'minute','hour','day','month','all_time'
    period_start: timestamp("period_start", { withTimezone: true }).defaultNow().notNull(), // bucket boundary

    // Usage info
    quantity: integer("quantity").notNull(), // accumulated count
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    check(
      "chk_usage_counters_one_owner",
      sql`
      (
        (profile_id    IS NOT NULL)::int
      + (organization_id IS NOT NULL)::int
      + (project_id    IS NOT NULL)::int
      ) = 1
    `
    ),
    // one counter per bucket
    uniqueIndex("ux_usage_counters_bucket").on(t.profile_id, t.organization_id, t.project_id, t.metric, t.granularity, t.period_start),

    // fast lookups by owner
    index("idx_usage_counters_profile").on(t.profile_id),
    index("idx_usage_counters_org").on(t.organization_id),
    index("idx_usage_counters_project").on(t.project_id),
    index("idx_usage_counters_time").on(t.period_start),

    // RLS: owners or their org members can read counters
    pgPolicy("Usage Counters are visible to the individual or org. members", usageRecordsAndCountersSelectVisible()),
  ]
);

/*-----------------------------------------------
 * CREDIT LEDGER
 *-----------------------------------------------*/
/*-----------------------------------------------
 * CREDIT LEDGER
 * Immutable, audit-ready ledger of credit changes
 *-----------------------------------------------*/
export const creditLedger = pgTable(
  "credit_ledger",
  {
    // Basic info and identifiers
    id: uuid("id").primaryKey().defaultRandom(),
    profile_id: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
    organization_id: uuid("organization_id").references(() => organizations.id, { onDelete: "set null" }),

    // Credit Ledger info
    delta: bigint("delta", { mode: "number" }).notNull(), // use bigint for large volumes
    balance: bigint("balance", { mode: "number" }).notNull(),
    reason: creditLedgerReasonEnum("reason").notNull(),

    // Metadata about the transaction
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),

    // Timestamps
    recorded_at: timestamp("recorded_at", { withTimezone: true }  ).defaultNow().notNull(),
  },
  (t) => [
    // Exactly one owner must be set
    check(
      "check_credit_one_owner",
      sql`
            (profile_id IS NOT NULL AND organization_id IS NULL)
            OR 
            (profile_id IS NULL AND organization_id IS NOT NULL)
          `
    ),

    // Balance must never go negative
    check("chk_credit_balance_nonnegative", sql`balance >= 0`),

    // Single-col indexes
    index("idx_credit_ledger_profile").on(t.profile_id),
    index("idx_credit_ledger_org").on(t.organization_id),
    index("idx_credit_ledger_time").on(t.recorded_at),
    index("idx_credit_ledger_reason").on(t.reason),

    // Composite time-range lookups
    index("idx_credit_ledger_profile_time").on(t.profile_id, t.recorded_at),
    index("idx_credit_ledger_org_time").on(t.organization_id, t.recorded_at),

    // GIN index for JSON metadata queries
    // index("idx_credit_ledger_metadata").on(t.metadata).using("gin"),

    // RLS: owners or org-members only
    pgPolicy("Credit Ledger is visible to the individual or org. members", creditLedgerSelectVisible()),
  ]
);
