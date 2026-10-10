import {
  AiConnector,
  AiConnectorConfig,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
} from '../types.js';
import { mergeSystemPrompt } from './ollama.js';

const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';

/**
 * Groq connector. Uses Groq's OpenAI-compatible Chat Completions endpoint.
 * Free tier is generous — the recommended free cloud default.
 */
export class GroqConnector implements AiConnector {
  public readonly provider = 'groq' as const;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: AiConnectorConfig) {
    if (config.provider !== 'groq') {
      throw new AiProviderError('groq', `wrong provider for GroqConnector: ${config.provider}`);
    }
    if (!config.apiKey) {
      throw new AiProviderError('groq', 'missing API key');
    }
    this.model = config.model;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(this.buildBody(req, false)),
    }).catch((err) => {
      throw new AiProviderError('groq', `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('groq', `HTTP ${res.status}: ${text}`);
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

    const content = data.choices?.[0]?.message?.content ?? '';
    return {
      provider: 'groq',
      model: data.model ?? this.model,
      content,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(this.buildBody(req, true)),
    }).catch((err) => {
      throw new AiProviderError('groq', `stream request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('groq', `HTTP ${res.status}: ${text}`);
    }

    yield* parseOpenAiStream(res.body, this.provider, this.model);
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { authorization: `Bearer ${this.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
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
 * Parse an OpenAI-style Server-Sent Events stream of chat completion deltas.
 * Shared by Groq, OpenAI, and any other OpenAI-compatible provider.
 */
export async function* parseOpenAiStream(
  body: ReadableStream<Uint8Array>,
  provider: 'groq' | 'openai',
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
