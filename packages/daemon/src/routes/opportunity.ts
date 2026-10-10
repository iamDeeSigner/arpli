import type { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import type { ArpliDb } from '@arpli/db';
import { getActiveConnector } from '../ai/manager.js';
import {
  OpportunityService,
  OpportunityParserService,
  isOpportunityType,
  isOpportunityStatus,
} from '../services/opportunity.js';

/**
 * Fastify routes for the Opportunity domain.
 *
 * Mounted at the daemon root (no prefix). Routes:
 *   POST /opportunities/intake       — parse text/url/pdf → preview draft
 *   POST /opportunities              — create from draft
 *   GET  /opportunities              — list all
 *   GET  /opportunities/:id          — single opportunity
 *   PATCH /opportunities/:id         — partial update
 *   DELETE /opportunities/:id        — hard delete
 */
export interface OpportunityRoutesOptions {
  db: ArpliDb;
}

export const opportunityRoutes: FastifyPluginAsync<OpportunityRoutesOptions> = async (
  app,
  opts,
) => {
  const service = new OpportunityService(opts.db);
  const parser = new OpportunityParserService(() => getActiveConnector(opts.db));

  // ── Intake / parse ──────────────────────────────────────────────────────────

  app.post<{
    Body: { text?: unknown; url?: unknown; pdfBase64?: unknown };
  }>('/opportunities/intake', async (req, reply) => {
    const { text, url, pdfBase64 } = req.body ?? {};

    try {
      if (typeof pdfBase64 === 'string' && pdfBase64.trim()) {
        const buf = Buffer.from(pdfBase64, 'base64');
        const draft = await parser.parseFromPdf(buf);
        return { draft };
      }

      if (typeof url === 'string' && url.trim()) {
        const draft = await parser.parseFromUrl(url.trim());
        return { draft };
      }

      if (typeof text === 'string' && text.trim()) {
        const draft = await parser.parseFromText(text.trim());
        return { draft };
      }

      return badRequest(reply, 'provide text, url, or pdfBase64');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      reply.code(422);
      return { error: msg };
    }
  });

  // ── Create ──────────────────────────────────────────────────────────────────

  app.post<{ Body: Record<string, unknown> }>('/opportunities', async (req, reply) => {
    const body = req.body ?? {};

    if (!body.title || typeof body.title !== 'string') {
      return badRequest(reply, 'title is required');
    }
    if (!isOpportunityType(body.type)) {
      return badRequest(reply, 'type must be one of scholarship|grant|fellowship|accelerator|job|other');
    }

    try {
      const opp = await service.create({
        title: body.title,
        type: body.type,
        organization: asStringOrNull(body.organization),
        url: asStringOrNull(body.url),
        deadline: asStringOrNull(body.deadline),
        eligibility: asStringOrNull(body.eligibility),
        questions: parseQuestionsField(body.questions),
        description: asStringOrNull(body.description),
        tags: parseTagsField(body.tags),
        status:
          isOpportunityStatus(body.status) ? body.status : undefined,
      });
      reply.code(201);
      return { opportunity: opp };
    } catch (err) {
      return badRequest(reply, (err as Error).message);
    }
  });

  // ── List ────────────────────────────────────────────────────────────────────

  app.get('/opportunities', async () => {
    const opportunities = await service.list();
    return { opportunities };
  });

  // ── Get one ─────────────────────────────────────────────────────────────────

  app.get<{ Params: { id: string } }>('/opportunities/:id', async (req, reply) => {
    const opp = await service.get(req.params.id);
    if (!opp) return notFound(reply, 'opportunity');
    return { opportunity: opp };
  });

  // ── Update ──────────────────────────────────────────────────────────────────

  app.patch<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/opportunities/:id',
    async (req, reply) => {
      const body = req.body ?? {};

      if (body.type !== undefined && !isOpportunityType(body.type)) {
        return badRequest(reply, 'type must be one of scholarship|grant|fellowship|accelerator|job|other');
      }
      if (body.status !== undefined && !isOpportunityStatus(body.status)) {
        return badRequest(reply, 'status must be active or archived');
      }

      try {
        const opp = await service.update(req.params.id, {
          ...(body.title !== undefined && { title: String(body.title) }),
          ...(body.type !== undefined && isOpportunityType(body.type) && { type: body.type }),
          ...(body.organization !== undefined && { organization: asStringOrNull(body.organization) }),
          ...(body.url !== undefined && { url: asStringOrNull(body.url) }),
          ...(body.deadline !== undefined && { deadline: asStringOrNull(body.deadline) }),
          ...(body.eligibility !== undefined && { eligibility: asStringOrNull(body.eligibility) }),
          ...(body.description !== undefined && { description: asStringOrNull(body.description) }),
          ...(body.status !== undefined && isOpportunityStatus(body.status) && { status: body.status }),
          ...(body.questions !== undefined && { questions: parseQuestionsField(body.questions) ?? null }),
          ...(body.tags !== undefined && { tags: parseTagsField(body.tags) ?? null }),
        });
        return { opportunity: opp };
      } catch (err) {
        return notFound(reply, 'opportunity', err);
      }
    },
  );

  // ── Delete ──────────────────────────────────────────────────────────────────

  app.delete<{ Params: { id: string } }>('/opportunities/:id', async (req) => {
    await service.delete(req.params.id);
    return { ok: true };
  });
};

export async function registerOpportunityRoutes(
  app: FastifyInstance,
  db: ArpliDb,
): Promise<void> {
  await app.register(opportunityRoutes, { db });
}

// ── helpers ──────────────────────────────────────────────────────────────────

function asStringOrNull(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  return typeof v === 'string' ? v : String(v);
}

/**
 * Accept `questions` as either a JSON string or a plain JS array.
 * Returns undefined (omit the field) if the value is absent, null when
 * explicitly nulled, or the parsed array.
 */
function parseQuestionsField(v: unknown): import('@arpli/shared').OpportunityQuestion[] | undefined {
  if (v === undefined) return undefined;
  if (v === null) return undefined;
  if (Array.isArray(v)) return v as import('@arpli/shared').OpportunityQuestion[];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function parseTagsField(v: unknown): string[] | undefined {
  if (v === undefined) return undefined;
  if (v === null) return undefined;
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.map(String) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function badRequest(reply: FastifyReply, message: string): { error: string } {
  reply.code(400);
  return { error: message };
}

function notFound(reply: FastifyReply, kind: string, err?: unknown): { error: string } {
  reply.code(404);
  const detail = err instanceof Error ? err.message : `${kind} not found`;
  return { error: detail };
}
