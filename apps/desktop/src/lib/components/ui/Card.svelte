<!--
  Card component. Uses the HSL token system from tokens.css via Tailwind aliases.
  Pass padded=false to remove default padding (e.g. for cards with custom padding).
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  let {
    padded = true,
    class: className = '',
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & { padded?: boolean; class?: string } = $props();
</script>

<div
  class={cn('bg-card text-card-foreground rounded-md border', padded ? 'p-6' : '', className)}
  {...rest}
>
  {@render children?.()}
</div>
