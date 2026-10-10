import {
  AiConnector,
  AiConnectorConfig,
  AiProvider,
  AiProviderError,
  AiRequest,
  AiResponse,
  AiStreamChunk,
  AiMessage,
} from '../types.js';

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Google Gemini connector (shared by the free Google AI Studio tier and
 * paid Gemini Pro). Uses the native generateContent REST API.
 *
 * The `provider` field is `'google'` for the free tier and `'gemini'` for
 * the paid tier so settings can distinguish them, but the wire protocol is
 * identical.
 */
export class GoogleConnector implements AiConnector {
  public readonly provider: AiProvider;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: AiConnectorConfig) {
    if (config.provider !== 'google' && config.provider !== 'gemini') {
      throw new AiProviderError(
        config.provider,
        `wrong provider for GoogleConnector: ${config.provider}`,
      );
    }
    if (!config.apiKey) {
      throw new AiProviderError(config.provider, 'missing API key');
    }
    this.provider = config.provider;
    this.model = config.model;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    const model = req.model ?? this.model;
    const url = `${this.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.buildBody(req)),
    }).catch((err) => {
      throw new AiProviderError(this.provider, `request failed: ${(err as Error).message}`, err);
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiProviderError(this.provider, `HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    const content =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';

    return {
      provider: this.provider,
      model,
      content,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount,
        completionTokens: data.usageMetadata?.candidatesTokenCount,
        totalTokens: data.usageMetadata?.totalTokenCount,
      },
    };
  }

  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    const model = req.model ?? this.model;
    const url = `${this.baseUrl}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(this.apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.buildBody(req)),
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
            candidates?: Array<{
              content?: { parts?: Array<{ text?: string }> };
              finishReason?: string;
            }>;
          };
          const parts = chunk.candidates?.[0]?.content?.parts ?? [];
          const delta = parts.map((p) => p.text ?? '').join('');
          const finished = chunk.candidates?.[0]?.finishReason !== undefined;
          if (delta || finished) {
            yield {
              provider: this.provider,
              model,
              delta,
              done: finished,
            };
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
    yield { provider: this.provider, model, delta: '', done: true };
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.baseUrl}/models?key=${encodeURIComponent(this.apiKey)}`,
      );
      return res.ok;
    } catch {
      return false;
    }
  }

  private buildBody(req: AiRequest) {
    const { systemText, contents } = splitForGemini(req);
    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        ...(req.maxTokens !== undefined ? { maxOutputTokens: req.maxTokens } : {}),
      },
    };
    const combinedSystem = [req.systemPrompt, systemText].filter(Boolean).join('\n\n');
    if (combinedSystem) {
      body.systemInstruction = { role: 'system', parts: [{ text: combinedSystem }] };
    }
    return body;
  }
}

function splitForGemini(req: AiRequest): {
  systemText: string;
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
} {
  const systemParts: string[] = [];
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const message of req.messages) {
    if (message.role === 'system') {
      systemParts.push(message.content);
      continue;
    }
    contents.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    });
  }
  return { systemText: systemParts.join('\n\n'), contents };
}

export function _geminiMessagesForTest(req: AiRequest): AiMessage[] {
  return req.messages;
}
