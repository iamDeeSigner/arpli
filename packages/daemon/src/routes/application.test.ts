import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import Fastify from 'fastify';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { schema, type ArpliDb } from '@arpli/db';
import { applicationRoutes } from './application.js';

const SCHEMA_PATH = resolveSchemaPath();

function resolveSchemaPath(): string {
  const here = fileURLToPath(new URL('.', import.meta.url));
  return join(here, '../../../db/src/migrations');
}

function applyMigrations(sqlite: Database.Database) {
  const files = readdirSync(SCHEMA_PATH)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    const sql = readFileSync(join(SCHEMA_PATH, f), 'utf8');
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim();
      if (trimmed) sqlite.exec(trimmed);
    }
  }
}

/**
 * Boot a Fastify instance with ONLY the application routes registered,
 * seed one profile + one opportunity, and return the handle for the test
 * to inject HTTP requests against.
 *
 * The AI connector is tested by the unit tests in
 * `services/application.test.ts` with a fake loader. The route-level
 * tests here cover HTTP wiring, status codes and request/response shape.
 */
async function openServer(): Promise<{
  app: Awaited<ReturnType<typeof buildApp>>;
  db: ArpliDb;
  profileId: string;
  opportunityId: string;
  close: () => void;
}> {
  const tmp = mkdtempSync(join(tmpdir(), 'arpli-route-test-'));
  const dbPath = join(tmp, 'test.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  applyMigrations(sqlite);
  const db = drizzle(sqlite, { schema });

  const profileId = randomUUID();
  await db.insert(schema.profiles).values({
    id: profileId,
    userId: 'u',
    mode: 'student',
    bio: 'Materials science undergraduate at MIT working on low-carbon cement.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const opportunityId = randomUUID();
  await db.insert(schema.opportunities).values({
    id: opportunityId,
    title: 'ClimateCorps Fellowship 2026',
    type: 'fellowship',
    organization: 'ClimateCorps',
    url: null,
    deadline: '2026-03-15',
    eligibility: null,
    questions: JSON.stringify([{ id: 'q-why', text: 'Why apply?', wordLimit: 50 }]),
    description: null,
    tags: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const app = await buildApp(db);
  return {
    app,
    db,
    profileId,
    opportunityId,
    close: () => {
      void app.close();
      sqlite.close();
      rmSync(tmp, { recursive: true, force: true });
    },
  };
}

async function buildApp(db: ArpliDb) {
  const app = Fastify({ logger: false });
  await app.register(applicationRoutes, { db });
  return app;
}

test('POST /applications creates an application', async () => {
  const ctx = await openServer();
  try {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    assert.equal(res.statusCode, 201);
    const body = res.json() as { application: { id: string; opportunityId: string } };
    assert.ok(body.application.id);
    assert.equal(body.application.opportunityId, ctx.opportunityId);
  } finally {
    ctx.close();
  }
});

test('POST /applications with ensure=true is idempotent', async () => {
  const ctx = await openServer();
  try {
    const first = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId, ensure: true },
    });
    assert.equal(first.statusCode, 200);
    const second = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId, ensure: true },
    });
    assert.equal(second.statusCode, 200);
    assert.equal(
      (first.json() as { application: { id: string } }).application.id,
      (second.json() as { application: { id: string } }).application.id,
    );
  } finally {
    ctx.close();
  }
});

test('GET /applications/:id returns application + drafts', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;
    const res = await ctx.app.inject({ method: 'GET', url: `/applications/${id}` });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { application: { id: string }; drafts: unknown[] };
    assert.equal(body.application.id, id);
    assert.deepEqual(body.drafts, []);
  } finally {
    ctx.close();
  }
});

test('POST /applications/:id/drafts persists a user-saved draft', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/applications/${id}/drafts`,
      payload: {
        questionId: 'q-why',
        questionText: 'Why apply?',
        draftContent: 'Because I care about climate.',
      },
    });
    assert.equal(res.statusCode, 201);
    const body = res.json() as { draft: { id: string; version: number; wordCount: number } };
    assert.ok(body.draft.id);
    assert.equal(body.draft.version, 1);
    assert.equal(body.draft.wordCount, 5);
  } finally {
    ctx.close();
  }
});

test('POST /applications/:id/draft requires questionText', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/applications/${id}/draft`,
      payload: { questionId: 'q-why' },
    });
    assert.equal(res.statusCode, 400);
  } finally {
    ctx.close();
  }
});

test('POST /applications/:id/draft returns 422 with no provider configured', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/applications/${id}/draft`,
      payload: { questionText: 'Why apply?', wordLimit: 50 },
    });
    // No provider configured in SQLite → getActiveConnector returns null → AnswerDrafterError → 422
    assert.equal(res.statusCode, 422);
    const body = res.json() as { error: string };
    assert.match(body.error, /No active AI provider/);
  } finally {
    ctx.close();
  }
});

test('PATCH /applications/:id updates status', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;

    const res = await ctx.app.inject({
      method: 'PATCH',
      url: `/applications/${id}`,
      payload: { status: 'submitted', notes: 'done' },
    });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { application: { status: string; notes: string } };
    assert.equal(body.application.status, 'submitted');
    assert.equal(body.application.notes, 'done');
  } finally {
    ctx.close();
  }
});

test('DELETE /applications/:id removes the application', async () => {
  const ctx = await openServer();
  try {
    const created = await ctx.app.inject({
      method: 'POST',
      url: '/applications',
      payload: { opportunityId: ctx.opportunityId, profileId: ctx.profileId },
    });
    const id = (created.json() as { application: { id: string } }).application.id;

    const del = await ctx.app.inject({ method: 'DELETE', url: `/applications/${id}` });
    assert.equal(del.statusCode, 200);
    const check = await ctx.app.inject({ method: 'GET', url: `/applications/${id}` });
    assert.equal(check.statusCode, 404);
  } finally {
    ctx.close();
  }
});

