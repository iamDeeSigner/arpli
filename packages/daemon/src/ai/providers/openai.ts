import {
  AiConnector,
  AiConnectorConfig,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
} from '../types.js';
import { parseOpenAiStream } from './groq.js';
import { mergeSystemPrompt } from './ollama.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

/**
 * OpenAI connector. Uses the Chat Completions API — the same wire format
 * as Groq, so it reuses the shared SSE parser.
 */
export class OpenAIConnector implements AiConnector {
  public readonly provider = 'openai' as const;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: AiConnectorConfig) {
    if (config.provider !== 'openai') {
      throw new AiProviderError('openai', `wrong provider for OpenAIConnector: ${config.provider}`);
    }
    if (!config.apiKey) {
      throw new AiProviderError('openai', 'missing API key');
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
      throw new AiProviderError('openai', `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('openai', `HTTP ${res.status}: ${text}`);
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
      provider: 'openai',
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
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(this.buildBody(req, true)),
    }).catch((err) => {
      throw new AiProviderError('openai', `stream request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('openai', `HTTP ${res.status}: ${text}`);
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
