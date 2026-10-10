import type { FastifyInstance, FastifyReply } from 'fastify';
import type { ArpliDb } from '@arpli/db';

import { ProfileService } from '../services/profile.js';
import {
  ProfileImportService,
  detectDocType,
  type ImportPreview,
} from '../services/profile-import.js';
import { getActiveConnector } from '../ai/manager.js';

/**
 * HTTP routes for the Document Import feature.
 *
 *   POST /profile/import              — multipart file upload (PDF/DOCX/ZIP)
 *   POST /profile/import/linkedin     — JSON body: LinkedIn JSON export
 *   POST /profile/import/url          — JSON body: { url: string }
 *   POST /profile/:id/import/apply    — JSON body: { preview, updateBio? }
 *
 * All routes return an `ImportPreview` (parse-only) or an `ImportApplyResult`
 * (confirmed apply). Nothing is written to SQLite until the user confirms
 * via the `/apply` endpoint — matching the "preview before confirming"
 * UX requirement in the Phase 1 spec.
 */

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export async function registerProfileImportRoutes(
  app: FastifyInstance,
  db: ArpliDb,
): Promise<void> {
  // Fastify multipart plugin — registered once per daemon.
  if (!(app as unknown as { hasMultipart?: boolean }).hasMultipart) {
    const multipart = await import('@fastify/multipart');
    await app.register(multipart.default, {
      limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    });
    (app as unknown as { hasMultipart?: boolean }).hasMultipart = true;
  }

  const profiles = new ProfileService(db);
  const importer = new ProfileImportService(profiles);

  app.post('/profile/import', async (req, reply) => {
    const data = await (req as unknown as {
      file?: () => Promise<{
        filename: string;
        mimetype: string;
        toBuffer: () => Promise<Buffer>;
      } | undefined>;
    }).file?.();
    if (!data) {
      return badRequest(reply, 'multipart file field is required');
    }
    const buffer = await data.toBuffer();
    const kind = detectDocType(data.filename, data.mimetype);

    try {
      if (kind === 'pdf' || kind === 'docx') {
        const connector = safeConnector(db);
        const preview = await importer.parseResume(
          { buffer, filename: data.filename, mimetype: data.mimetype },
          connector,
        );
        return preview;
      }
      if (kind === 'linkedin-zip') {
        return importer.parseLinkedin({ kind: 'zip', buffer });
      }
      if (kind === 'linkedin-json') {
        const text = buffer.toString('utf8');
        try {
          const parsed = JSON.parse(text);
          return importer.parseLinkedin({ kind: 'json', data: parsed });
        } catch (err) {
          return badRequest(
            reply,
            `uploaded .json could not be parsed: ${(err as Error).message}`,
          );
        }
      }
      if (kind === 'text') {
        const connector = safeConnector(db);
        return importer.parseResumeText(buffer.toString('utf8'), 'text', connector);
      }
      return badRequest(
        reply,
        `unsupported file type: ${data.mimetype || data.filename}. Supported: PDF, DOCX, LinkedIn ZIP, LinkedIn JSON, plain text.`,
      );
    } catch (err) {
      req.log.error({ err }, 'profile.import failed');
      return reply.code(500).send({ error: (err as Error).message });
    }
  });

  app.post<{ Body: { data?: unknown } }>(
    '/profile/import/linkedin',
    async (req, reply) => {
      const data = req.body?.data;
      if (data === undefined || data === null) {
        return badRequest(reply, 'body.data is required (LinkedIn JSON payload)');
      }
      try {
        return await importer.parseLinkedin({ kind: 'json', data });
      } catch (err) {
        req.log.error({ err }, 'profile.import.linkedin failed');
        return reply.code(500).send({ error: (err as Error).message });
      }
    },
  );

  app.post<{ Body: { url?: unknown } }>(
    '/profile/import/url',
    async (req, reply) => {
      const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
      if (!url) return badRequest(reply, 'body.url is required');
      try {
        return await importer.parseLinkedinUrl(url);
      } catch (err) {
        req.log.error({ err }, 'profile.import.url failed');
        return reply.code(500).send({ error: (err as Error).message });
      }
    },
  );

  app.post<{
    Params: { id: string };
    Body: { preview?: ImportPreview; updateBio?: boolean };
  }>('/profile/:id/import/apply', async (req, reply) => {
    const preview = req.body?.preview;
    if (!preview || typeof preview !== 'object') {
      return badRequest(reply, 'body.preview is required');
    }
    try {
      const result = await importer.applyPreview(req.params.id, preview, {
        updateBio: req.body?.updateBio === true,
      });
      return result;
    } catch (err) {
      req.log.error({ err }, 'profile.import.apply failed');
      const message = (err as Error).message ?? 'apply failed';
      const notFound = /not found/i.test(message);
      return reply.code(notFound ? 404 : 500).send({ error: message });
    }
  });
}

function safeConnector(db: ArpliDb) {
  try {
    return getActiveConnector(db);
  } catch {
    // When the active provider is misconfigured we still want to let
    // the import proceed in degraded "bio-only" mode. parseResumeText
    // handles a null connector gracefully.
    return null;
  }
}

function badRequest(reply: FastifyReply, message: string): { error: string } {
  reply.code(400);
  return { error: message };
}
