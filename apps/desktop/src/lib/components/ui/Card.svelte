<!--
  Scaffold Card. Uses the HSL token system (tailwind.config.js colours resolve
  to hsl(var(--card)) etc. defined in src/lib/styles/tokens.css). A follow-up
  task should port the full Card API from cloudlands-fe/src/lib/components/ui/card
  once its supporting primitives (SurfaceContext, ProximityHighlight, cn) are in
  place.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLAttributes<HTMLDivElement> & { class?: string };
  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div
  class={cn('bg-card text-card-foreground rounded-md border p-6', className)}
  {...$$restProps}
>
  <slot />
</div>
