// See https://svelte.dev/docs/kit/types#app.d.ts

// Extend Svelte HTML types with standard attributes not yet in the typings
// (used by the Textarea ported from Intent's UI kit).
declare module 'svelte/elements' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    autocorrect?: 'on' | 'off' | string;
  }
}

export {};
