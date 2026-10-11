// Minimal stand-in for the Paraglide runtime used by the UI kit ported from Intent.
// Arpli ships English only; locale.ts still routes through overwriteGetLocale so a real
// Paraglide setup can replace this file later without touching callers.
export const baseLocale = 'en';
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

let getLocaleImpl: () => Locale = () => baseLocale;

export function getLocale(): Locale {
  return getLocaleImpl();
}

export function overwriteGetLocale(fn: () => Locale): void {
  getLocaleImpl = fn;
}
