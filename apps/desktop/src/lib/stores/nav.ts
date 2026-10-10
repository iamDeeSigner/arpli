import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type NavSection = 'profile' | 'opportunities' | 'applications' | 'settings';

export const NAV_SECTIONS: readonly NavSection[] = [
  'profile',
  'opportunities',
  'applications',
  'settings',
] as const;

export const SECTION_LABELS: Record<NavSection, string> = {
  profile: 'Profile',
  opportunities: 'Opportunities',
  applications: 'Applications',
  settings: 'Settings',
};

const STORAGE_KEY = 'arpli:lastSection';

function readStored(): NavSection {
  if (!browser) return 'profile';
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value && (NAV_SECTIONS as readonly string[]).includes(value)) {
      return value as NavSection;
    }
  } catch {
    // Non-fatal.
  }
  return 'profile';
}

function createLastSection() {
  const { subscribe, set } = writable<NavSection>(readStored());

  return {
    subscribe,
    set(section: NavSection) {
      if (browser) {
        try {
          localStorage.setItem(STORAGE_KEY, section);
        } catch {
          // Non-fatal.
        }
      }
      set(section);
    },
  };
}

export const lastSection = createLastSection();

export function sectionFromPath(path: string): NavSection | null {
  for (const section of NAV_SECTIONS) {
    if (path === `/${section}` || path.startsWith(`/${section}/`)) {
      return section;
    }
  }
  return null;
}
