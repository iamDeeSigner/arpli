// Pulse-ring highlight for a target element (e.g. a settings row reached by search).
// Intent drives this from its Redux store; Arpli uses a small module-level registry:
// call `requestHighlight(id)` and any element using `use:highlightTarget={{ id }}` pulses.
const UI_HIGHLIGHT_DURATION_MS = 2000;
const HIGHLIGHT_CLASS = 'ui-highlight-pulse-ring';

type Listener = (durationMs: number) => void;
const listeners = new Map<string, Set<Listener>>();

export type HighlightTargetParams = {
  id?: string;
};

export function requestHighlight(id: string, durationMs = UI_HIGHLIGHT_DURATION_MS) {
  listeners.get(id.trim())?.forEach((listener) => listener(durationMs));
}

function normalizeHighlightId(id: string | null | undefined): string {
  return (id ?? '').trim();
}

export function highlightTarget(node: HTMLElement, params: HighlightTargetParams = {}) {
  let highlightId = normalizeHighlightId(params.id ?? node.dataset.highlightId);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function clearPulse() {
    node.classList.remove(HIGHLIGHT_CLASS);
  }

  function applyPulse(durationMs: number) {
    node.classList.remove(HIGHLIGHT_CLASS);
    void node.offsetWidth;
    node.classList.add(HIGHLIGHT_CLASS);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(clearPulse, durationMs);
  }

  function subscribe(id: string) {
    if (!id) return;
    let set = listeners.get(id);
    if (!set) listeners.set(id, (set = new Set()));
    set.add(applyPulse);
  }

  function unsubscribe(id: string) {
    listeners.get(id)?.delete(applyPulse);
  }

  subscribe(highlightId);

  return {
    update(nextParams: HighlightTargetParams = {}) {
      const nextId = normalizeHighlightId(nextParams.id ?? node.dataset.highlightId);
      if (nextId === highlightId) return;
      unsubscribe(highlightId);
      highlightId = nextId;
      clearPulse();
      subscribe(highlightId);
    },
    destroy() {
      unsubscribe(highlightId);
      if (timeout) clearTimeout(timeout);
      clearPulse();
    },
  };
}
