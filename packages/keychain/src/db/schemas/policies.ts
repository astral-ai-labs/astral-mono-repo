import { sql } from "drizzle-orm";

import { authenticatedRole } from "drizzle-orm/supabase";

/*-----------------------------------------------
 * Policy functions
 *-----------------------------------------------*/

/**
 * Policy: profilesSelectOwnOrOrgPeers
 * -----------------------------------
 * Allows a user to SELECT (read) from the `profiles` table if:
 *   - The profile belongs to themselves (auth.uid() = id), OR
 *   - The profile belongs to another member of any organization(s) they are a member of (org peer).
 * This enables users to see their own profile and the profiles of their organization peers, but not unrelated users.
 *
 * Used in: Profiles table select policy
 */
export const profilesSelectOwnOrOrgPeers = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
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
    `,
});

/**
 * Policy: profilesUpdateOwn
 * ------------------------
 * Allows a user to UPDATE their own profile row in the `profiles` table.
 * Both the USING and WITH CHECK clauses ensure that only the owner of the profile (auth.uid() = id) can update it.
 *
 * Used in: Profiles table update policy
 */
export const profilesUpdateOwn = () => ({
  for: "update" as const,
  to: authenticatedRole,
  using: sql`auth.uid() = id`,
  withCheck: sql`auth.uid() = id`,
});

/**
 * Policy: orgsSelectCreatorOrMembers
 * ----------------------------------
 * Allows a user to SELECT (read) from the `organizations` table if:
 *   - They are the creator of the organization (created_by = auth.uid()), OR
 *   - They are a member of the organization (via organization_members).
 * This ensures only org creators and members can see organization details.
 *
 * Used in: Organizations table select policy
 */
export const orgsSelectCreatorOrMembers = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
      created_by = auth.uid()
      OR id IN (
        SELECT organization_id
        FROM organization_members
        WHERE profile_id = auth.uid()
      )
    `,
});

/**
 * Policy: orgsManageByCreator
 * ---------------------------
 * Allows a user to perform ALL actions (select, update, delete, etc.) on an organization if they are the creator.
 * This restricts full management of organizations to their original creator.
 *
 * Used in: Organizations table update/delete policy
 */
export const orgsManageByCreator = () => ({
  for: "all" as const,
  to: authenticatedRole,
  using: sql`created_by = auth.uid()`,
});

/**
 * Policy: membersSelectOrgPeers
 * -----------------------------
 * Allows a user to SELECT (read) from the `organization_members` table if:
 *   - The organization is one they are a member of.
 * This lets users see the membership list of their own organizations, but not others.
 *
 * Used in: Organization members table select policy
 */
export const membersSelectOrgPeers = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`is_member_of_org(organization_id)`,
});

/**
 * Policy: membersManageByOrgAdmins
 * --------------------------------
 * Allows a user to perform ALL actions (insert, update, delete, etc.) on `organization_members` if:
 *   - They are an admin in the relevant organization.
 * This restricts membership management to organization admins only.
 *
 * Used in: Organization members table manage policy
 */
export const membersManageByOrgAdmins = () => ({
  for: "all" as const,
  to: authenticatedRole,
  using: sql`
      role = 'admin'
      AND 
      is_member_of_org(organization_id)
      
    `,
});

/**
 * Policy: projectsSelectOwnerOrOrgPeers
 * -------------------------------------
 * Allows a user to SELECT (read) from the `projects` table if:
 *   - They are the owner of the project (profile_id = auth.uid()), OR
 *   - They are a member of the organization that owns the project.
 * This enables both individual owners and organization members to view projects they are associated with, but not unrelated users.
 *
 * Used in: Projects table select policy
 */
export const projectsSelectOwnerOrOrgPeers = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
      (profile_id = auth.uid())
      OR
      (
        organization_id IN (
          SELECT organization_id
          FROM organization_members
          WHERE profile_id = auth.uid()
        )
      )
    `,
});

/**
 * Policy: projectsManageByOwnerOrOrgAdmins
 * ----------------------------------------
 * Allows a user to perform ALL actions (insert, update, delete, etc.) on a project if:
 *   - They are the owner of the project (profile_id = auth.uid()), OR
 *   - They are an admin of the organization that owns the project.
 * This restricts project management to individual owners and organization admins, preventing unauthorized changes by regular org members or unrelated users.
 *
 * Used in: Projects table manage policy
 */
export const projectsManageByOwnerOrOrgAdmins = () => ({
  for: "all" as const,
  to: authenticatedRole,
  using: sql`
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
    `,
});

/**
 * Policy: apiKeysSelectVisible
 * ---------------------------
 * Allows a user to SELECT (read) from the `api_keys` table if:
 *   - They are the owner of the project associated with the API key (project.profile_id = auth.uid()), OR
 *   - They are a member of the organization that owns the project associated with the API key.
 * This enables both individual project owners and organization peers to view API keys for projects they are associated with, but not unrelated users.
 *
 * Used in: API Keys table select policy
 */
export const apiKeysSelectVisible = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
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
    `,
});

/**
 * Policy: apiKeysManageByOwnerOrOrgAdmins
 * ---------------------------------------
 * Allows a user to perform ALL actions (insert, update, delete, etc.) on an API key if:
 *   - They are the owner of the project associated with the API key (project.profile_id = auth.uid()), OR
 *   - They are an admin of the organization that owns the project associated with the API key.
 * This restricts API key management to individual project owners and organization admins, preventing unauthorized changes by regular org members or unrelated users.
 *
 * Used in: API Keys table manage policy
 */
export const apiKeysManageByOwnerOrOrgAdmins = () => ({
  for: "all" as const,
  to: authenticatedRole,
  using: sql`
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
    `,
});

/**
 * Policy: usageRecordsAndCountersSelectVisible
 * --------------------------------------------
 * Allows a user to SELECT (read) from the `usage_records` and `usage_counters` tables if:
 *   - They are the owner of the record/counter (profile_id = auth.uid()), OR
 *   - They are a member of the organization associated with the record/counter.
 * This enables both individual owners and organization members to view their own and their organization's usage data, but not unrelated users.
 *
 * Used in: UsageRecords and UsageCounters table select policies
 */
export const usageRecordsAndCountersSelectVisible = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
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
    `,
});

/**
 * Policy: creditLedgerSelectVisible
 * ---------------------------------
 * Allows a user to SELECT (read) from the `credit_ledger` table if:
 *   - They are the owner of the ledger (profile_id = auth.uid()), OR
 *   - They are a member of the organization associated with the ledger.
 * This enables both individual owners and organization members to view their own and their organization's credit ledger, but not unrelated users.
 *
 * Used in: CreditLedger table select policy
 */
export const creditLedgerSelectVisible = () => ({
  for: "select" as const,
  to: authenticatedRole,
  using: sql`
      profile_id = auth.uid()
      OR
      organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE profile_id = auth.uid()
      )
    `,
});
