// Preload script runs in an isolated world. Expose a minimal, typed API to the
// renderer. For Phase 1 the renderer talks directly to the daemon over HTTP
// (localhost), so this file is a placeholder for future privileged bridges
// (filesystem access, native dialogs, OS keychain, etc.).

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('arpli', {
  version: '0.1.0',
  platform: process.platform,
});
