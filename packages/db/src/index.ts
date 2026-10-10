import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate as drizzleMigrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema.js';

export * as schema from './schema.js';

export type ArpliDb = BetterSQLite3Database<typeof schema>;

export interface OpenDbOptions {
  /** Absolute path to the SQLite file. The directory will be created if missing. */
  path: string;
  /** Set to false to skip automatic migrations on open. Defaults to true. */
  migrateOnOpen?: boolean;
}

/**
 * Open (and if necessary create) the Arpli SQLite database.
 *
 * The directory is created, better-sqlite3 is configured with WAL for
 * durability, and any pending drizzle migrations are applied before the
 * database is returned.
 */
export function openDatabase(options: OpenDbOptions): ArpliDb {
  const { path, migrateOnOpen = true } = options;

  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(path);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  if (migrateOnOpen) {
    const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), 'migrations');
    if (existsSync(migrationsFolder)) {
      drizzleMigrate(db, { migrationsFolder });
    }
  }

  return db;
}
