/**
 * Groq is a thin alias over the generic OpenAI-compatible adapter.
 * Kept as a named export so call sites that already imported
 * `GroqConnector` continue to work; the behaviour and defaults come
 * from `PROVIDER_REGISTRY.groq`.
 */
export { OpenAiCompatibleConnector as GroqConnector } from './openai-compatible.js';

/**
 * Shared parser kept for backwards compatibility with existing imports.
 * New code should import `parseOpenAiCompatibleStream` from
 * `./openai-compatible.js` directly.
 */
export { parseOpenAiCompatibleStream as parseOpenAiStream } from './openai-compatible.js';
