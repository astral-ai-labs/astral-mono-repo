/* ==========================================================================*/
// models.types.ts — Model definitions and provider types
/* ==========================================================================*/
// Purpose: Complete type definitions for AI models, providers, pricing, and features
// Sections: Imports, Enums, Core Interfaces, Model Types, UI Types, Utilities, Public API Exports

/* ==========================================================================*/
// Enums and Basic Types
/* ==========================================================================*/

/**
 * Model performance speed classification
 */
type SpeedType = "fastest" | "fast" | "medium" | "slow" | "slowest";

/**
 * Model intelligence level classification
 */
type IntelligenceType = "low" | "medium" | "high" | "highest";

/**
 * Resource types for different AI operations
 */
type ResourceType = "embedding" | "completion" | "tool" | "audio";

/**
 * Marketing tags for model categorization
 */
type ModelTag =
  | "cost-effective"
  | "fastest"
  | "flagship"
  | "affordable"
  | "powerful"
  | "reasoning"
  | "focused"
  | "small"
  | "flexible"
  | "intelligent"
  | "realtime"
  | "audio"
  | "open-source";

/**
 * Supported AI providers
 */
type ProviderName = "openai" | "anthropic" | "gemini" | "grok" | "deepseek" | "meta";

/* ==========================================================================*/
// Core Interfaces
/* ==========================================================================*/

/**
 * Supported input/output modalities for models
 */
interface Modalities {
  text: boolean;
  image: boolean;
  audio: boolean;
  video: boolean;
}

/**
 * Available model features and capabilities
 */
interface ModelFeatures {
  reasoning_effort: boolean;
  json_mode: boolean;
  structured_output: boolean;
  function_calling: boolean;
  streaming: boolean;
  distillation: boolean;
  fine_tuning: boolean;
  predicted_outputs: boolean;
  code_execution: boolean;
}

/**
 * System instruction support types
 */
interface SystemInstructionSupport {
  system_message: boolean;
  developer_message: boolean;
}

/**
 * Default message type support
 */
interface DefaultMessageSupport {
  model_message: boolean;
  assistant_message: boolean;
  user_message: boolean;
  tool_messages: boolean;
  other_messages: boolean;
}

/**
 * Built-in tool capabilities
 */
interface BuiltInTools {
  web_search: boolean;
  computer_use: boolean;
  file_search: boolean;
}

/**
 * Model context and limitations
 */
interface ModelContext {
  release_date: string; // e.g., "YYYY-MM-DD"
  context_window: number;
  max_output_tokens: number;
  max_output_tokens_reasoning_effort: number | null;
  knowledge_cutoff: string; // e.g., "YYYY-MM-DD"
}

/* ==========================================================================*/
// Pricing Types
/* ==========================================================================*/

/**
 * Base pricing structure for text operations
 */
interface BaseTextPricing {
  input: number; // Price per 1M tokens usually
  input_cache_hit: number;
  input_cache_write?: number; // Optional, especially for non-Anthropic
  output: number;
}

/**
 * Time-based pricing with standard and discount windows
 */
interface TimeBasedTextPricing {
  standard_window: string;
  discount_window: string;
  standard: BaseTextPricing;
  discount: BaseTextPricing;
}

/**
 * Model pricing structure with optional time-based pricing
 */
type ModelPricing =
  | {
      time_based: false;
      text: BaseTextPricing; // Use BaseTextPricing directly
      // Add image, audio pricing if structure expands
    }
  | {
      time_based: true;
      text: TimeBasedTextPricing;
      // Add image, audio pricing if structure expands
    };

/**
 * Rate limits for API usage
 */
interface RateLimits {
  requests_per_minute: number;
  tokens_per_minute: number;
}

/* ==========================================================================*/
// Model Types
/* ==========================================================================*/

/**
 * Model snapshot interface corresponding to model_snapshots table
 */
interface ModelSnapshot {
  id: string; // Corresponds to model_snapshots.id (UUID)
  model_id: string; // Corresponds to model_snapshots.model_id (UUID)
  model_name: string; // Corresponds to model_snapshots.model_name (text, e.g., "gpt-4.5-preview-2025-02-27")
  is_default: boolean; // Corresponds to model_snapshots.is_default and YAML `default` field

  // Direct columns from schema
  speed: SpeedType;
  intelligence: IntelligenceType;

  // Mapped from JSONB columns / YAML structure
  model_pricing: ModelPricing; // from model_snapshots.model_pricing
  model_context: ModelContext; // from model_snapshots.model_context
  input_modalities: Modalities; // from model_snapshots.input_modalities
  output_modalities: Modalities; // from model_snapshots.output_modalities
  features: ModelFeatures; // from model_snapshots.features
  built_in_tools: BuiltInTools; // from model_snapshots.built_in_tools
  rate_limits: RateLimits; // from model_snapshots.rate_limits
  system_instruction_support: SystemInstructionSupport; // from model_snapshots.system_message_type
  default_message_support: DefaultMessageSupport; // from model_snapshots.supported_message_types
}

/**
 * Model interface corresponding to models table
 */
interface Model {
  id: string; // Corresponds to models.id (UUID)
  provider_id: string; // Corresponds to models.provider_id (UUID)
  model_alias: string; // Corresponds to models.model_alias (text) and YAML `alias`
  model_description: string; // Corresponds to models.model_description (text)
  model_image: string | null; // Corresponds to models.model_image (text)
  model_type: ResourceType; // Corresponds to models.model_type (enum) and YAML `model_type`

  // Tags from schema
  model_tag_1: ModelTag | null; // Corresponds to models.model_tag_1 (enum)
  model_tags: ModelTag[]; // Corresponds to models.model_tags (jsonb assumed as array of ModelTag)

  // Contains the different versions/snapshots available for this model alias
  model_snapshots: ModelSnapshot[];
}

/**
 * Provider interface for organizing models
 */
interface Provider {
  id: string; // Corresponds to providers.id (UUID)
  name: ProviderName; // Corresponds to providers.name (enum)
  description: string | null; // Corresponds to providers.description (text)
  models: Model[]; // Grouping models under the provider
}

/* ==========================================================================*/
// UI Types
/* ==========================================================================*/

/**
 * Simple model info for listings and cards
 */
interface ModelInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  tags?: ModelTag[];
}

/**
 * Option type for model selectors and dropdowns
 */
type ModelOption = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Simplified pricing info for UI display
 */
interface SimplePricingInfo {
  modelAlias: string;
  input: number;
  inputCacheHit?: number;
  inputCacheWrite?: number;
  output: number;
  outputCacheHit?: number;
  outputCacheWrite?: number;
}

/**
 * Comparison model type for model comparison views
 */
type ComparisonModel = {
  id: string;
  name: string;
  description: string;
  image: string;
  intelligence: IntelligenceType;
  speed: SpeedType;
  inputModalities: Modalities;
  outputModalities: Modalities;
  features: {
    streaming: boolean;
    function_calling: boolean;
    structured_output: boolean;
    fine_tuning: boolean;
    distillation: boolean;
    predicted_outputs: boolean;
    inpainting?: boolean;
    image_input?: boolean;
    system_message: boolean;
    json_mode: boolean;
    reasoning_effort: boolean;
  };
  context: {
    contextWindow: number;
    maxOutputTokens: number;
    knowledgeCutoff: string;
  };
  pricing: {
    input: number;
    cachedInputHits: number;
    cachedInputWrites?: number;
    output: number;
    cachedOutput: number;
  };
  reasoningTokens: boolean;
};

/* ==========================================================================*/
// Utility Functions
/* ==========================================================================*/

/**
 * Convert ModelPricing to SimplePricingInfo for UI display
 * 
 * @param modelAlias - The model alias for identification
 * @param pricing - The full pricing structure
 * @returns Simplified pricing info for UI components
 * 
 * @example
 * const simplePrice = convertToSimplePricingInfo("gpt-4", modelPricing);
 */
function convertToSimplePricingInfo(modelAlias: string, pricing: ModelPricing): SimplePricingInfo {
  if (pricing.time_based) {
    // Use standard pricing for display
    return {
      modelAlias,
      input: pricing.text.standard.input,
      inputCacheHit: pricing.text.standard.input_cache_hit,
      inputCacheWrite: pricing.text.standard.input_cache_write,
      output: pricing.text.standard.output,
    };
  } else {
    return {
      modelAlias,
      input: pricing.text.input,
      inputCacheHit: pricing.text.input_cache_hit,
      inputCacheWrite: pricing.text.input_cache_write,
      output: pricing.text.output,
    };
  }
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export type {
  // Basic Types
  SpeedType,
  IntelligenceType,
  ResourceType as ModelResourceType,
  ModelTag,
  ProviderName,
  
  // Core Interfaces
  Modalities,
  ModelFeatures,
  SystemInstructionSupport,
  DefaultMessageSupport,
  BuiltInTools,
  ModelContext,
  
  // Pricing Types
  ModelPricing,
  RateLimits,
  
  // Model Types
  ModelSnapshot,
  Model,
  Provider,
  
  // UI Types
  ModelInfo,
  ModelOption,
  SimplePricingInfo,
  ComparisonModel,
};

export { convertToSimplePricingInfo };