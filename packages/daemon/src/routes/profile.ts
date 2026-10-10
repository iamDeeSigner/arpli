import type { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import type { ArpliDb } from '@arpli/db';
import type { ProfileMode } from '@arpli/shared';
import { ProfileService, isProfileMode } from '../services/profile.js';
import { ProfileExportService } from '../services/profile-export.js';
import { ProfileGapsService } from '../services/profile-gaps.js';

/**
 * Fastify routes that expose the profile service layer over local HTTP.
 *
 * Mounted at the daemon root. No auth — the daemon only binds to
 * 127.0.0.1 and talks to the desktop app on the same machine.
 */
export interface ProfileRoutesOptions {
  db: ArpliDb;
}

export const profileRoutes: FastifyPluginAsync<ProfileRoutesOptions> = async (app, opts) => {
  const profiles = new ProfileService(opts.db);
  const exports = new ProfileExportService(profiles);
  const gaps = new ProfileGapsService(profiles, exports);

  // ------------- Profile core -------------

  app.get('/profile', async () => {
    const profile = await profiles.getActiveProfile();
    return { profile };
  });

  app.post<{ Body: { mode: unknown; bio?: unknown } }>('/profile', async (req, reply) => {
    const { mode, bio } = req.body ?? ({} as { mode?: unknown; bio?: unknown });
    if (!isProfileMode(mode)) {
      return badRequest(reply, 'mode must be one of student|founder|researcher|professional');
    }
    const profile = await profiles.createProfile({
      mode,
      bio: typeof bio === 'string' ? bio : undefined,
    });
    return { profile };
  });

  app.get<{ Params: { id: string } }>('/profile/:id', async (req, reply) => {
    const profile = await profiles.getProfile(req.params.id);
    if (!profile) return notFound(reply, 'profile');
    return { profile };
  });

  app.patch<{
    Params: { id: string };
    Body: { mode?: unknown; bio?: unknown };
  }>('/profile/:id', async (req, reply) => {
    const patch: { mode?: ProfileMode; bio?: string | null } = {};
    if (req.body?.mode !== undefined) {
      if (!isProfileMode(req.body.mode)) {
        return badRequest(reply, 'mode must be one of student|founder|researcher|professional');
      }
      patch.mode = req.body.mode;
    }
    if (req.body?.bio !== undefined) {
      patch.bio = typeof req.body.bio === 'string' ? req.body.bio : null;
    }
    try {
      const profile = await profiles.updateProfile(req.params.id, patch);
      return { profile };
    } catch (err) {
      return notFound(reply, 'profile', err);
    }
  });

  // ------------- Sub-entity routes -------------
  //
  // All sub-entities share the same shape:
  //   GET    /profile/:id/<kind>
  //   POST   /profile/:id/<kind>
  //   PATCH  /profile/:id/<kind>/:entityId
  //   DELETE /profile/:id/<kind>/:entityId
  //
  // The handlers are wired through the service's add/update/remove/list
  // methods and return raw rows.

  // Education
  app.get<{ Params: { id: string } }>('/profile/:id/education', async (req) => ({
    education: await profiles.listEducation(req.params.id),
  }));
  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/profile/:id/education',
    async (req, reply) => {
      try {
        const entry = await profiles.addEducation(req.params.id, {
          institution: String(req.body?.institution ?? ''),
          degree: asStringOrNull(req.body?.degree),
          field: asStringOrNull(req.body?.field),
          startYear: asIntOrNull(req.body?.startYear),
          endYear: asIntOrNull(req.body?.endYear),
          gpa: asNumberOrNull(req.body?.gpa),
          honors: asStringOrNull(req.body?.honors),
        });
        return { education: entry };
      } catch (err) {
        return badRequest(reply, (err as Error).message);
      }
    },
  );
  app.patch<{ Params: { id: string; entityId: string }; Body: Record<string, unknown> }>(
    '/profile/:id/education/:entityId',
    async (req, reply) => {
      try {
        const entry = await profiles.updateEducation(req.params.entityId, req.body);
        return { education: entry };
      } catch (err) {
        return notFound(reply, 'education', err);
      }
    },
  );
  app.delete<{ Params: { id: string; entityId: string } }>(
    '/profile/:id/education/:entityId',
    async (req) => {
      await profiles.removeEducation(req.params.entityId);
      return { ok: true };
    },
  );

  // Work
  app.get<{ Params: { id: string } }>('/profile/:id/work', async (req) => ({
    work: await profiles.listWork(req.params.id),
  }));
  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/profile/:id/work',
    async (req, reply) => {
      try {
        const entry = await profiles.addWork(req.params.id, {
          company: String(req.body?.company ?? ''),
          title: String(req.body?.title ?? ''),
          description: asStringOrNull(req.body?.description),
          startDate: asStringOrNull(req.body?.startDate),
          endDate: asStringOrNull(req.body?.endDate),
          current: Boolean(req.body?.current),
        });
        return { work: entry };
      } catch (err) {
        return badRequest(reply, (err as Error).message);
      }
    },
  );
  app.patch<{ Params: { id: string; entityId: string }; Body: Record<string, unknown> }>(
    '/profile/:id/work/:entityId',
    async (req, reply) => {
      try {
        const entry = await profiles.updateWork(req.params.entityId, req.body);
        return { work: entry };
      } catch (err) {
        return notFound(reply, 'work', err);
      }
    },
  );
  app.delete<{ Params: { id: string; entityId: string } }>(
    '/profile/:id/work/:entityId',
    async (req) => {
      await profiles.removeWork(req.params.entityId);
      return { ok: true };
    },
  );

  // Projects
  app.get<{ Params: { id: string } }>('/profile/:id/projects', async (req) => ({
    projects: await profiles.listProjects(req.params.id),
  }));
  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/profile/:id/projects',
    async (req, reply) => {
      try {
        const entry = await profiles.addProject(req.params.id, {
          name: String(req.body?.name ?? ''),
          description: asStringOrNull(req.body?.description),
          url: asStringOrNull(req.body?.url),
          startDate: asStringOrNull(req.body?.startDate),
          endDate: asStringOrNull(req.body?.endDate),
        });
        return { project: entry };
      } catch (err) {
        return badRequest(reply, (err as Error).message);
      }
    },
  );
  app.patch<{ Params: { id: string; entityId: string }; Body: Record<string, unknown> }>(
    '/profile/:id/projects/:entityId',
    async (req, reply) => {
      try {
        const entry = await profiles.updateProject(req.params.entityId, req.body);
        return { project: entry };
      } catch (err) {
        return notFound(reply, 'project', err);
      }
    },
  );
  app.delete<{ Params: { id: string; entityId: string } }>(
    '/profile/:id/projects/:entityId',
    async (req) => {
      await profiles.removeProject(req.params.entityId);
      return { ok: true };
    },
  );

  // Accomplishments
  app.get<{ Params: { id: string } }>('/profile/:id/accomplishments', async (req) => ({
    accomplishments: await profiles.listAccomplishments(req.params.id),
  }));
  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/profile/:id/accomplishments',
    async (req, reply) => {
      try {
        const entry = await profiles.addAccomplishment(req.params.id, {
          title: String(req.body?.title ?? ''),
          description: asStringOrNull(req.body?.description),
          date: asStringOrNull(req.body?.date),
          category: asStringOrNull(req.body?.category),
        });
        return { accomplishment: entry };
      } catch (err) {
        return badRequest(reply, (err as Error).message);
      }
    },
  );
  app.patch<{ Params: { id: string; entityId: string }; Body: Record<string, unknown> }>(
    '/profile/:id/accomplishments/:entityId',
    async (req, reply) => {
      try {
        const entry = await profiles.updateAccomplishment(req.params.entityId, req.body);
        return { accomplishment: entry };
      } catch (err) {
        return notFound(reply, 'accomplishment', err);
      }
    },
  );
  app.delete<{ Params: { id: string; entityId: string } }>(
    '/profile/:id/accomplishments/:entityId',
    async (req) => {
      await profiles.removeAccomplishment(req.params.entityId);
      return { ok: true };
    },
  );

  // Essays
  app.get<{ Params: { id: string } }>('/profile/:id/essays', async (req) => ({
    essays: await profiles.listEssays(req.params.id),
  }));
  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    '/profile/:id/essays',
    async (req, reply) => {
      try {
        const entry = await profiles.addEssay(req.params.id, {
          title: String(req.body?.title ?? ''),
          content: String(req.body?.content ?? ''),
          tags: asStringOrNull(req.body?.tags),
        });
        return { essay: entry };
      } catch (err) {
        return badRequest(reply, (err as Error).message);
      }
    },
  );
  app.patch<{ Params: { id: string; entityId: string }; Body: Record<string, unknown> }>(
    '/profile/:id/essays/:entityId',
    async (req, reply) => {
      try {
        const entry = await profiles.updateEssay(req.params.entityId, req.body);
        return { essay: entry };
      } catch (err) {
        return notFound(reply, 'essay', err);
      }
    },
  );
  app.delete<{ Params: { id: string; entityId: string } }>(
    '/profile/:id/essays/:entityId',
    async (req) => {
      await profiles.removeEssay(req.params.entityId);
      return { ok: true };
    },
  );

  // ------------- Export + gaps -------------

  app.get<{ Params: { id: string }; Querystring: { format?: string } }>(
    '/profile/:id/export',
    async (req, reply) => {
      const format = (req.query?.format ?? 'json').toLowerCase();
      if (format === 'markdown') {
        try {
          const md = await exports.exportToMarkdown(req.params.id);
          reply.header('content-type', 'text/markdown; charset=utf-8');
          return md;
        } catch (err) {
          return notFound(reply, 'profile', err);
        }
      }
      if (format === 'json') {
        try {
          return await exports.exportToJSON(req.params.id);
        } catch (err) {
          return notFound(reply, 'profile', err);
        }
      }
      return badRequest(reply, "format must be 'markdown' or 'json'");
    },
  );

  app.get<{ Params: { id: string } }>('/profile/:id/gaps', async (req, reply) => {
    try {
      const items = await gaps.getProfileGaps(req.params.id);
      return { gaps: items };
    } catch (err) {
      return notFound(reply, 'profile', err);
    }
  });
};

// ---------------- helpers ----------------

function asStringOrNull(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  return typeof v === 'string' ? v : String(v);
}

function asIntOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function asNumberOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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

export async function registerProfileRoutes(app: FastifyInstance, db: ArpliDb): Promise<void> {
  await app.register(profileRoutes, { db });
}
