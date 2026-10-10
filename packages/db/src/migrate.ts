import { openDatabase } from './index.js';
import { join } from 'node:path';
import { homedir } from 'node:os';

const path = process.env.ARPLI_DB_PATH ?? join(homedir(), '.arpli', 'arpli.db');

openDatabase({ path, migrateOnOpen: true });

console.log(`Arpli database ready at ${path}`);
