import { AiConnector, AiConnectorConfig, AiProviderError } from './types.js';
import { OllamaConnector } from './providers/ollama.js';
import { GoogleConnector } from './providers/google.js';
import { AnthropicConnector } from './providers/anthropic.js';
import { OpenAiCompatibleConnector } from './providers/openai-compatible.js';
import { describe } from './providers/registry.js';
import {
  getActiveProvider,
  getAllProviders,
  type StoredAiProvider,
} from '../services/settings.js';
import type { ArpliDb } from '@arpli/db';

/**
 * Build an `AiConnector` from a stored provider config. Dispatch is
 * driven by the `wireProtocol` from the registry: native-ollama,
 * native-anthropic, native-google, or openai-compat (shared adapter).
 */
export function loadConnector(config: AiConnectorConfig): AiConnector {
  const descriptor = describe(config.provider);
  switch (descriptor.wireProtocol) {
    case 'native-ollama':
      return new OllamaConnector(config);
    case 'native-anthropic':
      return new AnthropicConnector(config);
    case 'native-google':
      return new GoogleConnector(config);
    case 'openai-compat':
      return new OpenAiCompatibleConnector(config);
    default: {
      const exhaustive: never = descriptor.wireProtocol;
      throw new AiProviderError(
        config.provider,
        `unknown wire protocol: ${String(exhaustive)}`,
      );
    }
  }
}

/**
 * Return the connector for the user's currently active provider, or null
 * if nothing is configured.
 */
export function getActiveConnector(db: ArpliDb): AiConnector | null {
  const row = getActiveProvider(db);
  if (!row) return null;
  return loadConnector(storedToConfig(row));
}

/**
 * Run `testConnection()` for every configured provider in parallel and
 * return a status map. Used by the settings UI to show provider health.
 */
export async function testAllConnectors(
  db: ArpliDb,
): Promise<Record<string, { ok: boolean; error?: string }>> {
  const providers = getAllProviders(db);
  const entries = await Promise.all(
    providers.map(async (row) => {
      try {
        const connector = loadConnector(storedToConfig(row));
        const ok = await connector.testConnection();
        return [row.kind, { ok }] as const;
      } catch (err) {
        return [row.kind, { ok: false, error: (err as Error).message }] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

export function storedToConfig(row: StoredAiProvider): AiConnectorConfig {
  return {
    provider: row.kind,
    tier: row.tier,
    model: row.model,
    apiKey: row.apiKey ?? undefined,
    baseUrl: row.baseUrl ?? undefined,
  };
}
