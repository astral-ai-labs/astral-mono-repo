/* ==========================================================================*/
// service.ts — Business logic layer for projects and API operations
/* ==========================================================================*/
// Purpose: Business-logic wrappers around the DAL with input validation and output formatting
// Sections: Imports, Helper Functions, Project Services, API Key Services, Organization Services, Public API Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Node.js Core ----
import { randomUUID } from "crypto";

// External Packages ----
import { InferInsertModel } from "drizzle-orm";

// Local Files ----
import { projects, apiKeys } from "./schemas/astral-schema";
import { 
  OwnerType,
  type OwnerScope, 
  type PlanTier,
  type Project,
  type APIKey,
  type ProjectWithApiKeys,
  type GeneratedAPIKey
} from "@/types/projects.types";
import { 
  formatDate, 
  getOwnerParam, 
  generateAPIKeyFromPayload
} from "@/lib/db-utils";
import { 
  dalGetAllProjects, 
  dalGetAllProjectsWithApiKeys, 
  dalDeleteProject, 
  dalUpdateProject, 
  dalCreateAPIKey, 
  dalHasProjects, 
  dalGetAllProjectAPIKeys, 
  dalCreateProject, 
  dalCreateOrganization, 
  dalUpdateOrganization, 
  dalRevokeAPIKey,
  dalGetOwnerTier
} from "./dal";

/* ==========================================================================*/
// Types for Inserts
/* ==========================================================================*/

/**
 * Project insert type for creation operations
 */
type ProjectInsert = InferInsertModel<typeof projects>;

/**
 * API Key insert type for creation operations
 */
type APIKeyInsert = InferInsertModel<typeof apiKeys>;

/* ==========================================================================*/
// Helper Functions
/* ==========================================================================*/

/**
 * Generate a secure API key with JWT payload and tier information
 * 
 * @param scope - Owner scope for the API key
 * @returns Generated API key components
 */
async function generateRawAPIKey(scope: OwnerScope): Promise<GeneratedAPIKey> {
  // Calculate timestamps
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 180 * 24 * 60 * 60; // 180 days expiration

  // Get tier information
  const tier = await dalGetOwnerTier(scope);

  // Generate unique identifier
  const jti = randomUUID();

  // Create JWT payload
  const jwtPayload = {
    sub: scope.id,
    jti: jti,
    tier: tier,
    account_type: scope.kind,
    iat: now,
    exp,
  };

  // Generate the API key using the standalone utility
  const { apiKey, hash } = generateAPIKeyFromPayload(jwtPayload);

  return { id: jti, apiKey, hash };
}

/* ==========================================================================*/
// Project Services
/* ==========================================================================*/

/**
 * Fetch all projects for an owner with optional API keys
 * 
 * @param ownerId - The ID of the owner (profile or organization)
 * @param ownerType - Whether this is an individual or organization
 * @param withApiKeys - Whether to include API keys in the response
 * @returns Array of projects with optional API keys
 * 
 * @example
 * const projects = await fetchProjectsService("user-123", OwnerType.Individual, true);
 */
async function fetchProjectsService(
  ownerId: string, 
  ownerType: OwnerType = OwnerType.Individual, 
  withApiKeys: boolean = true
): Promise<Array<ProjectWithApiKeys>> {
  const ownerParam = getOwnerParam(ownerId, ownerType);

  if (withApiKeys) {
    return await dalGetAllProjectsWithApiKeys(ownerParam);
  } else {
    return await dalGetAllProjects(ownerParam);
  }
}

/**
 * Check if an owner has any projects
 * 
 * @param ownerId - The profile ID to check
 * @returns True if the owner has at least one project
 * 
 * @example
 * const hasProjects = await hasProjectsService("user-123");
 */
async function hasProjectsService(ownerId: string): Promise<boolean> {
  return await dalHasProjects({ profile_id: ownerId });
}

/**
 * Create a new project for an owner
 * 
 * @param name - Human-readable project name
 * @param slug - URL-safe project slug
 * @param ownerId - The ID of the owner
 * @param ownerType - Whether this is an individual or organization
 * @param projectId - Optional custom project ID
 * @param description - Optional project description
 * @returns The created project
 * 
 * @example
 * const project = await createProjectService("My App", "my-app", "user-123", OwnerType.Individual);
 */
async function createProjectService(
  name: string, 
  slug: string, 
  ownerId: string, 
  ownerType: OwnerType, 
  projectId?: string, 
  description?: string
): Promise<Project> {
  return await dalCreateProject({
    id: projectId,
    name,
    slug,
    description,
    profile_id: ownerType === OwnerType.Individual ? ownerId : null,
    organization_id: ownerType === OwnerType.Organization ? ownerId : null,
  });
}

/**
 * Update an existing project
 * 
 * @param projectId - The ID of the project to update
 * @param patch - Object containing fields to update
 * @returns Updated project data or null if not found
 * 
 * @example
 * const updated = await updateProjectService("proj-123", { name: "New Name" });
 */
async function updateProjectService(
  projectId: string,
  patch: { name?: string; description?: string }
): Promise<{
  id: string;
  name: string;
  slug: string;
  description?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
} | null> {
  // Validate the patch
  if (!patch.name && !patch.description) {
    throw new Error("At least one of name or description is required");
  }

  // Update the project
  const updated = await dalUpdateProject(projectId, {
    name: patch.name,
    description: patch.description ?? null,
  });

  if (!updated) return null;

  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description ?? undefined,
    archivedAt: updated.archived_at ? formatDate(updated.archived_at) : undefined,
    createdAt: formatDate(updated.created_at),
    updatedAt: formatDate(updated.updated_at),
  };
}

/**
 * Delete a project by ID
 * 
 * @param projectId - The ID of the project to delete
 * 
 * @example
 * await deleteProjectService("proj-123");
 */
async function deleteProjectService(projectId: string): Promise<void> {
  await dalDeleteProject(projectId);
}

/* ==========================================================================*/
// API Key Services
/* ==========================================================================*/

/**
 * Fetch all API keys for a project
 * 
 * @param projectId - The ID of the project
 * @returns Array of formatted API key data
 * 
 * @example
 * const keys = await fetchProjectApiKeysService("proj-123");
 */
async function fetchProjectApiKeysService(projectId: string): Promise<
  Array<{
    id: string;
    name: string;
    prefix: string;
    description?: string;
    createdAt: string;
    expiresAt?: string;
    revokedAt?: string;
  }>
> {
  const keys: APIKey[] = await dalGetAllProjectAPIKeys(projectId);

  return keys.map((key) => ({
    id: key.id,
    name: key.name,
    prefix: key.prefix,
    description: key.description ?? undefined,
    createdAt: formatDate(key.created_at),
    expiresAt: key.expires_at ? formatDate(key.expires_at) : undefined,
    revokedAt: key.revoked_at ? formatDate(key.revoked_at) : undefined,
  }));
}

/**
 * Revoke an API key
 * 
 * @param apiKeyId - The ID of the API key to revoke
 * @param revokedBy - The ID of the user revoking the key
 * @returns Revocation data or null if key not found
 * 
 * @example
 * const result = await revokeAPIKeyService("key-123", "user-456");
 */
async function revokeAPIKeyService(
  apiKeyId: string,
  revokedBy: string
): Promise<{
  id: string;
  revokedAt: string;
} | null> {
  const key = await dalRevokeAPIKey(apiKeyId, revokedBy);
  if (!key) return null;
  return { id: key.id, revokedAt: formatDate(key.revoked_at!) };
}

/**
 * Create a new API key for a project
 * 
 * @param name - Human-readable name for the API key
 * @param projectId - The ID of the project
 * @param createdBy - The ID of the user creating the key
 * @param scope - Owner scope for JWT generation
 * @returns Object with raw API key, prefix, and database record
 * 
 * @example
 * const { rawApiKey, dbKey } = await createAPIKeyService("Production Key", "proj-123", "user-456", scope);
 */
async function createAPIKeyService(
  name: string, 
  projectId: string, 
  createdBy: string, 
  scope: OwnerScope
): Promise<{ 
  rawApiKey: string; 
  prettyPrefix: string; 
  dbKey: APIKey 
}> {
  // Generate the raw API key
  const { id, apiKey, hash } = await generateRawAPIKey(scope);

  // Generate the pretty prefix (first 15 chars)
  const prettyPrefix = apiKey.substring(0, 15);

  // Insert the API key into database
  const dbKey = await dalCreateAPIKey({
    id: id,
    name,
    project_id: projectId,
    created_by: createdBy,
    prefix: prettyPrefix,
    hash: hash,
  });

  return { rawApiKey: apiKey, prettyPrefix, dbKey };
}

/**
 * Regenerate an existing API key
 * 
 * @param apiKeyId - The ID of the API key to regenerate
 * @param projectId - The ID of the project
 * @param userId - The ID of the user performing the regeneration
 * @param scope - Owner scope for JWT generation
 * @param newName - Optional new name for the regenerated key
 * @returns Object with new raw API key, prefix, and database record
 * 
 * @example
 * const { rawApiKey } = await regenerateAPIKeyService("key-123", "proj-456", "user-789", scope);
 */
async function regenerateAPIKeyService(
  apiKeyId: string, 
  projectId: string, 
  userId: string, 
  scope: OwnerScope, 
  newName?: string
): Promise<{ 
  rawApiKey: string; 
  prettyPrefix: string; 
  dbKey: APIKey 
}> {
  // Revoke the existing key
  const revokedKey = await dalRevokeAPIKey(apiKeyId, userId);

  if (!revokedKey) {
    throw new Error(`API key with ID ${apiKeyId} not found or already revoked`);
  }

  // Create a new key with the same name (or new name if provided)
  const keyName = newName || revokedKey.name;

  // Generate the new API key
  return await createAPIKeyService(keyName, projectId, userId, scope);
}

/* ==========================================================================*/
// Organization Services
/* ==========================================================================*/

/**
 * Create a new organization
 * 
 * @param params - Organization creation parameters
 * @returns Created organization data
 * 
 * @example
 * const org = await createOrganizationService({
 *   name: "Acme Corp",
 *   slug: "acme-corp", 
 *   createdBy: "user-123"
 * });
 */
async function createOrganizationService({
  name,
  slug,
  createdBy,
  planId,
  tier = "free",
  creditBalance = "0"
}: {
  name: string;
  slug: string;
  createdBy: string;
  planId?: string;
  tier?: PlanTier;
  creditBalance?: string;
}): Promise<{ 
  id: string; 
  name: string; 
  slug: string; 
  createdBy: string; 
  activePlanId?: string 
}> {
  const org = await dalCreateOrganization({
    name,
    slug,
    created_by: createdBy,
    active_plan_id: planId,
    tier: tier,
    credit_balance: creditBalance
  });

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    activePlanId: org.active_plan_id ?? undefined,
    createdBy: org.created_by
  };
}

/**
 * Fetch an organization by ID
 * 
 * @param id - The organization ID
 * @returns Organization data or null if not found
 * 
 * @example
 * const org = await fetchOrganizationService("org-123");
 */
async function fetchOrganizationService(id: string): Promise<{ 
  id: string; 
  name: string; 
  slug: string; 
  createdBy: string 
} | null> {
  // TODO: Implement dalGetOrganization function
  console.log(`Organization fetch requested for ID: ${id}`);
  return null;
}

/**
 * Update an organization
 * 
 * @param id - The organization ID
 * @param patch - Fields to update
 * @returns Updated organization data or null if not found
 * 
 * @example
 * const updated = await updateOrganizationService("org-123", { name: "New Name" });
 */
async function updateOrganizationService(
  id: string,
  patch: { name?: string; slug?: string }
): Promise<{ 
  id: string; 
  name: string; 
  slug: string; 
  createdBy: string 
} | null> {
  const org = await dalUpdateOrganization(id, {
    name: patch.name,
    slug: patch.slug
  });
  
  if (!org) return null;

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdBy: org.created_by
  };
}

/**
 * Delete an organization
 * 
 * @param id - The organization ID
 * 
 * @example
 * await deleteOrganizationService("org-123");
 */
async function deleteOrganizationService(id: string): Promise<void> {
  // TODO: Implement dalDeleteOrganization function
  console.log(`Organization deletion requested for ID: ${id}`);
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export {
  // Re-export from types
  OwnerType,
  
  // Project Services
  fetchProjectsService,
  hasProjectsService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
  
  // API Key Services
  fetchProjectApiKeysService,
  revokeAPIKeyService,
  createAPIKeyService,
  regenerateAPIKeyService,
  
  // Organization Services
  createOrganizationService,
  fetchOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
};

export type {
  // Re-export from types
  OwnerScope,
  PlanTier,
  Project,
  APIKey,
  ProjectWithApiKeys,
  GeneratedAPIKey,
  
  // Service-specific types
  ProjectInsert,
  APIKeyInsert,
};
