import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Arpli SQLite schema — Phase 1
 *
 * One profile per user (user is implicit — single-user local app).
 * A profile has many education/work/project/accomplishment/essay rows.
 * An opportunity is a parsed description of something to apply to.
 * An application links one profile to one opportunity.
 * An application has many drafts (one per question, versioned).
 */

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  mode: text('mode', { enum: ['student', 'founder', 'researcher', 'professional'] }).notNull(),
  bio: text('bio'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const profileEducation = sqliteTable('profile_education', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  institution: text('institution').notNull(),
  degree: text('degree'),
  field: text('field'),
  startYear: integer('start_year'),
  endYear: integer('end_year'),
  gpa: real('gpa'),
  honors: text('honors'),
});

export const profileWork = sqliteTable('profile_work', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  current: integer('current', { mode: 'boolean' }).notNull().default(false),
});

export const profileProjects = sqliteTable('profile_projects', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  url: text('url'),
  startDate: text('start_date'),
  endDate: text('end_date'),
});

export const profileAccomplishments = sqliteTable('profile_accomplishments', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date'),
  category: text('category'),
});

export const profileEssays = sqliteTable('profile_essays', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  wordCount: integer('word_count').notNull().default(0),
  tags: text('tags'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * An opportunity is anything an applicant can bring into Arpli: a
 * scholarship, grant, fellowship, accelerator, or job posting. The
 * parser extracts a normalised shape; the user edits it before saving.
 *
 * `questions` is a JSON-encoded `OpportunityQuestion[]` and `tags` is a
 * JSON-encoded `string[]`. They are stored as text columns because
 * SQLite has no native JSON type; the service layer parses them.
 */
export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type', {
    enum: ['scholarship', 'grant', 'fellowship', 'accelerator', 'job', 'other'],
  }).notNull(),
  organization: text('organization'),
  url: text('url'),
  deadline: text('deadline'),
  eligibility: text('eligibility'),
  questions: text('questions'),
  description: text('description'),
  tags: text('tags'),
  status: text('status', { enum: ['active', 'archived'] })
    .notNull()
    .default('active'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  opportunityId: text('opportunity_id')
    .notNull()
    .references(() => opportunities.id, { onDelete: 'cascade' }),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  status: text('status', {
    enum: [
      'discovered',
      'qualifying',
      'drafting',
      'reviewing',
      'submitted',
      'awaiting',
      'won',
      'rejected',
      'waitlisted',
      'withdrew',
    ],
  })
    .notNull()
    .default('discovered'),
  notes: text('notes'),
  submittedAt: text('submitted_at'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const applicationDrafts = sqliteTable('application_drafts', {
  id: text('id').primaryKey(),
  applicationId: text('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  draftContent: text('draft_content').notNull(),
  wordCount: integer('word_count').notNull().default(0),
  version: integer('version').notNull().default(1),
  aiModel: text('ai_model'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Generic key/value settings store.
 * `value` is stored as a JSON-encoded string.
 */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * One row per configured AI provider. Only one row has `is_active = 1` at a
 * time — the connector manager routes all calls to that provider. API keys
 * are stored locally in SQLite (local-first, single-user); keep this table
 * out of any future cloud sync surface.
 */
export const aiProviders = sqliteTable('ai_providers', {
  kind: text('kind', {
    enum: [
      'ollama',
      'groq',
      'google',
      'anthropic',
      'openai',
      'gemini',
      'lmstudio',
      'jan',
      'localai',
      'llamafile',
      'openrouter',
      'together',
      'mistral',
    ],
  }).primaryKey(),
  tier: text('tier', { enum: ['local', 'free-cloud', 'paid'] }).notNull(),
  model: text('model').notNull(),
  apiKey: text('api_key'),
  baseUrl: text('base_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
