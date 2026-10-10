import { eq } from 'drizzle-orm';
import type { ArpliDb } from '@arpli/db';
import { schema } from '@arpli/db';
import type { AiProvider, AiProviderTier } from '../ai/types.js';

export interface StoredAiProvider {
  kind: AiProvider;
  tier: AiProviderTier;
  model: string;
  apiKey: string | null;
  baseUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface SaveProviderInput {
  kind: AiProvider;
  tier: AiProviderTier;
  model: string;
  apiKey?: string | null;
  baseUrl?: string | null;
}

/**
 * Upsert an AI provider config. If `setActive` is true, also mark this
 * provider as the single active one (clearing isActive on every other row).
 */
export function saveProvider(
  db: ArpliDb,
  input: SaveProviderInput,
  setActive = false,
): StoredAiProvider {
  const now = new Date().toISOString();
  const row = {
    kind: input.kind,
    tier: input.tier,
    model: input.model,
    apiKey: input.apiKey ?? null,
    baseUrl: input.baseUrl ?? null,
    isActive: setActive,
    updatedAt: now,
  };

  const existing = db
    .select()
    .from(schema.aiProviders)
    .where(eq(schema.aiProviders.kind, input.kind))
    .get();

  if (existing) {
    db.update(schema.aiProviders)
      .set({
        tier: row.tier,
        model: row.model,
        apiKey: row.apiKey,
        baseUrl: row.baseUrl,
        updatedAt: row.updatedAt,
        ...(setActive ? { isActive: true } : {}),
      })
      .where(eq(schema.aiProviders.kind, input.kind))
      .run();
  } else {
    db.insert(schema.aiProviders).values(row).run();
  }

  if (setActive) {
    db.update(schema.aiProviders)
      .set({ isActive: false })
      .where(eq(schema.aiProviders.isActive, true))
      .run();
    db.update(schema.aiProviders)
      .set({ isActive: true, updatedAt: now })
      .where(eq(schema.aiProviders.kind, input.kind))
      .run();
  }

  const saved = db
    .select()
    .from(schema.aiProviders)
    .where(eq(schema.aiProviders.kind, input.kind))
    .get();
  return toStored(saved!);
}

/**
 * Set which provider is active. Returns the newly active row, or null if
 * no row exists for `kind`.
 */
export function setActiveProvider(db: ArpliDb, kind: AiProvider): StoredAiProvider | null {
  const existing = db
    .select()
    .from(schema.aiProviders)
    .where(eq(schema.aiProviders.kind, kind))
    .get();
  if (!existing) return null;

  const now = new Date().toISOString();
  db.update(schema.aiProviders)
    .set({ isActive: false })
    .where(eq(schema.aiProviders.isActive, true))
    .run();
  db.update(schema.aiProviders)
    .set({ isActive: true, updatedAt: now })
    .where(eq(schema.aiProviders.kind, kind))
    .run();

  return toStored({ ...existing, isActive: true, updatedAt: now });
}

export function getActiveProvider(db: ArpliDb): StoredAiProvider | null {
  const row = db
    .select()
    .from(schema.aiProviders)
    .where(eq(schema.aiProviders.isActive, true))
    .get();
  return row ? toStored(row) : null;
}

export function getAllProviders(db: ArpliDb): StoredAiProvider[] {
  const rows = db.select().from(schema.aiProviders).all();
  return rows.map(toStored);
}

export function getProvider(db: ArpliDb, kind: AiProvider): StoredAiProvider | null {
  const row = db
    .select()
    .from(schema.aiProviders)
    .where(eq(schema.aiProviders.kind, kind))
    .get();
  return row ? toStored(row) : null;
}

export function deleteProvider(db: ArpliDb, kind: AiProvider): boolean {
  const result = db.delete(schema.aiProviders).where(eq(schema.aiProviders.kind, kind)).run();
  return result.changes > 0;
}

/**
 * Generic key/value settings access. `value` is stored JSON-encoded.
 */
export function getSetting<T = unknown>(db: ArpliDb, key: string): T | null {
  const row = db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .get();
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return row.value as unknown as T;
  }
}

export function setSetting(db: ArpliDb, key: string, value: unknown): void {
  const now = new Date().toISOString();
  const serialized = JSON.stringify(value);
  const existing = db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .get();
  if (existing) {
    db.update(schema.settings)
      .set({ value: serialized, updatedAt: now })
      .where(eq(schema.settings.key, key))
      .run();
  } else {
    db.insert(schema.settings).values({ key, value: serialized, updatedAt: now }).run();
  }
}

function toStored(row: {
  kind: string;
  tier: string;
  model: string;
  apiKey: string | null;
  baseUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}): StoredAiProvider {
  return {
    kind: row.kind as AiProvider,
    tier: row.tier as AiProviderTier,
    model: row.model,
    apiKey: row.apiKey,
    baseUrl: row.baseUrl,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
  };
}
