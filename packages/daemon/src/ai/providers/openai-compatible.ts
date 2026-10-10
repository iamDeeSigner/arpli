import {
  AiConnector,
  AiConnectorConfig,
  AiProvider,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
} from '../types.js';
import { describe } from './registry.js';
import { mergeSystemPrompt } from './ollama.js';

/**
 * One adapter for every provider that speaks the OpenAI Chat Completions
 * wire format. That is a lot of providers:
 *
 *   Local  — LM Studio, Jan.ai, LocalAI, llamafile
 *   Cloud  — OpenAI, Groq, OpenRouter, Together AI, Mistral AI
 *
 * They all accept a POST to `<baseUrl>/chat/completions` with the same
 * JSON body and emit the same SSE delta format. The only differences are
 * the base URL, whether an API key is required, and whether the key is
 * sent as a Bearer token (universal here).
 */
export class OpenAiCompatibleConnector implements AiConnector {
  public readonly provider: AiProvider;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string | null;
  private readonly probePath: string | undefined;

  private readonly requiresApiKey: boolean;

  constructor(config: AiConnectorConfig) {
    const descriptor = describe(config.provider);
    if (descriptor.wireProtocol !== 'openai-compat') {
      throw new AiProviderError(
        config.provider,
        `wrong wire protocol for OpenAiCompatibleConnector: ${descriptor.wireProtocol}`,
      );
    }
    // We no longer throw on a missing API key at construction time —
    // public endpoints like OpenRouter's `/models` work without auth, and
    // the setup UI needs to call `listModels()` before the user supplies
    // a key. Instead we gate completion/stream calls below.
    this.provider = config.provider;
    this.model = config.model;
    this.baseUrl = (config.baseUrl ?? descriptor.defaultBaseUrl).replace(/\/+$/, '');
    this.apiKey = config.apiKey ?? null;
    this.probePath = descriptor.probePath;
    this.requiresApiKey = descriptor.requiresApiKey;
  }

  private ensureAuthed(): void {
    if (this.requiresApiKey && !this.apiKey) {
      throw new AiProviderError(this.provider, 'missing API key');
    }
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    this.ensureAuthed();
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(this.buildBody(req, false)),
    }).catch((err) => {
      throw new AiProviderError(this.provider, `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError(this.provider, `HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      model?: string;
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };

    return {
      provider: this.provider,
      model: data.model ?? this.model,
      content: data.choices?.[0]?.message?.content ?? '',
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    this.ensureAuthed();
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(this.buildBody(req, true)),
    }).catch((err) => {
      throw new AiProviderError(
        this.provider,
        `stream request failed: ${(err as Error).message}`,
        err,
      );
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError(this.provider, `HTTP ${res.status}: ${text}`);
    }

    yield* parseOpenAiCompatibleStream(res.body, this.provider, this.model);
  }

  async testConnection(): Promise<boolean> {
    if (!this.probePath) {
      // Fallback: send a tiny completion ping.
      try {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.headers(),
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          }),
        });
        return res.ok;
      } catch {
        return false;
      }
    }
    try {
      const res = await fetch(`${this.baseUrl}${this.probePath}`, {
        method: 'GET',
        headers: this.headers(),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * List models the endpoint exposes. For most providers this is
   * `GET /models`. Returns an empty array when the endpoint is not
   * supported (e.g. llamafile serves a single baked-in model).
   */
  async listModels(): Promise<Array<{ id: string }>> {
    if (!this.probePath) return [];
    const res = await fetch(`${this.baseUrl}${this.probePath}`, {
      method: 'GET',
      headers: this.headers(),
    }).catch((err) => {
      throw new AiProviderError(
        this.provider,
        `list models failed: ${(err as Error).message}`,
        err,
      );
    });
    if (!res.ok) return [];
    const data = (await res.json().catch(() => ({}))) as { data?: Array<{ id?: string }> };
    return (data.data ?? [])
      .filter((m): m is { id: string } => typeof m.id === 'string')
      .map((m) => ({ id: m.id }));
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    // OpenRouter uses two optional headers for referrer tracking. They are
    // harmless on every other provider.
    if (this.provider === 'openrouter') {
      headers['http-referer'] = 'https://arpli.app';
      headers['x-title'] = 'Arpli';
    }
    return headers;
  }

  private buildBody(req: AiRequest, stream: boolean) {
    return {
      model: req.model ?? this.model,
      messages: mergeSystemPrompt(req),
      stream,
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
      ...(req.maxTokens !== undefined ? { max_tokens: req.maxTokens } : {}),
    };
  }
}

/**
 * Shared OpenAI-style SSE delta parser. Used by every openai-compat
 * provider — the old parser lived in groq.ts; this is the canonical copy
 * now and generic over any provider identifier.
 */
export async function* parseOpenAiCompatibleStream(
  body: ReadableStream<Uint8Array>,
  provider: AiProvider,
  model: string,
): AsyncIterable<AiStreamChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') {
        yield { provider, model, delta: '', done: true };
        return;
      }
      try {
        const chunk = JSON.parse(payload) as {
          model?: string;
          choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null }>;
        };
        const choice = chunk.choices?.[0];
        const delta = choice?.delta?.content ?? '';
        const finished = choice?.finish_reason !== null && choice?.finish_reason !== undefined;
        if (delta || finished) {
          yield {
            provider,
            model: chunk.model ?? model,
            delta,
            done: finished,
          };
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }
  yield { provider, model, delta: '', done: true };
}
