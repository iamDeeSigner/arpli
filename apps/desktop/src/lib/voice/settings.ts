/**
 * Voice-input settings — localStorage-backed store.
 *
 * `enabled`    — master toggle; when false the mic button is hidden.
 * `useWhisper` — prefer Groq Whisper over Web Speech when a provider is
 *                configured. Ignored if `enabled` is false.
 */

import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface VoiceSettings {
  enabled: boolean;
  useWhisper: boolean;
}

const STORAGE_KEY = 'arpli:voice';

const DEFAULTS: VoiceSettings = {
  enabled: true,
  useWhisper: false,
};

function read(): VoiceSettings {
  if (!browser) return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<VoiceSettings>;
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULTS.enabled,
      useWhisper:
        typeof parsed.useWhisper === 'boolean' ? parsed.useWhisper : DEFAULTS.useWhisper,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function persist(value: VoiceSettings) {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Non-fatal.
  }
}

function createVoiceSettingsStore() {
  const { subscribe, update, set } = writable<VoiceSettings>(read());

  return {
    subscribe,

    toggle() {
      update((s) => {
        const next = { ...s, enabled: !s.enabled };
        persist(next);
        return next;
      });
    },

    toggleWhisper() {
      update((s) => {
        const next = { ...s, useWhisper: !s.useWhisper };
        persist(next);
        return next;
      });
    },

    set(value: VoiceSettings) {
      persist(value);
      set(value);
    },
  };
}

export const voiceSettings = createVoiceSettingsStore();
