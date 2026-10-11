import type { FastifyInstance } from 'fastify';
import type { ArpliDb } from '@arpli/db';
import {
  type AiMessage,
  type AiProvider,
  type AiProviderTier,
  type AiRequest,
  AiProviderError,
} from '../ai/types.js';
import { getActiveConnector, loadConnector, testAllConnectors, storedToConfig } from '../ai/manager.js';
import { buildSystemPrompt } from '../ai/context.js';
import {
  pickTranscriptionProvider,
  transcribeAudio,
  TranscribeError,
} from '../services/transcribe.js';
import {
  getActiveProvider,
  getAllProviders,
  getProvider,
  saveProvider,
  setActiveProvider,
  deleteProvider,
} from '../services/settings.js';
import { OllamaConnector } from '../ai/providers/ollama.js';
import { OpenAiCompatibleConnector } from '../ai/providers/openai-compatible.js';
import {
  ALL_PROVIDERS,
  LOCAL_RUNNERS,
  PROVIDER_REGISTRY,
  describe,
} from '../ai/providers/registry.js';

const VALID_PROVIDERS: readonly AiProvider[] = ALL_PROVIDERS;

const VALID_TIERS: readonly AiProviderTier[] = ['local', 'free-cloud', 'paid'];

interface CompleteBody {
  messages?: Array<{ role?: string; content?: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  profileId?: string;
  opportunityId?: string | null;
  systemPrompt?: string;
}

interface SaveProviderBody {
  tier?: string;
  model?: string;
  apiKey?: string | null;
  baseUrl?: string | null;
  setActive?: boolean;
}

interface TranscribeBody {
  /** Base64-encoded audio bytes. */
  audio?: string;
  /** MIME type of the audio blob. */
  mimeType?: string;
  /** Optional filename hint, defaults to 'recording.webm'. */
  filename?: string;
  /** Optional Whisper model override. */
  model?: string;
  /** Optional ISO-639-1 language hint. */
  language?: string;
}

/**
 * Soft cap on uploaded audio size. Groq Whisper accepts up to ~25 MB per
 * request; we cap below that so a stuck-record session can't flood the
 * daemon. Measured on the decoded buffer, not the base64 string.
 */
const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // 20 MB

export async function registerAiRoutes(app: FastifyInstance, db: ArpliDb): Promise<void> {
  app.post('/ai/complete', async (req, reply) => {
    const body = (req.body ?? {}) as CompleteBody;
    const aiRequest = buildAiRequest(db, body);
    if ('error' in aiRequest) {
      return reply.code(400).send(aiRequest);
    }
    let connector;
    try {
      connector = getActiveConnector(db);
    } catch (err) {
      return reply.code(409).send({ error: errorMessage(err) });
    }
    if (!connector) {
      return reply.code(409).send({ error: 'no active AI provider configured' });
    }
    try {
      const result = await connector.complete(aiRequest);
      return result;
    } catch (err) {
      app.log.error({ err }, 'ai.complete failed');
      return reply.code(502).send({ error: errorMessage(err) });
    }
  });

  app.post('/ai/stream', async (req, reply) => {
    const body = (req.body ?? {}) as CompleteBody;
    const aiRequest = buildAiRequest(db, body);
    if ('error' in aiRequest) {
      return reply.code(400).send(aiRequest);
    }
    let connector;
    try {
      connector = getActiveConnector(db);
    } catch (err) {
      return reply.code(409).send({ error: errorMessage(err) });
    }
    if (!connector) {
      return reply.code(409).send({ error: 'no active AI provider configured' });
    }

    reply.raw.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    });

    try {
      for await (const chunk of connector.stream(aiRequest)) {
        reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
        if (chunk.done) break;
      }
      reply.raw.write('data: [DONE]\n\n');
    } catch (err) {
      app.log.error({ err }, 'ai.stream failed');
      reply.raw.write(
        `event: error\ndata: ${JSON.stringify({ error: errorMessage(err) })}\n\n`,
      );
    } finally {
      reply.raw.end();
    }
    return reply;
  });

  app.get('/ai/providers', async () => {
    const [providers, status] = await Promise.all([
      Promise.resolve(getAllProviders(db)),
      testAllConnectors(db),
    ]);
    const active = getActiveProvider(db);
    return {
      active: active?.kind ?? null,
      providers: providers.map((p) => ({
        kind: p.kind,
        tier: p.tier,
        model: p.model,
        baseUrl: p.baseUrl,
        hasApiKey: !!p.apiKey,
        isActive: p.isActive,
        updatedAt: p.updatedAt,
        connection: status[p.kind] ?? { ok: false, error: 'not tested' },
      })),
    };
  });

  app.put<{ Params: { provider: string }; Body: SaveProviderBody }>(
    '/ai/providers/:provider',
    async (req, reply) => {
      const provider = normalizeProvider(req.params.provider);
      if (!provider) {
        return reply.code(400).send({ error: `unknown provider: ${req.params.provider}` });
      }
      const body = req.body ?? {};
      if (!body.model) {
        return reply.code(400).send({ error: 'model is required' });
      }
      const tier = normalizeTier(body.tier) ?? defaultTierFor(provider);
      const saved = saveProvider(
        db,
        {
          kind: provider,
          tier,
          model: body.model,
          apiKey: body.apiKey ?? null,
          baseUrl: body.baseUrl ?? null,
        },
        body.setActive === true,
      );
      return {
        kind: saved.kind,
        tier: saved.tier,
        model: saved.model,
        baseUrl: saved.baseUrl,
        hasApiKey: !!saved.apiKey,
        isActive: saved.isActive,
        updatedAt: saved.updatedAt,
      };
    },
  );

  app.post<{ Params: { provider: string } }>(
    '/ai/providers/:provider/activate',
    async (req, reply) => {
      const provider = normalizeProvider(req.params.provider);
      if (!provider) {
        return reply.code(400).send({ error: `unknown provider: ${req.params.provider}` });
      }
      const saved = setActiveProvider(db, provider);
      if (!saved) {
        return reply.code(404).send({ error: `provider ${provider} is not configured` });
      }
      return { kind: saved.kind, isActive: saved.isActive };
    },
  );

  app.delete<{ Params: { provider: string } }>(
    '/ai/providers/:provider',
    async (req, reply) => {
      const provider = normalizeProvider(req.params.provider);
      if (!provider) {
        return reply.code(400).send({ error: `unknown provider: ${req.params.provider}` });
      }
      const removed = deleteProvider(db, provider);
      if (!removed) {
        return reply.code(404).send({ error: `provider ${provider} is not configured` });
      }
      return { ok: true };
    },
  );

  app.post<{ Params: { provider: string } }>(
    '/ai/providers/:provider/test',
    async (req, reply) => {
      const provider = normalizeProvider(req.params.provider);
      if (!provider) {
        return reply.code(400).send({ error: `unknown provider: ${req.params.provider}` });
      }
      const row = getProvider(db, provider);
      if (!row) {
        return reply.code(404).send({ error: `provider ${provider} is not configured` });
      }
      try {
        const connector = loadConnector(storedToConfig(row));
        const ok = await connector.testConnection();
        return { ok };
      } catch (err) {
        return reply.code(502).send({ ok: false, error: errorMessage(err) });
      }
    },
  );

  app.get('/ai/providers/ollama/models', async (req, reply) => {
    const row = getProvider(db, 'ollama');
    const baseUrl = row?.baseUrl ?? undefined;
    try {
      const connector = new OllamaConnector({
        provider: 'ollama',
        tier: 'local',
        model: row?.model ?? 'llama3.2',
        baseUrl,
      });
      const models = await connector.listModels();
      return { models };
    } catch (err) {
      return reply.code(502).send({ error: errorMessage(err) });
    }
  });

  app.get<{ Params: { provider: string } }>(
    '/ai/providers/:provider/models',
    async (req, reply) => {
      const provider = normalizeProvider(req.params.provider);
      if (!provider) {
        return reply.code(400).send({ error: `unknown provider: ${req.params.provider}` });
      }
      const descriptor = describe(provider);
      const row = getProvider(db, provider);
      const baseUrl = row?.baseUrl ?? descriptor.defaultBaseUrl;
      const model = row?.model ?? descriptor.suggestedModel ?? '';
      const apiKey = row?.apiKey ?? undefined;

      try {
        if (descriptor.wireProtocol === 'native-ollama') {
          const connector = new OllamaConnector({
            provider,
            tier: descriptor.tier,
            model,
            baseUrl,
          });
          return { models: await connector.listModels() };
        }
        if (descriptor.wireProtocol === 'openai-compat') {
          const connector = new OpenAiCompatibleConnector({
            provider,
            tier: descriptor.tier,
            model,
            apiKey,
            baseUrl,
          });
          return { models: await connector.listModels() };
        }
        return reply
          .code(400)
          .send({ error: `provider ${provider} has no model-listing endpoint` });
      } catch (err) {
        return reply.code(502).send({ error: errorMessage(err) });
      }
    },
  );

  /**
   * Transcribe an audio blob using the user's configured Whisper-capable
   * provider (currently Groq or OpenAI). The audio arrives as base64 JSON —
   * the Electron renderer encodes a browser MediaRecorder blob and forwards
   * it through IPC. We stream the decoded buffer back out as
   * multipart/form-data to the provider; the daemon never persists audio.
   *
   * Returns `{ text, provider, model }`. A 409 means no transcription
   * provider is configured — the UI should fall back to the Web Speech API
   * path.
   */
  app.post(
    '/ai/transcribe',
    { bodyLimit: 32 * 1024 * 1024 },
    async (req, reply) => {
      const body = (req.body ?? {}) as TranscribeBody;
      if (typeof body.audio !== 'string' || body.audio.length === 0) {
        return reply.code(400).send({ error: 'audio (base64 string) is required' });
      }
      if (typeof body.mimeType !== 'string' || body.mimeType.length === 0) {
        return reply.code(400).send({ error: 'mimeType is required' });
      }
      let audio: Buffer;
      try {
        audio = Buffer.from(body.audio, 'base64');
      } catch {
        return reply.code(400).send({ error: 'audio is not valid base64' });
      }
      if (audio.length === 0) {
        return reply.code(400).send({ error: 'decoded audio buffer is empty' });
      }
      if (audio.length > MAX_AUDIO_BYTES) {
        return reply
          .code(413)
          .send({ error: `audio exceeds ${MAX_AUDIO_BYTES} byte limit` });
      }
      try {
        const result = await transcribeAudio(db, {
          audio,
          mimeType: body.mimeType,
          filename: body.filename ?? 'recording.webm',
          model: body.model,
          language: body.language,
        });
        return result;
      } catch (err) {
        if (err instanceof TranscribeError) {
          const status =
            err.code === 'no-provider'
              ? 409
              : err.code === 'bad-request'
                ? 400
                : 502;
          return reply.code(status).send({ error: err.message, code: err.code });
        }
        app.log.error({ err }, 'ai.transcribe failed');
        return reply.code(502).send({ error: errorMessage(err) });
      }
    },
  );

  /**
   * Report whether a Whisper-capable provider (Groq / OpenAI) is configured
   * with an API key. The settings UI uses this to enable or disable the
   * "Use Groq Whisper" toggle.
   */
  app.get('/ai/transcribe/status', async () => {
    const pick = pickTranscriptionProvider(db);
    return {
      available: pick !== null,
      provider: pick?.provider ?? null,
    };
  });

  /**
   * Catalog of every provider Arpli knows about, in a shape the setup UI
   * can render directly. Does not touch SQLite — it reflects compile-time
   * registry data only.
   */
  app.get('/ai/catalog', async () => {
    return {
      providers: Object.values(PROVIDER_REGISTRY).map((p) => ({
        kind: p.kind,
        label: p.label,
        tier: p.tier,
        wireProtocol: p.wireProtocol,
        defaultBaseUrl: p.defaultBaseUrl,
        requiresApiKey: p.requiresApiKey,
        suggestedModel: p.suggestedModel,
        localRunner: p.localRunner === true,
      })),
    };
  });

  /**
   * Probe every known local runner on its default port and report which
   * ones are reachable. The setup UI uses this to recommend one-click
   * configuration when the user has (say) LM Studio already running.
   */
  app.get('/ai/local/detect', async () => {
    const results = await Promise.all(
      LOCAL_RUNNERS.map(async (descriptor) => {
        const probeUrl = `${descriptor.defaultBaseUrl.replace(/\/+$/, '')}${
          descriptor.probePath ?? '/'
        }`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1500);
        try {
          const res = await fetch(probeUrl, { signal: controller.signal });
          return {
            kind: descriptor.kind,
            label: descriptor.label,
            baseUrl: descriptor.defaultBaseUrl,
            running: res.ok,
            httpStatus: res.status,
          };
        } catch (err) {
          return {
            kind: descriptor.kind,
            label: descriptor.label,
            baseUrl: descriptor.defaultBaseUrl,
            running: false,
            error: (err as Error).name === 'AbortError' ? 'timeout' : (err as Error).message,
          };
        } finally {
          clearTimeout(timer);
        }
      }),
    );
    const anyRunning = results.some((r) => r.running);
    const recommendation = anyRunning
      ? null
      : {
          kind: 'ollama' as const,
          reason:
            'No local AI runner was detected. Install Ollama from https://ollama.com for the simplest zero-cost setup, or configure a free cloud provider (OpenRouter, Groq, Google AI Studio) under Settings → AI.',
        };
    return { runners: results, recommendation };
  });
}

function buildAiRequest(db: ArpliDb, body: CompleteBody): AiRequest | { error: string } {
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { error: 'messages is required and must be non-empty' };
  }
  const messages: AiMessage[] = body.messages.map((m) => {
    const role: AiMessage['role'] =
      m.role === 'assistant' || m.role === 'system' ? m.role : 'user';
    return { role, content: typeof m.content === 'string' ? m.content : '' };
  });

  const injected: string[] = [];
  if (body.profileId) {
    const prompt = buildSystemPrompt(db, body.profileId, body.opportunityId ?? null);
    if (prompt) injected.push(prompt);
  }
  if (body.systemPrompt) injected.push(body.systemPrompt);

  return {
    messages,
    model: body.model,
    temperature: body.temperature,
    maxTokens: body.maxTokens,
    systemPrompt: injected.length > 0 ? injected.join('\n\n') : undefined,
  };
}

function normalizeProvider(input: string): AiProvider | null {
  const lower = input.toLowerCase();
  return (VALID_PROVIDERS as readonly string[]).includes(lower) ? (lower as AiProvider) : null;
}

function normalizeTier(input: string | undefined): AiProviderTier | null {
  if (!input) return null;
  const lower = input.toLowerCase();
  return (VALID_TIERS as readonly string[]).includes(lower) ? (lower as AiProviderTier) : null;
}

function defaultTierFor(provider: AiProvider): AiProviderTier {
  return describe(provider).tier;
}

function errorMessage(err: unknown): string {
  if (err instanceof AiProviderError) return err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}
