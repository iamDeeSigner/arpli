/**
 * Voice input public API.
 *
 * Re-exports everything a component needs. Import from '$lib/voice'.
 */

export type { VoiceEngine, VoiceStatus, VoiceUpdate, VoiceResult, VoiceError } from './types';
export { isSpeechRecognitionSupported, WebSpeechRecognizer } from './recognition.svelte';
export { startWhisperSession, checkWhisperAvailability } from './whisper';
export { voiceSettings, type VoiceSettings } from './settings';
