<!--
  Button component. Uses the HSL token system from tokens.css via Tailwind aliases.
  Supports primary/secondary/ghost/danger variants and sm/md/lg sizes.
  Pass href to render an <a> tag instead.
-->
<script lang="ts">
  import { cn } from '$lib/utils';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  let {
    variant = 'primary' as Variant,
    size = 'md' as Size,
    type = 'button' as 'button' | 'submit' | 'reset',
    disabled = false,
    href = null as string | null,
    class: className = '',
    onclick = undefined as ((e: MouseEvent & { currentTarget: EventTarget & (HTMLButtonElement | HTMLAnchorElement) }) => void) | undefined,
    children,
    ...rest
  } = $props();

  const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variantClasses: Record<Variant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    danger: 'bg-danger text-white hover:bg-danger/90',
  };

  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  const classes = $derived(cn(base, sizeClasses[size], variantClasses[variant], className));
</script>

{#if href}
  <a {href} class={classes} aria-disabled={disabled || undefined} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button {type} {disabled} class={classes} {onclick} {...rest}>
    {@render children?.()}
  </button>
{/if}
