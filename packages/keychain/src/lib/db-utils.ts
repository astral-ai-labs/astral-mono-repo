/* ==========================================================================*/
// db-utils.ts — Database utility functions and helpers
/* ==========================================================================*/
// Purpose: Shared utilities for database operations, API key generation, and formatting
// Sections: Imports, Constants, Utility Functions, Public API Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Node.js Core ----
import { createHash, randomUUID } from "crypto";

// External Packages ----
import { format } from "date-fns";
import jwt from "jsonwebtoken";

// Local Files ----
import { OwnerType, type PlanTier, type GeneratedAPIKey } from "@/types/projects.types";

/* ==========================================================================*/
// Constants
/* ==========================================================================*/

/**
 * Public prefix for all generated API keys
 */
const API_KEY_PREFIX = "ak-";

/**
 * JWT secret for signing API key tokens
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

/* ==========================================================================*/
// Utility Functions
/* ==========================================================================*/

/**
 * Format a date to ISO string for API responses
 * 
 * @param date - Date object or ISO string to format
 * @returns Formatted ISO string in UTC
 * 
 * @example
 * const formatted = formatDate(new Date());
 * // Returns: "2024-01-15T10:30:00Z"
 */
function formatDate(date: Date | string): string {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

/**
 * Get owner parameter object for database queries
 * 
 * @param ownerId - The ID of the owner (profile or organization)
 * @param ownerType - Whether this is an individual or organization
 * @returns Object with either profileId or organizationId set
 * 
 * @example
 * const param = getOwnerParam("user-123", OwnerType.Individual);
 * // Returns: { profileId: "user-123" }
 */
function getOwnerParam(ownerId: string, ownerType: OwnerType) {
  return ownerType === OwnerType.Individual 
    ? { profileId: ownerId } 
    : { organizationId: ownerId };
}

/**
 * Generate a secure API key with JWT payload
 * 
 * @param jwtPayload - Complete JWT payload for the API key
 * @returns Generated API key components
 * 
 * @example
 * const { apiKey, hash } = generateAPIKeyFromPayload({
 *   sub: "user-123",
 *   jti: "uuid-here",
 *   tier: "free",
 *   account_type: "profile",
 *   iat: now,
 *   exp: expiration
 * });
 */
function generateAPIKeyFromPayload(jwtPayload: {
  sub: string;
  jti: string;
  tier: PlanTier;
  account_type: string;
  iat: number;
  exp: number;
}): Omit<GeneratedAPIKey, 'id'> {
  // Sign the JWT token
  const token = jwt.sign(jwtPayload, JWT_SECRET!, { algorithm: "HS256" });

  // Create random component for additional entropy
  const randomComponent = Buffer.from(randomUUID())
    .toString("hex")
    .substring(0, 8);

  // Combine components into final API key
  const apiKey = `${API_KEY_PREFIX}${randomComponent}-${token}`;

  // Generate secure hash for storage
  const hash = createHash("sha256").update(apiKey).digest("hex");

  return { apiKey, hash };
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export {
  // Constants
  API_KEY_PREFIX,
  
  // Re-export from types
  OwnerType,
  
  // Utility Functions
  formatDate,
  getOwnerParam,
  generateAPIKeyFromPayload,
};

export type {
  // Re-export from types
  PlanTier,
  GeneratedAPIKey,
}; 