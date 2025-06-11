// src/db/logging/schema.ts
// -----------------------------------------------------------------------------
// High-volume request/response logging schema.
// Distinguishes between the resource owner and the actor (caller).
// No cross-DB FKs; use JWT claims & async validation if needed.
// -----------------------------------------------------------------------------

import { pgTable, uuid, varchar, timestamp, jsonb, text, doublePrecision, index } from "drizzle-orm/pg-core";
// -----------------------------------------------------------------------------
// REQUEST_LOGS (append-only)
// -----------------------------------------------------------------------------
export const requestLogs = pgTable(
  "request_logs",
  {
    // Primary key
    id: uuid("id").primaryKey().defaultRandom(),

    // ---------------- Owner (resource context) ----------------
    owner_profile_id: uuid("owner_profile_id"), // Nullable: who owns the resource
    owner_organization_id: uuid("owner_organization_id"),

    // ------------ Actor (caller context) ---------------------
    actor_profile_id: uuid("actor_profile_id").notNull(),
    actor_organization_id: uuid("actor_organization_id"), // if acting on behalf of an org
    actor_membership_id: uuid("actor_membership_id"), // optional surrogate key for membership record
    actor_role: varchar("actor_role", { length: 32 }), // e.g. "admin", "member"

    // ------------- Request metadata --------------------------
    provider_name: varchar("provider_name", { length: 32 }).notNull(),
    resource_type: varchar("resource_type", { length: 32 }).notNull(),
    resource_subtype: varchar("resource_subtype", { length: 32 }),
    model: varchar("model", { length: 80 }).notNull(),

    // ---------------- Payloads -------------------------------
    raw_request: jsonb("raw_request").notNull(),
    response_id: text("response_id").notNull(),
    rate_limits: jsonb("rate_limits"),
    raw_response: jsonb("raw_response").notNull(),
    content: jsonb("content"),
    usage: jsonb("usage").notNull(),
    cost: jsonb("cost"),

    // ---------------- Metrics -------------------------------
    latency_ms: doublePrecision("latency_ms").notNull(),
    log_status: varchar("log_status", { length: 16 }).default("success").notNull(),

    // --------------- Misc metadata --------------------------
    metadata: jsonb("metadata"),

    // ---------- Timestamps (partition key) -------------------
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    // -----------------------------------------------------------------------
    // Indexes
    // -----------------------------------------------------------------------
    index("idx_logs_created_at").on(t.created_at),
    index("idx_logs_provider_time").on(t.provider_name, t.created_at),
    index("idx_logs_owner_project_time").on(t.owner_profile_id, t.owner_organization_id, t.created_at),
    index("idx_logs_actor_time").on(t.actor_profile_id, t.created_at),
    index("idx_logs_status_time").on(t.log_status, t.created_at),
    // GIN indexes for deep queries (uncomment if needed)
    // index("idx_logs_raw_request_gin").on(t.raw_request).using("gin"),
    // index("idx_logs_raw_response_gin").on(t.raw_response).using("gin"),
    // index("idx_logs_metadata_gin").on(t.metadata).using("gin"),
  ]
);
