import type { AiProvider, AiProviderTier } from '../types.js';

/**
 * Catalog of every provider Arpli knows about.
 *
 * The connector manager uses this registry to:
 *  - Validate incoming provider kinds (route handler).
 *  - Pick a wire protocol (native vs OpenAI-compatible).
 *  - Supply sensible defaults (base URL, tier, API-key requirement) so
 *    the Settings UI can offer one-click setup.
 *
 * `wireProtocol` groups providers by how they are called on the network:
 *  - 'native-ollama', 'native-anthropic', 'native-google' each have a
 *    dedicated connector class with their own schema.
 *  - 'openai-compat' providers all go through the shared
 *    `OpenAiCompatibleConnector`, differing only in default base URL,
 *    tier, and whether an API key is required.
 */

export type WireProtocol =
  | 'native-ollama'
  | 'native-anthropic'
  | 'native-google'
  | 'openai-compat';

export interface ProviderDescriptor {
  kind: AiProvider;
  /** Human-readable name for logs and UI. */
  label: string;
  tier: AiProviderTier;
  wireProtocol: WireProtocol;
  /** Default endpoint. Users can override per install. */
  defaultBaseUrl: string;
  /** True when the provider cannot be called without an API key. */
  requiresApiKey: boolean;
  /**
   * The connector will probe this URL on `testConnection()` when the
   * provider has no cheap list endpoint. Used for local-runner detection.
   */
  probePath?: string;
  /** Known-good default model name, if any. */
  suggestedModel?: string;
  /** True for the Tier-1 runners we auto-detect on the user's machine. */
  localRunner?: boolean;
}

export const PROVIDER_REGISTRY: Record<AiProvider, ProviderDescriptor> = {
  // ── Tier 1 — local, free, offline ───────────────────────────────────
  ollama: {
    kind: 'ollama',
    label: 'Ollama',
    tier: 'local',
    wireProtocol: 'native-ollama',
    defaultBaseUrl: 'http://localhost:11434',
    requiresApiKey: false,
    probePath: '/api/tags',
    localRunner: true,
  },
  lmstudio: {
    kind: 'lmstudio',
    label: 'LM Studio',
    tier: 'local',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'http://localhost:1234/v1',
    requiresApiKey: false,
    probePath: '/models',
    localRunner: true,
  },
  jan: {
    kind: 'jan',
    label: 'Jan.ai',
    tier: 'local',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'http://localhost:1337/v1',
    requiresApiKey: false,
    probePath: '/models',
    localRunner: true,
  },
  localai: {
    kind: 'localai',
    label: 'LocalAI',
    tier: 'local',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'http://localhost:8080/v1',
    requiresApiKey: false,
    probePath: '/models',
    localRunner: true,
  },
  llamafile: {
    kind: 'llamafile',
    label: 'llamafile',
    tier: 'local',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'http://localhost:8080/v1',
    requiresApiKey: false,
    probePath: '/models',
    localRunner: true,
  },

  // ── Tier 2 — free cloud ────────────────────────────────────────────
  groq: {
    kind: 'groq',
    label: 'Groq',
    tier: 'free-cloud',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    requiresApiKey: true,
    probePath: '/models',
    suggestedModel: 'llama-3.1-8b-instant',
  },
  google: {
    kind: 'google',
    label: 'Google AI Studio',
    tier: 'free-cloud',
    wireProtocol: 'native-google',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresApiKey: true,
    suggestedModel: 'gemini-1.5-flash',
  },
  openrouter: {
    kind: 'openrouter',
    label: 'OpenRouter',
    tier: 'free-cloud',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    requiresApiKey: true,
    probePath: '/models',
    suggestedModel: 'meta-llama/llama-3.1-8b-instruct:free',
  },
  together: {
    kind: 'together',
    label: 'Together AI',
    tier: 'free-cloud',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'https://api.together.xyz/v1',
    requiresApiKey: true,
    probePath: '/models',
    suggestedModel: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  },
  mistral: {
    kind: 'mistral',
    label: 'Mistral AI',
    tier: 'free-cloud',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    requiresApiKey: true,
    probePath: '/models',
    suggestedModel: 'mistral-small-latest',
  },

  // ── Tier 3 — paid ─────────────────────────────────────────────────
  anthropic: {
    kind: 'anthropic',
    label: 'Anthropic Claude',
    tier: 'paid',
    wireProtocol: 'native-anthropic',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    requiresApiKey: true,
    suggestedModel: 'claude-3-5-sonnet-latest',
  },
  openai: {
    kind: 'openai',
    label: 'OpenAI',
    tier: 'paid',
    wireProtocol: 'openai-compat',
    defaultBaseUrl: 'https://api.openai.com/v1',
    requiresApiKey: true,
    probePath: '/models',
    suggestedModel: 'gpt-4o-mini',
  },
  gemini: {
    kind: 'gemini',
    label: 'Gemini (paid)',
    tier: 'paid',
    wireProtocol: 'native-google',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresApiKey: true,
    suggestedModel: 'gemini-1.5-pro',
  },
};

export const ALL_PROVIDERS: readonly AiProvider[] = Object.keys(
  PROVIDER_REGISTRY,
) as AiProvider[];

export const LOCAL_RUNNERS: readonly ProviderDescriptor[] = Object.values(
  PROVIDER_REGISTRY,
).filter((p) => p.localRunner);

export function describe(kind: AiProvider): ProviderDescriptor {
  const row = PROVIDER_REGISTRY[kind];
  if (!row) throw new Error(`unknown provider: ${kind}`);
  return row;
}
