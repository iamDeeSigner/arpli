import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface OnboardingState {
  completed: boolean;
  aiProvider: 'ollama' | 'groq' | 'openai' | 'anthropic' | 'google' | null;
  aiModel: string | null;
  profileSeed: 'resume' | 'conversation' | 'skipped' | null;
}

const STORAGE_KEY = 'arpli:onboarding';

const EMPTY: OnboardingState = {
  completed: false,
  aiProvider: null,
  aiModel: null,
  profileSeed: null,
};

function readStored(): OnboardingState {
  if (!browser) return EMPTY;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return EMPTY;
    const parsed = JSON.parse(value) as OnboardingState;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function createOnboardingStore() {
  const { subscribe, update, set } = writable<OnboardingState>(readStored());

  function persist(state: OnboardingState) {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Non-fatal.
    }
  }

  return {
    subscribe,
    patch(patch: Partial<OnboardingState>) {
      update((current) => {
        const next = { ...current, ...patch };
        persist(next);
        return next;
      });
    },
    complete() {
      update((current) => {
        const next = { ...current, completed: true };
        persist(next);
        return next;
      });
    },
    reset() {
      persist(EMPTY);
      set(EMPTY);
    },
  };
}

export const onboarding = createOnboardingStore();
