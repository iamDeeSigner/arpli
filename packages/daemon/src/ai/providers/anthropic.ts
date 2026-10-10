import {
  AiConnector,
  AiConnectorConfig,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
} from '../types.js';

const DEFAULT_BASE_URL = 'https://api.anthropic.com/v1';
const API_VERSION = '2023-06-01';

/**
 * Anthropic Claude connector. Uses the native Messages API with
 * server-sent event streaming.
 */
export class AnthropicConnector implements AiConnector {
  public readonly provider = 'anthropic' as const;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: AiConnectorConfig) {
    if (config.provider !== 'anthropic') {
      throw new AiProviderError(
        'anthropic',
        `wrong provider for AnthropicConnector: ${config.provider}`,
      );
    }
    if (!config.apiKey) {
      throw new AiProviderError('anthropic', 'missing API key');
    }
    this.model = config.model;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(this.buildBody(req, false)),
    }).catch((err) => {
      throw new AiProviderError('anthropic', `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('anthropic', `HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      model?: string;
      content?: Array<{ type?: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };

    const content =
      data.content
        ?.filter((block) => block.type === 'text')
        .map((block) => block.text ?? '')
        .join('') ?? '';

    return {
      provider: 'anthropic',
      model: data.model ?? this.model,
      content,
      usage: {
        promptTokens: data.usage?.input_tokens,
        completionTokens: data.usage?.output_tokens,
        totalTokens:
          data.usage?.input_tokens !== undefined && data.usage?.output_tokens !== undefined
            ? data.usage.input_tokens + data.usage.output_tokens
            : undefined,
      },
    };
  }

  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(this.buildBody(req, true)),
    }).catch((err) => {
      throw new AiProviderError(
        'anthropic',
        `stream request failed: ${(err as Error).message}`,
        err,
      );
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError('anthropic', `HTTP ${res.status}: ${text}`);
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
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try {
          const chunk = JSON.parse(payload) as {
            type?: string;
            delta?: { type?: string; text?: string };
          };
          if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
            yield {
              provider: 'anthropic',
              model: this.model,
              delta: chunk.delta.text ?? '',
              done: false,
            };
          } else if (chunk.type === 'message_stop') {
            yield { provider: 'anthropic', model: this.model, delta: '', done: true };
            return;
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
    yield { provider: 'anthropic', model: this.model, delta: '', done: true };
  }

  async testConnection(): Promise<boolean> {
    // Anthropic has no cheap list endpoint; a 1-token message is the lightest check.
    try {
      const res = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  private headers(): Record<string, string> {
    return {
      'content-type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': API_VERSION,
    };
  }

  private buildBody(req: AiRequest, stream: boolean) {
    const systemParts: string[] = [];
    if (req.systemPrompt) systemParts.push(req.systemPrompt);
    const nonSystem: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    for (const message of req.messages) {
      if (message.role === 'system') {
        systemParts.push(message.content);
        continue;
      }
      nonSystem.push({ role: message.role, content: message.content });
    }
    return {
      model: req.model ?? this.model,
      max_tokens: req.maxTokens ?? 1024,
      ...(systemParts.length > 0 ? { system: systemParts.join('\n\n') } : {}),
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
      messages: nonSystem,
      stream,
    };
  }
}
