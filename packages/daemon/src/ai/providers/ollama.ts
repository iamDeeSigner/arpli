import {
  AiConnector,
  AiConnectorConfig,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
  AiMessage,
} from '../types.js';

const DEFAULT_BASE_URL = 'http://localhost:11434';

/**
 * Ollama connector. Talks to a local Ollama server (default
 * `http://localhost:11434`) using its native chat API. No account, no API
 * key, fully offline — the recommended default tier.
 */
export class OllamaConnector implements AiConnector {
  public readonly provider = 'ollama' as const;
  public readonly model: string;
  private readonly baseUrl: string;

  constructor(config: AiConnectorConfig) {
    if (config.provider !== 'ollama') {
      throw new AiProviderError('ollama', `wrong provider for OllamaConnector: ${config.provider}`);
    }
    this.model = config.model;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    const body = this.buildBody(req, false);
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).catch((err) => {
      throw new AiProviderError('ollama', `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('ollama', `HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      model?: string;
      message?: { role?: string; content?: string };
      prompt_eval_count?: number;
      eval_count?: number;
    };

    return {
      provider: 'ollama',
      model: data.model ?? this.model,
      content: data.message?.content ?? '',
      usage: {
        promptTokens: data.prompt_eval_count,
        completionTokens: data.eval_count,
        totalTokens:
          data.prompt_eval_count !== undefined && data.eval_count !== undefined
            ? data.prompt_eval_count + data.eval_count
            : undefined,
      },
    };
  }

  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    const body = this.buildBody(req, true);
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).catch((err) => {
      throw new AiProviderError('ollama', `stream request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('ollama', `HTTP ${res.status}: ${text}`);
    }

    const reader = res.body.getReader();
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
        if (!line) continue;
        try {
          const chunk = JSON.parse(line) as {
            model?: string;
            message?: { content?: string };
            done?: boolean;
          };
          yield {
            provider: 'ollama',
            model: chunk.model ?? this.model,
            delta: chunk.message?.content ?? '',
            done: chunk.done === true,
          };
        } catch {
          // ignore malformed partial lines
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /** List locally pulled models. Used by the UI to populate the model picker. */
  async listModels(): Promise<Array<{ name: string; size?: number; modifiedAt?: string }>> {
    const res = await fetch(`${this.baseUrl}/api/tags`, { method: 'GET' }).catch((err) => {
      throw new AiProviderError('ollama', `list models failed: ${(err as Error).message}`, err);
    });
    if (!res.ok) {
      throw new AiProviderError('ollama', `HTTP ${res.status}`);
    }
    const data = (await res.json()) as {
      models?: Array<{ name: string; size?: number; modified_at?: string }>;
    };
    return (data.models ?? []).map((m) => ({
      name: m.name,
      size: m.size,
      modifiedAt: m.modified_at,
    }));
  }

  private buildBody(req: AiRequest, stream: boolean) {
    const messages = mergeSystemPrompt(req);
    return {
      model: req.model ?? this.model,
      messages,
      stream,
      options: {
        ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        ...(req.maxTokens !== undefined ? { num_predict: req.maxTokens } : {}),
      },
    };
  }
}

export function mergeSystemPrompt(req: AiRequest): AiMessage[] {
  if (!req.systemPrompt) return req.messages;
  const existingSystem = req.messages.find((m) => m.role === 'system');
  if (existingSystem) {
    return req.messages.map((m) =>
      m === existingSystem
        ? { ...m, content: `${req.systemPrompt}\n\n${m.content}` }
        : m,
    );
  }
  return [{ role: 'system', content: req.systemPrompt }, ...req.messages];
}
