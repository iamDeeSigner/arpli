// Platform detection for keyboard-shortcut display (⌘ vs Ctrl).
// Trimmed from cloudlands-fe's shortcuts module, which also holds Intent's keymap.
const isMac =
  typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export function isMacPlatform(): boolean {
  return isMac;
}
