import type { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import type { ArpliDb } from '@arpli/db';
import { getActiveConnector } from '../ai/manager.js';
import {
  ApplicationService,
  isApplicationStatus,
} from '../services/application.js';
import {
  AnswerDrafterError,
  AnswerDrafterService,
} from '../services/answer-drafter.js';

/**
 * Fastify routes for the Application + Draft domain.
 *
 * Mounted at the daemon root:
 *   POST   /applications                  — create (or ensure, when opportunityId+profileId already linked)
 *   GET    /applications                  — list, optional ?opportunityId= / ?profileId= / ?status= filters
 *   GET    /applications/:id              — one application + its latest drafts
 *   PATCH  /applications/:id              — update status/notes/submittedAt
 *   DELETE /applications/:id              — hard delete (drafts cascade)
 *
 *   POST   /applications/:id/draft        — draft an answer with AI
 *   POST   /applications/:id/drafts       — save a user-edited draft (new version)
 *   GET    /applications/:id/drafts       — all draft versions for this application
 *   DELETE /applications/:id/drafts/:draftId — remove one version
 */
export interface ApplicationRoutesOptions {
  db: ArpliDb;
}

export const applicationRoutes: FastifyPluginAsync<ApplicationRoutesOptions> = async (
  app,
  opts,
) => {
  const applications = new ApplicationService(opts.db);
  const drafter = new AnswerDrafterService(opts.db, () => getActiveConnector(opts.db));

  // ── Create / ensure ────────────────────────────────────────────────────────

  app.post<{
    Body: {
      opportunityId?: unknown;
      profileId?: unknown;
      status?: unknown;
      notes?: unknown;
      ensure?: unknown;
    };
  }>('/applications', async (req, reply) => {
    const body = req.body ?? {};
    const opportunityId = asStringOrNull(body.opportunityId);
    const profileId = asStringOrNull(body.profileId);

    if (!opportunityId) return badRequest(reply, 'opportunityId is required');
    if (!profileId) return badRequest(reply, 'profileId is required');

    try {
      if (body.ensure === true) {
        const existing = await applications.ensureForOpportunity(opportunityId, profileId);
        reply.code(200);
        return { application: existing };
      }
      const status =
        typeof body.status === 'string' && isApplicationStatus(body.status)
          ? body.status
          : undefined;
      const created = await applications.create({
        opportunityId,
        profileId,
        status,
        notes: asStringOrNull(body.notes),
      });
      reply.code(201);
      return { application: created };
    } catch (err) {
      return badRequest(reply, (err as Error).message);
    }
  });

  // ── List ───────────────────────────────────────────────────────────────────

  app.get<{
    Querystring: { opportunityId?: string; profileId?: string; status?: string };
  }>('/applications', async (req, reply) => {
    const { opportunityId, profileId, status } = req.query;
    if (status !== undefined && !isApplicationStatus(status)) {
      return badRequest(reply, 'invalid status filter');
    }
    const list = await applications.list({
      opportunityId: opportunityId || undefined,
      profileId: profileId || undefined,
      status: status as ReturnType<typeof filterStatusCast> | undefined,
    });
    return { applications: list };
  });

  // ── Get one ────────────────────────────────────────────────────────────────

  app.get<{ Params: { id: string } }>('/applications/:id', async (req, reply) => {
    const application = await applications.get(req.params.id);
    if (!application) return notFound(reply, 'application');
    const drafts = await drafter.listDrafts(application.id);
    return { application, drafts };
  });

  // ── Patch ──────────────────────────────────────────────────────────────────

  app.patch<{
    Params: { id: string };
    Body: { status?: unknown; notes?: unknown; submittedAt?: unknown };
  }>('/applications/:id', async (req, reply) => {
    const body = req.body ?? {};
    if (body.status !== undefined && !isApplicationStatus(body.status)) {
      return badRequest(reply, 'invalid application status');
    }
    try {
      const updated = await applications.update(req.params.id, {
        ...(body.status !== undefined && isApplicationStatus(body.status) && { status: body.status }),
        ...(body.notes !== undefined && { notes: asStringOrNull(body.notes) }),
        ...(body.submittedAt !== undefined && { submittedAt: asStringOrNull(body.submittedAt) }),
      });
      return { application: updated };
    } catch (err) {
      return notFound(reply, 'application', err);
    }
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  app.delete<{ Params: { id: string } }>('/applications/:id', async (req) => {
    await applications.delete(req.params.id);
    return { ok: true };
  });

  // ── Draft an answer ────────────────────────────────────────────────────────

  app.post<{
    Params: { id: string };
    Body: {
      questionId?: unknown;
      questionText?: unknown;
      wordLimit?: unknown;
      tone?: unknown;
      instructions?: unknown;
      previousDraft?: unknown;
    };
  }>('/applications/:id/draft', async (req, reply) => {
    const body = req.body ?? {};
    const questionText =
      typeof body.questionText === 'string' ? body.questionText.trim() : '';
    if (!questionText) return badRequest(reply, 'questionText is required');

    const wordLimit =
      typeof body.wordLimit === 'number' && Number.isFinite(body.wordLimit)
        ? Math.max(0, Math.round(body.wordLimit))
        : null;

    try {
      const result = await drafter.draft({
        applicationId: req.params.id,
        questionId: asStringOrNull(body.questionId),
        questionText,
        wordLimit: wordLimit === 0 ? null : wordLimit,
        tone: asStringOrNull(body.tone),
        instructions: asStringOrNull(body.instructions),
        previousDraft: asStringOrNull(body.previousDraft),
      });
      return result;
    } catch (err) {
      if (err instanceof AnswerDrafterError) {
        return reply.code(422).send({ error: err.message });
      }
      app.log.error({ err }, 'applications.draft failed');
      return reply.code(502).send({ error: errorMessage(err) });
    }
  });

  // ── Save user-edited draft (new version) ───────────────────────────────────

  app.post<{
    Params: { id: string };
    Body: {
      questionId?: unknown;
      questionText?: unknown;
      draftContent?: unknown;
      tone?: unknown;
      instructions?: unknown;
    };
  }>('/applications/:id/drafts', async (req, reply) => {
    const body = req.body ?? {};
    const questionText =
      typeof body.questionText === 'string' ? body.questionText.trim() : '';
    const draftContent =
      typeof body.draftContent === 'string' ? body.draftContent : '';
    if (!questionText) return badRequest(reply, 'questionText is required');
    if (!draftContent.trim()) return badRequest(reply, 'draftContent is required');

    try {
      const draft = await drafter.saveDraft({
        applicationId: req.params.id,
        questionId: asStringOrNull(body.questionId),
        questionText,
        draftContent,
        tone: asStringOrNull(body.tone),
        instructions: asStringOrNull(body.instructions),
      });
      reply.code(201);
      return { draft };
    } catch (err) {
      if (err instanceof AnswerDrafterError) {
        return reply.code(422).send({ error: err.message });
      }
      return badRequest(reply, errorMessage(err));
    }
  });

  // ── List drafts ────────────────────────────────────────────────────────────

  app.get<{ Params: { id: string } }>('/applications/:id/drafts', async (req) => {
    const drafts = await drafter.listDrafts(req.params.id);
    return { drafts };
  });

  // ── Delete one draft version ───────────────────────────────────────────────

  app.delete<{ Params: { id: string; draftId: string } }>(
    '/applications/:id/drafts/:draftId',
    async (req) => {
      await drafter.deleteDraft(req.params.draftId);
      return { ok: true };
    },
  );
};

export async function registerApplicationRoutes(
  app: FastifyInstance,
  db: ArpliDb,
): Promise<void> {
  await app.register(applicationRoutes, { db });
}

// ── helpers ──────────────────────────────────────────────────────────────────

function asStringOrNull(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = typeof v === 'string' ? v.trim() : String(v).trim();
  return s.length === 0 ? null : s;
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

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/** Type-only helper so the inlined cast reads clearly. */
function filterStatusCast(): import('@arpli/shared').ApplicationStatus {
  throw new Error('type helper only');
}
