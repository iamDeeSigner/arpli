import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { schema, type ArpliDb } from '@arpli/db';

import { ProfileService, countWords } from './profile.js';
import { ProfileExportService } from './profile-export.js';
import { ProfileGapsService, detectGaps } from './profile-gaps.js';

const SCHEMA_PATH = resolveSchemaPath();

function resolveSchemaPath(): string {
  // packages/daemon/src/services/profile.test.ts → packages/db/src/migrations
  const here = fileURLToPath(new URL('.', import.meta.url));
  return join(here, '../../../db/src/migrations');
}

function applyMigrations(sqlite: Database.Database) {
  // The drizzle migrator looks for a meta/_journal.json. For an in-memory
  // test it's simpler to replay the .sql statements directly.
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
  const tmp = mkdtempSync(join(tmpdir(), 'arpli-test-'));
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

test('countWords handles empty, whitespace, and multi-space input', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   \n '), 0);
  assert.equal(countWords('hello world'), 2);
  assert.equal(countWords('  a   b   c  '), 3);
});

test('createProfile persists and getProfile reads back', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const p = await svc.createProfile({ mode: 'student', bio: 'Hello' });
    assert.ok(p.id);
    assert.equal(p.mode, 'student');
    assert.equal(p.bio, 'Hello');
    const got = await svc.getProfile(p.id);
    assert.ok(got);
    assert.equal(got!.id, p.id);
  } finally {
    h.close();
  }
});

test('createProfile rejects an invalid mode', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    await assert.rejects(
      () => svc.createProfile({ mode: 'retiree' as unknown as 'student' }),
      /invalid profile mode/,
    );
  } finally {
    h.close();
  }
});

test('updateProfile patches bio and refreshes updatedAt', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const p = await svc.createProfile({ mode: 'founder', bio: 'before' });
    // Guarantee a strictly-later ISO timestamp for the update.
    await new Promise((r) => setTimeout(r, 5));
    const updated = await svc.updateProfile(p.id, { bio: 'after' });
    assert.equal(updated.bio, 'after');
    assert.ok(
      updated.updatedAt >= p.updatedAt,
      `expected updatedAt to advance: ${p.updatedAt} -> ${updated.updatedAt}`,
    );
  } finally {
    h.close();
  }
});

test('getActiveProfile returns the most recently updated profile', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const first = await svc.createProfile({ mode: 'student' });
    await new Promise((r) => setTimeout(r, 5));
    const second = await svc.createProfile({ mode: 'founder' });
    const active = await svc.getActiveProfile();
    assert.ok(active);
    assert.equal(active!.id, second.id, `expected newest profile active, got ${active!.id}`);
    // Touch the first one and expect it to flip.
    await new Promise((r) => setTimeout(r, 5));
    await svc.updateProfile(first.id, { bio: 'bumped' });
    const active2 = await svc.getActiveProfile();
    assert.equal(active2!.id, first.id);
  } finally {
    h.close();
  }
});

test('education CRUD round-trips through the service', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const p = await svc.createProfile({ mode: 'student' });
    const edu = await svc.addEducation(p.id, {
      institution: 'University X',
      degree: 'BSc',
      field: 'CS',
      startYear: 2018,
      endYear: 2022,
      gpa: 3.8,
      honors: 'Dean List',
    });
    assert.equal(edu.institution, 'University X');

    const list = await svc.listEducation(p.id);
    assert.equal(list.length, 1);
    assert.equal(list[0].gpa, 3.8);

    const updated = await svc.updateEducation(edu.id, { honors: 'Summa cum laude' });
    assert.equal(updated.honors, 'Summa cum laude');

    await svc.removeEducation(edu.id);
    const empty = await svc.listEducation(p.id);
    assert.equal(empty.length, 0);
  } finally {
    h.close();
  }
});

test('work entries respect the required-fields guard', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const p = await svc.createProfile({ mode: 'professional' });
    await assert.rejects(
      () =>
        svc.addWork(p.id, {
          company: '',
          title: 'Engineer',
          description: null,
          startDate: null,
          endDate: null,
          current: false,
        }),
      /company is required/,
    );
    await assert.rejects(
      () =>
        svc.addWork(p.id, {
          company: 'Acme',
          title: '',
          description: null,
          startDate: null,
          endDate: null,
          current: false,
        }),
      /title is required/,
    );
    const w = await svc.addWork(p.id, {
      company: 'Acme',
      title: 'Engineer',
      description: 'Built things.',
      startDate: '2020-01',
      endDate: null,
      current: true,
    });
    assert.equal(w.current, true);
    const list = await svc.listWork(p.id);
    assert.equal(list.length, 1);
  } finally {
    h.close();
  }
});

test('essays compute wordCount automatically on add and update', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const p = await svc.createProfile({ mode: 'student' });
    const essay = await svc.addEssay(p.id, {
      title: 'Why me',
      content: 'one two three four five',
      tags: 'identity',
    });
    assert.equal(essay.wordCount, 5);
    const updated = await svc.updateEssay(essay.id, { content: 'one two three' });
    assert.equal(updated.wordCount, 3);
    // Explicit override is honoured.
    const forced = await svc.updateEssay(essay.id, { wordCount: 99 });
    assert.equal(forced.wordCount, 99);
  } finally {
    h.close();
  }
});

test('exportToJSON returns the full aggregate', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const exports = new ProfileExportService(svc);
    const p = await svc.createProfile({ mode: 'founder', bio: 'Founder bio text' });
    await svc.addEducation(p.id, {
      institution: 'Uni',
      degree: null,
      field: null,
      startYear: null,
      endYear: null,
      gpa: null,
      honors: null,
    });
    await svc.addWork(p.id, {
      company: 'Acme',
      title: 'Founder',
      description: null,
      startDate: null,
      endDate: null,
      current: true,
    });
    await svc.addProject(p.id, {
      name: 'Thing',
      description: null,
      url: null,
      startDate: null,
      endDate: null,
    });
    await svc.addAccomplishment(p.id, {
      title: 'Won X',
      description: null,
      date: null,
      category: null,
    });
    await svc.addEssay(p.id, { title: 'My Story', content: 'a b c', tags: null });

    const data = await exports.exportToJSON(p.id);
    assert.equal(data.profile.id, p.id);
    assert.equal(data.education.length, 1);
    assert.equal(data.work.length, 1);
    assert.equal(data.projects.length, 1);
    assert.equal(data.accomplishments.length, 1);
    assert.equal(data.essays.length, 1);
  } finally {
    h.close();
  }
});

test('exportToMarkdown is deterministic from the aggregate', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const exports = new ProfileExportService(svc);
    const p = await svc.createProfile({ mode: 'student', bio: 'Short bio.' });
    await svc.addEducation(p.id, {
      institution: 'Uni',
      degree: 'BSc',
      field: 'Math',
      startYear: 2020,
      endYear: 2024,
      gpa: 3.9,
      honors: null,
    });
    const md = await exports.exportToMarkdown(p.id);
    assert.match(md, /^# Profile/);
    assert.match(md, /\*\*Mode\*\*: student/);
    assert.match(md, /## Bio/);
    assert.match(md, /Short bio\./);
    assert.match(md, /## Education/);
    assert.match(md, /Uni/);
    assert.match(md, /BSc, Math/);
    assert.match(md, /2020–2024/);
    assert.match(md, /GPA 3\.9/);
  } finally {
    h.close();
  }
});

test('detectGaps flags empty required fields for a student profile', () => {
  const gaps = detectGaps({
    profile: { mode: 'student', bio: null },
    education: [],
    work: [],
    projects: [],
    accomplishments: [],
    essays: [],
  });
  const fields = gaps.map((g) => g.field).sort();
  assert.deepEqual(fields, [
    'accomplishments',
    'bio',
    'education',
    'essays',
    'projects',
    'work',
  ]);
  // Students need education and essays urgently.
  assert.equal(gaps.find((g) => g.field === 'education')!.priority, 'high');
  assert.equal(gaps.find((g) => g.field === 'essays')!.priority, 'high');
  // Highs come first.
  assert.equal(gaps[0].priority, 'high');
});

test('detectGaps weights founder gaps toward projects, not education', () => {
  const gaps = detectGaps({
    profile: {
      mode: 'founder',
      bio: 'A founder of things, building X and Y with a long enough bio that passes the 60-char floor.',
    },
    education: [],
    work: [],
    projects: [],
    accomplishments: [],
    essays: [],
  });
  // Founders can skip education; it should be low.
  assert.equal(gaps.find((g) => g.field === 'education')!.priority, 'low');
  // Projects matter the most.
  assert.equal(gaps.find((g) => g.field === 'projects')!.priority, 'high');
  // Bio is populated, so it must not appear.
  assert.ok(!gaps.some((g) => g.field === 'bio'));
});

test('getProfileGaps integrates service + exporter + detector', async () => {
  const h = openInMemory();
  try {
    const svc = new ProfileService(h.db);
    const exports = new ProfileExportService(svc);
    const gaps = new ProfileGapsService(svc, exports);
    const p = await svc.createProfile({ mode: 'researcher', bio: null });
    await svc.addEducation(p.id, {
      institution: 'Uni',
      degree: 'PhD',
      field: 'Bio',
      startYear: 2018,
      endYear: null,
      gpa: null,
      honors: null,
    });
    const list = await gaps.getProfileGaps(p.id);
    const byField = new Map(list.map((g) => [g.field, g]));
    assert.ok(byField.has('bio'));
    assert.ok(!byField.has('education'));
    assert.equal(byField.get('accomplishments')!.priority, 'high');
  } finally {
    h.close();
  }
});
