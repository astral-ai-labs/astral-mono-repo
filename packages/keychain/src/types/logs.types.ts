/* ==========================================================================*/
// logs.types.ts — Log entry types and logging interfaces
/* ==========================================================================*/
// Purpose: Type definitions for logging operations, usage tracking, and cost analysis
// Sections: Imports, Enums, Base Interfaces, Usage Types, Message Types, Log Entries, Utilities, Public API Exports

/* ==========================================================================*/
// Enums and Basic Types
/* ==========================================================================*/

/**
 * Supported log statuses for tracking operation outcomes
 */
enum LogStatus {
  SUCCESS = "success",
  ERROR = "error",
}

/**
 * Supported model providers for logging operations
 */
enum ModelProvider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  GEMINI = "gemini", 
  GROK = "grok",
  DEEPSEEK = "deepseek",
  META = "meta",
}

/**
 * Supported resource types for different AI operations
 */
enum ResourceType {
  EMBEDDING = "embedding",
  COMPLETION = "completion",
}

/**
 * Resource subtypes for categorizing operation variations
 */
enum ResourceSubtype {
  STANDARD = "standard",
  JSON = "json",
  STRUCTURED = "structured",
  STREAM = "stream",
}

/**
 * Conversation message roles
 */
enum RoleEnum {
  /** Represents a message from the user. */
  USER = "user",
  /** Represents a message from the AI assistant. */
  ASSISTANT = "assistant", 
  /** Represents a system message (e.g., instructions or context). */
  SYSTEM = "system",
}

/**
 * Message content types
 */
enum MessageType {
  /** The message contains plain text. */
  TEXT = "text",
  /** The message contains a URL pointing to an image. */
  IMAGE_URL = "image_url",
  /** The message contains base64 encoded image data. */
  LOCAL_IMAGE = "local_image",
  /** The message contains audio data (specific format TBD). */
  AUDIO = "audio",
}

/* ==========================================================================*/
// Base Interfaces
/* ==========================================================================*/

/**
 * Base usage interface that all log types implement
 */
interface AstralBaseUsage {
  // Minimum required usage data
  total_tokens: number;
}

/**
 * Base cost interface that all log types implement
 */
interface AstralBaseCost {
  // Minimum required cost data
  total_cost: number;
}

/**
 * Core properties for all log entries
 */
interface AstralBaseProperties {
  // Model
  model: string;

  // Provider Name
  provider_name: ModelProvider;

  // Project Name
  project_name: string;

  // Resource Type & Subtype
  resource_type: ResourceType;
  resource_subtype: ResourceSubtype;

  // Log Status
  log_status: LogStatus;

  // Latency properties
  latency_ms: number;
}

/**
 * Base log entry interface for all operation types
 */
interface AstralBaseLogEntry {
  id: string;
  created_at: string;
  updated_at: string;

  // Identifiers
  organization_id?: string | null; // Optional, only set for project logs
  profile_id?: string | null; // Optional, only set for user logs
  project_id: string; // Required, all logs have a project

  // Core properties
  properties: AstralBaseProperties;

  // Usage & Cost
  usage: AstralBaseUsage;
  cost: AstralBaseCost;
}

/* ==========================================================================*/
// Usage and Cost Types
/* ==========================================================================*/

/**
 * Completion-specific usage tracking
 */
interface AstralCompletionsUsage extends AstralBaseUsage {
  // Completion-specific usage details
  prompt_tokens: number;
  completion_tokens: number;

  // Chat Usage Details
  audio_tokens?: number;
  cached_tokens?: number;
  accepted_prediction_tokens?: number;
  rejected_prediction_tokens?: number;
  reasoning_tokens?: number;

  // Anthropic ONLY
  cache_creation_input_tokens?: number;
}

/**
 * Completion-specific cost breakdown
 */
interface AstralCompletionsCost extends AstralBaseCost {
  // Completion-specific cost details
  input_cost: number;
  cached_input_cost?: number;
  output_cost: number;

  // Anthropic ONLY
  anthropic_cache_creation_cost?: number;
}

/* ==========================================================================*/
// Message Types
/* ==========================================================================*/

/**
 * Base message structure for conversations
 */
interface AstralBaseMessage {
  role: RoleEnum;
  type: MessageType;
  content?: string;
}

/**
 * Nested message container for request structure
 */
interface NestedMessage {
  messages: AstralBaseMessage[];
}

/**
 * Base request structure for AI operations
 */
interface AstralBaseRequest {
  messages: NestedMessage;
  temperature: number | null;
  max_tokens: number | null;
}

/**
 * Base response structure for AI operations
 */
interface AstralBaseResponse {
  content: JSON;
}

/* ==========================================================================*/
// Log Entry Types
/* ==========================================================================*/

/**
 * Complete log entry for completion operations
 */
interface AstralCompletionLogEntry extends AstralBaseLogEntry {
  // Completion Request
  request: AstralBaseRequest;
  // Completion Response
  response: AstralBaseResponse;

  // Metadata
  metadata: Record<string, string>;

  // Usage & Cost
  usage: AstralCompletionsUsage;
  cost: AstralCompletionsCost;
}

/* ==========================================================================*/
// Utility Functions
/* ==========================================================================*/

/**
 * Type guard to check if a log entry is a completion log
 * 
 * @param log - The log entry to check
 * @returns True if the log is a completion log
 * 
 * @example
 * if (isCompletionLog(log)) {
 *   console.log(log.usage.prompt_tokens);
 * }
 */
function isCompletionLog(log: AstralBaseLogEntry): log is AstralCompletionLogEntry {
  return log.properties.resource_type === ResourceType.COMPLETION;
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export {
  // Enums
  LogStatus,
  ModelProvider,
  ResourceType,
  ResourceSubtype,
  RoleEnum,
  MessageType,
  
  // Utility Functions
  isCompletionLog,
};

export type {
  // Base Interfaces
  AstralBaseUsage,
  AstralBaseCost,
  AstralBaseProperties,
  AstralBaseLogEntry,
  
  // Usage and Cost Types
  AstralCompletionsUsage,
  AstralCompletionsCost,
  
  // Message Types
  AstralBaseMessage,
  AstralBaseRequest,
  AstralBaseResponse,
  
  // Log Entry Types
  AstralCompletionLogEntry,
};