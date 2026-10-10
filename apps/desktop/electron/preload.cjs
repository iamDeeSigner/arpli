/**
 * Preload script — runs in an isolated world with nodeIntegration disabled.
 *
 * Exposes a minimal typed API surface on `window.arpli`:
 *   - version, platform (metadata)
 *   - invoke(channel, payload) → typed IPC bridge to the main process
 *
 * The renderer calls window.arpli.invoke(channel, payload); the main process
 * handles it, proxies to the daemon, and returns the result. The renderer
 * never opens raw fetch calls to localhost in production.
 */

const { contextBridge, ipcRenderer } = require('electron');

/** @type {string[]} List every channel the renderer is allowed to call. */
const ALLOWED_CHANNELS = [
  'ai:complete',
  'ai:providers:ollama:models',
  'ai:providers',
  'profile:get',
  'profile:update',
  'daemon:health',
  'opportunity:intake',
  'opportunity:create',
  'opportunity:list',
  'opportunity:get',
  'opportunity:update',
  'opportunity:delete',
  'application:create',
  'application:ensure',
  'application:list',
  'application:get',
  'application:update',
  'application:delete',
  'application:draft',
  'application:save-draft',
  'application:list-drafts',
  'application:delete-draft',
];

contextBridge.exposeInMainWorld('arpli', {
  version: '0.1.0',
  platform: process.platform,

  /**
   * Typed IPC invoke — renderer calls this; main process handles the channel
   * and returns the result (or an { error: string } object on failure).
   *
   * @param {string} channel - One of ALLOWED_CHANNELS
   * @param {unknown} [payload] - JSON-serialisable payload
   * @returns {Promise<unknown>}
   */
  invoke(channel, payload) {
    if (!ALLOWED_CHANNELS.includes(channel)) {
      return Promise.reject(new Error(`IPC channel "${channel}" is not allowed`));
    }
    return ipcRenderer.invoke(channel, payload);
  },
});
