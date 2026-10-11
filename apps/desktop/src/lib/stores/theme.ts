import { readonly, writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'arpli:theme';

function readStoredTheme(): ThemeMode {
  if (!browser) return 'system';
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // localStorage disabled — fall through.
  }
  return 'system';
}

function systemPrefersDark(): boolean {
  if (!browser) return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

const resolvedDark = writable(false);

/** True while the resolved theme (after applying 'system') is dark. */
export const isDarkTheme = readonly(resolvedDark);

function applyTheme(mode: ThemeMode) {
  if (!browser) return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  const resolved = mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
  root.classList.add(resolved);
  resolvedDark.set(resolved === 'dark');
}

function createThemeStore() {
  const { subscribe, set } = writable<ThemeMode>(readStoredTheme());

  if (browser) {
    applyTheme(readStoredTheme());
    // React to OS preference changes while on 'system'.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (readStoredTheme() === 'system') applyTheme('system');
    };
    media.addEventListener?.('change', onChange);
  }

  return {
    subscribe,
    set(mode: ThemeMode) {
      if (browser) {
        try {
          localStorage.setItem(STORAGE_KEY, mode);
        } catch {
          // Non-fatal.
        }
        applyTheme(mode);
      }
      set(mode);
    },
  };
}

export const theme = createThemeStore();
