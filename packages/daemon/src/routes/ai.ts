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
  getActiveProvider,
  getAllProviders,
  getProvider,
  saveProvider,
  setActiveProvider,
  deleteProvider,
} from '../services/settings.js';
import { OllamaConnector } from '../ai/providers/ollama.js';

const VALID_PROVIDERS: readonly AiProvider[] = [
  'ollama',
  'groq',
  'google',
  'anthropic',
  'openai',
  'gemini',
];

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

export async function registerAiRoutes(app: FastifyInstance, db: ArpliDb): Promise<void> {
  app.post('/ai/complete', async (req, reply) => {
    const body = (req.body ?? {}) as CompleteBody;
    const aiRequest = buildAiRequest(db, body);
    if ('error' in aiRequest) {
      return reply.code(400).send(aiRequest);
    }
    const connector = getActiveConnector(db);
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
    const connector = getActiveConnector(db);
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
  switch (provider) {
    case 'ollama':
      return 'local';
    case 'groq':
    case 'google':
      return 'free-cloud';
    case 'anthropic':
    case 'openai':
    case 'gemini':
      return 'paid';
  }
}

function errorMessage(err: unknown): string {
  if (err instanceof AiProviderError) return err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}
