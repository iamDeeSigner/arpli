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

import type { Profile, AiProviderConfig, Opportunity, OpportunityDraft } from '@arpli/shared';

const DAEMON_BASE = 'http://127.0.0.1:4848';

type Channel =
  | 'ai:complete'
  | 'ai:providers:ollama:models'
  | 'ai:providers'
  | 'profile:get'
  | 'profile:update'
  | 'daemon:health'
  | 'opportunity:intake'
  | 'opportunity:create'
  | 'opportunity:list'
  | 'opportunity:get'
  | 'opportunity:update'
  | 'opportunity:delete';

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
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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

// ────── Opportunities ──────

export interface OpportunityIntakeInput {
  text?: string;
  url?: string;
  pdfBase64?: string;
}

export const opportunityApi = {
  async intake(input: OpportunityIntakeInput): Promise<{ draft: OpportunityDraft }> {
    if (hasInvokeBridge())
      return viaBridge<{ draft: OpportunityDraft }>('opportunity:intake', input);
    return viaFetch<{ draft: OpportunityDraft }>('POST', '/opportunities/intake', input);
  },

  async create(draft: Partial<OpportunityDraft>): Promise<{ opportunity: Opportunity }> {
    if (hasInvokeBridge())
      return viaBridge<{ opportunity: Opportunity }>('opportunity:create', draft);
    return viaFetch<{ opportunity: Opportunity }>('POST', '/opportunities', draft);
  },

  async list(): Promise<{ opportunities: Opportunity[] }> {
    if (hasInvokeBridge())
      return viaBridge<{ opportunities: Opportunity[] }>('opportunity:list');
    return viaFetch<{ opportunities: Opportunity[] }>('GET', '/opportunities');
  },

  async get(id: string): Promise<{ opportunity: Opportunity }> {
    if (hasInvokeBridge())
      return viaBridge<{ opportunity: Opportunity }>('opportunity:get', { id });
    return viaFetch<{ opportunity: Opportunity }>('GET', `/opportunities/${id}`);
  },

  async update(id: string, patch: Partial<OpportunityDraft>): Promise<{ opportunity: Opportunity }> {
    if (hasInvokeBridge())
      return viaBridge<{ opportunity: Opportunity }>('opportunity:update', { id, patch });
    return viaFetch<{ opportunity: Opportunity }>('PATCH', `/opportunities/${id}`, patch);
  },

  async delete(id: string): Promise<{ ok: boolean }> {
    if (hasInvokeBridge())
      return viaBridge<{ ok: boolean }>('opportunity:delete', { id });
    return viaFetch<{ ok: boolean }>('DELETE', `/opportunities/${id}`);
  },
};

// ────── Profile import ──────

export type ImportSource = 'pdf' | 'docx' | 'linkedin-json' | 'linkedin-zip' | 'text';

export interface ImportEducationInput {
  institution: string;
  degree?: string | null;
  field?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  gpa?: number | null;
  honors?: string | null;
}

export interface ImportWorkInput {
  company: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
}

export interface ImportProjectInput {
  name: string;
  description?: string | null;
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ImportAccomplishmentInput {
  title: string;
  description?: string | null;
  date?: string | null;
  category?: string | null;
}

export interface ImportPreview {
  source: ImportSource;
  bio?: string | null;
  education: ImportEducationInput[];
  work: ImportWorkInput[];
  projects: ImportProjectInput[];
  accomplishments: ImportAccomplishmentInput[];
  skills: string[];
  warnings: string[];
  confidence: number;
  rawTextPreview?: string;
}

export interface ImportApplyResult {
  profileId: string;
  educationAdded: unknown[];
  workAdded: unknown[];
  projectsAdded: unknown[];
  accomplishmentsAdded: unknown[];
  bioUpdated: boolean;
  skipped: string[];
}

async function viaFetchMultipart<T>(path: string, file: File): Promise<T> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${DAEMON_BASE}${path}`, { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Daemon POST ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

export const profileImportApi = {
  /** Upload a PDF, DOCX, LinkedIn ZIP, or plain-text file. Returns a preview. */
  async importFile(file: File): Promise<ImportPreview> {
    return viaFetchMultipart<ImportPreview>('/profile/import', file);
  },

  /** Parse a LinkedIn JSON export object directly. Returns a preview. */
  async importLinkedin(data: unknown): Promise<ImportPreview> {
    return viaFetch<ImportPreview>('POST', '/profile/import/linkedin', { data });
  },

  /** Fetch and parse a LinkedIn public profile URL. Returns a preview. */
  async importUrl(url: string): Promise<ImportPreview> {
    return viaFetch<ImportPreview>('POST', '/profile/import/url', { url });
  },

  /** Apply a confirmed preview to a profile. Writes to the database. */
  async applyPreview(
    profileId: string,
    preview: ImportPreview,
    opts: { updateBio?: boolean } = {},
  ): Promise<ImportApplyResult> {
    return viaFetch<ImportApplyResult>('POST', `/profile/${profileId}/import/apply`, {
      preview,
      updateBio: opts.updateBio ?? false,
    });
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
