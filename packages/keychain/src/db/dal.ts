/* -------------------------------------------------------------------------
 * Astral Data-Access Layer (Projects & API Keys)
 * -------------------------------------------------------------------------
 * This file contains a thin, **side-effect-free** DAO that wraps Drizzle-ORM
 * calls for working with `projects` and `api_keys`.
 *
 * Design goals
 * ------------
 * • **Single-purpose functions** – each helper maps 1-to-1 with a concrete
 *   query so the service layer can compose them freely.
 * • **Safety & correctness** – runtime validation of caller intent (exactly
 *   one owner for a project).
 * • **Low latency** – leverage Drizzle's compiled queries and batched lookups.
 * • **Observability** – structured logging records query intent and outcomes.
 * • **No business logic** – permissions and RLS live in the DB. DAO only handles
 *   data fetching/mutation.
 * -------------------------------------------------------------------------*/

// DB
import { astralDb as db } from "@/db/index"

// Schemas
import { projects, apiKeys, organizations, organizationMembers, usageRecords, usageCounters, tierEnum, profiles, planRateLimits, plans } from "@/db/schemas/astral-schema";

// Drizzle ORM
import { eq, and, sql, count, inArray, desc } from "drizzle-orm";

// Infer types
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Types
import type { OwnerScope, ProjectWithApiKeys } from "@/types/projects.types";

// Logger
import { logger } from "@/lib/logger";

/* -------------------------------------------------------------------------
 * Database Helper Functions
 * -------------------------------------------------------------------------*/

/**
 * Asserts that an INSERT operation returned a row
 * INSERT operations should always return a row unless there's a constraint violation
 */
function assertInsertResult<T>(rows: T[], operation: string): T {
  if (rows.length === 0) {
    throw new Error(`${operation} failed: No row returned from database`);
  }
  return rows[0]!;
}

/**
 * Safely extracts the first row from UPDATE operations
 * UPDATE operations may legitimately affect 0 rows
 */
function extractUpdateResult<T>(rows: T[]): T | null {
  return rows.length > 0 ? rows[0]! : null;
}

/**
 * Safely extracts count from COUNT queries
 * COUNT queries should always return a result
 */
function extractCountResult(rows: Array<{ count: number }>): number {
  if (rows.length === 0) {
    throw new Error("COUNT query failed: No result returned");
  }
  return Number(rows[0]!.count);
}

/**
 * Asserts that a SELECT operation found the expected row
 * Use when the absence of a row indicates an error condition
 */
function assertSelectResult<T>(rows: T[], operation: string, identifier?: string): T {
  if (rows.length === 0) {
    const details = identifier ? ` (${identifier})` : '';
    throw new Error(`${operation} failed: Record not found${details}`);
  }
  return rows[0]!;
}

/* -------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------*/

/** Type aliases for table rows */

// Projects
export type Project = InferSelectModel<typeof projects>;
export type ProjectInsert = InferInsertModel<typeof projects>;

// API Keys
export type APIKey = InferSelectModel<typeof apiKeys>;
export type APIKeyInsert = InferInsertModel<typeof apiKeys>;

// Organizations and their members
export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferInsertModel<typeof organizations>;
export type OrganizationMember = InferSelectModel<typeof organizationMembers>;
export type OrganizationMemberInsert = InferInsertModel<typeof organizationMembers>;

// Usage Records and Counters
export type UsageRecordInsert = InferInsertModel<typeof usageRecords>;
export type UsageCounterInsert = InferInsertModel<typeof usageCounters>;
export type RateMetric = UsageRecordInsert["metric"];
export type Granularity = UsageRecordInsert["granularity"];

/* -------------------------------------------------------------------------
 * Utilities and Helpers
 * -------------------------------------------------------------------------*/

/**
 * Guard: ensure exactly one of two mutually-exclusive params is provided.
 */
function xor<T, U>(a: T | undefined, b: U | undefined, fieldA: string, fieldB: string): asserts a is T | undefined {
  if ((a ? 1 : 0) + (b ? 1 : 0) !== 1) {
    throw new Error(`Exactly one of \`${fieldA}\` or \`${fieldB}\` must be supplied.`);
  }
}

/**
 * getPlanId
 * ---------
 * Fetches the active plan ID for the given owner.
 * @returns The owner's active plan ID
 */
async function getPlanId(scope: OwnerScope, allowProjectFallback: boolean = false): Promise<string | null> {
  if (scope.kind === "profile") {
    const [row] = await db.select({ pid: profiles.active_plan_id }).from(profiles).where(eq(profiles.id, scope.id)).limit(1);
    return row?.pid ?? null;
  } else if (scope.kind === "organization") {
    const [row] = await db.select({ pid: organizations.active_plan_id }).from(organizations).where(eq(organizations.id, scope.id)).limit(1);
    return row?.pid ?? null;
  } else if (scope.kind === "project" && allowProjectFallback) {
    const [row] = await db.select({ pid: projects.id }).from(projects).where(eq(projects.id, scope.id)).limit(1);
    return row?.pid ?? null;
  } else {
    throw new Error(`Invalid owner scope kind: ${scope.kind}`);
  }
}

/**
 * Creates a WHERE clause for filtering non-archived projects by owner
 * @param owner The owner (profile or organization) to filter by
 * @returns SQL where condition
 */
function getProjectsOwnerFilter(owner: { profileId?: string; organizationId?: string }) {
  return owner.profileId ? and(eq(projects.profile_id, owner.profileId), sql`archived_at IS NULL`) : and(eq(projects.organization_id, owner.organizationId!), sql`archived_at IS NULL`);
}

/* =====================================================================
 * Section 1 – Owners / Base
 * ====================================================================*/

/**
 * getOwnerPlanId
 * -------------------------
 * Fetches the owner's plan ID.
 * @returns The owner's plan ID
 */
export async function dalGetOwnerPlanId(scope: OwnerScope): Promise<string | null> {
  // 1) Extract the plan ID from the owner record
  const planId = await getPlanId(scope, true);

  console.log("The plan ID is", planId);

  // 3) if no plan → return defaults
  if (!planId) {
    return null;
  }

  return planId;
}

/* =====================================================================
 * Section 2 – Projects
 * ====================================================================*/

/**
 * createProject
 * -------------
 * Inserts a new project owned **either** by a profile **or** an organization.
 * IDs and timestamps are generated by the DB defaults.
 *
 * @param input.name            – Human-readable name (≤100 chars)
 * @param input.slug            – URL slug unique per owner
 * @param input.description     – Optional free-form text
 * @param input.profileId       – Set if profile-owned
 * @param input.organizationId  – Set if org-owned
 * @returns The newly-created `projects` row
 */
export async function dalCreateProject(input: ProjectInsert): Promise<Project> {
  xor(input.profile_id, input.organization_id, "profile_id", "organization_id");

  const rows = await db
    .insert(projects)
    .values({
      id: input.id,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      profile_id: input.profile_id ?? null,
      organization_id: input.organization_id ?? null,
    })
    .returning();

  const row = assertInsertResult(rows, "dalCreateProject");
  logger.info({ msg: "project.created", projectId: row.id, owner: input.profile_id || input.organization_id });
  return row;
}

/**
 * hasProjects
 * -----------
 * Fast existence check to see if an owner already has ≥1 project.
 * @returns `true` if ≥1 project exists, else `false`
 */
export async function dalHasProjects(owner: { profile_id?: string; organization_id?: string }): Promise<boolean> {
  xor(owner.profile_id, owner.organization_id, "profile_id", "organization_id");

  const rows = await db
    .select({ count: count() })
    .from(projects)
    .where(owner.profile_id ? eq(projects.profile_id, owner.profile_id) : eq(projects.organization_id, owner.organization_id!));

  const c = extractCountResult(rows);
  return c > 0;
}

/**
 * updateProject
 * -------------
 * Partial update – only mutable columns are allowed. Updates `updated_at`.
 * @returns The updated `projects` row, or `null` if no changes applied
 */
export async function dalUpdateProject(
  projectId: string,
  patch: {
    name?: string;
    slug?: string;
    description?: string | null;
    archivedAt?: Date | null;
  }
): Promise<Project | null> {
  if (Object.keys(patch).length === 0) return null;

  const rows = await db
    .update(projects)
    .set({
      ...(patch.name !== undefined && { name: patch.name }),
      ...(patch.slug !== undefined && { slug: patch.slug }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.archivedAt !== undefined && { archived_at: patch.archivedAt }),
      updated_at: sql`now()` as unknown as Date,
    })
    .where(eq(projects.id, projectId))
    .returning();

  const row = extractUpdateResult(rows);
  if (row) {
    logger.info({ msg: "project.updated", projectId });
  }
  return row;
}

/**
 * deleteProject
 * -------------
 * Hard-deletes a project. Prefer soft-delete via `archived_at` if uncertain.
 * @returns `void`
 */
export async function dalDeleteProject(projectId: string): Promise<void> {
  await db.delete(projects).where(eq(projects.id, projectId));
  logger.warn({ msg: "project.deleted", projectId });
}

/**
 * dalGetAllProjects
 * --------------
 * Fetches all non-archived projects for the given owner. Ordered most-recent first.
 * @returns Array of `projects` rows (without API keys)
 */
export async function dalGetAllProjects(owner: { profileId?: string; organizationId?: string }): Promise<Project[]> {
  xor(owner.profileId, owner.organizationId, "profileId", "organizationId");

  return db
    .select()
    .from(projects)
    .where(getProjectsOwnerFilter(owner))
    .orderBy(sql`${projects.created_at} desc`);
}

/**
 * dalGetAllProjectsWithApiKeys
 * --------------
 * Fetches all non-archived projects with their API keys for the given owner. Ordered most-recent first.
 * @returns Array of `projects` rows with their associated API keys
 */
export async function dalGetAllProjectsWithApiKeys(owner: { profileId?: string; organizationId?: string }): Promise<ProjectWithApiKeys[]> {
  xor(owner.profileId, owner.organizationId, "profileId", "organizationId");

  // Query with API keys included
  const result = await db
    .select({
      project: projects,
      apiKey: apiKeys,
    })
    .from(projects)
    .where(getProjectsOwnerFilter(owner))
    .leftJoin(apiKeys, eq(projects.id, apiKeys.project_id))
    .orderBy(sql`${projects.created_at} desc`);

  // Group API keys by project
  const projectMap = new Map<string, ProjectWithApiKeys>();

  for (const row of result) {
    const projectId = row.project.id;

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, {
        ...row.project,
        api_keys: [],
      });
    }

    if (row.apiKey) {
      projectMap.get(projectId)!.api_keys!.push(row.apiKey);
    }
  }

  return Array.from(projectMap.values());
}

/* =====================================================================
 * Section 3 – API Keys
 * ====================================================================*/

/**
 * createAPIKey
 * ------------
 * Inserts a new API key for the specified project.
 * @returns The newly-created `api_keys` row
 */
export async function dalCreateAPIKey(input: APIKeyInsert): Promise<APIKey> {
  const rows = await db
    .insert(apiKeys)
    .values({
      ...input,
      hash: input.hash ?? "",
    })
    .returning();

  const row = assertInsertResult(rows, "dalCreateAPIKey");
  logger.info({ msg: "api_key.created", apiKeyId: row.id, projectId: row.project_id });
  return row;
}

/**
 * revokeAPIKey
 * ------------
 * Marks an API key as revoked. Does not delete the key.
 * @param apiKeyId - The ID of the API key to revoke
 * @param revokedBy - The ID of the profile that revoked the key
 * @returns The updated `api_keys` row, or `null` if key not found
 */
export async function dalRevokeAPIKey(apiKeyId: string, revokedBy: string): Promise<APIKey | null> {
  const [row] = await db
    .update(apiKeys)
    .set({
      revoked_at: sql`now()` as unknown as Date,
      revoked_by: revokedBy,
    })
    .where(eq(apiKeys.id, apiKeyId))
    .returning();

  if (!row) return null;

  logger.info({ msg: "api_key.revoked", apiKeyId, revokedBy });
  return row;
}

/**
 * getAllProjectAPIKeys
 * --------------------
 * Returns every non-revoked API key for the specified project.
 * @returns Array of `api_keys` rows
 */
export async function dalGetAllProjectAPIKeys(projectId: string): Promise<APIKey[]> {
  return db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.project_id, projectId), sql`revoked_at IS NULL`))
    .orderBy(sql`${apiKeys.created_at} desc`);
}

/**
 * projectHasAPIKeys
 * -----------------
 * Lightweight existence check (COUNT 1) for API keys on a project.
 * @returns `true` if ≥1 active key exists, else `false`
 */
export async function projectHasAPIKeys(projectId: string): Promise<boolean> {
  const rows = await db
    .select({ count: count() })
    .from(apiKeys)
    .where(and(eq(apiKeys.project_id, projectId), sql`revoked_at IS NULL`));

  const c = extractCountResult(rows);
  return c > 0;
}

/* =====================================================================
 * Section 4 – Organization Management
 * ====================================================================*/

/**
 * createOrganization
 * ------------------
 * Inserts a new organization. Uses DB defaults for ID, timestamps.
 */
export async function dalCreateOrganization(input: OrganizationInsert): Promise<Organization> {
  const rows = await db.insert(organizations).values(input).returning();
  const row = assertInsertResult(rows, "dalCreateOrganization");
  logger.info({ msg: "organization.created", organizationId: row.id, name: row.name });
  return row;
}

/**
 * updateOrganization
 * ------------------
 * Updates mutable organization fields. Returns updated row or null if no-op.
 */
export async function dalUpdateOrganization(orgId: string, patch: Partial<Omit<OrganizationInsert, "created_by">>): Promise<Organization | null> {
  if (Object.keys(patch).length === 0) return null;
  const rows = await db
    .update(organizations)
    .set({
      ...(patch.name !== undefined && { name: patch.name }),
      ...(patch.slug !== undefined && { slug: patch.slug }),
      ...(patch.logo_url !== undefined && { logo_url: patch.logo_url }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.website !== undefined && { website: patch.website }),
      ...(patch.contact_email !== undefined && { contact_email: patch.contact_email }),
      ...(patch.phone !== undefined && { phone: patch.phone }),
      ...(patch.address !== undefined && { address: patch.address }),
      updated_at: sql`now()`,
    })
    .where(eq(organizations.id, orgId))
    .returning();
  
  const row = extractUpdateResult(rows);
  if (row) {
    logger.info({ msg: "organization.updated", organizationId: orgId });
  }
  return row;
}

/**
 * addOrgMembers
 * -------------
 * Bulk inserts new organization members. Returns inserted rows.
 */
export async function dalAddOrgMembers(
  orgId: string,
  members: Array<{
    profile_id: string;
    role?: OrganizationMemberInsert["role"];
    invited_by?: OrganizationMemberInsert["invited_by"];
  }>
): Promise<OrganizationMember[]> {
  const inserts = members.map((m) => ({
    organization_id: orgId,
    profile_id: m.profile_id,
    role: m.role ?? "member",
    invited_by: m.invited_by ?? null,
  }));
  const rows = await db.insert(organizationMembers).values(inserts).returning();
  logger.info({ msg: "org.members_added", organizationId: orgId, count: rows.length });
  return rows;
}

/**
 * removeOrgMembers
 * ----------------
 * Deletes members by profile IDs from the specified organization.
 */
export async function dalRemoveOrgMembers(orgId: string, profileIds: string[]): Promise<void> {
  if (profileIds.length === 0) return;
  await db.delete(organizationMembers).where(and(eq(organizationMembers.organization_id, orgId), inArray(organizationMembers.profile_id, profileIds)));
  logger.info({ msg: "org.members_removed", organizationId: orgId, count: profileIds.length });
}

/* =====================================================================
 * Section 4 – Rate Limits and Usage Counters
 * ====================================================================*/

/** Maps granularity to the appropriate SQL date truncation */
const PERIOD_START_SQL: Record<string, (ts: Date | string) => unknown> = {
  minute: (ts) => sql`date_trunc('minute', ${ts}::timestamptz)`,
  hour: (ts) => sql`date_trunc('hour', ${ts}::timestamptz)`,
  day: (ts) => sql`date_trunc('day', ${ts}::timestamptz)`,
  month: (ts) => sql`date_trunc('month', ${ts}::timestamptz)`,
  all_time: () => sql`'1970-01-01'::timestamptz`,
};

/* -------------------------------------------------------------------------
 * recordUsage (transactional)
 * -------------------------------------------------------------------------
 * Records usage in both the audit log and counters tables in a single transaction.
 *
 * How it works:
 * 1. Adds a new row to usageRecords (immutable audit log)
 * 2. Updates the counter in usageCounters using an efficient upsert pattern:
 *    - For new usage buckets: Creates a counter starting at the given quantity
 *    - For existing buckets: Increments the existing counter
 *
 * Example:
 *   When recording "5 playground requests" for project ABC:
 *   - If this is the first request this hour → creates counter with quantity=5
 *   - If there were already 10 requests this hour → updates counter to quantity=15
 *
 * Benefits:
 *   - Single database round-trip (vs separate UPDATE then INSERT)
 *   - Thread-safe under concurrent usage
 *   - Keeps rate limit checks fast (single counter lookup vs summing logs)
 * -------------------------------------------------------------------------*/

export async function recordUsage(data: UsageRecordInsert): Promise<void> {
  const now = new Date();
  const gran = data.granularity;

  // Ensure granularity is valid
  const periodStartFn = PERIOD_START_SQL[gran];
  if (!periodStartFn) {
    throw new Error(`Invalid granularity: ${gran}`);
  }

  await db.transaction(async (tx) => {
    // Add to audit log
    await tx.insert(usageRecords).values({ ...data, recorded_at: now });

    // Update counter (create if not exists, increment if exists)
    await tx
      .insert(usageCounters)
      .values({
        profile_id: data.profile_id ?? null,
        organization_id: data.organization_id ?? null,
        project_id: data.project_id ?? null,
        metric: data.metric,
        granularity: gran,
        period_start: periodStartFn(now) as unknown as Date,
        quantity: data.quantity,
      })
      .onConflictDoUpdate({
        target: [usageCounters.profile_id, usageCounters.organization_id, usageCounters.project_id, usageCounters.metric, usageCounters.granularity, usageCounters.period_start],
        set: {
          quantity: sql`${usageCounters.quantity} + ${data.quantity}`,
          updated_at: sql`now()`,
        },
      });
  });
}

/**
 * Resets a usage counter to zero for the given scope, metric, and granularity.
 */
export async function resetCounter(scope: OwnerScope, metric: RateMetric, granularity: Granularity): Promise<void> {
  const scopeFilter = scope.kind === "profile" ? eq(usageCounters.profile_id, scope.id) : scope.kind === "organization" ? eq(usageCounters.organization_id, scope.id) : eq(usageCounters.project_id, scope.id);

  //   Reset the counter
  await db
    .update(usageCounters)
    .set({ quantity: 0, updated_at: sql`now()` })
    .where(and(scopeFilter, eq(usageCounters.metric, metric), eq(usageCounters.granularity, granularity)));
}

/**
 * Checks if the requested usage is allowed based on plan limits.
 * Returns true if the usage can be consumed, false if it would exceed the limit.
 */

/** Input type for rate limit checks */
interface CheckInput {
  scope: OwnerScope;
  metric: RateMetric;
  granularity: Granularity;
  qty?: number; // default 1
}

export async function canConsume({ scope, metric, granularity, qty = 1 }: CheckInput): Promise<boolean> {
  // 1.  Calculate the scope filter based on the owner type
  const scopeFilter = scope.kind === "profile" ? eq(usageCounters.profile_id, scope.id) : scope.kind === "organization" ? eq(usageCounters.organization_id, scope.id) : eq(usageCounters.project_id, scope.id);

  // 2. Get active plan ID for the scope
  const planRow = scope.kind === "profile" ? await db.select({ pid: profiles.active_plan_id }).from(profiles).where(eq(profiles.id, scope.id)).limit(1) : scope.kind === "organization" ? await db.select({ pid: organizations.active_plan_id }).from(organizations).where(eq(organizations.id, scope.id)).limit(1) : await db.select({ pid: projects.id }).from(projects).where(eq(projects.id, scope.id)).limit(1);

  // IMPORTANT: NEED TO SET PLAN ID TO BASIC IN PROFILE TABLE
  const planId = planRow[0]?.pid;
  if (!planId) return true; // No plan means unlimited usage

  // 3. Fetch plan limit (0 = unlimited)
  const [limitRow] = await db
    .select({ max: planRateLimits.value })
    .from(planRateLimits)
    .where(and(eq(planRateLimits.plan_id, planId), eq(planRateLimits.metric, metric), eq(planRateLimits.granularity, granularity)))
    .limit(1);

  if (!limitRow || Number(limitRow.max) === 0) return true;
  const max = Number(limitRow.max);

  // 4. Get current usage counter
  const counter = await db
    .select({ qty: usageCounters.quantity })
    .from(usageCounters)
    .where(and(scopeFilter, eq(usageCounters.metric, metric), eq(usageCounters.granularity, granularity)))
    .orderBy(desc(usageCounters.updated_at))
    .limit(1);

  const current = counter[0] ? Number(counter[0].qty) : 0;
  return current + qty <= max;
}

/* -------------------------------------------------------------------------
 * Section 5 – Tiers and Plans
 * -------------------------------------------------------------------------*/

/**
 * getOwnerTier
 * ------------
 * Fetches the owner's tier.
 */

type Tier = (typeof tierEnum.enumValues)[number];

export async function dalGetOwnerTier(scope: OwnerScope): Promise<Tier> {
  const [row] = await db
    .select({ tier: profiles.tier })
    .from(profiles)
    .where(scope.kind === "profile" ? eq(profiles.id, scope.id) : scope.kind === "organization" ? eq(organizations.id, scope.id) : eq(projects.id, scope.id))
    .limit(1);
  return row?.tier ?? "free";
}

/**
 * getOwnerPlan
 * ------------
 * Fetches the owner's plan.
 */

/** Raw Plan row (as stored in the DB) */
export type Plan = InferSelectModel<typeof plans>;

/** Shape we expect inside the `features` JSON column */
export interface PlanBaseFeatures {
  startingCredit: number; // e.g. 100 = $1.00 if credits are cents
  tier: Tier; // matches tier_enum
}

/** Composite return type with parsed metadata */
export type PlanWithFeatures = Plan & { features: PlanBaseFeatures };

export async function fetchOwnerPlan(overrideId: string | undefined, planType: "individual" | "organization"): Promise<Plan> {
  // Build query dynamically to avoid branching logic later
  const rows = await db
    .select()
    .from(plans)
    .where(overrideId ? eq(plans.id, overrideId) : and(eq(plans.type, planType), eq(plans.is_default, true)))
    .limit(1);

  const plan = assertSelectResult(rows, "fetchOwnerPlan", overrideId ?? `default(${planType})`);
  return plan;
}

/**
 * fetchAllPlans
 * -------------
 * Fetches all available plans with their features.
 * 
 * @returns Object with plans organized by type and ID for easy lookup
 */
export async function fetchAllPlans(): Promise<Record<string, Record<string, Plan>>> {
  const rows = await db.select().from(plans).where(eq(plans.currently_available, true));
  
  // Initialize result structure with empty objects for each plan type
  const result: Record<string, Record<string, Plan>> = {
    individual: {},
    organization: {}
  };

  for (const plan of rows) {
    // Add directly to the appropriate type dictionary, indexed by ID
    if (plan.type === "individual" || plan.type === "organization") {
      result[plan.type]![plan.id] = plan;
    }
  }

  return result;
}

// -------------------------------------------------------------------------
// applyPlanToProfile / applyPlanToOrganization
// -------------------------------------------------------------------------
export async function applyPlanToProfile(profileId: string, plan: PlanWithFeatures): Promise<void> {
  await db
    .update(profiles)
    .set({
      active_plan_id: plan.id,
      tier: plan.features.tier,
      credit_balance: plan.features.startingCredit.toString(),
    })
    .where(eq(profiles.id, profileId));
}

export async function applyPlanToOrganization(orgId: string, plan: PlanWithFeatures): Promise<void> {
  await db
    .update(organizations)
    .set({
      active_plan_id: plan.id,
      tier: plan.features.tier,
      credit_balance: plan.features.startingCredit.toString(),
    })
    .where(eq(organizations.id, orgId));
}
