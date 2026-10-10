/**
 * Unified AI connector types.
 *
 * Every Arpli feature that calls an LLM goes through an `AiConnector`
 * implementation. Providers (ollama, groq, google, anthropic, openai) each
 * expose the same surface, so swapping models is a one-setting change.
 */

export type AiProvider = 'ollama' | 'groq' | 'google' | 'anthropic' | 'openai' | 'gemini';

export type AiProviderTier = 'local' | 'free-cloud' | 'paid';

export type AiRole = 'system' | 'user' | 'assistant';

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiRequest {
  /** Conversation history. The connector will prepend any configured system prompt. */
  messages: AiMessage[];
  /** Model override. If omitted, the provider's configured model is used. */
  model?: string;
  /** Sampling temperature. Providers that do not support it will ignore it. */
  temperature?: number;
  /** Max tokens / output length. Providers that do not support it will ignore it. */
  maxTokens?: number;
  /** Additional system prompt text injected before the first message. */
  systemPrompt?: string;
}

export interface AiResponse {
  /** The provider that produced the response. */
  provider: AiProvider;
  /** The model that produced the response. */
  model: string;
  /** Full generated text. */
  content: string;
  /** Optional token usage, when the provider reports it. */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AiStreamChunk {
  /** The provider emitting the chunk. */
  provider: AiProvider;
  /** The model emitting the chunk. */
  model: string;
  /** Incremental text delta for this chunk. */
  delta: string;
  /** True on the final chunk. */
  done: boolean;
}

/**
 * Configuration passed to the connector factory. API keys live in SQLite and
 * are read fresh per call, so a long-running daemon picks up settings changes
 * on the next invocation of `loadConnector()`.
 */
export interface AiConnectorConfig {
  provider: AiProvider;
  tier: AiProviderTier;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface AiConnector {
  readonly provider: AiProvider;
  readonly model: string;
  complete(req: AiRequest): Promise<AiResponse>;
  stream(req: AiRequest): AsyncIterable<AiStreamChunk>;
  testConnection(): Promise<boolean>;
}

export class AiProviderError extends Error {
  constructor(
    public readonly provider: AiProvider,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`[${provider}] ${message}`);
    this.name = 'AiProviderError';
  }
}
