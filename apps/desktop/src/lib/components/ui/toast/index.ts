export { toast } from 'svelte-sonner';
export type { ExternalToast } from 'svelte-sonner';
export { default as ErrorToast } from './ErrorToast.svelte';
export { default as Toast } from './Toast.svelte';
export { default as ToastCloseButton } from './ToastCloseButton.svelte';
export { default as ToastGlyph } from './ToastGlyph.svelte';
export { default as ToastUndoAction } from './ToastUndoAction.svelte';
export {
  withToastCountdown,
  TOAST_COUNTDOWN_CLASS,
  TOAST_COUNTDOWN_NO_HOVER_PAUSE_CLASS,
} from './toast-countdown';

export type ErrorToastComponent = (typeof import('./ErrorToast.svelte'))['default'];
export type ToastComponent = (typeof import('./Toast.svelte'))['default'];

export const loadErrorToast = () => import('./ErrorToast.svelte').then((module) => module.default);
export const loadToast = () => import('./Toast.svelte').then((module) => module.default);
