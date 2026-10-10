<!--
  Scaffold Button. Uses the HSL token system; a follow-up task should port
  the full Button API from cloudlands-fe/src/lib/components/ui/button once
  its supporting primitives (IntentMarkLoader, TooltipShortcut, size-context,
  button.variants) are in place.
-->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLButtonAttributes & {
    variant?: 'primary' | 'secondary' | 'ghost';
    class?: string;
  };

  export let variant: NonNullable<$$Props['variant']> = 'primary';
  export let type: $$Props['type'] = 'button';
  export let disabled: $$Props['disabled'] = false;
  let className: $$Props['class'] = undefined;
  export { className as class };

  const variantClasses: Record<NonNullable<$$Props['variant']>, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
  };
</script>

<button
  {type}
  {disabled}
  class={cn(
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:opacity-50 disabled:pointer-events-none',
    variantClasses[variant],
    className,
  )}
  on:click
  {...$$restProps}
>
  <slot />
</button>
