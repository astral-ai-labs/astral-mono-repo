/* ==========================================================================*/
// projects.types.ts — Project and API Key type definitions
/* ==========================================================================*/
// Purpose: Core types for projects, API keys, and project-related operations
// Sections: Imports, Enums, Base Types, UX Types, Public API Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages ----
import { InferSelectModel } from "drizzle-orm";

// Local Files ----
import { projects, apiKeys, tierEnum } from "../db/schemas/astral-schema";

/* ==========================================================================*/
// Enums
/* ==========================================================================*/

/**
 * Owner types for project operations
 */
enum OwnerType {
  Individual = "individual",
  Organization = "organization",
}

/* ==========================================================================*/
// Base Types
/* ==========================================================================*/

/**
 * OwnerScope defines the ownership context for resources
 * 
 * @example
 * const scope: OwnerScope = { kind: "project", id: "project-123" };
 */
type OwnerScope = { 
  kind: "profile" | "organization" | "project"; 
  id: string 
};

/**
 * Plan tier type from database enum
 */
type PlanTier = typeof tierEnum.enumValues[number];

/**
 * Core project type inferred from database schema
 */
type Project = InferSelectModel<typeof projects>;

/**
 * Core API key type inferred from database schema
 */
type APIKey = InferSelectModel<typeof apiKeys>;

/**
 * Project with associated API keys for detailed views
 */
type ProjectWithApiKeys = Project & { 
  api_keys?: APIKey[] 
};

/**
 * Generated API key result from key generation process
 */
interface GeneratedAPIKey {
  id: string;
  apiKey: string;
  hash: string;
}

/* ==========================================================================*/
// UX Types
/* ==========================================================================*/

// TODO: Add UX-specific types here as needed

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export { OwnerType };

export type { 
  OwnerScope, 
  PlanTier,
  Project, 
  APIKey, 
  ProjectWithApiKeys,
  GeneratedAPIKey 
};
