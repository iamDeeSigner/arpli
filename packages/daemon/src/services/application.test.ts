import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { schema, type ArpliDb } from '@arpli/db';
import { randomUUID } from 'node:crypto';

import { ApplicationService } from './application.js';
import {
  AnswerDrafterService,
  AnswerDrafterError,
  countWords,
} from './answer-drafter.js';
import type { AiConnector, AiRequest, AiResponse, AiStreamChunk } from '../ai/types.js';

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

function openInMemory(): { db: ArpliDb; close: () => void } {
  const tmp = mkdtempSync(join(tmpdir(), 'arpli-app-test-'));
  const dbPath = join(tmp, 'test.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  applyMigrations(sqlite);
  const db = drizzle(sqlite, { schema });
  return {
    db,
    close: () => {
      sqlite.close();
      rmSync(tmp, { recursive: true, force: true });
    },
  };
}

async function seedProfile(db: ArpliDb): Promise<string> {
  const id = randomUUID();
  await db.insert(schema.profiles).values({
    id,
    userId: 'u-test',
    mode: 'student',
    bio: 'Second-year undergraduate at MIT researching materials for low-carbon cement.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await db.insert(schema.profileEducation).values({
    id: randomUUID(),
    profileId: id,
    institution: 'MIT',
    degree: 'BSc',
    field: 'Materials Science',
    startYear: 2024,
    endYear: 2028,
    gpa: null,
    honors: null,
  });
  await db.insert(schema.profileAccomplishments).values({
    id: randomUUID(),
    profileId: id,
    title: 'ARPA-E Fellowship — low-carbon cement research',
    description: 'Led a six-month study on blended Portland cements.',
    date: '2026-01',
    category: 'research',
  });
  return id;
}

async function seedOpportunity(db: ArpliDb): Promise<string> {
  const id = randomUUID();
  await db.insert(schema.opportunities).values({
    id,
    title: 'ClimateCorps Fellowship 2026',
    type: 'fellowship',
    organization: 'ClimateCorps',
    url: 'https://example.org/climate-fellows',
    deadline: '2026-03-15',
    eligibility: 'Undergraduate students in climate-adjacent STEM.',
    questions: null,
    description: 'A one-year fellowship for undergraduates.',
    tags: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return id;
}

class FakeConnector implements AiConnector {
  readonly provider = 'ollama' as const;
  readonly model = 'test-model';
  calls: AiRequest[] = [];

  constructor(private readonly produce: (req: AiRequest) => string) {}

  async complete(req: AiRequest): Promise<AiResponse> {
    this.calls.push(req);
    return {
      provider: this.provider,
      model: this.model,
      content: this.produce(req),
    };
  }

  stream(_req: AiRequest): AsyncIterable<AiStreamChunk> {
    throw new Error('stream not implemented in test fake');
  }

  async testConnection(): Promise<boolean> {
    return true;
  }
}

test('ApplicationService.create persists all fields', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const svc = new ApplicationService(db);

    const app = await svc.create({ opportunityId, profileId, notes: 'first pass' });
    assert.equal(app.opportunityId, opportunityId);
    assert.equal(app.profileId, profileId);
    assert.equal(app.status, 'drafting');
    assert.equal(app.notes, 'first pass');
    assert.ok(app.id);
    assert.ok(app.createdAt);
  } finally {
    close();
  }
});

test('ApplicationService.ensureForOpportunity is idempotent', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const svc = new ApplicationService(db);

    const a = await svc.ensureForOpportunity(opportunityId, profileId);
    const b = await svc.ensureForOpportunity(opportunityId, profileId);
    assert.equal(a.id, b.id);
    const list = await svc.list({ opportunityId });
    assert.equal(list.length, 1);
  } finally {
    close();
  }
});

test('ApplicationService.update changes status and submittedAt', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const svc = new ApplicationService(db);
    const app = await svc.create({ opportunityId, profileId });

    const submittedAt = new Date().toISOString();
    const updated = await svc.update(app.id, { status: 'submitted', submittedAt });
    assert.equal(updated.status, 'submitted');
    assert.equal(updated.submittedAt, submittedAt);
  } finally {
    close();
  }
});

test('ApplicationService.list filters by status and opportunity', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const o1 = await seedOpportunity(db);
    const o2 = await seedOpportunity(db);
    const svc = new ApplicationService(db);
    const a1 = await svc.create({ opportunityId: o1, profileId });
    await svc.create({ opportunityId: o2, profileId });
    await svc.update(a1.id, { status: 'submitted' });

    const submitted = await svc.list({ status: 'submitted' });
    assert.equal(submitted.length, 1);
    assert.equal(submitted[0].id, a1.id);

    const byOpp = await svc.list({ opportunityId: o2 });
    assert.equal(byOpp.length, 1);
    assert.equal(byOpp[0].opportunityId, o2);
  } finally {
    close();
  }
});

test('ApplicationService.delete cascades to drafts', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const svc = new ApplicationService(db);
    const app = await svc.create({ opportunityId, profileId });
    const drafter = new AnswerDrafterService(db, () => null);
    await drafter.saveDraft({
      applicationId: app.id,
      questionId: 'q1',
      questionText: 'Why?',
      draftContent: 'Because.',
    });
    const before = await drafter.listDrafts(app.id);
    assert.equal(before.length, 1);

    await svc.delete(app.id);
    const after = await drafter.listDrafts(app.id);
    assert.equal(after.length, 0);
  } finally {
    close();
  }
});

test('AnswerDrafter.draft calls the connector with profile and opportunity context', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });

    const connector = new FakeConnector(
      () => 'I spent six months at MIT studying blended Portland cements through the ARPA-E Fellowship.',
    );
    const drafter = new AnswerDrafterService(db, () => connector);

    const { draft, withinLimit } = await drafter.draft({
      applicationId: app.id,
      questionId: 'q-exp',
      questionText: 'Describe your most impactful research experience.',
      wordLimit: 50,
      tone: 'concise',
    });

    assert.ok(draft.id);
    assert.equal(draft.applicationId, app.id);
    assert.equal(draft.questionId, 'q-exp');
    assert.equal(draft.version, 1);
    assert.ok(draft.wordCount > 0);
    assert.equal(withinLimit, true);
    assert.equal(draft.aiModel, 'test-model');

    assert.equal(connector.calls.length, 1);
    const call = connector.calls[0];
    assert.ok(call.systemPrompt, 'system prompt should be injected');
    assert.ok(call.systemPrompt!.includes('MIT'), 'system prompt should carry education');
    assert.ok(
      call.systemPrompt!.includes('ClimateCorps'),
      'system prompt should carry opportunity',
    );
    assert.ok(
      call.messages[0].content.includes('50 words'),
      'user prompt should carry the word limit',
    );
    assert.ok(
      call.messages[0].content.includes('concise'),
      'user prompt should carry the tone',
    );
  } finally {
    close();
  }
});

test('AnswerDrafter.draft bumps version on second call for same question', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });

    const connector = new FakeConnector(() => 'first draft content, three sentences long.');
    const drafter = new AnswerDrafterService(db, () => connector);

    const first = await drafter.draft({
      applicationId: app.id,
      questionId: 'q-x',
      questionText: 'Why apply?',
    });
    const second = await drafter.draft({
      applicationId: app.id,
      questionId: 'q-x',
      questionText: 'Why apply?',
      previousDraft: first.draft.draftContent,
      instructions: 'make it shorter',
    });
    assert.equal(first.draft.version, 1);
    assert.equal(second.draft.version, 2);

    const latest = await drafter.latestForQuestion(app.id, 'q-x', 'Why apply?');
    assert.equal(latest?.version, 2);

    const versions = await drafter.versionsForQuestion(app.id, 'q-x', 'Why apply?');
    assert.equal(versions.length, 2);
    assert.equal(versions[0].version, 2, 'newest first');
  } finally {
    close();
  }
});

test('AnswerDrafter.draft fails when no connector is configured', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });

    const drafter = new AnswerDrafterService(db, () => null);
    await assert.rejects(
      drafter.draft({
        applicationId: app.id,
        questionText: 'Why apply?',
      }),
      (err: unknown) =>
        err instanceof AnswerDrafterError && /No active AI provider/.test((err as Error).message),
    );
  } finally {
    close();
  }
});

test('AnswerDrafter.draft rejects empty question text', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });
    const drafter = new AnswerDrafterService(db, () => new FakeConnector(() => 'x'));

    await assert.rejects(
      drafter.draft({ applicationId: app.id, questionText: '   ' }),
      (err: unknown) =>
        err instanceof AnswerDrafterError && /questionText is required/.test((err as Error).message),
    );
  } finally {
    close();
  }
});

test('AnswerDrafter.draft flags withinLimit false when model overruns', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });

    const connector = new FakeConnector(() =>
      'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty',
    );
    const drafter = new AnswerDrafterService(db, () => connector);

    const { draft, withinLimit } = await drafter.draft({
      applicationId: app.id,
      questionText: 'q?',
      wordLimit: 5,
    });
    assert.equal(draft.wordCount, 20);
    assert.equal(withinLimit, false);
  } finally {
    close();
  }
});

test('AnswerDrafter.saveDraft stores a user edit as a new version', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });
    const drafter = new AnswerDrafterService(db, () => null);

    const v1 = await drafter.saveDraft({
      applicationId: app.id,
      questionId: 'q1',
      questionText: 'Explain yourself.',
      draftContent: 'First.',
    });
    const v2 = await drafter.saveDraft({
      applicationId: app.id,
      questionId: 'q1',
      questionText: 'Explain yourself.',
      draftContent: 'First. Second sentence.',
    });
    assert.equal(v1.version, 1);
    assert.equal(v2.version, 2);
    assert.equal(v2.wordCount, 3);
  } finally {
    close();
  }
});

test('AnswerDrafter.listDrafts across multiple questions', async () => {
  const { db, close } = openInMemory();
  try {
    const profileId = await seedProfile(db);
    const opportunityId = await seedOpportunity(db);
    const apps = new ApplicationService(db);
    const app = await apps.create({ opportunityId, profileId });
    const drafter = new AnswerDrafterService(db, () => null);

    await drafter.saveDraft({
      applicationId: app.id,
      questionId: 'q1',
      questionText: 'Q1',
      draftContent: 'a',
    });
    await drafter.saveDraft({
      applicationId: app.id,
      questionId: 'q2',
      questionText: 'Q2',
      draftContent: 'b',
    });

    const all = await drafter.listDrafts(app.id);
    assert.equal(all.length, 2);
    const q1 = await drafter.versionsForQuestion(app.id, 'q1', 'Q1');
    assert.equal(q1.length, 1);
  } finally {
    close();
  }
});

test('countWords handles edge cases', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('one'), 1);
  assert.equal(countWords('one two   three\nfour'), 4);
});
