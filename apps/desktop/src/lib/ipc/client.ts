/**
 * IPC client — single surface the renderer uses to talk to the backend.
 *
 * The real backend is the Node daemon on 127.0.0.1:4848. Electron exposes a
 * typed `invoke()` bridge on `window.arpli.invoke` that proxies to the daemon
 * (keeps the renderer sandboxed, lets the main process attach auth/user id
 * headers in future phases). When running in the plain SvelteKit dev server
 * (no Electron, e.g. for Storybook-style component work), we fall back to a
 * direct `fetch` call to the daemon.
 *
 * All methods throw a plain `Error` with a message a UI can show. They never
 * silently swallow failures: a down daemon surfaces as a clear error.
 */

import type { Profile, AiProviderConfig } from '@arpli/shared';

const DAEMON_BASE = 'http://127.0.0.1:4848';

type Channel =
  | 'ai:complete'
  | 'ai:providers:ollama:models'
  | 'ai:providers'
  | 'profile:get'
  | 'profile:update'
  | 'daemon:health';

interface ArpliBridge {
  version: string;
  platform: string;
  invoke?: (channel: Channel, payload?: unknown) => Promise<unknown>;
}

declare global {
  interface Window {
    arpli?: ArpliBridge;
  }
}

function hasInvokeBridge(): boolean {
  return typeof window !== 'undefined' && typeof window.arpli?.invoke === 'function';
}

async function viaBridge<T>(channel: Channel, payload?: unknown): Promise<T> {
  if (!hasInvokeBridge()) {
    throw new Error(`Electron IPC bridge not available for channel "${channel}"`);
  }
  const result = (await window.arpli!.invoke!(channel, payload)) as T | { error: string };
  if (result && typeof result === 'object' && 'error' in result) {
    throw new Error((result as { error: string }).error);
  }
  return result as T;
}

async function viaFetch<T>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { 'content-type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${DAEMON_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Daemon ${method} ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

// ────── AI ──────

export interface AiCompleteRequest {
  prompt: string;
  model?: string;
  provider?: string;
  temperature?: number;
}

export interface AiCompleteResponse {
  text: string;
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface OllamaModelInfo {
  name: string;
  size?: number;
  modifiedAt?: string;
}

export interface OllamaProbe {
  available: boolean;
  models: OllamaModelInfo[];
  endpoint: string;
  error?: string;
}

export const ai = {
  async complete(request: AiCompleteRequest): Promise<AiCompleteResponse> {
    if (hasInvokeBridge()) return viaBridge<AiCompleteResponse>('ai:complete', request);
    return viaFetch<AiCompleteResponse>('POST', '/ai/complete', request);
  },

  async probeOllama(): Promise<OllamaProbe> {
    if (hasInvokeBridge()) return viaBridge<OllamaProbe>('ai:providers:ollama:models');
    return viaFetch<OllamaProbe>('GET', '/ai/providers/ollama/models');
  },

  async listProviders(): Promise<{ providers: AiProviderConfig[] }> {
    if (hasInvokeBridge())
      return viaBridge<{ providers: AiProviderConfig[] }>('ai:providers');
    return viaFetch<{ providers: AiProviderConfig[] }>('GET', '/ai/providers');
  },
};

// ────── Profile ──────

export interface ProfileListResponse {
  profiles: Profile[];
}

export const profileApi = {
  async get(): Promise<Profile | null> {
    if (hasInvokeBridge()) {
      const result = await viaBridge<Profile | null>('profile:get');
      return result ?? null;
    }
    const { profiles } = await viaFetch<ProfileListResponse>('GET', '/profiles');
    return profiles[0] ?? null;
  },

  async update(id: string, patch: Partial<Profile>): Promise<Profile> {
    if (hasInvokeBridge()) {
      return viaBridge<Profile>('profile:update', { id, patch });
    }
    return viaFetch<Profile>('PATCH', `/profile/${id}`, patch);
  },
};

// ────── Daemon health ──────

export interface DaemonHealthResult {
  ok: boolean;
  version: string;
  dbReady: boolean;
}

export const daemon = {
  async health(): Promise<DaemonHealthResult> {
    if (hasInvokeBridge()) return viaBridge<DaemonHealthResult>('daemon:health');
    return viaFetch<DaemonHealthResult>('GET', '/health');
  },
};
