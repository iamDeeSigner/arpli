<!--
  Neutral loading indicator. Replaces Intent's animated brand mark (IntentMarkLoader),
  which is Intent branding and not covered by its Apache-2.0 license. Same props, so
  call sites in Button, ListItem and UnsavedIndicator keep working.
-->
<script lang="ts">
  import { m } from '$shared/paraglide/messages.js';

  interface Props {
    size?: number;
    playing?: boolean;
    class?: string;
  }

  let { size = 24, playing = true, class: className = '' }: Props = $props();
</script>

<svg
  class="spinner {className}"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  role="status"
  aria-label={m.ui_spinner_loading_ariaLabel()}
  data-slot="spinner"
  data-playing={playing}
>
  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" opacity="0.2" />
  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
</svg>

<style>
  .spinner {
    display: inline-block;
    flex: none;
    color: inherit;
    vertical-align: middle;
    animation: spinner-rotate 0.8s linear infinite;
    animation-play-state: paused;
  }

  .spinner[data-playing='true'] {
    animation-play-state: running;
  }

  @keyframes spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  /* Reduced motion: hold a static ring rather than spinning (tokens.css --motion-reduced). */
  @container style(--motion-reduced: 1) {
    .spinner {
      animation: none;
    }
  }

  @media (forced-colors: active) {
    .spinner {
      color: CanvasText;
    }
  }
</style>
