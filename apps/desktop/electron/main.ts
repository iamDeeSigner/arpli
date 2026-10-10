import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === 'development';
const DEV_URL = process.env.ARPLI_DEV_URL ?? 'http://localhost:5173';
const DAEMON_BASE = process.env.ARPLI_DAEMON_URL ?? 'http://127.0.0.1:4848';

let mainWindow: BrowserWindow | null = null;

// ── Daemon proxy helpers ─────────────────────────────────────────────────────

/**
 * Forward a request to the local daemon and return parsed JSON.
 * On non-2xx status or network error, returns { error: string }.
 */
async function daemonRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T | { error: string }> {
  try {
    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { 'content-type': 'application/json' };
      init.body = JSON.stringify(body);
    }
    const res = await fetch(`${DAEMON_BASE}${path}`, init);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { error: `Daemon ${method} ${path} → ${res.status} ${res.statusText} ${text}`.trim() };
    }
    return (await res.json()) as T;
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// ── IPC channel handlers ─────────────────────────────────────────────────────

ipcMain.handle('daemon:health', () =>
  daemonRequest('GET', '/health'),
);

ipcMain.handle('ai:complete', (_event, payload) =>
  daemonRequest('POST', '/ai/complete', payload),
);

ipcMain.handle('ai:providers:ollama:models', () =>
  daemonRequest('GET', '/ai/providers/ollama/models'),
);

ipcMain.handle('ai:providers', () =>
  daemonRequest('GET', '/ai/providers'),
);

ipcMain.handle('profile:get', async () => {
  const result = await daemonRequest<{ profiles: unknown[] }>('GET', '/profiles');
  if ('error' in result) return result;
  return result.profiles[0] ?? null;
});

ipcMain.handle('profile:update', (_event, payload: { id: string; patch: unknown }) =>
  daemonRequest('PATCH', `/profile/${payload.id}`, payload.patch),
);

ipcMain.handle('opportunity:intake', (_event, payload) =>
  daemonRequest('POST', '/opportunities/intake', payload),
);

ipcMain.handle('opportunity:create', (_event, payload) =>
  daemonRequest('POST', '/opportunities', payload),
);

ipcMain.handle('opportunity:list', () =>
  daemonRequest('GET', '/opportunities'),
);

ipcMain.handle('opportunity:get', (_event, payload: { id: string }) =>
  daemonRequest('GET', `/opportunities/${payload.id}`),
);

ipcMain.handle('opportunity:update', (_event, payload: { id: string; patch: unknown }) =>
  daemonRequest('PATCH', `/opportunities/${payload.id}`, payload.patch),
);

ipcMain.handle('opportunity:delete', (_event, payload: { id: string }) =>
  daemonRequest('DELETE', `/opportunities/${payload.id}`),
);

// ── Applications ─────────────────────────────────────────────────────────────

ipcMain.handle('application:create', (_event, payload) =>
  daemonRequest('POST', '/applications', payload),
);

ipcMain.handle(
  'application:ensure',
  (_event, payload: { opportunityId: string; profileId: string }) =>
    daemonRequest('POST', '/applications', { ...payload, ensure: true }),
);

ipcMain.handle(
  'application:list',
  (
    _event,
    payload?: { opportunityId?: string; profileId?: string; status?: string },
  ) => {
    const qs = new URLSearchParams();
    if (payload?.opportunityId) qs.set('opportunityId', payload.opportunityId);
    if (payload?.profileId) qs.set('profileId', payload.profileId);
    if (payload?.status) qs.set('status', payload.status);
    const q = qs.toString();
    return daemonRequest('GET', `/applications${q ? `?${q}` : ''}`);
  },
);

ipcMain.handle('application:get', (_event, payload: { id: string }) =>
  daemonRequest('GET', `/applications/${payload.id}`),
);

ipcMain.handle(
  'application:update',
  (_event, payload: { id: string; patch: unknown }) =>
    daemonRequest('PATCH', `/applications/${payload.id}`, payload.patch),
);

ipcMain.handle('application:delete', (_event, payload: { id: string }) =>
  daemonRequest('DELETE', `/applications/${payload.id}`),
);

ipcMain.handle(
  'application:draft',
  (_event, payload: { id: string; input: unknown }) =>
    daemonRequest('POST', `/applications/${payload.id}/draft`, payload.input),
);

ipcMain.handle(
  'application:save-draft',
  (_event, payload: { id: string; input: unknown }) =>
    daemonRequest('POST', `/applications/${payload.id}/drafts`, payload.input),
);

ipcMain.handle('application:list-drafts', (_event, payload: { id: string }) =>
  daemonRequest('GET', `/applications/${payload.id}/drafts`),
);

ipcMain.handle(
  'application:delete-draft',
  (_event, payload: { id: string; draftId: string }) =>
    daemonRequest('DELETE', `/applications/${payload.id}/drafts/${payload.draftId}`),
);

// ── Window ───────────────────────────────────────────────────────────────────

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    await mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show());
}

void app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) void createWindow();
});
