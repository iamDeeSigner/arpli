import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Fastify from 'fastify';
import { schema } from '@arpli/db';

import { registerProfileRoutes } from './profile.js';
import { registerProfileImportRoutes } from './profile-import.js';

const SCHEMA_PATH = join(fileURLToPath(new URL('.', import.meta.url)), '../../../db/src/migrations');

/**
 * Onboarding's path: create the profile, read pasted text, apply it. With no
 * AI provider configured the text comes back as a bio-only preview, which is
 * enough to check the HTTP wiring without calling a model.
 */
async function openServer() {
  const tmp = mkdtempSync(join(tmpdir(), 'arpli-import-test-'));
  const sqlite = new Database(join(tmp, 'test.db'));
  sqlite.pragma('foreign_keys = ON');
  for (const file of readdirSync(SCHEMA_PATH).filter((f) => f.endsWith('.sql')).sort()) {
    for (const stmt of readFileSync(join(SCHEMA_PATH, file), 'utf8').split('--> statement-breakpoint')) {
      if (stmt.trim()) sqlite.exec(stmt.trim());
    }
  }
  const db = drizzle(sqlite, { schema });
  const app = Fastify({ logger: false });
  await registerProfileRoutes(app, db);
  await registerProfileImportRoutes(app, db);
  return {
    app,
    close: async () => {
      await app.close();
      sqlite.close();
      rmSync(tmp, { recursive: true, force: true });
    },
  };
}

test('POST /profile/import/text requires text', async () => {
  const { app, close } = await openServer();
  try {
    const res = await app.inject({ method: 'POST', url: '/profile/import/text', payload: { text: '  ' } });
    assert.equal(res.statusCode, 400);
  } finally {
    await close();
  }
});

test('onboarding path: create profile, import pasted text, apply it as the bio', async () => {
  const { app, close } = await openServer();
  try {
    const created = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: { mode: 'professional', bio: null },
    });
    assert.equal(created.statusCode, 200);
    const profileId = created.json().profile.id as string;

    const cv = 'Product designer. Six years designing fintech and AI tools in Lagos.';
    const preview = await app.inject({ method: 'POST', url: '/profile/import/text', payload: { text: cv } });
    assert.equal(preview.statusCode, 200);
    const body = preview.json();
    assert.equal(body.source, 'text');
    assert.equal(body.bio, cv, 'without an AI provider the text becomes the bio');
    assert.ok(body.warnings.length > 0, 'says why nothing was structured');

    const applied = await app.inject({
      method: 'POST',
      url: `/profile/${profileId}/import/apply`,
      payload: { preview: body, updateBio: true },
    });
    assert.equal(applied.statusCode, 200);
    assert.equal(applied.json().bioUpdated, true);

    const after = await app.inject({ method: 'GET', url: `/profile/${profileId}` });
    assert.equal(after.json().profile.bio, cv);
  } finally {
    await close();
  }
});
