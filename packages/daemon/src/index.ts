import Fastify from 'fastify';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { openDatabase, type ArpliDb } from '@arpli/db';
import type { DaemonHealth } from '@arpli/shared';
import { registerProfileRoutes } from './routes/profile.js';
import { registerProfileImportRoutes } from './routes/profile-import.js';
import { registerAiRoutes } from './routes/ai.js';
import { registerOpportunityRoutes } from './routes/opportunity.js';

const PORT = Number(process.env.ARPLI_DAEMON_PORT ?? 4848);
const HOST = process.env.ARPLI_DAEMON_HOST ?? '127.0.0.1';
const DB_PATH = process.env.ARPLI_DB_PATH ?? join(homedir(), '.arpli', 'arpli.db');
const VERSION = '0.1.0';

async function main() {
  let db: ArpliDb | null = null;
  let dbReady = false;

  try {
    db = openDatabase({ path: DB_PATH, migrateOnOpen: true });
    dbReady = true;
    console.log(`[arpli-daemon] SQLite ready at ${DB_PATH}`);
  } catch (err) {
    console.error('[arpli-daemon] failed to open database', err);
  }

  const app = Fastify({ logger: { level: 'info' } });

  app.get('/health', async (): Promise<DaemonHealth> => ({
    ok: true,
    version: VERSION,
    dbReady,
  }));

  app.get('/profiles', async () => {
    if (!db) return { profiles: [] };
    const rows = await db.query.profiles.findMany();
    return { profiles: rows };
  });

  if (db) {
    await registerProfileRoutes(app, db);
    await registerProfileImportRoutes(app, db);
    await registerAiRoutes(app, db);
    await registerOpportunityRoutes(app, db);
  }

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`[arpli-daemon] listening on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[arpli-daemon] fatal', err);
  process.exit(1);
});
