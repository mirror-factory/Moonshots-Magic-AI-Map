/**
 * @module lib/settings
 * Client-side settings storage using localStorage. Provides utilities for
 * persisting user preferences like AI model selection and API configuration.
 */

/** Available AI models with their metadata. */
export const AVAILABLE_MODELS = [
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    tier: "premium",
    contextWindow: "200K",
  },
  {
    id: "anthropic/claude-haiku",
    name: "Claude Haiku",
    provider: "Anthropic",
    tier: "fast",
    contextWindow: "200K",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    tier: "premium",
    contextWindow: "128K",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    tier: "fast",
    contextWindow: "128K",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    tier: "fast",
    contextWindow: "1M",
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    tier: "premium",
    contextWindow: "2M",
  },
] as const;

/** Model ID type derived from available models. */
export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];

/** Default model when no preference is stored. */
export const DEFAULT_MODEL: ModelId = "anthropic/claude-sonnet-4.5";

const STORAGE_KEYS = {
  selectedModel: "moonshots_selected_model",
  apiKey: "moonshots_api_key",
} as const;

/**
 * Retrieves the stored AI model preference.
 * @returns The stored model ID or the default model.
 */
export function getStoredModel(): ModelId {
  if (typeof window === "undefined") return DEFAULT_MODEL;
  const stored = localStorage.getItem(STORAGE_KEYS.selectedModel);
  if (stored && AVAILABLE_MODELS.some((m) => m.id === stored)) {
    return stored as ModelId;
  }
  return DEFAULT_MODEL;
}

/**
 * Stores the AI model preference.
 * @param modelId - The model ID to store.
 */
export function setStoredModel(modelId: ModelId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.selectedModel, modelId);
}

/**
 * Retrieves the stored API key (if custom).
 * @returns The stored API key or undefined.
 */
export function getStoredApiKey(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(STORAGE_KEYS.apiKey) || undefined;
}

/**
 * Stores a custom API key.
 * @param apiKey - The API key to store.
 */
export function setStoredApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
}

/**
 * Clears the stored custom API key.
 */
export function clearStoredApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.apiKey);
}

/**
 * Masks an API key for display (shows first 8 and last 4 chars).
 * @param apiKey - The API key to mask.
 * @returns The masked key string.
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 12) return "••••••••";
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}

/**
 * Gets model metadata by ID.
 * @param modelId - The model ID to look up.
 * @returns The model metadata or undefined.
 */
export function getModelById(modelId: string) {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}
